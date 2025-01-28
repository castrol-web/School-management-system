import { create } from "zustand";
import { URL } from "../App";
import axios from "axios";
import { toast } from "react-toastify";


const useSingleParentStore = create((set) => ({
    parent: null,
    studentId: null,
    fetchParent: async (token, id) => {
        try {
            const response = await axios.get(`${URL}/api/parent/parent/${id}`, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                set({ parent: response.data })
                set({ studentId: response.data.childId })
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return toast.error(error.response.data.message)
            } else {
                toast.error('an error occured')
                console.error(error)
            }
        }

    }
}));


export default useSingleParentStore;