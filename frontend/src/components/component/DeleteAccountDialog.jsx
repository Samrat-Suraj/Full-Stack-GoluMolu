import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaTrashAlt } from 'react-icons/fa'
import axios from 'axios'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSuggestedUser, setUser, setUserProfileById } from '@/redux/authSlice'
import { setAllPost, setPostById, setSelectedPost } from '@/redux/postSlice'
import { setNotification } from '@/redux/notificationSlice'
import { setMessages, setOnlineUser } from '@/redux/chatSlice'
import { setMutalStatus, setMyStatus } from '@/redux/statusSlice'
import { setAllComment } from '@/redux/commentSlice'

const DeleteAccountDialog = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading , setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        try {
            setLoading(true)
            const res = await axios.delete(`${USER_API_ENDPOINT}/delete`, { withCredentials: true })
            if (res?.data?.success) {
                setIsOpen(false)
                navigate("/auth")
                dispatch(setUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setAllPost([]))
                dispatch(setSuggestedUser([]))
                dispatch(setUserProfileById(""))
                dispatch(setNotification([]))
                dispatch(setMessages([]))
                dispatch(setMyStatus([]))
                dispatch(setMutalStatus([]))
                dispatch(setAllPost([]))
                dispatch(setPostById(""))
                dispatch(setAllComment([]))
                dispatch(setOnlineUser([]))
                dispatch(setMyStatus([]))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }finally{
            setLoading(false)
        }

    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="flex items-center bg-red-500 p-4 text-white rounded-lg shadow-sm  transition-all cursor-pointer">
                    <FaTrashAlt className="text-xl text-blue-600 mr-4" />
                    <p className="text-sm text-white font-semibold">Delete Account</p>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Delete Account</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Are you sure you want to delete your account? This action will permanently remove all of your data, including chat comments, posts, and other content. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={handleDelete}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-all"
                    >
                        {loading ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:scale-105 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAccountDialog
