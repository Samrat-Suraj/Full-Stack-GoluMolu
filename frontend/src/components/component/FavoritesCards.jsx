import { MessageCircle, ThumbsUp } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const FavoritesCards = () => {
    const navigate = useNavigate()
    const { bookmarks } = useSelector(store => store.auth)
    return (
        <div className='hidescroll overflow-auto mt-7 h-[95vh] flex-1 ' >
            <h1 className='text-3xl font-bold ml-4'>My Favorites Posts</h1>
            <div className="flex-1 p-4  mb-11">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {
                        bookmarks?.bookmarks?.map((post) => {
                            return (
                                <div key={post?._id} onClick={() => navigate(`/post/${post?._id}`)}  className="group relative cursor-pointer">
                                    <img className="rounded-lg h-full w-full object-cover"
                                        src={post?.image}
                                        alt=""
                                    />
                                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-2">
                                            <button className="text-white p-2 rounded-full"><ThumbsUp /> {post?.likes?.length}</button>
                                            <button className="text-white p-2 rounded-full"><MessageCircle />{post?.comments?.length}</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default FavoritesCards