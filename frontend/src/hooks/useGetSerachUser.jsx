import { setSerachHistory } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetSerachUser = () => {
    const dispatch = useDispatch()
    const {serachText} = useSelector(store => store.auth)
    useEffect(() => {
        const featchUserByUsername = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/users/${serachText}`, { withCredentials: true })
                // console.log(res)
                if (res?.data?.success) {
                    dispatch(setSerachHistory(res?.data?.user))
                }
            } catch (error) {
                console.log(error?.response?.data?.success)
            }
        }
        featchUserByUsername()
    }, [dispatch , serachText])
}

export default useGetSerachUser