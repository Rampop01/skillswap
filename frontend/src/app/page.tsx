"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Sparkles, 
  Users, 
  Handshake, 
  Award, 
  Search, 
  Plus,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)

  const features = [
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Peer Gateways",
      description: "Connect directly with skilled individuals for mutual exchange."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Reputation System",
      description: "Build your reputation through verified skill exchanges."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Blockchain-powered security on Hedera network."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast & Low Cost",
      description: "Lightning-fast transactions with minimal fees."
    },
  ]

  const stats = [
    { value: "0", label: "Active Users" },
    { value: "0", label: "Skill Listings" },
    { value: "0", label: "Completed Trades" },
    { value: "100%", label: "User Satisfaction" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.7) contrast(1.1) saturate(1.2)' }}
      >
        <source src="https://res.cloudinary.com/dxswouxj5/video/upload/v1761270457/6913299_Motion_Graphics_Motion_Graphic_1080x1920_u1bpqe.mp4" type="video/mp4" />
      </video>
      
      {/* Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer z-[1] pointer-events-none" 
           style={{ 
             animation: 'shimmer 3s infinite',
             backgroundPosition: '-200% 0'
           }}></div>
      
      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-black/20 via-transparent to-black/40">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white font-medium">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Trade Skills,
            <br />
            Not Money
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The decentralized platform where talent meets talent. Exchange your skills 
            directly with others and earn NFT proof of your achievements on Hedera.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/skills"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Browse Skills
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose SkillSwap?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built on Hedera's eco-friendly blockchain for fast, secure skill exchanges.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Obtaining a skilled trade is simple and straightforward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: "1", title: "Register", description: "Create your profile with skills you offer and want" },
            { step: "2", title: "Browse & Match", description: "Find skill listings that match your interests" },
            { step: "3", title: "Exchange & Earn", description: "Complete the skill exchange and earn NFT proof" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Swapping Skills?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the SkillSwap community and start trading your expertise today.
          </p>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Built on Hedera Hashgraph • Contract: 0.0.7137731
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
