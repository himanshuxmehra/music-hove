import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import "../app/globals.css";

const SERVER_URL = process.env.NODE_ENV === 'production' ? 'https://produrl.com' : 'http://localhost:4000';

export default function HomeView() {

    const [sessionCode, setSessionCode] = useState<string>('');
    let [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
    const router = useRouter();

    const handleJoinCall = async (e: any) => {
        try {
            const response = await axios.post(`${SERVER_URL}/joinSession`, { sixDigitCode: sessionCode });
            const sessionData = response.data;

            // Assuming your 'Call' screen is at '/call'
            e.preventDefault()
            router.push({ pathname: '/hove', query: { sessionData } });
        } catch (error) {
            console.error('Error joining call:', error);
            // Handle error, show message, etc.
        }
    };

    const handleCreateCall = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/createSession`, { username: 'exampleUser' });
            const sessionData = response.data;
            console.log(sessionData);
            // Assuming your 'Call' screen is at '/call'
            router.push({ pathname: '/hove', query: { sessionData } }, `${sessionData.sixDigitCode}`);
        } catch (error) {
            console.error('Error creating call:', error);
            // Handle error, show message, etc.
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <h1 className="text-4xl font-bold mb-10 text-gray-200">Music Hove</h1>
            <div className="flex flex-col gap-6 md:flex-row md:gap-10">
                <Button
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                    data-modal-target="#joinCallModal"
                    onClick={() => {
                        setOpenJoinModal(true);
                    }}
                >
                    <CameraIcon className="h-6 w-6" />
                    <span>Join Call</span>
                </Button>
                <Button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
                    onClick={handleCreateCall}
                    >
                    <PlusIcon className="h-6 w-6" />
                    <span>Create Call</span>
                </Button>
            </div>
            {openJoinModal ?

                <div
                    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                    id="joinCallModal"
                >
                    <div className="bg-white rounded-lg w-80">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <p className="text-2xl font-bold">Join a Call</p>
                            <Button className="text-gray-400 hover:text-gray-500" data-modal-close="#joinCallModal"
                                onClick={() => {
                                    setOpenJoinModal(false);
                                }}
                            >
                                <PanelTopCloseIcon className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 text-gray-600">Enter the 6-digit code of the call you want to join:</p>
                            <Input className="mb-4 w-full p-2 border border-gray-200 rounded-md" placeholder="6-digit code" onChange={(e)=>{
                                setSessionCode(e.target.value)
                            }} />
                            <Button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                                onClick={handleJoinCall}
                            >
                                <span>Join Call</span>
                            </Button>
                        </div>
                    </div>

                </div> : <div></div>}
        </div>
    )
}


function CameraIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
        </svg>
    )
}


function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


function PanelTopCloseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <path d="m9 16 3-3 3 3" />
        </svg>
    )
}
