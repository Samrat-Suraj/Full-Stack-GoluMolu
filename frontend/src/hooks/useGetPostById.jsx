import { setPostById } from '@/redux/postSlice'
import { POST_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetPostById = (postId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!postId) return

        const fetchPostById = async () => {
            try {
                const res = await axios.get(`${POST_API_ENDPOINT}/post/${postId}`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setPostById(res?.data?.post))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        fetchPostById()
    }, [dispatch, postId])

}

export default useGetPostById
