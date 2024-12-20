import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaUserSlash } from 'react-icons/fa';

const BlockUserDialog = () => {
    const [blockedUsers, setBlockedUsers] = useState([
        { id: 1, username: "john_doe" },
        { id: 2, username: "jane_smith" },
        { id: 3, username: "alex_lee" },
        { id: 4, username: "sam_jones" },
        { id: 5, username: "mike_doe" },
        { id: 6, username: "nina_brown" },
        { id: 7, username: "luke_white" },
        { id: 8, username: "sara_black" },
        { id: 9, username: "paul_grey" },
        { id: 10, username: "kate_king" },
    ]);

    const handleUnblock = (userId) => {
        const updatedBlockedUsers = blockedUsers.filter(user => user.id !== userId);
        setBlockedUsers(updatedBlockedUsers);
        console.log(`User ${userId} unblocked.`);
    }

    return (
        <Dialog className="" >
            <DialogTrigger>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition-all cursor-pointer">
                    <FaUserSlash className="text-xl text-blue-600 mr-4" />
                    <p className="text-lg text-gray-700">Block Users</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[33vw] min-w-[380px] rounded-xl shadow-2xl bg-white p-6 animate-fadeIn">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-gray-800">Blocked Users</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2">
                        Here is the list of users you've blocked. You can unblock any of them.
                    </DialogDescription>
                </DialogHeader>

                
                <div className="mt-6 hidescroll space-y-4 h-60 overflow-y-auto">
                    {blockedUsers.length > 0 ? (
                        blockedUsers.map((user) => (
                            <div key={user.id} className="flex justify-between items-center">
                                <span className="text-lg text-gray-700">{user.username}</span>
                                <button
                                    onClick={() => handleUnblock(user.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-all"
                                >
                                    Unblock
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No blocked users.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BlockUserDialog;
