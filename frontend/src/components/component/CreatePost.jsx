import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Clapperboard, Image, Loader2 } from 'lucide-react'
import { IoMdCloudDone } from "react-icons/io";
import { POST_API_ENDPOINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPost } from '@/redux/postSlice';

const CreatePost = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState("")
    const {allPost} = useSelector(store => store.post)

    const onChange = (e) => {
        setImage(e.target.files[0])
    }
    const onChangeHander = (e) => {
        setCaption(e.target.value)
    }

    const postCreater = async () => {
        const form = new FormData()
        form.append("caption", caption)
        if (image) {
            form.append("image", image)
        }

        try {
            setLoading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/create`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(setAllPost([res?.data?.post , ...allPost]))
                toast.success(res?.data?.message)
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-auto bg-gray-300 mt-2 rounded-sm'>
            <div className='w-full h-full flex flex-col p-4 justify-between items-center'>
                <div className='bg-white h-auto w-full sm:w-[90%] p-4 rounded-sm'>
                    <textarea
                        name=""
                        rows={4}
                        onChange={onChangeHander}
                        className='w-full outline-none resize-none p-2 text-sm'
                        placeholder='Compose A New Post'
                    ></textarea>


                    <div className='flex gap-4 items-center mt-2 text-gray-500'>
                        {
                            image ? <IoMdCloudDone className='text-blue-700' size={27} /> :
                                <div>
                                    <label htmlFor="image"><Image className='cursor-pointer' /></label>
                                    <input onChange={onChange} type="file" hidden name="" id="image" />
                                </div>
                        }
                        <Clapperboard className='cursor-pointer' />
                    </div>
                </div>

                <Button onClick={postCreater}
                    className="text-[10px] mt-4 sm:mt-2 ml-auto sm:mr-4 sm:px-5 px-3 py-2"
                >
                    {
                        loading ? <Loader2 className='h-3 w-3 animate-spin' /> : <></>
                    }
                    Post
                </Button>
            </div>
        </div>
    )
}

export default CreatePost
