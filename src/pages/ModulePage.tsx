import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import ModuleComponent from '../components/ModuleComponent';
import VideoPlayer from '../components/VideoPlayer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

interface ModulePageProps { }
interface Module {
    id: string;
    name: string;
    serialNumber: number;
    heading: string;
    content: string;
}

interface VideoProgress {
    id: string;
    userId: string;
    videoId: string;
    lastPosition: number;
    completed: boolean;
    completedAt?: Date;
    video: {
        id: string;
        title: string;
        url: string;
        description?: string;
        duration: number;
        moduleId: string;
        module: Module;
    };
}

const ModulePage: FC<ModulePageProps> = () => {
    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [videoProgress, setVideoProgress] = useState<VideoProgress | null>(null);
    const completionPercentage = videoProgress ? videoProgress.lastPosition : 0;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('authToken'); 
                if (!token) {
                    throw new Error('No auth token found, please log in again.');
                }

                const response = await axios.get('/api/current-module', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { currentModule, videoProgress } = response.data;
                setCurrentModule(currentModule);
                setVideoProgress(videoProgress);
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized access, redirecting to login.');
                    navigate('/login');
                } else {
                    console.error('Failed to fetch module progress:', error);
                }
            }
        };

        fetchProgress();
    }, [navigate]);

    const handleNextModule = async () => {
        if (!currentModule) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No auth token found, please log in again.');
            }

            const response = await axios.get(`/api/next-module?currentSerialNumber=${currentModule.serialNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { nextModule, videoProgress } = response.data;
            setCurrentModule(nextModule);
            setVideoProgress(videoProgress);
        } catch (error: any) {
            console.error('Failed to fetch next module:', error);
        }
    };

    if (!currentModule || !videoProgress) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative h-screen p-4 bg-white">
            <div className="absolute top-4 right-4 w-20 h-20">
                <CircularProgressbar
                    value={completionPercentage}
                    text={`${completionPercentage}%`}
                    styles={buildStyles({
                        textColor: '#00BFFF',
                        pathColor: '#00BFFF',
                    })}
                />
                <div className="text-center text-xs mt-1">
                    {videoProgress.completed ? 'Completed' : 'In Progress'}
                </div>
            </div>
            <div className="flex">
                <div>
                    <ModuleComponent
                        heading={currentModule.heading}
                        content={currentModule.content}
                    />
                </div>
                <div className='mr-20 mt-20'>
                    <VideoPlayer
                        urls={[`${videoProgress.video.url}`]}
                        width={'600'}
                        height={'400'}
                    />
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <button 
                    className="flex items-center justify-center bg-blue-500 text-white p-3 rounded-full shadow-lg"
                    onClick={handleNextModule}
                >
                    <span className="text-sm font-bold">Next Module</span>
                    <span className="ml-2 text-lg">➔</span>
                </button>
            </div>
        </div>
    );
};

export default ModulePage;
