import { setMutalStatus } from '@/redux/statusSlice'
import { STATUS_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetMulterUserStatus = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchMutalStatus = async () => {
            try {
                const res = await axios.get(`${STATUS_API_ENDPOINT}/userstatus`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setMutalStatus(res?.data?.mutualUsersWithStatus))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchMutalStatus()
    }, [dispatch])
}

export default useGetMulterUserStatus