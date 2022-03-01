import React, { useEffect, useState } from 'react'

import socket from './socket'
import './App.css';

const App = ()  => {

    socket.on('video:play', (ms) => {
        console.log('video:play ' + ms);
        playPlayer(ms)
    })

    socket.on('video:stop', (ms) => {
        console.log('video:stop ' + ms);
        stopPlayer(ms)
    })

    const [ytPlayer, setYtPlayer] = useState(null)
    const [videoDuration, setVideoDuration] = useState(null)
    const [sliderX, setSliderX] = useState(0)

    const bar = document.getElementById('progess-bar')

    useEffect(() => {
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
        socket.connect()
    }, [])

    const playPlayer = (ms) => {
        if (ytPlayer != null) {
            ytPlayer.playVideo()
            console.log('ytPlayer');
            console.log(ytPlayer);
        }
    }

    const stopPlayer = (ms) => {
        if (ytPlayer && window.YT.PlayerState.PLAYING) {
            if (ms) {
                ytPlayer.seekTo(ms)
            }
            ytPlayer.pauseVideo()
        }
    }

    const onPlayerReady = (event) => {
        setVideoDuration(event.target.playerInfo.duration)
        event.target.playVideo()
    }

    const onPlayerStateChange = (event) => {
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
        }
    }

    const seekSecond = (event) => {
        if (bar && event.clientY > bar.getBoundingClientRect().top && event.clientY < bar.getBoundingClientRect().bottom) {
            const pxPerSecond = bar.getBoundingClientRect().width / videoDuration
            setSliderX(event.clientX)
            if (ytPlayer) {
                ytPlayer.seekTo(event.clientX / pxPerSecond)
            }
        }
    }

    document.addEventListener('click', seekSecond)

    setInterval(() => {
        if (ytPlayer && bar) {
            setSliderX(ytPlayer.playerInfo.currentTime / (bar.getBoundingClientRect().width / videoDuration))
        }
    }, 4000)

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
                    <div className='col-12' style={{ background: 'black', height: '20px' }}>
                        <div className='slider row'>
                            <div
                                className='col-auto'
                                style={{ background: 'white', width: '5px', position: 'absolute', left: `${sliderX}px` }}
                            >
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
