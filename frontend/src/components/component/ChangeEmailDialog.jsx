import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaEnvelope } from 'react-icons/fa'
import axios from 'axios'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'

const ChangeEmailDialog = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/changemail`, { email }, { withCredentials: true })
            if (res?.data?.success) {
                setEmail("")
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.")
            return
        }

        console.log("Email changed:", { email })
    }

    return (
        <Dialog className="" >
            <DialogTrigger>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition-all cursor-pointer">
                    <FaEnvelope className="text-xl text-blue-600 mr-4" />
                    <p className="text-lg text-gray-700">Change Email Address</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Change Your Email</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Enter your new email address to update it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {/* New Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">New Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mt-6 justify-end">
                        <button
                            type="submit"
                            className="px-6 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-purple-500 transition-all transform hover:scale-105"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangeEmailDialog
