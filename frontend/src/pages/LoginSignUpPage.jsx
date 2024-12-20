import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"


const LoginSignUpPage = () => {
    const [curr, setCurr] = useState("Login")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [input, setInput] = useState({
        fullname: "",
        username: "",
        password: "",
        email: ""
    })

    const onChangeHander = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (curr === "SignUp") {
                const res = await axios.post(`${USER_API_ENDPOINT}/singup`, input, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })
                if (res?.data?.success) {
                    dispatch(setUser(res?.data?.user))
                    navigate("/")
                    toast.success(res?.data?.message)
                }
            } else if (curr === "Login") {
                const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                })
               
                if (res?.data?.success) {
                    dispatch(setUser(res?.data?.user))
                    navigate("/")
                    toast.success(res?.data?.message)
                }
            }

        } catch (error) {
            toast.success(error?.response?.data?.message)
        }
    }


    return (
        <div className='login flex items-center bg-black justify-center h-screen w-screen'>
            <div className='bg-transparent text-white border min-w-[300px] w-[27vw] p-7 rounded-lg '>
                <form onSubmit={onSubmit} >
                    <h1 className='text-4xl font-bold mb-8'>
                        {curr === "SignUp" ? "SignUp" : "Login"}
                    </h1>
                    <div className='flex flex-col gap-3'>
                        {
                            curr === "SignUp" ?
                                <div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Fullname</Label>
                                        <Input onChange={onChangeHander} className="focus-visible:ring-transparent text-black" name="fullname" />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label>Username</Label>
                                        <Input onChange={onChangeHander} className="focus-visible:ring-transparent text-black" name="username" />
                                    </div>
                                </div> : ""
                        }

                        <div className='flex flex-col gap-2'>
                            <Label>Email</Label>
                            <Input onChange={onChangeHander} className="focus-visible:ring-transparent text-black" name="email" />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label>Password</Label>
                            <Input type="password" onChange={onChangeHander} className="focus-visible:ring-transparent text-black" name="password" />
                        </div>
                        <Button type="submit" className="w-full bg-gray-100 text-black font-bold hover:bg-gray-200 mt-4">
                            {
                                curr === "SignUp" ? "SignUp" : "Login"
                            }
                        </Button>
                    </div>
                </form>
                {
                    curr === "SignUp" ? <p onClick={() => setCurr("Login")} className='mt-7 text-sm cursor-pointer' >Not Have An Account <span className='text-blue-500 font-bold'>LogIn</span></p> : <p onClick={() => setCurr("SignUp")} className='mt-7 text-sm cursor-pointer ' >Already Have An Account <span className='text-blue-500 font-bold'>SignUp</span></p>
                }

            </div>
        </div>
    )
}

export default LoginSignUpPage