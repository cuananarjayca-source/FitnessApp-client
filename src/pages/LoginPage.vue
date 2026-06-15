<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { Notyf } from 'notyf';
import { useRouter } from 'vue-router';
import api from '../api.js';
import { useGlobalStore } from '../stores/global.js';

const router = useRouter();
const globalStore = useGlobalStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

const notyf = new Notyf();

// Monitors both fields to enable the Sign In button only when both have content
watch([email, password], (currentValue) => {
  isEnabled.value = currentValue.every(input => input !== "");
});

// Await user details configuration safely via the global store
async function getUserDetails(token) {
  try {
    await globalStore.getUserDetails(token);
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
}

// Renamed to match the template form submission handler
async function handleLogin() {
  if (isLoading.value) return;

  // Strict email regex validation matching your backend requirements
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    notyf.error("Please enter a valid email address.");
    return;
  }

  isLoading.value = true;

 try {
    const response = await api.post(`/users/login`, {
      email: email.value,
      password: password.value,
    });

    if (response.data) {
      notyf.success("Login Successful");
      const token = response.data.access;
      
      // Set token in BOTH localStorage and Pinia store immediately
      localStorage.setItem("token", token);
      globalStore.user = { ...globalStore.user, token };  // Or however your store setter works
      
      // Then fetch full user details
      await getUserDetails(token);
      
      email.value = "";
      password.value = "";
      router.push({ path: '/' });
    }
  } catch (e) {
    const status = e.response?.status;
    if (status === 404 || status === 401 || status === 400) {
      notyf.error(e.response.data.error || "Invalid email or password.");
    } else {
      notyf.error("Login Failed. Please contact administrator.");
    }
  } finally {
    isLoading.value = false;
  }
}

onBeforeMount(() => {
    if (globalStore.user?.token) router.push("/");
});
</script>

<template>
  <div class="container-fluid login-container">
    <div class="row align-items-center min-vh-100">
      <div class="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4 offset-sm-1 offset-md-1">
        <div class="login-card">
          <h2 class="text-center mb-4">
            Access your <span class="highlight-pulse">PULSE</span>
          </h2>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  v-model="email"
                  type="email" 
                  class="form-control-custom" 
                  placeholder="Enter your Email" 
                  required 
                />
              </div>
            </div>
            
            <div class="form-group-custom mb-3">
              <div class="input-icon-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  v-model="password"
                  type="password" 
                  class="form-control-custom" 
                  placeholder="Enter your Password" 
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              class="btn-signin w-100 mb-3"
              :disabled="!isEnabled || isLoading"
            >
              {{ isLoading ? 'SIGNING IN...' : 'SIGN IN' }}
            </button>
          </form>
          
          <div class="text-center">
            <a href="#" class="forgot-password-link d-block mb-3">Forgot Password</a>
            <p class="register-cta mb-4">
                Don't have an account yet? Register
                <RouterLink to="/register" class="register-link">here</RouterLink>
            </p>
            <p class="footer-note">
              We provide the ultimate training environment designed for real results.
            </p>
          </div>
        </div>
      </div>
      
      <div class="col-12 col-md-5 col-lg-6 d-none d-md-block"></div>
    </div>
  </div>
</template>

<style scoped>
/* Main Container & Background Image Setup */
.login-container {
  background: url('@/assets/login-background.png') no-repeat center center fixed;
  background-size: cover;
  overflow-x: hidden;
}

/* Glassmorphism Login Card */
.login-card {
  background: rgba(45, 45, 60, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 40px 30px;
  color: #ffffff;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Branding & Highlights */
.highlight-pulse {
  color: #00d4ff;
  font-weight: 800;
  text-transform: uppercase;
}

/* Custom Styled Input Groups */
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

.form-control-custom {
  width: 100%;
  padding: 12px 12px 12px 45px;
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

/* Vibrant Sign In Button */
.btn-signin {
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

.btn-signin:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.95;
}

.btn-signin:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-signin:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Contextual Links & Typography */
.forgot-password-link {
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.forgot-password-link:hover {
  color: #00d4ff;
}

.register-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.register-link {
  color: #00d4ff;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.footer-note {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}
</style>