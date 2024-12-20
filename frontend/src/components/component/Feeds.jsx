import React from 'react'
import AllStory from './AllStory'
import CreatePost from './CreatePost'
import AllPosts from './AllPosts'


const Feeds = () => {
  return (
    <div className='overflow-auto h-screen flex-1 hidescroll p-2'>
      <AllStory />
      <div className='h-[2px] bg-black' ></div>
      <CreatePost/>
      <AllPosts/>
    </div>
  )
}

export default Feeds
