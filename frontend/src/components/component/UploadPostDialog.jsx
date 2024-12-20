import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { motion } from "framer-motion"
import axios from 'axios'
import { toast } from 'sonner'
import { POST_API_ENDPOINT } from '@/utils/constant'
import { setAllPost } from '@/redux/postSlice'
import { useDispatch, useSelector } from 'react-redux'

const UploadPostDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const {allPost} = useSelector(store => store.post)
    const [image, setImage] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [caption, setCaption] = useState('')

    const onChangeHandler = (e) => {
        const selectedImage = e.target.files[0]
        if (selectedImage) {
            setImage(selectedImage)
        }
    }

    const handleCaptionChange = (e) => {
        setCaption(e.target.value)
    }

    const postCreater = async () => {
        const form = new FormData()
        form.append("caption", caption)
        if (image) {
            form.append("image", image)
        }

        try {
            setIsUploading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/create`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            if (res?.data?.success) {
                setOpen(false)
                setImage("")
                setCaption("")
                dispatch(setAllPost([res?.data?.post , ...allPost]))
                toast.success(res?.data?.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="">
                {/* <button className="w-full p-2 text-lg bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-colors">
                    Create Post
                </button> */}
            </PopoverTrigger>
            <PopoverContent 
                as={motion.div}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: '100%', opacity: 0 }} 
                transition={{ 
                    type: 'spring', 
                    stiffness: 100,   
                    damping: 30,            
                    duration: 0.2           
                }}
                className="max-w-md w-full h-[99vh]  flex justify-center items-center p-6 rounded-lg  bg-white transition-all"
            >
                <div>
                    <div className="text-center mb-4">
                        <p className="text-xl font-bold mb-2">Create New Post</p>
                        <p className="text-sm text-gray-600">Upload an image and share with your friends</p>
                    </div>

                    <div className="flex justify-center items-center py-6">
                        {image ? (
                            <div className="relative w-64 h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                                <img src={URL.createObjectURL(image)} alt="Uploaded preview" className="object-cover w-full h-full" />
                                <div className="absolute top-2 right-2 bg-white p-2 rounded-full cursor-pointer" onClick={() => setImage(null)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <label htmlFor="upload" className="p-3 text-sm rounded-lg cursor-pointer bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">
                                    Upload Image
                                </label>
                                <input onChange={onChangeHandler} id="upload" type="file" hidden />
                            </div>
                        )}
                    </div>

                    
                    {image && (
                        <div className="mb-4">
                            <textarea
                                value={caption}
                                onChange={handleCaptionChange}
                                placeholder="Write a caption..."
                                className="w-full p-2 border-2 border-gray-300 rounded-lg resize-none"
                                rows="3"
                            ></textarea>
                        </div>
                    )}

                    {image && !isUploading ? (
                        <div className="flex">
                            <button onClick={postCreater} className="p-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                                Post
                            </button>
                        </div>
                    ) : isUploading ? (
                        <div className="flex">
                            <div className="loader w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : null}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default UploadPostDialog
