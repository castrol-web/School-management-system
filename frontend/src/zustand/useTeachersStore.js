import { create } from "zustand";
import { URL } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

//creating a function for teacher states
const useTeachersStore = create((set) => ({
    //states
    teachers: [],
    Loading: false,
    //function to fetch teachers
    fetchTeachers: async (token) => {
        try {
            set({ Loading: true })
            const response = await axios.get(`${URL}/api/admin/get-teachers`, {
                headers: { 'x-access-token': token },
            });
            if (response.status === 201) {
                set({ teachers: response.data })
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast("failed to fetch teachers")
                console.error(error)
            }
        } finally {
            set({ Loading: false })
        }
    }
}));


export default useTeachersStore;