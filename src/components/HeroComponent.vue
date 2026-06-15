<template>
  <div class="d-flex flex-column text-white hero-container justify-content-center align-items-center">
    <div class="container-fluid py-5">
      <div class="row align-items-center justify-content-center min-vh-75 px-md-5">
        
        <!-- Left Side Character Component -->
        <div class="col-md-3 d-none d-md-flex justify-content-end align-items-center position-relative">
          <img 
            src="@/assets/left-character.png" 
            alt="Left Fitmon Asset" 
            class="img-fluid character-img left-asset"
          />
        </div>

        <!-- Center Text Section -->
        <div class="col-12 col-md-6 d-flex flex-column align-items-center text-center text-white center-content z-1">
          <p class="text-uppercase small fw-bold tracking-wide text-white mb-3 sub-heading">
            ELEVATE YOUR MOTION
          </p>
          
          <h1 class="fw-black mb-0 main-title-text">
            TRACK. TRAIN.
          </h1>
          
          <h2 class="fw-bold mb-4 main-subtitle-text">
            Workout with your <span class="highlight-fitmon">FITMON</span>
          </h2>
          
          <button 
            class="btn rounded-pill px-4 py-2 hero-btn d-flex align-items-center justify-content-center"
            @click="goToWorkouts"
          >
            Start Your Journey <span class="ms-2">&rarr;</span>
          </button>

          <h3 class="mt-5 slogan-text">
            Your Fitness is your Pet's goal
          </h3>
        </div>

        <!-- Right Side Character Component -->
        <div class="col-md-3 d-none d-md-flex justify-content-start align-items-center position-relative">
          <img 
            src="@/assets/right-character.png" 
            alt="Right Fitmon Asset" 
            class="img-fluid character-img right-asset"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToWorkouts() {
  router.push('/workouts');
}
</script>

<style scoped>
/* Main Container & Background Setup */
.hero-container {
  background: url('@/assets/hero-background.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  min-height: 100vh;
  position: relative;
}

/* Typography & Layout Refinements */
.sub-heading {
  font-size: 1.5rem;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.9) !important;
}

.main-title-text {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 0.95;
  color: #ffffff;
}

.main-subtitle-text {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: #ffffff;
}

/* Custom FITMON Text Gradient matching the image */
.highlight-fitmon {
  background: linear-gradient(180deg, #51a7ff 0%, #3b50df 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  display: inline-block;
}

/* Primary CTA Button Match */
.hero-btn {
  background: linear-gradient(90deg, #3782eb 0%, #1e52be 100%);
  color: #ffffff !important;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(30, 82, 190, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(30, 82, 190, 0.6);
}

/* Bottom Quote Stylings */
.slogan-text {
  font-size: 2.2rem;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 230, 245, 0.95);
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Character Placement and Scale Adjustments */
.character-img {
  max-height: 480px; 
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
  animation: float 6s ease-in-out infinite;
}

.left-asset {
  transform: translateX(10%);
}

.right-asset {
  transform: translateX(-10%);
}

/* =========================================
   RESPONSIVE BREAKPOINTS
   ========================================= */

@media (max-width: 1200px) {
  .main-title-text { font-size: 4.5rem; }
  .main-subtitle-text { font-size: 2.8rem; }
  .character-img { max-height: 380px; }
}

@media (max-width: 992px) { 
  .main-title-text { font-size: 3.5rem; }
  .main-subtitle-text { font-size: 2.2rem; }
  .slogan-text { font-size: 1.6rem; }
  .character-img { max-height: 290px; }
}

@media (max-width: 768px) { 
  .sub-heading { font-size: 1.1rem; }
  .main-title-text { font-size: 2.8rem; }
  .main-subtitle-text { font-size: 1.8rem; }
  .slogan-text { font-size: 1.3rem; }
}

/* Ambient Floating Animation */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
</style>
