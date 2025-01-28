import { create } from "zustand";
import axios from "axios";
import { toast } from 'react-toastify';
import { URL } from '../App';

const useParentStore = create((set) => ({
    //states
    parents: [],
    Loading: false,
    //function to fetch parents
    fetchParents: async (token) => {
        set({ Loading: true });
        try {
            const response = await axios.get(`${URL}/api/admin/get-parents`, {
                headers: { 'x-access-token': token },
            });
            if (response.status === 201) {
                set({ parents: response.data });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return toast.error(toast.error.message)
            } else {
                toast.error(`an error occured!:${error}`)
            }
        } finally {
            set({ Loading: false });
        }
    }
}));

export default useParentStore;