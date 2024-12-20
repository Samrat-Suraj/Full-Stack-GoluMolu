import LeftSideBar from '@/components/component/LeftSideBar'
import PostDetails from '@/components/component/PostDetails'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PostDetailsPages = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  },[user, navigate])
  
  return (
    <div className='flex gap-2 h-screen' >
        <LeftSideBar/>
        <PostDetails/>
    </div>
  )
}

export default PostDetailsPages