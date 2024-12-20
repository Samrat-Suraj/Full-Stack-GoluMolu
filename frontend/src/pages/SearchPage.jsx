import LeftSideBar from '@/components/component/LeftSideBar'
import RightSideBar from '@/components/component/RightSideBar'
import SerachHistory from '@/components/component/SerachHistory'
import useGetSerachUser from '@/hooks/useGetSerachUser'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])
  useGetSerachUser()
  return (
    <div className='flex justify-between h-screen'>
      <LeftSideBar />
      <SerachHistory />
      <RightSideBar />
    </div>
  )
}

export default SearchPage