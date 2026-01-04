import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowRight, Sparkles, Zap, Shield, Layers, Target, Clock, 
  CheckCircle2, Play, Star, ChevronLeft, ChevronRight, 
  Palette, Type, Brain, Wand2, Image, MousePointer,
  Rocket, Globe, Award, TrendingUp, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7 }
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Hero carousel slides
const heroSlides = [
  {
    title: "AI-Powered Creative Studio",
    subtitle: "Design stunning ads in minutes",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    title: "Multi-Format Export",
    subtitle: "One design, infinite platforms",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    accent: "from-purple-500 to-pink-500",
  },
  {
    title: "Brand Compliance",
    subtitle: "Auto-validate retailer guidelines",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    accent: "from-orange-500 to-red-500",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "18 AI Engines",
    description: "Specialized AI engines work together like a creative agency—from layout to compliance.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Auto-Compliance",
    description: "Real-time validation against retailer guidelines. No more rejections.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    title: "Multi-Format",
    description: "One design, infinite formats. Instagram, Facebook, in-store—all optimized.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Minutes, Not Days",
    description: "Generate campaign-ready creatives in under 5 minutes. 100x faster.",
    color: "from-orange-500 to-amber-500",
  },
];

const stats = [
  { value: "100x", label: "Faster Production", icon: Rocket },
  { value: "18", label: "AI Engines", icon: Brain },
  { value: "12+", label: "Ad Formats", icon: Layers },
  { value: "99%", label: "Compliance Rate", icon: Shield },
];

const aiEngines = [
  { name: "Brand DNA", icon: Palette, desc: "Extract brand identity" },
  { name: "AutoLayout", icon: Layers, desc: "Smart positioning" },
  { name: "Compliance", icon: Shield, desc: "Retailer validation" },
  { name: "Copywriting", icon: Type, desc: "AI-generated copy" },
  { name: "Background Gen", icon: Image, desc: "AI backgrounds" },
  { name: "Format Transform", icon: Globe, desc: "Multi-format export" },
  { name: "Attention Sim", icon: Eye, desc: "Heatmap analysis" },
  { name: "Performance", icon: TrendingUp, desc: "Predict metrics" },
  { name: "Typography", icon: Type, desc: "Font harmony" },
  { name: "Color Harmony", icon: Palette, desc: "Color psychology" },
  { name: "Scene Builder", icon: Wand2, desc: "Scene generation" },
  { name: "Multiverse Gen", icon: Sparkles, desc: "Infinite variations" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow",
    quote: "Creato-Sphere cut our creative production time by 90%. What took days now takes minutes.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Michael Roberts",
    role: "Creative Lead",
    company: "BrandHouse",
    quote: "The AI engines understand our brand better than most human designers. Incredible results.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Emily Watson",
    role: "E-commerce Manager",
    company: "ShopNow",
    quote: "99% compliance rate on first submission. No more back-and-forth with retailers.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Creato-Sphere</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "AI Engines", "Testimonials"].map((item) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors font-medium"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-6 shadow-lg shadow-teal-500/25"
                >
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Carousel */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/40 to-cyan-200/40 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-left relative z-10"
            >
              {/* Floating Badge */}
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full border border-teal-200/50 mb-6"
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-teal-500"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-teal-700">AI-Powered Creative Platform</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
              >
                <span className="text-gray-900">We use AI to build</span>{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">stunning creatives</span>{" "}
                <span className="text-gray-900">and</span>{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">ad campaigns</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 max-w-xl mb-8 leading-relaxed"
              >
                Generate retailer-compliant, multi-format ad creatives in minutes with a proven track record of over{" "}
                <span className="font-semibold text-gray-900">500</span> successful projects.
              </motion.p>

              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-8">
                {[
                  { icon: Award, text: "Gold Agency", color: "bg-amber-50 border-amber-200 text-amber-700" },
                  { icon: Star, text: "110+ Reviews", color: "bg-teal-50 border-teal-200 text-teal-700" },
                  { icon: Star, text: "4.9 Rating", color: "bg-purple-50 border-purple-200 text-purple-700" },
                ].map((badge, index) => (
                  <motion.div 
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${badge.color}`}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <badge.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-8">
                <Link to="/auth">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-full px-8 py-6 text-lg shadow-2xl shadow-teal-500/30 group"
                    >
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      LET'S CREATE
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="rounded-full px-8 py-6 text-lg border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50/50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Speed Badge */}
              <motion.div 
                variants={fadeInUp} 
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50 w-fit"
              >
                <span className="text-3xl">🔥</span>
                <div>
                  <span className="text-gray-900 font-bold text-lg">Up to 10x</span>{" "}
                  <span className="text-orange-600 font-medium">faster and cheaper</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Carousel */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="relative">
                {/* Main Browser Window */}
                <motion.div 
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl shadow-gray-900/50"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-gray-700/50 rounded-lg h-7 ml-4 flex items-center px-3">
                      <span className="text-xs text-gray-400">creato-sphere.com/studio</span>
                    </div>
                  </div>
                  
                  {/* Carousel Content */}
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden aspect-[4/3]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent z-10" />
                        <img 
                          src={heroSlides[currentSlide].image} 
                          alt={heroSlides[currentSlide].title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h3 className={`text-2xl font-bold text-white mb-2 bg-gradient-to-r ${heroSlides[currentSlide].accent} bg-clip-text text-transparent`}>
                              {heroSlides[currentSlide].title}
                            </h3>
                            <p className="text-gray-300">{heroSlides[currentSlide].subtitle}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel Navigation */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-30">
                      <motion.button 
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-30">
                      <motion.button 
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIsAutoPlaying(false);
                            setCurrentSlide(index);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                              ? 'w-8 bg-white' 
                              : 'w-2 bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Floating Tool Icons */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-3">
                    {[MousePointer, Palette, Type, Image].map((Icon, index) => (
                      <motion.div
                        key={index}
                        className="w-10 h-10 rounded-xl bg-gray-700/80 backdrop-blur-sm flex items-center justify-center text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(20, 184, 166, 0.3)" }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div 
                  className="absolute -right-4 top-1/4 z-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Target className="w-8 h-8 text-teal-500" />
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="absolute -left-6 bottom-1/4 z-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>

                {/* Watch Video Button */}
                <motion.div 
                  className="absolute -bottom-4 right-8 z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button 
                    className="flex items-center gap-3 bg-white rounded-full pl-2 pr-6 py-2 shadow-xl border border-gray-100"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </motion.div>
                    <span className="text-gray-900 font-semibold">Watch video</span>
                  </motion.button>
                </motion.div>

                {/* 3D Cursor */}
                <motion.div 
                  className="absolute bottom-20 left-1/3"
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="50" height="60" viewBox="0 0 50 60" fill="none" className="drop-shadow-xl">
                    <path d="M5 5L45 25L25 30L20 55L5 5Z" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <stat.icon className="w-7 h-7 text-teal-500" />
                </motion.div>
                <motion.div 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              ✨ Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Intelligent</span>{" "}
              <span className="text-gray-900">Creative Automation</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From brand analysis to compliant export, every step is AI-powered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group"
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-white via-teal-50/30 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 border-2 border-dashed border-teal-200 rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-dashed border-cyan-200 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              🚀 How it Works
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-gray-900">From Upload to</span>{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Campaign-Ready</span>
            </h2>
            <p className="text-gray-600 text-lg">Complete workflow in under 5 minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal-300 via-purple-300 to-pink-300" />

            {[
              {
                step: "01",
                title: "Upload & Configure",
                description: "Upload your product image, select campaign type, and let AI extract your brand DNA.",
                time: "30 sec",
                icon: Image,
                color: "from-teal-500 to-emerald-500",
              },
              {
                step: "02",
                title: "AI Generates Options",
                description: "18 AI engines create 20+ style variations with optimal layouts and copy.",
                time: "90 sec",
                icon: Sparkles,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Validate & Export",
                description: "Real-time compliance checking, multi-format export, all under 500KB.",
                time: "45 sec",
                icon: CheckCircle2,
                color: "from-orange-500 to-red-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 relative overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Large Step Number Background */}
                <div className="absolute top-0 right-0 font-bold text-[120px] text-gray-50 leading-none select-none pointer-events-none group-hover:text-gray-100 transition-colors">
                  {item.step}
                </div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-mono font-bold text-teal-600">{item.time}</span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engines Section */}
      <section id="ai-engines" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              🤖 AI Technology
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">18 AI Engines</span>{" "}
              <span className="text-gray-900">Working Together</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each engine is a specialist—together they form your autonomous creative department
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aiEngines.map((engine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group cursor-default"
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-100 group-hover:to-cyan-100 transition-all"
                    whileHover={{ rotate: 5 }}
                  >
                    <engine.icon className="w-6 h-6 text-teal-500" />
                  </motion.div>
                  <span className="text-sm font-semibold text-gray-800 block mb-1">{engine.name}</span>
                  <span className="text-xs text-gray-500">{engine.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              💬 Testimonials
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-gray-900">Loved by</span>{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Creative Teams</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-teal-500/30"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <motion.div 
                className="absolute -top-20 -right-20 w-80 h-80 border-4 border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-60 h-60 border-4 border-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-white/30 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Ready to Transform Your Creative Workflow?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join 500+ brands creating stunning, compliant ad campaigns in minutes
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="lg" 
                        className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold shadow-xl"
                      >
                        Start Creating Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white rounded-full px-10 py-7 text-lg font-semibold"
                    >
                      Book a Demo
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Creato-Sphere</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered creative platform for building stunning ad campaigns in minutes.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Features", "AI Engines", "Pricing", "Integrations"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Status", "API Docs"] },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2024 Creato-Sphere. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
