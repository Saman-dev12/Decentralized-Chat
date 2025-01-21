import { useEffect, useState } from "react"
import { useSocket } from "./hooks/useSocket"
import 'tailwindcss/tailwind.css'

function App() {
  const socket = useSocket();
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    if (socket) {
      const handleMessage = (message: MessageEvent) => {
        console.log("Received message", message.data)
        setMessages((prevMessages) => [...prevMessages, message.data])
      }
      socket.addEventListener('message', handleMessage)
      return () => {
        socket.removeEventListener('message', handleMessage)
      }
    }
  }, [socket])

  if (!socket) {
    return <div className="flex items-center justify-center h-screen">Connecting...</div>
  }

  const handleSend = () => {
    socket.send(message);
    setMessages([...messages, message])
    setMessage("")
  }

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
  )
}

export default App
