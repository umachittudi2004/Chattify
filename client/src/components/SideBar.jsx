import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SideBarSkeleton from '../skeletons/SideBarSkeleton'
import { User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

const SideBar = () => {
    const { users, isUserLoading, getUsers, setSelectedUsers, selectedUser, } = useChatStore()
    const { onlineUsers } = useAuthStore()

    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    useEffect(() => {
        getUsers()
    }, [])

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;


    if (isUserLoading) {
        return (
            <div className=''>
                <SideBarSkeleton />
            </div>
        )
    }


    return (
        <div>
            <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
                <div className='border-b border-base-300 w-full p-5'>
                    <div className='flex items-center gap-2'>
                        <User className='w-6 h-6' />
                        <span className='font-medium hidden lg:block'>Contacts</span>
                    </div>
                    {/* Online Users */}
                    <div className="mt-3 hidden lg:flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={showOnlineOnly}
                                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                className="checkbox checkbox-sm"
                            />
                            <span className="text-sm">Show online only</span>
                        </label>
                        <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                    </div>
                </div>
                <div className='overflow-y-auto w-full py-3'>
                    {
                        filteredUsers.map((users, index) => (
                            <button key={users._id}
                                onClick={() => setSelectedUsers(users)}
                                className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-all duration-200 hover:cursor-pointer ${selectedUser?._id === users._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                            >
                                <div className='relative mx-auto lg:mx-0'>
                                    <img src={users.profilePic || "/avatar.png"} alt={users.fullName} className='size-12 object-cover rounded-full' />
                                    {
                                        onlineUsers.includes(users._id) && (
                                            <div className='absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-base-100 rounded-full animate-ping' />
                                        )
                                    }
                                </div>
                                <div className='hidden lg:block text-left min-w-0'>
                                    <div className='font-medium truncate'>
                                        {users.fullName}
                                    </div>
                                    <div className='text-sm text-zinc-400'>
                                        {
                                            onlineUsers.includes(users._id) ? "Online" : "Offline"
                                        }
                                    </div>
                                </div>
                            </button>
                        ))
                    }
                    {
                        filteredUsers.length === 0 && (
                            <div className='flex items-center justify-center h-full'>
                                <span className='text-sm text-zinc-500'>No users found</span>
                            </div>
                        )
                    }
                </div>
            </aside>
        </div>
    )
}

export default SideBar