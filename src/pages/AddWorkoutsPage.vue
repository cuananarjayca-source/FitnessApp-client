<template>
  <div class="add-workout-container min-vh-100 p-4 text-white">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div class="d-flex align-items-center gap-3">
        <button @click="goBack" class="btn btn-back rounded-circle border-0 d-flex align-items-center justify-content-center">
          <svg xmlns="http://w3.org" width="20" height="20" fill="currentColor" class="bi bi-arrow-left text-white" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
          </svg>
        </button>
        <h1 class="display-6 fw-bold text-gradient-title m-0">Create New Routine</h1>
      </div>
    </div>

    <div class="row g-5">
      <!-- Configuration Entry Section Column -->
      <div class="col-12 col-lg-7">
        <div class="card bg-dark-card border-0 p-4 rounded-3 shadow">
          <h2 class="h4 fw-bold text-teal mb-4">Routine Settings</h2>
          
          <form @submit.prevent="saveRoutine">
            <div class="mb-4">
              <label for="workoutName" class="form-label text-teal-muted small fw-semibold">WORKOUT TARGETS (NAME)</label>
              <input 
                v-model="form.name" 
                type="text" 
                id="workoutName" 
                class="form-control form-dark-input" 
                placeholder="e.g., Chest + Tricep"
                required
              >
            </div>

            <div class="mb-5">
              <label for="interval" class="form-label text-teal-muted small fw-semibold">DURATION / DETAILS</label>
              <input 
                v-model="form.interval" 
                type="text" 
                id="interval" 
                class="form-control form-dark-input" 
                placeholder="e.g., 15 mins interval per rep"
                required
              >
            </div>

            <div class="d-flex gap-3 justify-content-end pt-3 border-top border-secondary">
              <button type="button" @click="goBack" class="btn btn-outline-secondary rounded-3 px-4">
                Cancel
              </button>
              <button type="submit" :disabled="isSubmitting" class="btn btn-teal rounded-3 px-4 fw-semibold">
                {{ isSubmitting ? 'Saving...' : 'Save Task to Board' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Live Mock Review Representation Display Column -->
      <div class="col-12 col-lg-5 d-flex flex-column gap-4">
        <h2 class="h5 fw-bold text-muted uppercase m-0 small tracking-wide">Live Component Card Preview</h2>
        
        <div class="card bg-dark-card border-0 p-4 rounded-3 position-relative shadow card-preview-sizing">
          <div class="counter-circle d-flex align-items-center justify-content-center mb-4">
            <span class="fs-4 fw-bold text-teal">1</span>
          </div>
          <div class="mt-auto">
            <h3 class="h4 fw-bold text-teal mb-2 text-truncate">{{ form.name || 'Task Title Name' }}</h3>
            <p class="text-teal-muted mb-1 fs-6 text-truncate">{{ form.interval || 'Duration / Interval context' }}</p>
            <p class="text-info fw-medium text-capitalize m-0 fs-6">Status: pending</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global.js';

const router = useRouter();
const globalStore = useGlobalStore();

const form = ref({
  name: '',
  interval: ''
});

const isSubmitting = ref(false);

const goBack = () => {
  router.push({ name: 'Workouts' });
};

const saveRoutine = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  
  const success = await globalStore.addWorkoutItem(form.value);
  isSubmitting.value = false;

  if (success) {
    goBack();
  }
};
</script>

<style scoped>
.add-workout-container { background-color: #ffffff; }
.text-gradient-title {
  background: linear-gradient(45deg, #3d66e4, #5394f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bg-dark-card { background-color: #2b323c; }
.text-teal { color: #5be2eb !important; }
.text-teal-muted { color: #a4e1e6; }
.btn-teal { background-color: #6fbcc2; color: #2b323c; border: none; }
.btn-teal:hover { background-color: #5aa6ac; }
.btn-back { background-color: #2b323c; width: 45px; height: 45px; }
.form-dark-input { background-color: #1f242b; border: 1px solid #414b59; color: #ffffff; padding: 0.75rem 1rem; }
.form-dark-input:focus { background-color: #1f242b; color: #ffffff; border-color: #5be2eb; box-shadow: 0 0 0 0.25rem rgba(91, 226, 235, 0.15); }
.counter-circle { width: 55px; height: 55px; border: 2px solid #5be2eb; border-radius: 50%; }
.card-preview-sizing { min-height: 180px; }
</style>
