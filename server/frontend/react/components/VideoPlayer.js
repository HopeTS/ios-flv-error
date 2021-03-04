import React, {useEffect, useState} from 'react';
import {ReactFlvPlayer} from 'react-flv-player';
import axios from 'axios';

export function VideoPlayer(props) {

    useEffect(() => {
        console.log('Component mounted')
        axios.get(`https://${window.location.hostname}:8443/live/${props.streamKey}.flv`)
        .then((res) => {
            console.log('There was a valid response')
            console.log(res)
        })
        .catch((err) => {
            console.log('There was an error')
            console.log(err);
        })
    }, [])

    /** Handle HTTP video error */
    const handle_http_video_error = (err) => {
        console.log(err);
        set_http_video_error(true);

        
    }

    /** Handle HTTPS video error */
    const handle_https_video_error = () => {
        set_https_video_error(true);
    }

    return (
        <div className="VideoPlayer">

            {/* Default HTTP player */}
            <ReactFlvPlayer 
                url={`https://${window.location.hostname}:8443/live/${props.streamKey}.flv`}
                height={httpVideoHeight}
                width={httpVideoWidth}
                isLive={true}
                handleError={(err) => handle_http_video_error(err)}
                hasAudio={false}
                isMuted={true}
            />

            {/* If nothing works */}
            {(httpVideoError) &&
                <p>Something went wrong.</p>
            }
        </div>
    );
}

export default VideoPlayer;