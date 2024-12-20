import { SetBookmarks } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetFavPost = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchUser = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/post/fav`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(SetBookmarks(res?.data?.user))
                }
            } catch (error) {
                console.log(error?.response?.data?.message)
            }
        }
        featchUser()
    }, [dispatch])
}

export default useGetFavPost