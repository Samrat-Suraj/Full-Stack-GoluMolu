import Feeds from '@/components/component/Feeds'
import LeftSideBar from '@/components/component/LeftSideBar'
import RightSideBar from '@/components/component/RightSideBar'
import useGetAllMyStatus from '@/hooks/useGetAllMyStatus'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetAllSuggestedUser from '@/hooks/useGetAllSuggestedUser'
import useGetMulterUserStatus from '@/hooks/useGetMulterUserStatus'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  },[user, navigate])
  
  useGetAllSuggestedUser()
  useGetAllPosts()
  useGetMulterUserStatus()
  useGetAllMyStatus()

  return (
    <div className='flex justify-between'>
      <LeftSideBar />
      <Feeds />
      <RightSideBar />
    </div>
  )
}

export default HomePage
