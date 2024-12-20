import LeftSideBar from '@/components/component/LeftSideBar'
import React, { useEffect } from 'react'
import Settings from '@/components/component/Settings'
import RightSideBar from '@/components/component/RightSideBar'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  return (
    <div className='flex justify-between h-screen ' >
      <LeftSideBar />
      <Settings />
      <RightSideBar />
    </div>
  )
}

export default SettingsPage