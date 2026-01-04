import { motion, AnimatePresence, type Variants, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, Sparkles, Zap, Shield, Layers, Target, Clock, 
  CheckCircle2, Play, Star, ChevronLeft, ChevronRight, 
  Palette, Type, Brain, Wand2, Image, MousePointer,
  Rocket, Globe, Award, TrendingUp, Eye, Users, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { VideoModal } from "@/components/VideoModal";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";

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

const howItWorks = [
  {
    step: "01",
    title: "Upload Your Assets",
    description: "Drop in your product images, logos, and brand guidelines. Our AI instantly understands your brand.",
    icon: Image,
    color: "from-teal-500 to-emerald-500",
  },
  {
    step: "02",
    title: "AI Generates Options",
    description: "18 specialized AI engines work together to create dozens of compliant variations.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "03",
    title: "Fine-tune & Export",
    description: "Make quick edits, then export to all platforms with one click. Production-ready in minutes.",
    icon: Rocket,
    color: "from-orange-500 to-amber-500",
  },
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

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
      {/* Video Modal */}
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

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

      {/* Hero Section */}
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
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-left relative z-10"
            >
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
              >
                <span className="text-gray-900">We use AI to build</span>{" "}
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">stunning creatives</span>{" "}
                <span className="text-gray-900">and</span>{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">ad campaigns</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-gray-600 max-w-xl mb-8 leading-relaxed"
              >
                Generate retailer-compliant, multi-format ad creatives in minutes with a proven track record of over{" "}
                <span className="font-semibold text-gray-900">500</span> successful projects.
              </motion.p>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 mb-8"
              >
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mb-8"
              >
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
                    onClick={() => setShowVideoModal(true)}
                    className="rounded-full px-8 py-6 text-lg border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50/50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Speed Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
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
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative">
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 z-20 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/30"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

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
                          className={`transition-all duration-300 rounded-full ${
                            index === currentSlide 
                              ? "w-8 h-2 bg-white" 
                              : "w-2 h-2 bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Watch Video Button */}
                  <motion.button
                    onClick={() => setShowVideoModal(true)}
                    className="absolute bottom-6 right-6 z-30 flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </motion.div>
                    <span className="text-gray-900 font-medium pr-2">Watch video</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-teal-200 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full text-teal-600 text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4" />
                Features
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything you need to
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent"> create faster</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform combines 18 specialized engines to automate your creative workflow.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 shadow-sm hover:shadow-xl transition-all h-full"
                  whileHover={{ y: -8 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-4 h-4" />
                How it Works
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Three steps to
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> amazing creatives</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.15}>
                <motion.div
                  className="relative"
                  whileHover={{ y: -5 }}
                >
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />
                  )}
                  
                  <div className="relative p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-bold text-gray-100 absolute top-6 right-6">{step.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engines Section */}
      <section id="ai-engines" className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-4 border border-teal-500/30"
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="w-4 h-4" />
                AI Engines
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                18 Specialized
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"> AI Engines</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Each engine is a specialist, working together like a full creative agency.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {aiEngines.map((engine, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <motion.div
                  className="group p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800 transition-all"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <engine.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{engine.name}</h3>
                  <p className="text-sm text-gray-500">{engine.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4" />
                Testimonials
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Loved by
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> creative teams</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-8 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-100"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
              <Rocket className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your creative workflow?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 500+ brands already using Creato-Sphere to create stunning, compliant ads in minutes.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/auth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-10 py-6 text-lg shadow-2xl group"
                  >
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowVideoModal(true)}
                  className="border-2 border-white/50 text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">Creato-Sphere</span>
            </div>
            
            <div className="flex items-center gap-8">
              {["Features", "How it Works", "AI Engines", "Testimonials"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="text-sm text-gray-500">
              © 2024 Creato-Sphere. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
