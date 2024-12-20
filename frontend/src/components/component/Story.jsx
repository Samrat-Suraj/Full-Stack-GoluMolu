import React, { useState } from 'react'
import ViewStatusDialog from './ViewStatusDialog'

const Story = ({statuses}) => {
    const [open , setOpen] = useState(false)
    return (
        <div>
            <div onClick={()=>setOpen(true)} className=' cursor-pointer w-[20vw] sm:w-[10vw] md:w-[8vw] h-[20vw] sm:h-[10vw] md:h-[8vw] flex justify-center items-center bg-black rounded-full'>
                <div className='flex justify-center items-center w-full h-full p-1 border-black rounded-full'>
                    <img className=" rounded-full object-cover w-full h-full" src={statuses?.image} alt="" />
                </div>
            </div>
            <ViewStatusDialog open={open} setOpen={setOpen} statuses={statuses} />
        </div>
    )
}

export default Story