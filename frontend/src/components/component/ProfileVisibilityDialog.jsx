import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaEyeSlash } from 'react-icons/fa'

const ProfileVisibilityDialog = () => {
    const [visibility, setVisibility] = useState('public') // default to 'public'

    const handleSave = () => {
        console.log("Profile visibility set to:", visibility)
    }

    return (
        <Dialog className="" >
            <DialogTrigger>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition-all cursor-pointer">
                    <FaEyeSlash className="text-xl text-blue-600 mr-4" />
                    <p className="text-lg text-gray-700">Profile Visibility</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Profile Visibility</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Choose your profile visibility: Public or Private.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                    {/* Visibility Options */}
                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-700">Public</span>
                        <input
                            type="radio"
                            id="public"
                            name="visibility"
                            value="public"
                            checked={visibility === 'public'}
                            onChange={() => setVisibility('public')}
                            className="text-blue-600"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-700">Private</span>
                        <input
                            type="radio"
                            id="private"
                            name="visibility"
                            value="private"
                            checked={visibility === 'private'}
                            onChange={() => setVisibility('private')}
                            className="text-blue-600"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-purple-500 transition-all transform hover:scale-105"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileVisibilityDialog
