import { MoreHorizontal, Settings } from 'lucide-react';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { NOTIFICATION_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setNotification } from '@/redux/notificationSlice';
import useRtcNotification from '@/hooks/useRtcNotification';


const Notifications = () => {
  const dispatch = useDispatch();
  useRtcNotification()
  const { allNotification } = useSelector((store) => store.notification);
  const { user } = useSelector((store) => store.auth);


  const DeleteAllNotiHander = async () => {
    try {
      const res = await axios.delete(`${NOTIFICATION_API_ENDPOINT}/delete`, { withCredentials: true });
      if (res?.data?.success) {
        dispatch(setNotification([]));
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };


  const DeleteOneNotiHander = async (NotificationId) => {
    try {
      const res = await axios.delete(`${NOTIFICATION_API_ENDPOINT}/delete/${NotificationId}`, { withCredentials: true });
      if (res?.data?.success) {
        const updatedNotification = allNotification.filter((noti) => noti?._id !== NotificationId);
        dispatch(setNotification(updatedNotification));
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className='flex-1 p-6 h-screen overflow-auto hidescroll'>
      <div className='flex justify-between items-center'>
        <p className='text-2xl text-blue-900 font-bold mt-7 py-3 z-10'>
          Notifications
        </p>

        <Popover>
          <PopoverTrigger>
            <button className='text-2xl text-blue-900 font-bold mt-7 py-3'>
              <Settings />
            </button>
          </PopoverTrigger>
          <PopoverContent onClick={DeleteAllNotiHander} className="w-fit cursor-pointer text-[14px] font-bold text-red-600">
            Delete All Notifications
          </PopoverContent>
        </Popover>
      </div>

      <div className='mt-5 space-y-6'>
        {allNotification?.length < 0 ? (
          <p className='text-center text-gray-500 text-lg'>No notifications yet!</p>
        ) : (
          allNotification.map((noti) => (
            <div key={noti?._id}>

              {user?._id === noti?.to?._id ? (
                <div className='flex flex-col p-4 bg-white rounded-xl border border-gray-200 transition-all duration-200 ease-in-out'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center'>
                      <img
                        className='h-[30px] w-[30px] rounded-full'
                        src={noti?.from?.profilePic || "/placeHolder.png"}
                        alt="User Avatar"
                      />
                      <div className='ml-3'>
                        <p className='text-black text-sm font-semibold'>{noti?.from?.fullname}</p>
                      </div>
                    </div>

                    <Popover>
                      <PopoverTrigger>
                        <button className='w-7 h-7 text-gray-600 hover:text-blue-500'>
                          <MoreHorizontal />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        <p onClick={() => DeleteOneNotiHander(noti?._id)} className='text-red-600 font-semibold text-[14px] cursor-pointer'>
                          Delete
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className='mt-3'>
                    <p className='text-sm text-gray-800'>
                      <p><strong>{noti?.post?.caption}</strong></p>
                      <strong>{noti?.from?.fullname}</strong> has <span className="font-semibold">{noti?.type}</span> {noti?.type === 'like' ? "your Post" : "You"}.
                    </p>
                  </div>


                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(noti?.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
