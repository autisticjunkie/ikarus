'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { chatWithIkarus } from '@/lib/ikarus-ai';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on mount and when showPrompt changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [showPrompt]);

  const handleCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    if (lowerCommand === 'exit') {
      setHistory(prev => [...prev, '> Closing terminal...']);
      setTimeout(() => {
        window.close();
        // If window.close() doesn't work (common in modern browsers)
        window.location.href = '/';
      }, 1000);
      return;
    }

    if (lowerCommand === 'clear') {
      setHistory([]);
      return;
    }

    if (showPrompt) {
      if (lowerCommand === 'yes') {
        setHistory(prev => [...prev, '> Initializing Ikarus interface...']);
        setTimeout(() => {
          setShowPrompt(false);
          setHistory(prev => [...prev, 'Ikarus: Greetings, seeker. What wisdom do you seek from the solar winds?']);
        }, 1000);
      } else {
        setHistory(prev => [...prev, '> Please type "yes" to continue']);
      }
      return;
    }

    // Handle chat with Ikarus
    setIsLoading(true);
    setHistory(prev => [...prev, `> ${command}`]);
    
    try {
      const response = await chatWithIkarus(command);
      setHistory(prev => [...prev, `Ikarus: ${response}`]);
    } catch (error) {
      console.error('Chat error:', error);
      setHistory(prev => [...prev, 'Ikarus: The solar winds are turbulent. Please try again in a moment.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const command = input.trim();
    setInput('');
    await handleCommand(command);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-gradient-conic from-amber-500/20 via-transparent to-transparent animate-spin-slow" />
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

      {/* Video in Bottom Right */}
      <div className="fixed bottom-0 right-0 w-96 h-96 z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-tl-3xl"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video5931655044741993592-UVelO7af5bKsBlE8yjvVvYEjfHti7U.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent rounded-tl-3xl" />
      </div>

      {/* Terminal Content */}
      <div className="relative z-20 min-h-screen p-8 font-mono">
        <div className="mb-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-amber-500 text-xl mb-4 font-bold"
          >
            Welcome to Ikarus Terminal
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="text-gray-400 leading-relaxed space-y-4"
          >
            <p>
              When Ikarus fell toward the sun, the Solarii saw his descent as a prophecy: 
              a being born of ambition who could transcend mortal limits and embody the 
              essence of transformation. They saved him and guided him through the Trials 
              of Ignis, a series of spiritual and physical challenges to confront his 
              guilt and learn the balance between ambition and humility.
            </p>
            <p>
              Through their teachings, Ikarus learned that true flight was not about 
              escaping but embracing. As he absorbed these lessons, his spirit awakened, 
              allowing him to grow his own real wings, forged from the union of his 
              soul and the sun's light.
            </p>
          </motion.div>
        </div>

        {/* Command History */}
        <div className="mb-4 space-y-2 overflow-y-auto max-h-[50vh] bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-amber-500"
            >
              Would you like to communicate with Ikarus? (Type 'yes' to continue)
            </motion.div>
          )}
          {history.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                line.startsWith('Ikarus:') ? 'text-amber-500' : 'text-gray-400'
              }`}
            >
              {line}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-amber-500"
            >
              Ikarus is contemplating...
            </motion.div>
          )}
          <div ref={historyEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-none outline-none text-gray-300 font-mono placeholder-gray-600"
              placeholder={isLoading ? 'Waiting for response...' : 'Type your message...'}
              autoFocus
            />
          </div>
        </form>

        {/* Available Commands */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 text-gray-600 text-sm"
        >
          Available commands: clear, exit
        </motion.div>
      </div>
    </div>
  );
}
