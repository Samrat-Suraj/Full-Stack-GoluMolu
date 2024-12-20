import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';

const ViewStatusDialog = ({ open, setOpen , statuses}) => {
    const [timer, setTimer] = useState(30);
    const [datePosted] = useState(new Date().toLocaleString());
    const [comment] = useState("This is a sample comment on the status post.");
    const {mutalStatus } = useSelector(store => store.status)

    useEffect(() => {
        if (open) {
            setTimer(30);
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setOpen(false);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [open, setOpen]);

    const handleDialogClick = () => {
        if (open) {
            setTimer(30);
        }
    };
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="flex w-[90%] justify-center items-center p-0 bg-black bg-opacity-70" onClick={handleDialogClick}>
                <div className="relative w-full sm:max-w-md md:max-w-lg lg:max-w-xl h-[80vh] sm:h-[70vh] md:h-[60vh] bg-white rounded-xl overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        src={statuses?.image}
                        alt="Status"
                    />
                    {/* <div className="absolute bottom-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg flex items-center space-x-2">
                        <span>{statuses?.author?.fullname}</span>
                    </div> */}
                    <div className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg">
                        <span>{statuses?.createdAt}</span>
                    </div>
                    <div className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg">
                        <span>{timer} sec</span>
                    </div>

                    <div className="absolute bottom-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-lg max-w-xs">
                        <span>{statuses?.text}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewStatusDialog;
