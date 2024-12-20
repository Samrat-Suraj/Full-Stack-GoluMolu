import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FaLock } from 'react-icons/fa';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';

const ChangePasswordDialog = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/changepas`, { oldPassword, newPassword}, { withCredentials: true });

            if (res?.data?.success) {
                setNewPassword("")
                setNewPassword("")
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog className="">
            <DialogTrigger>
                <div className="flex w-full items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition-all cursor-pointer">
                    <FaLock className="text-xl text-blue-600 mr-4" />
                    <p className="text-lg text-gray-700">Change Password</p>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Change Your Password</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Enter your old password and a new one to update your password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {/* Old Password */}
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full mt-3 p-3 outline-none border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 mt-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-purple-500 transition-all transform hover:scale-105"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
