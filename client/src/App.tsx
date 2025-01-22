import { useEffect, useState, useRef } from "react";
import "tailwindcss/tailwind.css";
import { useSocket } from "./hooks/useSocket";

function App() {
  const socket = useSocket();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    pc.ondatachannel = (event) => {
      const dc = event.channel;
      dataChannel.current = dc;

      dc.onopen = () => console.log("Data channel is open");
      dc.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, `Peer: ${event.data}`]);
      };
    };

    if (socket) {
      socket.onmessage = async (event: any) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.send(JSON.stringify({ type: "answer", answer }));
        } else if (data.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === "candidate" && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      };

      // Assume the current client is the caller
      const dc = pc.createDataChannel("chat");
      dataChannel.current = dc;

      dc.onopen = () => console.log("Data channel is open");
      dc.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, `Peer: ${event.data}`]);
      };

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: "offer", offer }));
      });
    }

    return () => {
      pc.close();
      socket?.close();
    };
  }, [socket]);

  const handleSend = () => {
    if (dataChannel.current?.readyState === "open" && message.trim() !== "") {
      dataChannel.current.send(message);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b last:border-b-0">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
