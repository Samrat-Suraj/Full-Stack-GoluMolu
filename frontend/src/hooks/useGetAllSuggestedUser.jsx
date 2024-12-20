import { setSuggestedUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllSuggestedUser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchAllSuggestedUser = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/suggested`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setSuggestedUser(res?.data?.users))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchAllSuggestedUser()
    }, [dispatch])
}

export default useGetAllSuggestedUser