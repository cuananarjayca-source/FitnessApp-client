<script setup>
	import { storeToRefs } from "pinia";
    import { useGlobalStore } from "../stores/global.js";

    const globalStore = useGlobalStore();
    const { user } = storeToRefs(globalStore);
</script>

<template>
  <nav class="navbar">
    <div class="logo">Pulse Flow</div>
    <ul class="nav-links">
      <li><a href="#">Features</a></li>
      <li><a href="#">Workouts</a></li>
      <li><a href="#">Community</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
    <div class="auth-buttons">
      <button class="register">Register</button>
      <button class="login">Login</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  /* The transparent effect */
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: 500;
}

.auth-buttons button {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>