import { create } from "zustand";
import { URL } from "../App";
import axios from "axios";
import { toast } from "react-toastify";


//function for class storage
const useClassesStore = create((set) => ({
    classes: [],
    loading: false,
    fetchClasses: async (token) => {
        try {
            set({ Loading: true });
            const response = await axios.get(`${URL}/api/admin/get-classes`, {
                headers: {
                    "x-access-token": token
                }
            });
            if (response.status === 201) {
                set({ classes: response.data })
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred, please try again!");
                console.error(error);
            }
        } finally {
            set({ Loading: false })
        }
    }
}));

export default useClassesStore;