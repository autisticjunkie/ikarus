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
    <div className="min-h-screen bg-black text-white">
      {/* Background Animation */}
      <div className="fixed inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-purple-500/20 animate-pulse" />
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
        <div className="mb-4 space-y-2 overflow-y-auto max-h-[50vh]">
          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#FF4545]"
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
              className={`text-gray-300 ${
                line.startsWith('Ikarus:') ? 'text-[#FF4545]' : ''
              }`}
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
          <div ref={historyEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent border-none outline-none text-gray-300 font-mono"
            placeholder={isLoading ? 'Waiting for response...' : 'Type your message...'}
            autoFocus
          />
        </form>

        {/* Available Commands */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 text-gray-500 text-sm"
        >
          Available commands: clear, exit
        </motion.div>
      </div>
    </div>
  );
}
