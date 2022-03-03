import React, { useEffect, useState } from 'react'

import socket from './socket'
import './App.css';

const App = ()  => {



    const [ytPlayer, setYtPlayer] = useState(null)
    const [videoDuration, setVideoDuration] = useState(null)
    const [sliderX, setSliderX] = useState(0)

    const bar = document.getElementById('progess-bar')

    useEffect(() => {
        socket.on('video:play', () => {
            if (ytPlayer != null) {
                if (ytPlayer.playerInfo.playerState == 3) {
                    stopPlayer()
                }
                ytPlayer.playVideo()
            }
        })

        socket.on('video:stop', () => {
            if (ytPlayer != null) {
                ytPlayer.pauseVideo()
            }
        })

        socket.on('video:seek', (sc) => {
            seekSecond(sc)
        })
    },[socket, ytPlayer])

    useEffect(() => {
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
        socket.connect()
    }, [])

    const playPlayer = () => {
        if (ytPlayer != null) {
            socket.emit('video:play')
            ytPlayer.playVideo()
        }
    }

    const stopPlayer = (ms) => {
        if (ytPlayer) {
            socket.emit('video:stop')
            ytPlayer.pauseVideo()
        }
    }

    const onPlayerReady = (event) => {
        setVideoDuration(event.target.playerInfo.duration)
        event.target.playVideo()
    }

    const onPlayerStateChange = (event) => {
        if (event.data == window.YT.PlayerState.PLAYING) {
            //socket.emit('video:play', event.target.playerInfo.currentTime)
        } else if (event.data == window.YT.PlayerState.PAUSED) {
            //socket.emit('video:stop', event.target.playerInfo.currentTime)
        } else if (event.data == window.YT.PlayerState.BUFFERING) {
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
            height: window.screen.height - 200,
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

    const seekSecond = (sc) => {
        if (ytPlayer) {
            ytPlayer.seekTo(sc)
        }
    }

    const seekSecondOnTap = (event) => {
        if (bar && event.clientY > bar.getBoundingClientRect().top && event.clientY < bar.getBoundingClientRect().bottom) {
            const pxPerSecond = bar.getBoundingClientRect().width / videoDuration
            setSliderX(event.clientX)
            if (ytPlayer) {
                ytPlayer.seekTo(event.clientX / pxPerSecond)
                socket.emit('video:seek', event.clientX / pxPerSecond)
                stopPlayer()
            }
        }
    }

    setInterval(() => {
        if (ytPlayer && bar && window.YT.PlayerState.PLAYING) {
            setSliderX(ytPlayer.playerInfo.currentTime * (bar.getBoundingClientRect().width / videoDuration))
        }
    }, 1000)

    return (
        <div className='App row'>
            <div className='col-12 py-4 px-2'>
                <div id='ytplayer' className='w-100'>
                </div>
                <div
                    id='progess-bar'
                    className='row'
                    onClick={(event) => seekSecondOnTap(event)}
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
            <div className='col-12 mt-5'>

            </div>
            <div className='col-12'>
                <button
                    type='button'
                    className='btn btn-dark mx-2'
                    onClick={() => playPlayer()}
                >
                    Play
                </button>
                <button
                    type='button'
                    className='btn btn-dark mx-2'
                    onClick={() => stopPlayer()}
                >
                    Pause
                </button>
            </div>
        </div>
    )

}

export default App;
