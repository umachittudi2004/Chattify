import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUserLoading : false,
    isMessagesLoading : false,

    getUsers : async () => {
        set({ isUserLoading: true })
        try {
            const response = await axiosInstance.get("/messages/user")
            // console.log(response);
            
            set({
                users : response.data.data
            })
        } catch (error) {
            // console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUserLoading: false })
        }
    },

    getMessages : async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const response = await axiosInstance.get(`/messages/${userId}`)
            set({
                messages : response.data
            })
        } catch (error) {
            console.log(error);
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage : async(messageData) => {
        const {messages , selectedUser} = get()
        // console.log(messageData);
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({
                messages : [...messages , response.data]
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    },

    setSelectedUsers : (selectedUser) => {
        set({ selectedUser })
    },

    subscribeToMessages : () => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on('newMessage',(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages : [...get().messages , newMessage]
            })
            // console.log("newMessage",newMessage);
        })
    },

    unsubscribeFromMessages : () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    },



}))
