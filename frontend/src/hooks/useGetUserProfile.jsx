import { setUserProfileById } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!userId) return;

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/${userId}`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setUserProfileById(res?.data?.user))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        fetchUserProfile()
    }, [dispatch, userId])

}

export default useGetUserProfile
