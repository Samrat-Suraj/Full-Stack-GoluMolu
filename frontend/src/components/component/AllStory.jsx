import React, { useState } from 'react';
import Story from './Story';
import { Plus } from 'lucide-react';
import AddStatusDialog from './AddStatusDialog';
import ViewMyPostDialog from './ViewMyPostDialog';
import { useSelector } from 'react-redux';

const AllStory = () => {
    const [open, setOpen] = useState(false)
    const [myOpen, setMyOpen] = useState(false)
    const { myStatus, mutalStatus } = useSelector(store => store.status)
    const lastStatus = myStatus?.status?.length > 0 ? myStatus.status[myStatus.status.length - 1] : null;

    return (
        <div className='flex-1 flex h-auto md:h-[10vw] w-full md:w-full p-3 gap-3 overflow-x-auto hidescroll'>
            <div className='flex gap-2'>
                <div>
                    <div onClick={() => setOpen(true)} className='w-[20vw] cursor-pointer sm:w-[10vw] md:w-[8vw]  h-[20vw] sm:h-[10vw] md:h-[8vw] flex justify-center items-center bg-blue-700 rounded-full'>
                        <div className='flex flex-col items-center text-white font-bold'>
                            <Plus className='text-white font-bold' />
                            <p className='text-xs sm:text-[12px]'>Add Story</p>
                            <AddStatusDialog open={open} setOpen={setOpen} />
                        </div>
                    </div>
                </div>

                {
                    lastStatus ?
                        <div>
                            <div
                                onClick={() => setMyOpen(true)}
                                className='cursor-pointer w-[20vw] sm:w-[10vw] md:w-[8vw] h-[20vw] sm:h-[10vw] md:h-[8vw] flex justify-center items-center bg-black rounded-full relative group'
                            >
                                <div className='flex justify-center items-center w-full h-full p-1 border-black rounded-full'>
                                    <img className="rounded-full object-cover w-full h-full" src={lastStatus?.image} alt="" />
                                </div>

                                <div className="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm">My Status</span>
                                </div>
                            </div>
                        </div>
                        : <></>
                }



                <ViewMyPostDialog myOpen={myOpen} setMyOpen={setMyOpen} />

                {
                    mutalStatus?.map((statuses) =>
                        statuses.status.map((s) => (
                            <Story key={s?._id} statuses={s} />
                        ))
                    )
                }

            </div>
        </div>
    )
}

export default AllStory;
