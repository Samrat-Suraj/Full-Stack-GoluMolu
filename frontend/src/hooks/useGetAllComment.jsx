import { setAllComment } from '@/redux/commentSlice'
import { COMMENT_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllComment = (postId) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!postId) return;

        const fetchAllComments = async () => {
            try {
                const res = await axios.get(`${COMMENT_API_ENDPOINT}/${postId}/get`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setAllComment(res?.data?.comments))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }

        fetchAllComments()
    }, [dispatch, postId])
}

export default useGetAllComment
