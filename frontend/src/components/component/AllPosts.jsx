import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import PostCards from './PostCards';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from 'react-redux';

const AllPosts = () => {
    const [text, setText] = useState(""); 
    const { allPost } = useSelector(store => store.post);
    const [filterData, setFilterData] = useState(allPost);

    useEffect(() => {

        let sortedPosts = [...allPost];
        if (text === "latest") {
            sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (text === "old") {
            sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (text === "all"){
            return true
        }
        setFilterData(sortedPosts);
    }, [text, allPost]);

    return (
        <div className='w-[95%] m-auto'>
            <div className='flex justify-between mt-3 text-[14px]'>
                <p className='font-bold'>All</p>

                <Popover>
                    <PopoverTrigger><Filter /></PopoverTrigger>
                    <PopoverContent className="p-3 lg:mr-36 mr-5 w-[200px]">
                        <div className='flex'>
                            <label className='p-2 text-[14px] font-bold cursor-pointer'>
                                <input
                                    type="radio"
                                    onChange={() => setText("latest")}
                                    checked={text === "latest"}
                                    id='latest'
                                    className='hidden'
                                />
                                Latest Post
                            </label>
                        </div>

                        <div>
                            <label className='p-2 text-[14px] font-bold cursor-pointer'>
                                <input
                                    type="radio"
                                    onChange={() => setText("old")}
                                    checked={text === "old"}
                                    id='old'
                                    className='hidden'
                                />
                                Old Post
                            </label>
                        </div>

                    </PopoverContent>
                </Popover>

            </div>

            {
                filterData?.map((post) => {
                    return (
                        <PostCards key={post._id} post={post} />
                    );
                })
            }
        </div>
    );
}

export default AllPosts;
