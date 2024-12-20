import { setMyStatus } from '@/redux/statusSlice'
import { STATUS_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllMyStatus = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchMyStatus = async () => {
            try {
                const res = await axios.get(`${STATUS_API_ENDPOINT}/get`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setMyStatus(res?.data?.statuses))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchMyStatus()
    }, [dispatch])
}

export default useGetAllMyStatus