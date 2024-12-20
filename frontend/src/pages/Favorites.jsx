import FavoritesCards from '@/components/component/FavoritesCards'
import LeftSideBar from '@/components/component/LeftSideBar'
import RightSideBar from '@/components/component/RightSideBar'
import useGetFavPost from '@/hooks/useGetFavPost'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Favorites = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    useEffect(() => {
        if (!user) {
            navigate('/auth')
        }
    }, [user, navigate])
    useGetFavPost()
    return (
        <div className='flex h-screen justify-between gap-2' >
            <LeftSideBar />
            <FavoritesCards />
            <RightSideBar />
        </div>
    )
}

export default Favorites