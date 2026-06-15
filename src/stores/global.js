import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import api from '../api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export const useGlobalStore = defineStore('global', () => {

    const notyf = new Notyf({
        duration: 4000,
        position: { x: 'right', y: 'top' },
        dismissible: true
    });

    let user = reactive({
        token: localStorage.getItem('token'),
        email: null,
        isAdmin: false,
    });

    const workouts = ref([]);

    // Helper utility to inject user authorization bearer headers automatically
    const getAuthHeaders = () => {
        return {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };
    };

    async function getUserDetails(token) {
        if (!token) {
            user.token = null;
            user.email = null;
            user.isAdmin = false;
            return;
        }
        let { data } = await api.get('/users/details', {
            headers: { Authorization: `Bearer ${token}` }
        });
        user.token = token;
        user.email = data.email;
        user.isAdmin = data.isAdmin;
    }


    async function fetchWorkouts() {
        try {

            const response = await api.get('/workouts/getMyWorkouts', getAuthHeaders());

            console.log("Inspecting backend data envelope:", response.data);

            let rawWorkoutsArray = [];

            if (Array.isArray(response.data)) {
                rawWorkoutsArray = response.data;
            } else if (response.data && Array.isArray(response.data.workouts)) {
                rawWorkoutsArray = response.data.workouts;
            } else if (response.data && Array.isArray(response.data.data)) {
                rawWorkoutsArray = response.data.data;
            } else {
                console.error("Could not locate your workout array inside response object wrapper");
                return;
            }


            workouts.value = rawWorkoutsArray.map((item, index) => ({
                id: item._id || item.id,
                counter: index + 1,
                name: item.name,
                interval: item.duration,
                schedule: item.status || 'pending',
                weight: 190,
                timestamp: item.dateAdded ? 'Added' : 'Just now'
            }));

        } catch (error) {
            console.error('Error executing getMyWorkouts:', error);
            notyf.error('Failed to parse routine dashboard.');
        }
    }


    async function addWorkoutItem(workoutData) {
        try {

            await api.post('/workouts/addWorkout', {
                name: workoutData.name,
                duration: workoutData.interval,
                status: 'pending'
            }, getAuthHeaders());

            await fetchWorkouts();
            notyf.success('Workout routine added successfully!');
            return true;
        } catch (error) {
            console.error('Error executing addWorkout:', error);
            notyf.error('Failed to persist workout item profile.');
            return false;
        }
    }

    async function editWorkoutItem(workoutData) {
        try {
            await api.patch(`/workouts/updateWorkout/${workoutData.id}`, {
                name: workoutData.name,
                duration: workoutData.interval
            }, getAuthHeaders());

            if (workoutData.schedule === 'completed') {
                await api.patch(`/workouts/completeWorkoutStatus/${workoutData.id}`, {}, getAuthHeaders());
            }

            await fetchWorkouts();
            notyf.success('Workout routine updated successfully!');
            return true;
        } catch (error) {
            console.error('Error executing updateWorkout:', error);
            notyf.error('Failed to persist workout item profile.');
            return false;
        }
    }

    async function deleteWorkoutItem(workoutId) {
        try {
            await api.delete(`/workouts/deleteWorkout/${workoutId}`, getAuthHeaders());


            await fetchWorkouts();
            notyf.success('Routine entry removed.');
            return true;
        } catch (error) {
            console.error('Error executing deleteWorkout:', error);
            notyf.error('Could not complete routine removal processing.');
            return false;
        }
    }

    // Remember to add deleteWorkoutItem to your store's return statement block at the bottom!
    return {
        user,
        workouts,
        getUserDetails,
        fetchWorkouts,
        addWorkoutItem,
        editWorkoutItem,
        deleteWorkoutItem // Expose to views
    }
});
