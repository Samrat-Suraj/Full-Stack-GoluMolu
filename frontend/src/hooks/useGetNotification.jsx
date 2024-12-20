import { setNotification } from '@/redux/notificationSlice'
import { NOTIFICATION_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetNotification = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchAllNotification = async () => {
            try {
                const res = await axios.get(`${NOTIFICATION_API_ENDPOINT}/get`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setNotification(res?.data?.notifications))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchAllNotification()
    }, [dispatch])
}

export default useGetNotification