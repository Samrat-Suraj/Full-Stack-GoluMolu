import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from 'axios';
import { STATUS_API_ENDPOINT } from '@/utils/constant';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyStatus } from '@/redux/statusSlice';

const AddStatusDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const [statusImage, setStatusImage] = useState('');
    const [statusComment, setStatusComment] = useState('');
    const [loading, setloading] = useState(false)
    const { myStatus } = useSelector(store => store.status)

    const handleImageChange = (e) => {
        setStatusImage(e.target.files[0])
    };

    const handleCommentChange = (e) => {
        setStatusComment(e.target.value);
    };

    const handlePostStatus = async () => {
        const form = new FormData()
        form.append("text", statusComment)
        form.append("image", statusImage)
        try {
            setloading(true)
            const res = await axios.post(`${STATUS_API_ENDPOINT}/create`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            setOpen(false)
            setStatusComment("")
            setStatusImage("")
            dispatch(setMyStatus([res?.data?.status, ...myStatus?.status]))
            toast.success(res?.data?.message)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setloading(false)
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const removeImage = () => {
        setStatusImage('');
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={handleCloseDialog} className="flex justify-center items-center w-[25vw] rounded-lg min-w-[300px] p-0">
                <div className="relative w-full p-2 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-full bg-white rounded-xl overflow-hidden flex flex-col justify-center items-center shadow-lg">
                    <div className="p-4 flex flex-col justify-center items-center w-full space-y-4">

                        <div className="w-full space-y-3">
                            <textarea
                                value={statusComment}
                                onChange={handleCommentChange}
                                placeholder="Write a comment..."
                                className="w-full p-3 text-sm border rounded-md shadow-sm resize-none focus:outline-none transition-all duration-200"
                                rows="3"
                            />
                        </div>

                        {!statusImage ? (
                            <div className="flex  text-center flex-col w-full space-y-3">
                                <label htmlFor="upload" className="bg-blue-500 cursor-pointer text-white text-sm p-2 rounded-md w-full hover:bg-blue-600 transition-all duration-300">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="upload"
                                    onChange={handleImageChange}
                                    hidden
                                    className="w-full p-2 border rounded-md text-sm"
                                />
                            </div>
                        ) : (
                            <div className="w-full flex flex-col justify-center items-center space-y-4 relative">

                                <button
                                    onClick={removeImage}
                                    className="absolute top-7 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>

                                <img
                                    className="w-full max-w-xs object-cover rounded-lg shadow-sm mb-3"
                                    src={URL.createObjectURL(statusImage)}
                                    alt="Status Preview"
                                />
                            </div>
                        )}

                        <div className='flex w-full'>
                            <button
                                onClick={handlePostStatus}
                                className="bg-blue-500 flex items-center justify-center text-white text-sm p-2 rounded-md w-full hover:bg-blue-600 transition-all duration-300"
                            >
                                {loading ? <Loader2 className='h-5 w-5 text-center animate-spin ' /> : "Post Status"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddStatusDialog;
