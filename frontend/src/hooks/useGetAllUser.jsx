import { SetAllUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllUser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchAllUser = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/alluser`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(SetAllUser(res?.data?.users))
                }
            } catch (error) {
                console.log(error?.response?.data?.message)
            }
        }
        featchAllUser()
    }, [dispatch])
}

export default useGetAllUser