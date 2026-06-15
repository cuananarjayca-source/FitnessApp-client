<script setup>
import { watch, ref, onBeforeMount, reactive } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import api from '../api.js';

// 1. Group inputs into a reactive object to match your template's formData bindings
const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const isEnabled = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const termsAccepted = ref(false);

const notyf = new Notyf();
const router = useRouter();

// 2. Update the watcher to track the reactive object properties safely
watch(
  () => [formData.name, formData.email, formData.password, formData.confirmPassword, termsAccepted.value], 
  (currentValue) => {
    const [n, em, pw, cp, terms] = currentValue;
    const allFilled = [n, em, pw, cp].every(v => v.trim() !== "");
    const passwordsMatch = pw === cp;
    isEnabled.value = allFilled && passwordsMatch && terms;
  }
);

// Renamed function to match the form submission hook in the template
async function handleRegister() {
    if (!isEnabled.value || isLoading.value) return;

    isLoading.value = true;

    try {
        // 3. Send payload matching your backend Mongoose Schema requirements
        const response = await api.post('/users/register', {
            name: formData.name, 
            email: formData.email,
            password: formData.password
        });

        if (response.status === 201) {
            notyf.success(response.data.message || "Registration Successful!");

            // Clear form fields inside the reactive object
            formData.name = "";
            formData.email = "";
            formData.password = "";
            formData.confirmPassword = "";
            termsAccepted.value = false;

            router.push({ path: '/login' });
        } else {
            notyf.error("Registration Failed. Please contact administrator.");
        }
    } catch (e) {
        const status = e.response?.status;
        if ([400, 401, 404, 409].includes(status)) {
            notyf.error(e.response.data.error || "Validation error occurred.");
        } else {
            notyf.error("Registration Failed. Please contact administrator.");
        }
    } finally {
        isLoading.value = false;
    }
}

function togglePass(field) {
    if (field === 'password') showPassword.value = !showPassword.value;
    else showConfirmPassword.value = !showConfirmPassword.value;
}

onBeforeMount(() => {
    // If user is already authenticated, redirect them out of the register loop
    if (localStorage.getItem("token")) {
        router.push({ path: '/dashboard' }); 
    }
});
</script>

<template>
  <div class="container-fluid register-container">
    <div class="row align-items-center min-vh-100">
      <div class="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4 offset-sm-1 offset-md-1">
        <div class="register-card">
          <h2 class="text-center mb-4">
            Join <span class="highlight-pulse">PULSE</span>
          </h2>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="form-control-custom" 
                  placeholder="Full Name" 
                  required 
                />
              </div>
            </div>

            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">✉️</span>
                <input 
                  v-model="formData.email"
                  type="email" 
                  class="form-control-custom" 
                  placeholder="Email Address" 
                  required 
                />
              </div>
            </div>
            
            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control-custom" 
                  placeholder="Create Password" 
                  required 
                />
                <span class="password-toggle-icon" @click="togglePass('password')">
                  {{ showPassword ? '🙈' : '👁️' }}
                </span>
              </div>
            </div>

            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">🛡️</span>
                <input 
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  class="form-control-custom" 
                  placeholder="Confirm Password" 
                  required 
                />
                <span class="password-toggle-icon" @click="togglePass('confirmConfirm')">
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </span>
              </div>
            </div>

            <div class="form-check mb-4 custom-checkbox-wrapper">
              <input 
                v-model="termsAccepted"
                type="checkbox" 
                class="form-check-input custom-checkbox" 
                id="termsCheck" 
                required 
              />
              <label class="form-check-label checkbox-label" for="termsCheck">
                I accept the <a href="#" class="terms-link">Terms & Conditions</a>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="btn-register w-100 mb-3"
              :disabled="!isEnabled || isLoading"
            >
              {{ isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
            </button>
          </form>
          
          <div class="text-center">
            <p class="login-cta">
                Already have an account?
                <RouterLink to="/login" class="login-link">Login here</RouterLink>
            </p>
            <p class="footer-note">
              Start your dynamic training journey and elevate your motion today.
            </p>
          </div>
        </div>
      </div>
      
    <div class="col-12 col-md-7 col-lg-6 text-center text-white ps-md-5">
        <p class="sub-title text-uppercase tracking-wider">Elevate Your Motion</p>
        <h1 class="main-title font-black text-uppercase">Track. Train.</h1>
        <p class="promo-text font-bold mb-0">
          Workout with your 
          <span class="brand-highlight text-uppercase">Fitmon</span>
        </p>
        </div>
      </div>
  </div>
</template>

<style scoped>
/* Container & Background configuration */
.register-container {
  background: url('@/assets/register-background.png') no-repeat center center fixed;
  background-size: cover;
  overflow-x: hidden;
}

/* Identical UI Glassmorphism Spec for cohesive identity */
.register-card {
  background: rgba(45, 45, 60, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 40px 30px;
  color: #ffffff;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Pulse branding color treatment */
.highlight-pulse {
  color: #00d4ff;
  font-weight: 800;
  text-transform: uppercase;
}

/* Custom Element Icons & Form controls */
.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #00d4ff;
  font-size: 1.1rem;
}

.password-toggle-icon {
  position: absolute;
  right: 15px;
  cursor: pointer;
  user-select: none;
  font-size: 1.1rem;
  transition: opacity 0.2s ease;
}

.password-toggle-icon:hover {
  opacity: 0.8;
}

.form-control-custom {
  width: 100%;
  padding: 12px 40px 12px 45px; /* Right padding adjusted for toggle icon */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control-custom:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.form-control-custom::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* Terms and Conditions Checkbox styling */
.custom-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 25px;
}

.custom-checkbox {
  cursor: pointer;
  accent-color: #00d4ff;
  width: 16px;
  height: 16px;
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.terms-link {
  color: #00d4ff;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Action button gradient matching brand scheme */
.btn-register {
  background: linear-gradient(90deg, #00d4ff 0%, #4a90e2 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  padding: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.95;
}

.btn-register:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-register:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Link treatments */
.login-cta {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.login-link {
  color: #00d4ff;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.footer-note {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}

/* Right Column: Hero Section Styles */
.sub-title {
  font-size: 1.2rem;
  letter-spacing: 2px;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.main-title {
  font-size: calc(2.8rem + 3vw);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -1px;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.promo-text {
  font-size: calc(1.5rem + 1.2vw);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.brand-highlight {
  display: block;
  font-size: calc(2.2rem + 2.5vw);
  font-weight: 900;
  background: linear-gradient(135deg, #00d4ff 0%, #4a90e2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0.25rem;
}
</style>