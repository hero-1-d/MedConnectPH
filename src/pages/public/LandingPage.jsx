import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Calendar, Heart, Shield, Users, BarChart3, MessageCircle,
  ArrowRight, CheckCircle, Star, Quote, Phone, Mail, MapPin
} from 'lucide-react'
import Navbar from '../../components/layouts/Navbar.jsx'

const LandingPage = () => {
  const features = [
    { icon: Calendar, title: 'Easy Scheduling', description: 'Book, reschedule, or cancel appointments with just a few clicks. View real-time availability.' },
    { icon: Heart, title: 'Mood Tracking', description: 'Log your daily mood and track patterns over time with visual charts and insights.' },
    { icon: Shield, title: 'Crisis Support', description: 'Immediate access to crisis resources and emergency hotlines when you need them most.' },
    { icon: Users, title: 'Expert Counselors', description: 'Connect with licensed professionals specializing in various mental health areas.' },
    { icon: BarChart3, title: 'Progress Insights', description: 'Track your mental health journey with data-driven insights and personalized recommendations.' },
    { icon: MessageCircle, title: 'Secure Communication', description: 'Private and confidential messaging with your counselor between sessions.' },
  ]

  const testimonials = [
    { name: 'Alex Thompson', role: 'Computer Science Student', content: 'MindConnect made it so easy to find a counselor who understands academic stress. The mood tracker helps me stay aware of my mental state.', rating: 5 },
    { name: 'Maria Garcia', role: 'Psychology Student', content: 'As someone studying psychology, I appreciate how well-designed this platform is. The crisis support feature is especially important.', rating: 5 },
    { name: 'Jordan Lee', role: 'Engineering Student', content: 'The appointment scheduling is seamless. I was able to book a session within minutes and got approved the same day.', rating: 4 },
  ]

  const stats = [
    { value: '500+', label: 'Students Helped' },
    { value: '15+', label: 'Expert Counselors' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Crisis Support' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-mental-health">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Your Mental Health Matters
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                Mental Health Support,{' '}
                <span className="text-gradient">Just a Click Away</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                MindConnect connects university students with professional counselors, provides mental health resources, and offers crisis support — all in one secure platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-4">
                  Sign In
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-wellness-500" />Free for Students</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-wellness-500" />HIPAA Compliant</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-wellness-500" />24/7 Support</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-soft-lg">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop" alt="Student counseling session" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-wellness-100 dark:bg-wellness-900/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-wellness-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Mood Improved</p>
                  <p className="text-xs text-gray-500">After 3 sessions</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white dark:border-gray-800" />)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">500+ Students</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Everything You Need for <span className="text-gradient">Better Mental Health</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to prioritize your mental well-being.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="card card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              How <span className="text-gradient">MindConnect</span> Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your university email in seconds.' },
              { step: '02', title: 'Find a Counselor', desc: 'Browse profiles and find the right match for you.' },
              { step: '03', title: 'Book Session', desc: 'Choose a convenient time from their availability.' },
              { step: '04', title: 'Start Healing', desc: 'Attend your session and begin your wellness journey.' },
            ].map((item, index) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              What Students <span className="text-gradient">Say</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="card">
                <Quote className="w-8 h-8 text-primary-200 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-semibold">{testimonial.name.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
                About <span className="text-gradient">MindConnect</span>
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>MindConnect was developed in partnership with the University Counseling Center to address the growing mental health needs of students. We believe that every student deserves access to quality mental health support.</p>
                <p>Our platform combines technology with compassionate care, making it easier than ever to connect with licensed professionals, track your mental health journey, and access resources that empower you to thrive.</p>
                <p>Whether you are dealing with stress, anxiety, depression, or just need someone to talk to, MindConnect is here to support you every step of the way.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle className="w-5 h-5 text-wellness-500" />Licensed Professionals</div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle className="w-5 h-5 text-wellness-500" />Confidential & Secure</div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle className="w-5 h-5 text-wellness-500" />Evidence-Based Care</div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle className="w-5 h-5 text-wellness-500" />Student-Focused</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-soft-lg">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" alt="Students studying together" className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Have questions? We are here to help.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
              <p className="text-sm text-gray-500">(555) 123-4567</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
              <p className="text-sm text-gray-500">support@mindconnect.edu</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
              <p className="text-sm text-gray-500">Student Wellness Center</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Ready to Prioritize Your <span className="text-gradient">Mental Health</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of students who have taken the first step toward better mental wellness. It is free, confidential, and easy to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/login" className="btn-outline text-lg px-8 py-4">
                Already a Member? Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-display font-bold">MindConnect</span>
              </div>
              <p className="text-sm text-gray-400">Empowering students to prioritize their mental health through accessible, professional support.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mental Health Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Crisis Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Self-Help Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href="tel:988" className="hover:text-white transition-colors">988 Suicide Hotline</a></li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /><a href="tel:911" className="hover:text-white transition-colors">911 Emergency</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p> MindConnect. All rights reserved. A university mental health initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
