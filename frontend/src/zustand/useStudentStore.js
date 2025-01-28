import { create } from "zustand";
import { URL } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

//studentstore function
const useStudentStore = create((set) => ({
    students: [],
    data: [],
    Loading: false,
    fetchStudents: async (token) => {
        set({ Loading: true });
        try {
            const response = await axios.get(`${URL}/api/admin/get-students`, {
                headers: {
                    'x-access-token': token
                }
            });
            if (response.status === 201) {
                //flattening students array result into a new array from the object
                const studentList = response.data.flatMap((item) => {
                    return item.students;
                });
                set({ data: response.data });
                set({ students: studentList });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return toast.error(toast.error.message)
            } else {
                toast.error(`an error occured!:${error}`)
            }
        } finally {
            set({ Loading: false })
        }
    }
}));


export default useStudentStore;