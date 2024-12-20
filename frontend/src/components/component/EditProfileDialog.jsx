import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
}
    from "@/components/ui/dialog"
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const EditProfileDialog = () => {
    const {user} = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    // const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [socialLinks, setSocialLinks] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const form = new FormData();
        // form.append("username", username);
        form.append("fullname", name);
        form.append("bio", bio);
        form.append("link", socialLinks);

        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_ENDPOINT}/update`, form, {
                withCredentials: true
            });
            
            if (res?.data?.success) {
                dispatch(setUser(res?.data?.user));
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false)
        }
    };

    useEffect(()=>{
        setName(user?.fullname) 
        setBio(user?.bio) 
        setSocialLinks(user?.link) 
    },[])

    return (
        <Dialog className="" >
            <DialogTrigger>
                <button className="px-4 py-2  bg-blue-600 rounded-full text-white  transition-all transform hover:scale-105">
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Edit Your Profile</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Update your profile details here.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {/* Username */}
                    {/* <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div> */}

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    {/* Social Links */}
                    <div>
                        <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700">Social Links</label>
                        <input
                            type="text"
                            id="socialLinks"
                            value={socialLinks}
                            onChange={(e) => setSocialLinks(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-2 flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-purple-500 transition-all transform hover:scale-105"
                        >
                            {
                                loading ? <Loader2 className='h-4 w-4 animate-spin ' /> : <></>
                            }
                            Save
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog
