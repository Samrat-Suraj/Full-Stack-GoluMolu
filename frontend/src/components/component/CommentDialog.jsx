import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import Comments from './Comments';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { COMMENT_API_ENDPOINT, POST_API_ENDPOINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import useGetAllComment from '@/hooks/useGetAllComment';
import { setAllComment } from '@/redux/commentSlice';

const CommentDialog = ({ open, setOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading , setIsLoading] = useState(false);
    const {selectedPost} = useSelector(store => store.post);
    const {allComment} = useSelector(store => store.comment);
    useGetAllComment(selectedPost?._id);
    const [text , setText] = useState("");

    const { user } = useSelector(store => store.auth);
    const isBookMarked = user?.bookmarks.includes(selectedPost?._id);


    const OnChnagehander = (e) =>{
        setText(e.target.value)
    }

    const BookMarksPost = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${POST_API_ENDPOINT}/bookmark/${selectedPost?._id}`, {}, { withCredentials: true });
            if (res?.data?.success) {
                const updatedUserBookmaks = isBookMarked ? 
                    user?.bookmarks?.filter((id) => id !== selectedPost?._id) : 
                    [...user.bookmarks, selectedPost?._id];

                dispatch(setUser({
                    ...user,
                    bookmarks: updatedUserBookmaks
                }));

                toast.success(res?.data?.type);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    const CommentHander = async () => {
        setText("")
        try {
            const res = await axios.post(`${COMMENT_API_ENDPOINT}/${selectedPost?._id}/create`, {text} , {withCredentials : true});
            if(res?.data?.success){
                dispatch(setAllComment([...allComment , res?.data?.comment]))
                setText("")
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div>
            <Dialog className="p-4 h-full" open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-[90%] sm:max-w-2xl lg:max-w-3xl p-4 rounded-lg overflow-hidden max-h-[90vh] sm:max-h-[80vh] mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 w-full h-full">
                        <div className="w-full sm:w-1/2 h-[250px] sm:h-[400px] relative">
                            <img
                                className="w-full h-full object-cover rounded-lg"
                                src={selectedPost?.image}
                                alt="Image"
                            />
                        </div>

                        <div className="h-full w-px bg-gray-600 sm:block hidden"></div>

                        <div className="w-full sm:w-1/2 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedPost?.author?.profilePic} />
                                        <AvatarFallback>SM</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-semibold">{selectedPost?.author?.fullname}</p>
                                </div>

                                <Dialog>
                                    <DialogTrigger>
                                        {/* <MoreHorizontal className="text-gray-600 cursor-pointer" /> */}
                                    </DialogTrigger>
                                    <DialogContent className="w-[350px] lg:w-[50vw] rounded-lg">
                                        <DialogHeader>
                                            <Button variant="ghost" className="text-sm text-[14px] font-semibold">Follow</Button>
                                            <Button onClick={BookMarksPost} variant="ghost" className="text-sm text-[14px] font-semibold">{isBookMarked ? "Remove to Favorites" : "Add to Favorites" }</Button>
                                            {/* <Button variant="ghost" className="text-sm text-[14px] font-semibold">Block</Button> */}
                                            <Button onClick={()=>navigate(`/post/${selectedPost?._id}`)} variant="ghost" className="text-sm text-[14px] font-semibold">Go To Post</Button>
                                            <Button variant="ghost" className="text-sm text-[14px] text-red-600 font-semibold">Delete</Button>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="mt-5 w-full gap-2 overflow-y-auto hidescroll max-h-[250px] sm:max-h-[300px] scrollbar-thin scrollbar-thumb-gray-400">
                                {allComment?.map((comment) => (
                                    <Comments key={comment?._id} comment={comment} />
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    placeholder="Write a Comment"
                                    className="w-full text-sm outline-none border p-2 rounded-md"
                                    type="text"
                                    value={text}
                                    onChange={OnChnagehander}
                                />
                                <p onClick={CommentHander} className="text-xs text-blue-500 font-bold cursor-pointer">Post</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommentDialog;
