import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Layers, Target, Clock, CheckCircle2, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const features = [
  {
    icon: Sparkles,
    title: "18 AI Engines",
    description: "Specialized AI engines work together like a creative agency—from layout to compliance.",
  },
  {
    icon: Shield,
    title: "Auto-Compliance",
    description: "Real-time validation against retailer guidelines. No more rejections.",
  },
  {
    icon: Layers,
    title: "Multi-Format",
    description: "One design, infinite formats. Instagram, Facebook, in-store—all optimized.",
  },
  {
    icon: Zap,
    title: "Minutes, Not Days",
    description: "Generate campaign-ready creatives in under 5 minutes. 100x faster.",
  },
];

const stats = [
  { value: "100x", label: "Faster Production" },
  { value: "18", label: "AI Engines" },
  { value: "12+", label: "Ad Formats" },
  { value: "99%", label: "Compliance Rate" },
];

const trustedBy = [
  "Bubble Gold Agency",
  "110+ Reviews",
  "4.9 Rating",
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Creato-Sphere</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#engines" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">AI Engines</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="sm" 
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Zeroqode Style */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-left"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-gray-900">We use AI to build</span>{" "}
                <span className="text-teal-500">stunning creatives</span>{" "}
                <span className="text-gray-900">and</span>{" "}
                <span className="text-cyan-500">ad campaigns</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 max-w-xl mb-8"
              >
                Generate retailer-compliant, multi-format ad creatives in minutes with a proven track record of over{" "}
                <span className="font-semibold text-gray-900">500</span> successful projects.
              </motion.p>

              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-8">
                {trustedBy.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-gray-700">{badge}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-8">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6 text-lg group"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    LET'S CREATE
                  </Button>
                </Link>
              </motion.div>

              {/* Speed Badge */}
              <motion.div variants={fadeInUp} className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-gray-900 font-semibold">Up to 10x</span>
                <span className="text-teal-500">faster and cheaper</span>
              </motion.div>
            </motion.div>

            {/* Right - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 ml-4 flex items-center px-3">
                    <span className="text-xs text-gray-400">creato-sphere.com</span>
                  </div>
                </div>
                
                {/* App Preview */}
                <div className="bg-gray-900 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500"></div>
                      <span className="text-white font-semibold">Turn Your Idea</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-700"></div>
                      <div className="w-8 h-8 rounded bg-gray-700"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl text-white font-bold">into Reality</h3>
                  <p className="text-gray-400">with Creato-Sphere</p>
                  
                  {/* Floating Elements */}
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                      <Target className="w-8 h-8 text-teal-500" />
                    </div>
                  </div>
                </div>

                {/* Watch Video Button */}
                <motion.div 
                  className="absolute bottom-20 right-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <button className="flex items-center gap-3 bg-white rounded-full pl-4 pr-6 py-3 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-gray-900 font-medium">Watch video</span>
                  </button>
                </motion.div>

                {/* 3D Cursor */}
                <motion.div 
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
                    <path d="M4 4L36 20L20 24L16 44L4 4Z" fill="white" stroke="gray" strokeWidth="2"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Intelligent</span>{" "}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-teal-500" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-white via-teal-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gray-900">From Upload to</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">Campaign-Ready</span>
            </h2>
            <p className="text-gray-600 text-lg">Complete workflow in under 5 minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Configure",
                description: "Upload your product image, select campaign type, and let AI extract your brand DNA.",
                time: "30 sec",
              },
              {
                step: "02",
                title: "AI Generates Options",
                description: "18 AI engines create 20+ style variations with optimal layouts and copy.",
                time: "90 sec",
              },
              {
                step: "03",
                title: "Validate & Export",
                description: "Real-time compliance checking, multi-format export, all under 500KB.",
                time: "45 sec",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 relative overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="absolute top-0 right-0 font-bold text-9xl text-gray-100 -mt-4 -mr-4">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-mono text-teal-500">{item.time}</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Engines Preview */}
      <section id="engines" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">18 AI Engines</span>{" "}
              <span className="text-gray-900">Working Together</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each engine is a specialist—together they form your autonomous creative department
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Brand DNA", "AutoLayout", "Compliance", "Copywriting",
              "Background Gen", "Format Transform", "Attention Sim", "Performance",
              "Typography", "Color Harmony", "Scene Builder", "Multiverse Gen",
            ].map((engine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-teal-300 hover:shadow-md transition-all cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-teal-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{engine}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Creative Workflow?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join the AI creative revolution. Generate stunning ad creatives in minutes, not days.
              </p>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-teal-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg group"
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Creato-Sphere</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Creato-Sphere. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
