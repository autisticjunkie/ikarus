'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function DevWebsite() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  const words = ["I", "did", "not", "fall."]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
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

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen items-end p-8">
        <div className="flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center space-x-4"
          >
            <span className="font-mono text-4xl text-white">/Ikarus</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-4 w-4 rounded-full bg-red-500"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <motion.div 
              className="text-4xl font-bold text-white mb-8 flex flex-wrap"
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            
            <div className="font-mono text-gray-300 space-y-2">
              <p>/dev/agents {'>'} Ikarus</p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="pl-4 space-y-1"
              >
                <motion.a
                  href="/terminal"
                  className="text-[#FF4545] hover:text-red-400 transition-colors block animate-pulse"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  Terminal
                </motion.a>
                <motion.a
                  href="https://x.com/"
                  className="text-[#FF4545] hover:text-red-400 transition-colors block animate-pulse"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  Twitter
                </motion.a>
                <motion.a
                  href="/buy"
                  className="text-[#FF4545] hover:text-red-400 transition-colors block animate-pulse"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  Buy
                </motion.a>
              </motion.div>
              <p>/dev/agents {'>'} <span className="animate-pulse">▊</span></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
