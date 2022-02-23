import React, { useEffect, useState } from 'react'

import socket from './socket'
import './App.css';

const App = ()  => {

    const [youtubePlayerReady, setYoutubePlayerReady] = useState(false)
    const [startVideo, setStartVideo] = useState(0)
    const [endVideo, setEndVideo] = useState(null)
    const [ytPlayer, setYtPlayer] = useState(null)

    // socket.on('connect_error', (error) => {
    //     console.log('Failed to connect to server');
    //     console.log(error);
    // });
    //
    // socket.io.on('error', (error) => {
    //     console.log('and error happened');
    //     console.log(error);
    // });

    socket.on('video:play', (ms) => {
        console.log('video:play ' + ms);
        playPlayer(ms)
    })

    socket.on('video:stop', (ms) => {
        console.log('video:stop ' + ms);
        stopPlayer(ms)
    })


    console.log('socket');
    console.log(socket);

    useEffect(() => {
        // if (!window.YT) {
        //     loadYT()
        //     window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        // } else {
        //     onYouTubePlayerAPIReady(window.YT)
        // }
    })

    useEffect(() => {
        console.log('UE[]');
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
        socket.connect()
    }, [])


    const loadYT = async () => {
        const tag = document.createElement('script');
        tag.src = await "http://www.youtube.com/player_api"
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    const onYouTubePlayerAPIReady = () => {
        console.log('onYouTubePlayerAPIReady');
        const player = new window.YT.Player('ytplayer', {
            videoId: 'M7lc1UVf-VE',
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            },
        })
        if (!ytPlayer) {
            setYtPlayer(player)
        }
    }

    const onPlayerStateChange = (event) => {
        console.log('youtube state change');
        console.log('Is playing');
        console.log(event.data == window.YT.PlayerState.PLAYING);
        console.log('playing seconds');
        console.log(event.target.playerInfo.currentTime);
        console.log('playing total');
        console.log(event.target.playerInfo.duration);
        if (event.data == window.YT.PlayerState.PLAYING) {
            socket.emit('video:play', event.target.playerInfo.currentTime)
        } else {
            socket.emit('video:stop', event.target.playerInfo.currentTime)

        }
    }

    const onPlayerReady = (event) => {
        event.target.playVideo()
        setYoutubePlayerReady(true)
    }

    const playPlayer = (ms) => {
        if (ytPlayer != null) {
            console.log('playPlayer');
            console.log(ms);
            ytPlayer.playVideo()
        }

    }

    const stopPlayer = (ms) => {
        if (ytPlayer && ytPlayer.playerInfo.playerState == 1) {
            console.log('stopPlayer');
            console.log(ytPlayer);
            ytPlayer.seekTo(ms)
            ytPlayer.pauseVideo()
        }

    }

    return (
        <div className='App'>
            youtube player
            <div id='ytplayer'>
            </div>
        </div>
    )

}

export default App;
