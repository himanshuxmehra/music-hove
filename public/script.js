const socket = io('/')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'

})
const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')

const peers = {}

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var screenSharing = false

myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
          })
    })

    socket.on('user-connected',userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    console.log(userId + ' disconnected')
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id=> {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] = call
}


function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if (peer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
            screenSharing = true
        }
        console.log(screenStream)
    })
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = local_stream.getVideoTracks()[0];
    if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false
}