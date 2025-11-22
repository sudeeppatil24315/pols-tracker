import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Shield, TrendingUp, Users } from 'lucide-react';
import Scene3D from './Scene3D.tsx';
import Aurora from './Aurora';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {


  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Real-Time Tracking',
      description: 'Monitor your entire fleet with live GPS updates every 4 seconds',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Smart ETA Predictions',
      description: 'AI-powered arrival time estimates with traffic consideration',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Cargo Monitoring',
      description: 'Temperature tracking for refrigerated goods in real-time',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime', icon: <TrendingUp /> },
    { value: '500+', label: 'Deliveries/Day', icon: <Truck /> },
    { value: '50+', label: 'Active Drivers', icon: <Users /> },
    { value: '24/7', label: 'Support', icon: <Clock /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] text-white overflow-x-hidden">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-lg border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🐔</span>
            <div>
              <h1 className="text-xl font-bold text-[#F9D71C]">LOS POLLOS TRACKER</h1>
              <p className="text-xs text-gray-400">Taste the Family... On Time</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-[#F9D71C] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('stats')}
              className="text-gray-300 hover:text-[#F9D71C] transition-colors"
            >
              Stats
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold rounded-lg transition-all"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onGetStarted}
            className="md:hidden px-4 py-2 bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold rounded-lg transition-all"
          >
            Login
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={['#F9D71C', '#FF94B4', '#5227FF']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Scene3D />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/50 to-[#0F0F0F] z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-8xl"
              >
                🐔
              </motion.div>
            </div>

            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#F9D71C] via-yellow-300 to-[#F9D71C] bg-clip-text text-transparent">
              LOS POLLOS TRACKER
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Taste the Family... <span className="text-[#F9D71C] font-semibold">On Time</span>
            </p>

            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Enterprise-grade fleet management system with real-time GPS tracking,
              intelligent routing, and comprehensive analytics.
            </p>

            <div className="flex justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-12 py-5 bg-[#F9D71C] hover:bg-[#e5c619] text-black font-bold text-xl rounded-lg shadow-2xl shadow-[#F9D71C]/50 transition-all"
              >
                Get Started →
              </motion.button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-[#F9D71C] rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              Powerful Features for{' '}
              <span className="text-[#F9D71C]">Modern Fleets</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage, monitor, and optimize your delivery operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                  style={{
                    background: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`
                  }}
                />
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-gradient-to-r from-[#F9D71C]/10 via-yellow-500/5 to-[#F9D71C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-[#F9D71C] mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your Fleet?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join hundreds of businesses already using Los Pollos Tracker
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="px-12 py-5 bg-[#F9D71C] hover:bg-[#e5c619] text-black font-bold text-xl rounded-lg shadow-2xl shadow-[#F9D71C]/50 transition-all"
          >
            Start Tracking Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2025 Los Pollos Hermanos. All rights reserved.</p>
          <p className="text-sm">Taste the Family... On Time</p>
        </div>
      </footer>
    </div>
  );
}
