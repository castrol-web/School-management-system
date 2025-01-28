import { create } from "zustand";
import { URL } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const useInvoiceStore = create((set) => ({
    invoices: [],
    fetchStatements: async (studentId,token) => {
        try {
            const response = await axios.get(`${URL}/api/parent/${studentId}`, {
                headers: {
                    'x-access-token': token
                }
            })
            if (response.status === 201) {
                set({ invoices: response.data })
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


export default useInvoiceStore;