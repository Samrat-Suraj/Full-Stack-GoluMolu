import AllSuggestedUser from '@/components/component/AllSuggestedUser'
import LeftSideBar from '@/components/component/LeftSideBar'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SuggestedUserPage = () => {

  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])


  return (
    <div className='flex gap-2 h-screen'>
      <LeftSideBar />
      <AllSuggestedUser />
    </div>
  )
}

export default SuggestedUserPage