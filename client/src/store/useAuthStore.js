import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:3000": '/';

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers : [],
    socket : null,

    checkAuth: async () => {
        try {
            const responce = await axiosInstance.get('/auth/checkAuth')
            // console.log("response" + responce);
            set({
                authUser: responce.data,
            })
            get().connectSocket()
        } catch (error) {
            // console.log(error)
            // toast.error(error.response.data.message)
            set({
                authUser: null,
            })
        }
        finally{
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data) => {
        set({ isSigninUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', data)
            set({
                authUser: response.data.user,
            })
            toast.success(response.data.message)
            get().connectSocket()
        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            set({ isSigninUp: false })
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ authUser: null })
            get().disConnectSocket()
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    logIn: async (data) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post('/auth/login', data)
            // console.log(response.data.message);
            set({
                authUser: response.data.user,
            })
            toast.success(response.data.message)
            get().connectSocket()
            // console.log(response.data.user);
            // console.log("ending" + authUser);
        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({
            isUpdatingProfile: true
        })
        try {
            const response = await axiosInstance.put('/auth/updateProfile', data)
            set({
                authUser: response.data.user,
            })
            toast.success(response.data.message)
        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
        }

    },
 
    connectSocket : async () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected ) return
        const socket = io(BASE_URL,{
            query:{
                userId : authUser._id,
            },
        })
        socket.connect()
        set({ socket: socket })
        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disConnectSocket : () => {
        if(get().socket.connected){
            get().socket.disconnect()
        }
    }

}))