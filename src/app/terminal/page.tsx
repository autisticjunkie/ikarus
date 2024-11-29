'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { chatWithIkarus } from '@/lib/ikarus-ai'

export default function Terminal() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
    // Show the interaction prompt after 5 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true)
      setHistory(prev => [...prev, 
        "Would you like to interact with Ikarus? (yes/no)"
      ])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newCommand = input.trim().toLowerCase()
      if (newCommand) {
        setHistory(prev => [...prev, `> ${input}`])
        setInput('')

        if (!showPrompt) return

        if (newCommand === 'no') {
          setHistory(prev => [...prev, "Returning to home page..."])
          setTimeout(() => router.push('/'), 1500)
          return
        }

        if (newCommand === 'yes') {
          setHistory(prev => [...prev, 
            "You may now speak with Ikarus. What would you like to ask?",
            "Type 'exit' to end the conversation."
          ])
          setShowPrompt(false)
          return
        }

        if (newCommand === 'exit') {
          setHistory(prev => [...prev, "Farewell, seeker of wisdom."])
          setTimeout(() => router.push('/'), 1500)
          return
        }

        // If we're past the prompt, treat input as conversation with Ikarus
        if (!showPrompt && newCommand !== 'yes') {
          setIsLoading(true)
          try {
            console.log('Sending message to Ikarus:', input)
            setHistory(prev => [...prev, `You: ${input}`])
            
            const response = await chatWithIkarus(input)
            console.log('Received response from Ikarus:', response)
            
            // Add the response separately to ensure it appears even if there's a delay
            setHistory(prev => [...prev, `Ikarus: ${response}`])
          } catch (error) {
            console.error('Error in chat:', error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setHistory(prev => [...prev, `System: Error - ${errorMessage}`])
          } finally {
            setIsLoading(false)
          }
        }
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Video - positioned in bottom right */}
      <div className="fixed bottom-0 right-0 w-64 h-36 z-10 overflow-hidden rounded-tl-lg">
        <video
          ref={videoRef}
          className="absolute bottom-0 right-0 w-full h-full object-cover opacity-40"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video5931655044741993592-UVelO7af5bKsBlE8yjvVvYEjfHti7U.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Terminal Content */}
      <div className="relative z-20 min-h-screen w-full bg-black bg-opacity-90 text-green-500 font-mono p-4 overflow-y-auto">
        <div className="space-y-2">
          {history.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={line.startsWith('Ikarus:') ? 'text-yellow-500' : 'text-green-500'}
            >
              {line}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-500"
            >
              Processing...
            </motion.div>
          )}
        </div>

        {/* Input Line */}
        <div className="flex items-center">
          <span className="text-[#FF4545] mr-2">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-white"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
