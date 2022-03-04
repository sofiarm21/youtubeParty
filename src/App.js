import React, { useEffect, useState } from 'react'

import socket from './socket'

const App = ()  => {

    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    const [ytPlayer, setYtPlayer] = useState(null)
    const [videoDuration, setVideoDuration] = useState(null)
    const [sliderX, setSliderX] = useState(0)
    const [youtubeVideoId, setYoutubeVideoId] = useState(null)
    const [roomId, setRoomId] = useState(`${random(1, 999999)}`)

    const bar = document.getElementById('progess-bar')

    useEffect(() => {
        if (!window.YT) {
            loadYT()
            window.onYouTubeIframeAPIReady = onYouTubePlayerAPIReady
        } else {
            onYouTubePlayerAPIReady(window.YT)
        }
        socket.connect()
        socket.emit('room:join', roomId)
    }, [])

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
        socket.on('video:change', (id) => {
            setYoutubeVideoId(id)
            if (ytPlayer) {
                ytPlayer.pauseVideo()
            }
        })
    },[socket, ytPlayer])

    useEffect(() => {
        if (youtubeVideoId && ytPlayer) {
            ytPlayer.loadVideoById(youtubeVideoId, 'large')
            setVideoDuration(ytPlayer.playerInfo.duration ?? null)
        }
    }, [youtubeVideoId])

    const playPlayer = () => {
        if (ytPlayer != null) {
            console.log('socket');
            console.log(socket);
            socket.emit('video:play', { room: roomId })
            ytPlayer.playVideo()
        }
    }

    const stopPlayer = (ms) => {
        if (ytPlayer) {
            socket.emit('video:stop', { room: roomId })
            ytPlayer.pauseVideo()
        }
    }

    const onPlayerReady = (event) => {
        setVideoDuration(event.target.playerInfo.duration)
    }

    const onPlayerStateChange = (event) => {
        if (event.data == window.YT.PlayerState.PLAYING) {
            if (!videoDuration && event.target.playerInfo) {
                setVideoDuration(event.target.playerInfo.duration)
            }
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
                'autoplay': 0,
                'controls': 0,
                //'mute': 1
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
                socket.emit('video:seek', { room: roomId, sc: event.clientX / pxPerSecond })
                stopPlayer()
            }
        }
    }

    const handleSubmit = (event) => {
        socket.emit('video:change', { room: roomId, sc: event.target[0].value })
        setYoutubeVideoId(event.target[0].value)
        ytPlayer.pauseVideo()
        event.preventDefault();
    }

    const joinNewSocketRoom = () => {
        const value =  document.getElementById('new-socket-room-id').value
        console.log(value);
        setRoomId(value)
        socket.emit('room:join', value)
    }

    setInterval(() => {
        if (ytPlayer && bar && window.YT.PlayerState.PLAYING) {
            setSliderX(ytPlayer.playerInfo.currentTime * (bar.getBoundingClientRect().width / videoDuration))
        }
    }, 1000)

    return (
        <div className='App row justify-content-center'>
            <div className='col-12 mt-3'>
                <h3 className='title text-white font-weight-bold'>
                    YoutubeParty 🎉
                </h3>
            </div>
            <div className='col-12'>
                <p className='text-white font-weight-bold'>
                    Invite people to your party using the code <b> {`${roomId}`} </b>
                </p>
            </div>
            <div className='col-auto'>
                <p className='text-white font-weight-bold'>
                    Or join someones room
                </p>
            </div>
            <div className='col-auto'>
                <input
                    id='new-socket-room-id'
                    className='form-control'
                    placeholder='Enter Room Id'
                />
            </div>
            <div className='col-auto'>
                <button
                    type='submit'
                    className='btn btn-primary'
                    onClick={() => joinNewSocketRoom()}
                >
                    Join
                </button>
            </div>
            <div className='col-12 py-4 px-2'>
                <div id='ytplayer' className='w-100'>
                </div>
                <div
                    id='progess-bar'
                    className='row rounded border'
                    onClick={(event) => seekSecondOnTap(event)}
                >
                    <div className='col-12' style={{ height: '20px' }}>
                        <div className='slider row h-100'>
                            <div
                                className='col-auto position-absolute rounded'
                                style={{ background: 'white', width: '3px', left: `${sliderX}px`, height: '20px' }}
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-12'>
            </div>
            <div className='col-12 mt-1 mb-4'>
                <button
                    type='button'
                    className='btn btn-dark mx-2 control-button'
                    onClick={() => playPlayer()}
                >
                    Play
                </button>
                <button
                    type='button'
                    className='btn btn-dark mx-2 control-button'
                    onClick={() => stopPlayer()}
                >
                    Pause
                </button>
            </div>
            <div className='col-6 mx-auto'>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Video Id</label>
                        <input
                            className='form-control'
                            placeholder='Enter Id'
                        />
                        <button
                            type='submit'
                            className='btn btn-primary'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default App;
