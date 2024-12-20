import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';

const ViewMyPostDialog = ({ myOpen, setMyOpen }) => {
    const { myStatus } = useSelector(store => store.status)
    return (
        <Dialog open={myOpen} onOpenChange={(open) => setMyOpen(open)} className="w-full">
            <DialogContent onInteractOutside={() => setMyOpen(false)} className="p-2 bg-transparent border-none">
                <Carousel className="w-full m-auto">
                    <CarouselContent>
                        {myStatus?.status?.map((item, index) => (
                            <CarouselItem key={item?._id}>
                                <div className="w-full">
                                    <div className="relative w-full sm:max-w-full p-[1px] md:max-w-lg lg:max-w-xl h-[80vh] sm:h-[70vh] md:h-[62vh] bg-white rounded-xl overflow-hidden">
                                        <img
                                            className="w-full rounded-lg h-full object-cover"
                                            src={item?.image}
                                            alt="Status"
                                        />
                                        {/* <div className="absolute bottom-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg flex items-center space-x-2">
                                            <Heart className="w-6 h-6 text-red-500" />
                                            <span>{item?.likes?.length}likes</span>
                                        </div> */}
                                        <div className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg">
                                            <span>
                                                {new Date(item?.createdAt).toLocaleString('en-IN', {
                                                    weekday: 'long',
                                                    // year: 'numeric',
                                                    // month: 'long',
                                                    // day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    second: 'numeric',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg max-w-xs">
                                            <span>{item?.text}</span>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute top-1/2 left-12 right-12 flex justify-between px-4 transform -translate-y-1/2 z-10">
                        <CarouselPrevious className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">

                        </CarouselPrevious>
                        <CarouselNext className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75">

                        </CarouselNext>
                    </div>
                </Carousel>
            </DialogContent>
        </Dialog>
    );
};

export default ViewMyPostDialog;
