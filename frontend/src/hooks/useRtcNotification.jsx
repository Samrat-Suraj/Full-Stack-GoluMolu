import { setNotification } from '@/redux/notificationSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const useRtcNotification = () => {

    const dispatch = useDispatch()
    const { socket } = useSelector(store => store.socket)
    const { allNotification } = useSelector(store => store.notification)

    useEffect(() => {
        socket?.on("notification", (notification) => {
            dispatch(setNotification([notification , ...allNotification]))
        })
        return () => {
            socket?.off("notification")
        }

    }, [allNotification, setNotification])
}

export default useRtcNotification