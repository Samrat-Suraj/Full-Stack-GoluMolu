import LeftSideBar from '@/components/component/LeftSideBar'
import Notications from '@/components/component/Notications'
import RightSideBar from '@/components/component/RightSideBar'
import useGetNotification from '@/hooks/useGetNotification'
import useRtcNotification from '@/hooks/useRtcNotification'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const NotficationsPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  },[user, navigate])
  useGetNotification()
  useRtcNotification()
  return (
    <div className='flex justify-between h-screen' >
        <LeftSideBar/>
        <Notications/>
        <RightSideBar/>
    </div>
  )
}

export default NotficationsPage