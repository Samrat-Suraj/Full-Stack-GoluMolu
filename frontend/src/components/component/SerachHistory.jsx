
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SerachHistory = () => {
    const { SearchHistory } = useSelector(store => store.auth)
    const navigate = useNavigate()
    return (
        <div className="h-screen hidescroll overflow-y-auto w-full md:w-[60vw] lg:w-[45vw] xl:w-[40vw] mx-auto">
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Search User</h1>
                <div className="space-y-2">
                    <div key={SearchHistory?._id} onClick={()=>navigate(`/profile/${SearchHistory?._id}`)} className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition ease-in-out duration-300">
                        <div className="flex items-center gap-3">
                            <img
                                className="h-12 w-12 rounded-full border-2 border-blue-500"
                                src={SearchHistory?.profilePic || "placeHolder.png"}
                                alt="User avatar"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{SearchHistory?.fullname ? SearchHistory?.fullname : "Full Name"}</p>
                                <p className="text-sm text-gray-500">@{SearchHistory?.username ? SearchHistory?.username : "Username"}</p>
                                <p className="text-xs text-gray-400">Searach By You</p>
                            </div>
                        </div>
                        <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300">
                            Follow
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SerachHistory
