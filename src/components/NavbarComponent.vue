<template>
  <nav :class="['global-navbar', { 'is-scrolled': isScrolled }]">
    <div class="navbar-inner">
      
      <div class="nav-left">
        <RouterLink to="/" class="brand-identity">
          <span class="brand-pulse">Pulse</span> <span class="brand-flow">Flow</span>
        </RouterLink>
      </div>

      <div class="nav-center">
        <ul class="nav-links">
          <li><RouterLink to="/features">Features</RouterLink></li>
          <li><RouterLink to="/workouts">Workouts</RouterLink></li>
          <li><RouterLink to="/community">Community</RouterLink></li>
          <li><RouterLink to="/pricing">Pricing</RouterLink></li>
        </ul>
      </div>

      <div class="nav-right">
        <!-- Guest Content: Disappears completely once authenticated -->
        <template v-if="!isAuthenticated">
          <RouterLink to="/register" class="action-link">Register</RouterLink>
          <RouterLink to="/login" class="action-link">Login</RouterLink>
        </template>
        
        <!-- Profile Container: Wrapped to attach template ref and position the dropdown menu -->
        <div class="position-relative d-inline-block" ref="profileBtnRef">
          <button 
            @click="toggleProfileDropdown" 
            class="profile-icon-btn" 
            aria-label="User Profile"
            :aria-expanded="profileDropdownOpen"
          >
            <svg class="profile-silhouette" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>

          <!-- Dropdown Menu: Displays only if authenticated and profileDropdownOpen is true -->
          <ul 
            v-if="isAuthenticated && profileDropdownOpen" 
            class="dropdown-menu dropdown-menu-end show shadow mt-2 border-0 position-absolute"
            style="right: 0;"
          >
            <li class="dropdown-header pb-2 mb-1 border-bottom" v-if="user?.email">
              <div class="small text-muted">Signed in as</div>
              <strong class="text-dark d-block text-truncate" style="max-width: 180px;">{{ user.email }}</strong>
            </li>
            <li>
              <RouterLink to="/profile" class="dropdown-item" @click="closeDropdown">My Profile</RouterLink>
            </li>
            <li v-if="user?.isAdmin">
              <RouterLink to="/products" class="dropdown-item fw-bold text-primary" @click="closeDropdown">Admin Panel</RouterLink>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button @click="handleLogout" class="dropdown-item text-danger d-flex align-items-center justify-content-betweenw-100 border-0 bg-transparent">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "../stores/global.js";

const globalStore = useGlobalStore();
const { user } = storeToRefs(globalStore);
const isAuthenticated = computed(() => Boolean(user.value?.token));
const router = useRouter();
const route = useRoute();

const isAuthPage = computed(() => {
    return ['/login', '/register'].includes(route.path); 
});

watch(
    () => user.value?.isAdmin,
    (isAdmin) => {
        if (isAdmin && !route.path.startsWith('/admin')) {
            router.push('/products');
        }
    },
    { immediate: true } 
);

const isScrolled = ref(false);
const offcanvasOpen = ref(false);
const profileDropdownOpen = ref(false);
const profileBtnRef = ref(null);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 30;
};

const handleClickOutside = (e) => {
    if (profileBtnRef.value && !profileBtnRef.value.contains(e.target)) {
        profileDropdownOpen.value = false;
    }
};

onMounted(() => {
    const token = localStorage.getItem("token");
    if (token && !user.value?.email) {
        globalStore.getUserDetails(token);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("click", handleClickOutside);
});

const toggleOffcanvas = () => {
    offcanvasOpen.value = !offcanvasOpen.value;
};

const closeOffcanvas = () => {
    offcanvasOpen.value = false;
};

const toggleProfileDropdown = () => {
    if (!isAuthenticated.value) {
        router.push("/login");
        return;
    }
    profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeDropdown = () => {
    profileDropdownOpen.value = false;
};

const handleLogout = async () => {
    closeDropdown();
    if (typeof globalStore.logout === 'function') {
        await globalStore.logout();
    } else {
        user.value = null;
        localStorage.removeItem("token");
    }
    router.push("/");
};

// Robust SPA scroll behavior for both same-page and cross-page navigation
watch(
    () => [route.path, route.hash],
    async ([newPath, newHash]) => {
        if (newHash) {
            setTimeout(() => {
                const element = document.querySelector(newHash);
                if (element) {
                    const yOffset = -90; 
                    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                    
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        } else if (newPath === '/' && !newHash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    { immediate: true }
);
</script>


<style scoped>
/* --- Main Layout Container --- */
.global-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 15px 0;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: 
    background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.4s ease,
    padding 0.4s ease;
}

/* --- Scrolled Layout State (70% Transparent Dark Over Pastel Gradient) --- */
.global-navbar.is-scrolled {
  background-color: rgba(15, 15, 20, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px 0;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* --- Left: Brand Identity Typography --- */
.nav-left {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.45rem;
  letter-spacing: -0.5px;
  display: inline-flex;
  align-items: center;
}

.brand-identity {
  text-decoration: none !important;
}

.brand-pulse {
  color: #ffffff;
  font-weight: 800; /* Bold White */

}

.brand-flow {
  color: #38bdf8; /* Solid Light Blue */
  font-weight: 500;
  margin-left: 1px;

}

/* --- Center: Navigation Links --- */
.nav-links {
  list-style: none;
  display: flex;
  gap: 2.5rem; /* Balanced, even spatial layout separation */
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #ffffff;
  text-decoration: none;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  opacity: 0.85;
  transition: opacity 0.25s ease;
}

.nav-links a:hover {
  opacity: 1;
}

/* --- Right: Actions Utility Section --- */
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-link {
  color: #ffffff;
  text-decoration: none;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.25s ease;
}

.action-link:hover {
  opacity: 1;
}

/* --- Square Profile Icon Button --- */
.profile-icon-btn {
  background-color: #e5e7eb; /* Light Grey Background */
  border: none;
  outline: none;
  width: 38px;
  height: 38px;
  border-radius: 6px; /* Clean modern square profile profile */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.profile-icon-btn:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

.profile-silhouette {
  width: 22px;
  height: 22px;
  color: #6b7280; /* Minimalist dark gray silhouette color overlay */
}
</style>