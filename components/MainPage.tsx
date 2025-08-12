import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Sparkles, Zap, Star, Shield, Palette, Globe, Users, CheckCircle, Play, Link, Brush, Layout, BarChart3 } from 'lucide-react';

interface MainPageProps {
  onGetStarted: () => void;
}

export function MainPage({ onGetStarted }: MainPageProps) {
  const features = [
    {
      icon: Palette,
      title: "Unlimited Customization",
      description: "Choose from modern, minimalist, bold, professional, and creative themes with full design control",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description: "Optimized for speed with instant loading and smooth interactions that engage your audience",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with 99.9% uptime guarantee. Your data and links are completely secure",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, views, and engagement with detailed insights to optimize your biolink performance",
      color: "from-blue-500 to-indigo-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "1 biolink", 
        "Basic customization", 
        "5 social links", 
        "stolen.bio subdomain",
        "Basic themes",
        "Community support"
      ],
      popular: false,
      description: "Perfect for getting started"
    },
    {
      name: "Premium",
      price: "$9",
      period: "/month", 
      features: [
        "Unlimited biolinks", 
        "Advanced customization", 
        "Unlimited social links", 
        "Custom domain support",
        "Premium themes & effects",
        "Background media support",
        "Advanced analytics",
        "Custom badges",
        "Avatar decorations",
        "Priority support"
      ],
      popular: true,
      description: "Everything you need to stand out"
    }
  ];

  const styleCategories = [
    { name: "Modern", icon: Layout, count: "50+ themes" },
    { name: "Creative", icon: Brush, count: "40+ themes" },
    { name: "Professional", icon: Users, count: "35+ themes" },
    { name: "Minimalist", icon: Sparkles, count: "25+ themes" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Accent lines */}
        <motion.div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent opacity-20"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-20"
          animate={{ opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 p-6 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Link className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            stolen.bio
          </span>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Pricing
          </button>
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
          >
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300 px-4 py-2 text-lg">
              🚀 All Design Styles Available
            </Badge>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-white">Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 relative">
              Perfect
              <motion.span
                className="absolute -inset-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 blur-xl rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Biolink
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Create stunning, professional biolinks with any style you can imagine.
            <br />
            <span className="text-xl text-slate-400">
              From minimalist to bold, modern to creative - we have it all.
            </span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onGetStarted}
              className="group relative px-10 py-5 text-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="relative z-10 flex items-center">
                Start Creating
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 text-xl font-semibold border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200 rounded-xl transition-all duration-300 flex items-center gap-3"
            >
              <Star className="w-5 h-5" />
              View Pricing
            </Button>
          </motion.div>

          {/* Style categories */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {styleCategories.map((style, index) => (
              <div key={index} className="text-center p-4 bg-slate-800/30 backdrop-blur-sm border border-emerald-500/20 rounded-xl">
                <style.icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-white font-semibold">{style.name}</div>
                <div className="text-slate-400 text-sm">{style.count}</div>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                100K+
              </div>
              <div className="text-slate-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                5M+
              </div>
              <div className="text-slate-400 text-sm">Links Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                150+
              </div>
              <div className="text-slate-400 text-sm">Design Styles</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> stolen.bio</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Professional biolinks with enterprise-grade features and unlimited creativity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pricing</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex"
              >
                <Card className={`relative w-full ${plan.popular ? 'border-emerald-500 shadow-emerald-500/20 shadow-2xl scale-105' : 'border-slate-600'} bg-slate-800/50 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-slate-400 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                          {plan.price}
                        </span>
                        <span className="text-slate-400 ml-1">{plan.period}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-slate-300">
                          <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={onGetStarted}
                      className={`w-full ${plan.popular 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      } transition-all duration-300`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Free' ? 'Start Free' : 'Upgrade to Premium'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-6xl font-bold text-white mb-8">
              Ready to build your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> perfect biolink</span>?
            </h2>
            <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
              Join thousands of professionals who trust stolen.bio for their digital presence
            </p>
            <Button
              onClick={onGetStarted}
              className="group relative px-12 py-6 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                Start Building Now
                <Sparkles className="ml-3 w-7 h-7 group-hover:rotate-12 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Link className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                stolen.bio
              </span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 stolen.bio. Empowering digital creators worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}