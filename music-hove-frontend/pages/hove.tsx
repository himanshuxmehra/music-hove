// pages/call.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Webcam from 'react-webcam';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "../app/globals.css";

export default function Component() {
  const router = useRouter();
  const { sessionData } = router.query;

  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [peers, setPeers] = useState<{ userId: string; peer: Peer.Instance }[]>([]);
  const [myPeer, setMyPeer] = useState<Peer.Instance | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [videoOn, setVideoOn] = useState<boolean>(true);

  const socket = io('http://localhost:3001'); // Replace with your Socket.io server URL

  useEffect(() => {
    // if (!sessionData) {
    //   // Redirect to home if session data is not available
    //   router.push('/');
    // }

    const sessionId = sessionData?.sessionId;

    // Connect to the Socket.io room for the specific session
    socket.emit('join-room', sessionId);

    // Get user media and create peer connection
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMyPeer(new Peer({ initiator: true, trickle: false, stream }));

      // Listen for incoming peers
      socket.on('user-connected', (userId) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        setPeers((prevPeers) => [...prevPeers, { userId, peer }]);

        peer.on('signal', (data) => {
          socket.emit('send-signal', { userId, signalData: data });
        });
      });

      // Listen for signals from other peers
      socket.on('receive-signal', ({ userId, signalData }) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.signal(signalData);
        setPeers((prevPeers) => [...prevPeers, { userId, peer }]);
      });

      // Remove peer when disconnected
      socket.on('user-disconnected', (userId) => {
        setPeers((prevPeers) => prevPeers.filter((p) => p.userId !== userId));
      });
    });

    // Clean up on component unmount
    return () => {
      if (myPeer) {
        myPeer.destroy();
      }
      socket.disconnect();
    };
  }, [router, sessionData]);

  const handleSendMessage = () => {
    socket.emit('send-message', inputMessage);
    setMessages((prevMessages) => [...prevMessages, { user: 'You', message: inputMessage }]);
    setInputMessage('');
  };

  const handleToggleMute = () => {
    myPeer?.stream.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    setMuted(!muted);
  };

  const handleToggleVideo = () => {
    myPeer?.stream.getVideoTracks().forEach((track) => {
      track.enabled = !videoOn;
    });
    setVideoOn(!videoOn);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-screen">
      <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 space-y-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex-1 overflow-y-auto space-y-2">


          {messages.map((msg, index) => (
            <div key={index}>
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">{msg.user}</span>
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">00:00 AM</span>
              </div>

            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <Input placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative group rounded-lg overflow-hidden">
          <span className="w-full h-full object-cover rounded-md bg-muted" />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all flex items-center justify-center space-x-2">
            <span className="text-white">John Doe</span>
            <Button size="sm" variant="ghost" onClick={handleToggleMute}>
              {muted ? 'Unmute' : 'Mute'}
            </Button>
            <Webcam />
          </div>
        </div>
        {peers.map(({ userId, peer }) => (
          <div key={userId}>
            <div className="relative group rounded-lg overflow-hidden">
              <span className="w-full h-full object-cover rounded-md bg-muted" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all flex items-center justify-center space-x-2">
                <span className="text-white">{userId}</span>
                <video
                  className="remote-video"
                  playsInline
                  autoPlay
                  ref={(ref) => {
                    if (ref) {
                      ref.srcObject = peer.stream;
                    }
                  }}
                />
                <Button size="sm" variant="ghost">
                  Mute
                </Button>
              </div>
            </div>

          </div>

        ))}
        <div className="relative group rounded-lg overflow-hidden">
          <span className="w-full h-full object-cover rounded-md bg-muted" />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all flex items-center justify-center space-x-2">
            <span className="text-white">Jane Smith</span>
            <Button size="sm" variant="ghost">
              Mute
            </Button>
          </div>
        </div>
        <div className="relative group rounded-lg overflow-hidden">
          <span className="w-full h-full object-cover rounded-md bg-muted" />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all flex items-center justify-center space-x-2">
            <span className="text-white">Bob Johnson</span>
            <Button size="sm" variant="ghost">
              Mute
            </Button>
          </div>
        </div>
        <div className="relative group rounded-lg overflow-hidden">
          <span className="w-full h-full object-cover rounded-md bg-muted" />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all flex items-center justify-center space-x-2">
            <span className="text-white">Bob Johnson</span>
            <Button size="sm" variant="ghost">
              Mute
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

