import { FC, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Cog, Expand, Maximize, Pause, Play, Settings, SkipBack, SkipForward, Volume, VolumeOff } from 'lucide-react';


interface VideoPlayerProps {
    urls: string[];
    width?: string | number;
    height?: string | number;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
    urls,
    width = '100%',
    height = 'auto'
}) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [played, setPlayed] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0.8);
    const [muted, setMuted] = useState<boolean>(false);
    const playerRef = useRef<ReactPlayer>(null);

    const validUrls = urls.filter(url => url.trim() !== '');

    const currentUrl = validUrls[currentVideoIndex] || '';

    useEffect(() => {
        if (currentUrl) {
            const savedTime = localStorage.getItem(`video-time-${currentUrl}`);
            if (savedTime) {
                playerRef.current?.seekTo(parseFloat(savedTime), 'seconds');
            }
        }
    }, [currentUrl]);

    const handleProgress = (state: { played: number }) => {
        setPlayed(state.played);
        if (currentUrl) {
            localStorage.setItem(`video-time-${currentUrl}`, (state.played * playerRef.current!.getDuration()).toString());
        }
    };

    const handleEnded = () => {
        const nextIndex = currentVideoIndex + 1;
        if (nextIndex < validUrls.length) {
            setCurrentVideoIndex(nextIndex);
            setPlaying(true);
        } else {
            setPlaying(false);
        }
    };

    const handlePlayPause = () => setPlaying(!playing);

    const handleRewind = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, 'seconds');
        }
    };

    const handleFastForward = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, 'seconds');
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
        setMuted(false);
    };

    const handleMute = () => setMuted(!muted);

    if (validUrls.length === 0) {
        return <div>No valid video sources available.</div>;
    }

    return (
        <div className="p-4 max-w-screen-md mx-auto">
            <ReactPlayer
                ref={playerRef}
                url={currentUrl}
                playing={playing}
                controls={false}
                width={width}
                height={height}
                onProgress={handleProgress}
                onEnded={handleEnded}
                volume={volume}
                muted={muted}
                progressInterval={1000}
                config={{ file: { attributes: { controlsList: 'nodownload' }}}}
            />
            <div className="mt-4 flex items-center space-x-4 bg-gray-800 p-2 rounded-md">
                <button
                    onClick={handlePlayPause}
                    className="text-white"
                >
                    {playing ? <Pause /> : <Play />}
                </button>
                <button onClick={handleRewind} className="text-white"><SkipBack /></button>
                <button onClick={handleFastForward} className="text-white"><SkipForward /></button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    className="flex-grow"
                />
                <button onClick={handleMute} className="text-white">
                    {muted ? <VolumeOff /> : <Volume />}
                </button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24"
                />
                <button className="text-white"><Settings /></button>
                <button className="text-white"><Maximize /></button>
            </div>
        </div>
    );
};

export default VideoPlayer;
