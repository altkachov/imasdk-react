import './videos-page.css';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ImaSdkComponent from "../../components/ima-sdk-component/ima-sdk-component";

const DATA_SET = [
    {name: 'clouds', link: './clouds.mp4', id: 1},
    {name: 'flower', link: './flower.mp4', id: 2},
    {name: 'sunset', link: './sunset.mp4', id: 3},
];
export default function VideosPage() {
    const [videoSrc, setVideoSrc] = useState();
    const [dataset, setDataset] = useState([]);
    const [adsLoaded, setAdsLoaded] = useState(false);
    const videoElement = useRef();
    const imaDSK = useRef();
    console.log("IMASDK", imaDSK);
    useEffect(() => {
        setDataset(DATA_SET);
    }, []);
    const setVideo = (v) => {
        setAdsLoaded(false);
        setVideoSrc(v.link);
    }
    const onPlay = (event) => {
        if (adsLoaded) {
            return;
        }
        setAdsLoaded(true);
        // Prevent triggering immediate playback when ads are loading
        event.preventDefault();
        if (imaDSK.current) {
            imaDSK.current.loadAds();
        }
    };
    const onResumeRequested = () => {
        if (!videoElement.current) return;
        videoElement.current.play();
    }
    /*onPlay={loadAds}*/
    // // Prevent this function from running on if there are already ads loaded
    //         if (adsLoaded) {
    //             return;
    //         }
    //         adsLoaded = true;
    //
    //         // Prevent triggering immediate playback when ads are loading
    //         event.preventDefault();
    return <div className={'videos'}>
        <div>
            <div className={'player'}>
                <div className={'video-container'}>
                    <video controls={true} ref={videoElement} src={videoSrc} onPlay={onPlay}></video>
                    <ImaSdkComponent ref={imaDSK} videoElementRef={videoElement} onResumeRequested={onResumeRequested}/>
                </div>
            </div>
        </div>
        <div className={'videos-list'}>
            <ul>
                {dataset.map(d => <li key={d.id} onClick={() => setVideo(d)}>{d.name}</li>)}
            </ul>
        </div>
    </div>
}
