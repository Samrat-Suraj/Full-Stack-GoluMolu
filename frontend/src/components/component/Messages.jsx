import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setSelectedUser } from '@/redux/authSlice';
import { setMessages } from '@/redux/chatSlice';
import { MESSAGE_API_ENDPOINT } from '@/utils/constant';
import useGetAllUser from '@/hooks/useGetAllUser';
import useGetMessage from '@/hooks/useGetMessage';
import useRtc from '@/hooks/useRtc';

const Messages = () => {
  useGetAllUser();
  useRtc()
  const dispatch = useDispatch();
  const { selectedUser, allUser, user } = useSelector((store) => store.auth);
  const { messages , onlineUser } = useSelector((store) => store.chat);
  const [message, setMsg] = useState('');
  const isOnline = onlineUser?.includes(selectedUser?._id);
  useGetMessage();
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  const SendMessage = async () => {
    if (message.trim() === '') return;
    try {
      const res = await axios.post(`${MESSAGE_API_ENDPOINT}/${selectedUser?._id}/send`, { message }, { withCredentials: true });
      if (res?.data?.success) {
        setMsg('');
        dispatch(setMessages([...messages, res?.data?.newMessage]));
        // toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error?.response?.data.message);
      toast.error('Error sending message');
    }
  };

  const filteredUsers = allUser.filter((u) => u._id !== user?._id);

  const handleBackClick = () => {
    dispatch(setSelectedUser(null));
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-gray-100">
      {/* User list side */}
      <div
        className={`w-full md:w-1/3 h-full bg-white rounded-l-lg overflow-auto ${selectedUser ? 'hidden' : ''}`}
      >
        <div className="sticky top-0 p-4 bg-white shadow-md">
          <h1 className="text-center text-2xl font-semibold text-gray-700">Messages</h1>
          <div className="h-[1px] w-full bg-gray-300 mt-2"></div>
        </div>
        <div className="p-4 space-y-3">
          {filteredUsers.map((user, index) => {
            const isUserOnline = onlineUser?.includes(user?._id); // check online status here
            return (
              <div
                key={index}
                className="flex gap-3 items-center p-3 cursor-pointer hover:bg-gray-200 rounded-lg transition ease-in-out duration-200"
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <img className="h-10 w-10 rounded-full object-cover" src={user?.profilePic || '/placeHolder.png'} alt="profile" />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-700">{user?.fullname}</p>
                  <p className={`text-xs font-semibold ${isUserOnline ? 'text-green-500' : 'text-red-600'}`}>
                    {isUserOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message area side */}
      <div
        className={`w-full md:w-full h-full relative bg-white shadow-lg rounded-r-lg overflow-hidden ${selectedUser ? '' : 'hidden'}`}
      >
        <div className="flex gap-3 sticky top-0 bg-white items-center p-4 text-black shadow-md">
          <button onClick={handleBackClick} className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img className="h-10 w-10 rounded-full object-cover" src={selectedUser?.profilePic || '/placeHolder.png'} alt="profile" />
          <div className="flex flex-col">
            <p className="text-sm font-semibold">{selectedUser?.fullname}</p>
            <p className={`text-xs font-semibold ${isOnline ? "text-green-500" : "text-red-600"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4 hidescroll overflow-y-auto max-h-[calc(100vh-200px)]">
          {messages?.map((msg) => (
            <div key={msg?._id}>
              <div className={`flex gap-2 mb-3 ${user?._id === msg?.senderId ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-xl ${user?._id === msg?.senderId ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    } max-w-[70%]`}
                >
                  <p className="text-xs">{msg?.message}</p>
                </div>
              </div>
              <div ref={messageEndRef} />
            </div>
          ))}
        </div>

        <div className="w-full p-4 bg-white shadow-md absolute bottom-0">
          <div className="flex items-center gap-3 mb-20 lg:mb-1">
            <input
              type="text"
              placeholder="Type a message..."
              onChange={(e) => setMsg(e.target.value)}
              value={message}
              className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={SendMessage} className="bg-blue-500 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12l6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
