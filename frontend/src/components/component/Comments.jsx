import { setAllComment } from '@/redux/commentSlice';
import { COMMENT_API_ENDPOINT } from '@/utils/constant';
import axios from 'axios';
import React from 'react';
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const Comments = ({ comment }) => {
  const dispatch = useDispatch()

  const { allComment } = useSelector(store => store.comment);
  const { user } = useSelector(store => store.auth);


  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${COMMENT_API_ENDPOINT}/${comment?._id}/delete`, { withCredentials: true });
      if (res?.data?.success) {
        const updateComment = allComment.filter((com) => com?._id !== comment?._id)
       
        dispatch(setAllComment(updateComment))
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex w-[310px] items-start p-3 border-b border-gray-300">

      <div className="mr-3">
        <img
          src={comment?.author?.profilePic || "/placeHolder.png"}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="font-semibold text-sm">{comment?.author?.fullname}</div>
        <div
          className="text-gray-600 text-xs break-words"
          style={{ whiteSpace: 'normal' }}
        >
          {comment?.text}
        </div>
      </div>
      {
        user?._id !== comment?.author?._id ? <></> :
          <div className="cursor-pointer pl-3" onClick={handleDelete}>
            <MdDelete className='hover:text-red-500' />
          </div>
      }

    </div>
  );
};

export default Comments;
