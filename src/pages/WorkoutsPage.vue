<template>
  <div class="workouts-container min-vh-100 p-4 text-white">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-5 fw-bold text-gradient-title mt-5">Fitness Routine Board</h1>
      <button @click="goToAddWorkout" class="btn btn-teal rounded-3 px-4 py-2 fw-semibold">
        Add Routine Task
      </button>
    </div>

    <!-- Dashboard Layout Grid -->
    <div class="row g-4">
      
      <!-- Top Row Grid Elements -->
      <div class="col-12 col-md-4">
        <div class="card bg-dark-card border-0 h-100 p-4 rounded-3 min-card-height d-flex flex-column justify-content-between position-relative overflow-hidden stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-teal-muted small fw-bold uppercase m-0 tracking-wide">Routine Tasks</p>
              <h3 class="display-5 fw-bold text-white mt-2 mb-0">{{ workouts.length }}</h3>
            </div>
            <div class="stat-icon-wrapper bg-teal-subtle text-teal">
              <i class="bi bi-activity fs-4"></i>
            </div>
          </div>
          <div class="mt-4 pt-3 border-top border-secondary-subtle">
            <span class="text-success small fw-semibold">
              <i class="bi bi-check-circle-fill me-1"></i>
              {{ workouts.filter(w => w.schedule === 'completed').length }} Completed
            </span>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card bg-teal-card text-dark-bg border-0 h-100 p-4 rounded-3 min-card-height d-flex flex-column justify-content-between stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-dark-bg opacity-75 small fw-bold uppercase m-0 tracking-wide">Weight Metric</p>
              <h3 class="display-5 fw-bold text-dark-bg mt-2 mb-0">190 <span class="fs-5">lbs</span></h3>
            </div>
            <div class="stat-icon-wrapper bg-dark-bg-subtle text-dark-bg">
              <i class="bi bi-scale fs-4"></i>
            </div>
          </div>
          <div class="mt-4 pt-3 border-top border-dark-subtle">
            <span class="text-dark-bg opacity-75 small fw-medium">Tracking since registration</span>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="card bg-dark-card border-0 h-100 p-4 rounded-3 min-card-height d-flex flex-column justify-content-between stat-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="text-teal-muted small fw-bold uppercase m-0 tracking-wide">Yearly Progress</p>
              <h3 class="display-5 fw-bold text-white mt-2 mb-0">84%</h3>
            </div>
            <div class="stat-icon-wrapper bg-teal-subtle text-teal">
              <i class="bi bi-calendar-check fs-4"></i>
            </div>
          </div>
          <div class="mt-4 pt-3 border-top border-secondary-subtle">
            <span class="text-teal small fw-semibold">Target: 90% completion rate</span>
          </div>
        </div>
      </div>

      <!-- Bottom Layout Element -->
      <div class="col-12">
        <div class="card bg-dark-card border-0 p-4 p-md-5 rounded-3 min-panel-height">
          <h2 class="h4 fw-bold text-teal mb-4 d-flex justify-content-between align-items-center">
            <span>Detailed Routine Activities</span>
            <span class="badge bg-teal text-dark-bg fs-6">{{ workouts.length }} Active</span>
          </h2>
          
          <div v-if="workouts.length === 0" class="d-flex flex-column align-items-center justify-content-center py-5">
            <span class="text-muted fs-6 mb-3">Detailed routine activities panel is empty</span>
            <button @click="goToAddWorkout" class="btn btn-outline-teal btn-sm">Create your first routine</button>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-dark table-hover align-middle custom-table">
              <thead>
                <tr>
                  <th scope="col" class="text-teal-muted small fw-bold">#</th>
                  <th scope="col" class="text-teal-muted small fw-bold">WORKOUT NAME</th>
                  <th scope="col" class="text-teal-muted small fw-bold">DURATION</th>
                  <th scope="col" class="text-teal-muted small fw-bold">STATUS</th>
                  <th scope="col" class="text-teal-muted small fw-bold text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(workout, index) in workouts" :key="workout.id" class="workout-row">
                  <td class="fw-semibold text-teal-muted">{{ index + 1 }}</td>
                  <td>
                    <div class="fw-bold text-white">{{ workout.name }}</div>
                  </td>
                  <td>
                    <span class="badge bg-dark-pill text-teal border border-teal-subtle px-3 py-2">
                      <i class="bi bi-clock-history me-1"></i> {{ workout.interval }}
                    </span>
                  </td>
                  <td>
                    <span :class="['badge px-3 py-2', workout.schedule === 'completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning']">
                      <i :class="['bi me-1', workout.schedule === 'completed' ? 'bi-check-circle-fill' : 'bi-hourglass-split']"></i>
                      {{ workout.schedule }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="d-flex gap-2 justify-content-end">
                      <button 
                        v-if="workout.schedule !== 'completed'"
                        @click="completeWorkout(workout.id)" 
                        class="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 action-btn"
                        title="Complete Workout"
                      >
                        <i class="bi bi-check-lg"></i> Complete
                      </button>
                      <!-- Connected Edit Handler -->
                      <button 
                        @click="openEditModal(workout)" 
                        class="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1 action-btn"
                        title="Edit Workout"
                      >
                        <i class="bi bi-pencil-square"></i> Edit
                      </button>
                      <button 
                        @click="deleteWorkout(workout.id)" 
                        class="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 action-btn"
                        title="Delete Workout"
                      >
                        <i class="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Embedded Edit Routine Modal Box Layout Component Overlay -->
    <div v-if="showModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center">
      <div class="modal-dialog-custom card bg-dark-card border border-secondary p-4 rounded-3 shadow-lg">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="h5 fw-bold text-teal m-0">Modify Routine Task</h3>
          <button @click="closeEditModal" class="btn-close btn-close-white" aria-label="Close"></button>
        </div>
        
        <form @submit.prevent="submitModalUpdate">
          <div class="mb-3">
            <label for="modalWorkoutName" class="form-label text-teal-muted small fw-semibold">WORKOUT NAME</label>
            <input 
              v-model="editForm.name" 
              type="text" 
              id="modalWorkoutName" 
              class="form-control form-dark-input" 
              required
            >
          </div>
          
          <div class="mb-4">
            <label for="modalInterval" class="form-label text-teal-muted small fw-semibold">DURATION / INTERVAL</label>
            <input 
              v-model="editForm.interval" 
              type="text" 
              id="modalInterval" 
              class="form-control form-dark-input" 
              required
            >
          </div>

          <div class="mb-4">
            <label for="modalSchedule" class="form-label text-teal-muted small fw-semibold">STATUS TRACKER</label>
            <select v-model="editForm.schedule" id="modalSchedule" class="form-select form-dark-input">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="d-flex gap-2 justify-content-end border-top border-secondary pt-3">
            <button type="button" @click="closeEditModal" class="btn btn-outline-secondary px-4 rounded-3 btn-sm">Cancel</button>
            <button type="submit" :disabled="isUpdating" class="btn btn-teal px-4 rounded-3 fw-semibold btn-sm">
              {{ isUpdating ? 'Saving...' : 'Save Updates' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../stores/global.js';

// --- Initialization Variables ---
const router = useRouter();
const globalStore = useGlobalStore();

// Safely destructure workouts list preserving reactive state tracking
const { workouts } = storeToRefs(globalStore);

// --- Modal System Reactive State Objects ---
const showModal = ref(false);
const isUpdating = ref(false);
const editForm = ref({ 
  id: '', 
  name: '', 
  interval: '', 
  schedule: '' 
});

// Fetch routine collections from backend API database on initial layout render mount
onMounted(async () => {
  await globalStore.fetchWorkouts();
});

// Programmatic route navigation method to direct user to creation board form view
const goToAddWorkout = () => {
  router.push({ name: 'AddWorkouts' });
};

// --- Modal Operation Functional Methods ---

// 1. Intercept item details click, assign data to model fields, reveal backdrop wrapper
const openEditModal = (targetWorkout) => {
  editForm.value = {
    id: targetWorkout.id,
    name: targetWorkout.name,
    interval: targetWorkout.interval, // Preloads current duration text context
    schedule: targetWorkout.schedule   // Preloads status value context (pending/completed)
  };
  showModal.value = true;
};

// 2. Shut down modal component interface overlays
const closeEditModal = () => {
  showModal.value = false;
};

// 3. Dispatch form variations out to Pinia API store update mutations
const submitModalUpdate = async () => {
  if (isUpdating.value) return;
  isUpdating.value = true;
  
  const success = await globalStore.editWorkoutItem(editForm.value);
  isUpdating.value = false;
  
  if (success) {
    closeEditModal();
  }
};

// Quick-toggle action method to change status flag properties instantly to 'completed'
const completeWorkout = async (id) => {
  const item = workouts.value.find(w => w.id === id);
  if (item) {
    await globalStore.editWorkoutItem({
      id: item.id,
      name: item.name,
      interval: item.interval,
      schedule: 'completed'
    });
  }
};

// Delete routine action dispatcher communicating tracking ID down to database endpoints
const deleteWorkout = async (id) => {
  if (confirm("Are you sure you want to remove this workout?")) {
    if (typeof globalStore.deleteWorkoutItem === 'function') {
      await globalStore.deleteWorkoutItem(id);
    }
  }
};
</script>


<style scoped>
.workouts-container {
  background-color: #1a1a24;
}

.text-dark-bg {
  color: #2b323c !important;
}

.text-gradient-title {
  background: linear-gradient(45deg, #00d4ff, #4a90e2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-teal {
  background-color: #6fbcc2;
  color: #2b323c;
  border: none;
}
.btn-teal:hover {
  background-color: #5aa6ac;
}

.bg-dark-card {
  background-color: #2b323c;
}

.bg-teal-card {
  background-color: #6fbcc2;
}

.min-card-height {
  min-height: 220px;
}

.min-panel-height {
  min-height: 350px;
}

.italic {
  font-style: italic;
}

.stat-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-teal-subtle {
  background-color: rgba(111, 188, 194, 0.15);
}

.bg-dark-bg-subtle {
  background-color: rgba(43, 50, 60, 0.15);
}

.text-teal-muted {
  color: #a4e1e6;
}

.text-teal {
  color: #6fbcc2 !important;
}

.btn-outline-teal {
  color: #6fbcc2;
  border-color: #6fbcc2;
  background-color: transparent;
  transition: all 0.2s ease;
}
.btn-outline-teal:hover {
  color: #2b323c;
  background-color: #6fbcc2;
  border-color: #6fbcc2;
}

.bg-dark-pill {
  background-color: #1f242b;
}

.bg-success-subtle {
  background-color: rgba(25, 135, 84, 0.2) !important;
}

.bg-warning-subtle {
  background-color: rgba(255, 193, 7, 0.2) !important;
}

.custom-table {
  background-color: transparent;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.custom-table thead th {
  border-bottom: none;
  padding: 12px 16px;
}

.custom-table tbody tr {
  background-color: #1f242b;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.custom-table tbody tr:hover {
  background-color: #252b33;
  transform: scale(1.005);
}

.custom-table tbody td {
  border: none;
  padding: 16px;
}

.custom-table tbody tr td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.custom-table tbody tr td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.action-btn {
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: scale(1.05);
}
</style>
