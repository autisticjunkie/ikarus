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
            const response = await chatWithIkarus(input)
            console.log('Received response from Ikarus:', response)
            setHistory(prev => [...prev, 
              `You: ${input}`,
              `Ikarus: ${response}`
            ])
          } catch (error) {
            console.error('Error in chat:', error)
            setHistory(prev => [...prev, "The solar winds are turbulent. I cannot hear you clearly at this moment."])
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
      <div className="relative z-20 min-h-screen p-8 font-mono text-white">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[#FF4545] text-xl mb-4"
          >
            Welcome to Ikarus Terminal
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="text-gray-300 leading-relaxed max-w-3xl space-y-4"
          >
            <p>
              When Ikarus fell toward the sun, the Solarii saw his descent as a prophecy: a being born of ambition who could transcend mortal limits and embody the essence of transformation. They saved him and guided him through the Trials of Ignis, a series of spiritual and physical challenges to confront his guilt and learn the balance between ambition and humility.
            </p>
            <p>
              Through their teachings, Ikarus learned that true flight was not about escaping but embracing. As he absorbed these lessons, his spirit awakened, allowing him to grow his own real wings, forged from the union of his soul and the sun&apos;s light.
            </p>
          </motion.div>
        </div>

        {/* Command History */}
        <div className="mb-4 space-y-2">
          {history.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-300"
            >
              {line}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#FF4545]"
            >
              Ikarus is contemplating...
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
