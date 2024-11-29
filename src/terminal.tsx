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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center space-x-4"
        >
          <span className="font-mono text-4xl text-white">/dev</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-4 w-4 rounded-full bg-red-500"
          />
        </motion.div>
      </div>
    </div>
  )
}

