import React from 'react'
import { motion } from 'framer-motion'

export default function ZimaBlueWebsite() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-white font-sans">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#64ffda]">Zima Blue</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#about" className="hover:text-[#64ffda] transition-colors">About</a></li>
            <li><a href="#gallery" className="hover:text-[#64ffda] transition-colors">Gallery</a></li>
            <li><a href="#journey" className="hover:text-[#64ffda] transition-colors">Journey</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section id="hero" className="py-20 text-center">
          <motion.h2 
            className="text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Universe in Blue
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore the artistic journey of Zima Blue, from cosmic murals to the essence of existence.
          </motion.p>
          <motion.div 
            className="w-40 h-40 bg-[#64ffda] mx-auto rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          />
        </section>

        <section id="about" className="py-20">
          <h3 className="text-4xl font-bold mb-6">About Zima Blue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-lg">
              Zima Blue, once the universe's most celebrated artist, created vast cosmic murals that captivated galaxies. His journey of self-discovery led him back to his origins, finding profound meaning in simplicity.
            </p>
            <div className="bg-[#112240] p-6 rounded-lg">
              <h4 className="text-2xl font-bold mb-4">Artistic Evolution</h4>
              <ul className="list-disc list-inside">
                <li>Cosmic Murals</li>
                <li>Galactic Installations</li>
                <li>Minimalist Blue Squares</li>
                <li>The Ultimate Pool Tile</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20">
          <h3 className="text-4xl font-bold mb-6">Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-[#112240] rounded-lg overflow-hidden">
                <div className="w-full h-full bg-[#64ffda] opacity-80" />
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="py-20">
          <h3 className="text-4xl font-bold mb-6">The Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#64ffda]" />
            {['Cosmic Beginnings', 'Galactic Fame', 'Introspection', 'Return to Origin'].map((stage, index) => (
              <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <motion.div 
                  className="w-64 bg-[#112240] p-4 rounded-lg"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-xl font-bold mb-2">{stage}</h4>
                  <p>A pivotal moment in Zima Blue's artistic and personal evolution.</p>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#112240] py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Zima Blue Experience. All rights reserved.</p>
      </footer>
    </div>
  )
}

