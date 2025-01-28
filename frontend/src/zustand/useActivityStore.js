import { create } from "zustand";
import { URL } from "../App";
import axios from "axios";
import { toast } from "react-toastify";


const useActivityStore = create((set) => ({
    activities: [],
    loading:false,
    fetchActivities: async (token) => {
        try {
            set({loading:true})
            const response = await axios.get(`${URL}/api/teacher/activities`, {
                headers: {
                    'x-access-token': token
                }
            });
            if (response.status === 201) {
                set({ activities: response.data });
            }

        } catch (error) {
            toast.error('Failed to fetch activities');
            console.error('Error fetching activities:', error);
        }finally{
            set({loading:false})
        }
    }
}));

export default useActivityStore;