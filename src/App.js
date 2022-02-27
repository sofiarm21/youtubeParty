import React, { useEffect, useState } from 'react'

import socket from './socket'
import './App.css';

const App = ()  => {

    const [ytPlayer, setYtPlayer] = useState(null)
    const [videoDuration, setVideoDuration] = useState(null)

    useEffect(() => {
        document.addEventListener("click", seekSecond);
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
        socket.connect()
    }, [])

    useEffect(() => {
        console.log('ytPlayer');
        console.log(ytPlayer);
        if (ytPlayer && ytPlayer.playerInfo) {
            console.log(ytPlayer.playerInfo.duration);
        }
    }, [ytPlayer])


    socket.on('video:play', (ms) => {
        console.log('video:play ' + ms);
        playPlayer(ms)
    })

    socket.on('video:stop', (ms) => {
        console.log('video:stop ' + ms);
        stopPlayer(ms)
    })

    const playPlayer = (ms) => {
        if (ytPlayer != null) {
            ytPlayer.playVideo()
        }
    }

    const stopPlayer = (ms) => {
        console.log('ytPlayer sp');
        console.log(ytPlayer);
        if (ytPlayer && ytPlayer.playerInfo.playerState == 1) {
            if (ms) {
                ytPlayer.seekTo(ms)
            }
            ytPlayer.pauseVideo()
        }
    }

    const onPlayerReady = (event) => {
        console.log('event.target.playerInfo.duration');
        console.log(event.target.playerInfo.duration);
        setVideoDuration(event.target.playerInfo.duration)
        event.target.playVideo()
    }

    const onPlayerStateChange = (event) => {
        console.log('event.target.playerInfo.currentTime');
        console.log(event.target.playerInfo.currentTime);
        // if (!videoDuration) {
        //     setVideoDuration(event.target.playerInfo.currentTime)
        // }
        if (event.data == window.YT.PlayerState.PLAYING) {
            socket.emit('video:play', event.target.playerInfo.currentTime)
        } else {
            socket.emit('video:stop', event.target.playerInfo.currentTime)
        }
    }

    const loadYT = async () => {
        const tag = document.createElement('script');
        tag.src = await 'http://www.youtube.com/player_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    const onYouTubePlayerAPIReady = () => {
        const player = new window.YT.Player('ytplayer', {
            width: window.screen.width,
            videoId: 'M7lc1UVf-VE',
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                // 'disablekb': 1,
                // 'modestbranding': 1,
                // 'rel': 0,
                // 'showinfo': 0
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            },
        })
        if (!ytPlayer) {
            setYtPlayer(player)
            console.log('player');
            console.log(player);
        }
    }

    const seekSecond = (event) => {
        const bar = document.getElementById('progess-bar')
        if (event.clientY > bar.getBoundingClientRect().top && event.clientY < bar.getBoundingClientRect().bottom) {
            console.log('bar clicked');
            console.log('videoDuration');
            console.log(videoDuration);
            const pxPerSecond = bar.getBoundingClientRect().width / videoDuration
            console.log('pxPerSecond');
            console.log(pxPerSecond);
        }
    }

    return (
        <div className='App row'>
            <div className='col-12 py-4 px-2'>
                <div id='ytplayer'>
                </div>
            </div>
            <div className='col-12'>
                <button
                    type='button'
                    className='btn btn-dark'
                    onClick={(event) => playPlayer(event)}
                >
                    Play
                </button>
                <button
                    type='button'
                    className='btn btn-dark'
                    onClick={() => stopPlayer()}
                >
                    Pause
                </button>
            </div>
            <div className='col-12 mt-5'>
                <div
                    id='progess-bar'
                    className='row'
                >
                    <div className='col-12' style={{ background: 'black' }}>
                        <div className='slider row'>
                            <div className='col-auto' style={{ background: 'white', width: '5px'}}>
                                s
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default App;
