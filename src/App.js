import React, { useEffect, useState } from 'react'

import './App.css';

const App = ()  => {

    const [youtubePlayerReady, setYoutubePlayerReady] = useState(false)
    const [startVideo, setStartVideo] = useState(0)
    const [endVideo, setEndVideo] = useState(null)

    useEffect(() => {
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
    })

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
        });
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

    };

    return (
        <div className="App">
            youtube player
            <div id="ytplayer"></div>
        </div>
    )
}

export default App;
