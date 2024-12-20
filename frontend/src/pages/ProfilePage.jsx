import LeftSideBar from '@/components/component/LeftSideBar'
import RightSideBar from '@/components/component/RightSideBar'
import UserDetails from '@/components/component/UserDetails'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    useEffect(() => {
        if (!user) {
            navigate('/auth')
        }
    }, [user, navigate])
    return (
        <div className='flex gap-2 justify-between h-screen'>
            <LeftSideBar />
            <div className='flex-1' >
                <UserDetails />
            </div>
            <RightSideBar />
        </div>
    )
}

export default ProfilePage