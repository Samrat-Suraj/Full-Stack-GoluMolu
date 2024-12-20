import LeftSideBar from '@/components/component/LeftSideBar'
import Messages from '@/components/component/Messages'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const MessagesPages = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])
  return (
    <div className='flex gap-2 h-screen' >
      <LeftSideBar />
      <Messages />
    </div>
  )
}

export default MessagesPages