import { setAllPost } from '@/redux/postSlice'
import { POST_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchAllPosts = async () => {
            try {
                const res = await axios.get(`${POST_API_ENDPOINT}/feed`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setAllPost(res?.data?.posts))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchAllPosts()
    }, [])
}

export default useGetAllPosts