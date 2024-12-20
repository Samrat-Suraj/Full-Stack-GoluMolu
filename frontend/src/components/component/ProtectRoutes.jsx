import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
    const navigate = useNavigate()
    const loaction = useLocation()
    const { user } = useSelector(store => store.auth)

    useEffect(() => {
        if (!user) {
            navigate("/auth")
        }else if(user && loaction.pathname === "/auth"){
            navigate("/")
        }
    }, [user, navigate])

    return <>{children}</>
}

export default ProtectRoute
