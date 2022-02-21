import React, { useEffect, useState } from 'react'

import socket from './socket'
import './App.css';

const App = ()  => {

    const [youtubePlayerReady, setYoutubePlayerReady] = useState(false)
    const [startVideo, setStartVideo] = useState(0)
    const [endVideo, setEndVideo] = useState(null)

    // socket.on('connect_error', (error) => {
    //     console.log('Failed to connect to server');
    //     console.log(error);
    // });
    //
    // socket.io.on('error', (error) => {
    //     console.log('and error happened');
    //     console.log(error);
    // });
    
    console.log('socket');
    console.log(socket);

    useEffect(() => {
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
    })

    useEffect(() => {
        console.log('UE[]');
        socket.connect()
    }, [])


    const loadYT = async () => {
        const tag = document.createElement('script');
        tag.src = await "https://www.youtube.com/player_api"
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    const onYouTubePlayerAPIReady = () => {
        const player = new window.YT.Player('ytplayer', {
            videoId: 'M7lc1UVf-VE',
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            },
        })
    }

    const onPlayerStateChange = (event) => {
        console.log('youtube state change');
        console.log('Is playing');
        console.log(event.data == window.YT.PlayerState.PLAYING);
        console.log('playing seconds');
        console.log(event.target.playerInfo.currentTime);
        console.log('playing total');
        console.log(event.target.playerInfo.duration);
    }

    const onPlayerReady = (event) => {
        event.target.playVideo();
        setYoutubePlayerReady(true)

    }

    return (
        <div className="App">
            youtube player
            <div id="ytplayer"></div>
        </div>
    )
}

export default App;
