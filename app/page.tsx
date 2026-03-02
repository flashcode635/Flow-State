
import { Metadata } from 'next'
import Link from 'next/link'
import { Flame, Target,  CheckCircle, Calendar, ArrowRight, BarChart3, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Flow State - Master Your Daily Habits & Transform Your Life',
  description: 'Track daily routines, build lasting habits, and achieve your goals with our intelligent habit tracking system. Join 10K+ users transforming their lives.',
  keywords: ['habit tracking', 'daily routine', 'goal setting', 'productivity', 'personal development', 'Flow State'],
  authors: [{ name: 'Flow State Team' }],
  openGraph: {
    title: 'Flow State - Master Your Daily Habits',
    description: 'Transform your habits and achieve your goals with intelligent daily tracking.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flow State - Master Your Daily Habits',
    description: 'Transform your habits and achieve your goals with intelligent daily tracking.',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-amber-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-white">Flow State</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-300 hover:text-orange-400 transition-colors">Features</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-orange-400 transition-colors">Testimonials</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-orange-400 transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/signin" className="text-gray-300 hover:text-orange-400 transition-colors">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/20 border border-amber-800/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Trusted by 10,000+ users</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500">
              Daily Routine
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed" >
            Transform your habits, track your progress, and achieve your goals with our intelligent daily Flow State. Build consistency and unlock your full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup" className="px-8 py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="px-8 py-4 border border-amber-800/50 text-orange-300 rounded-lg font-semibold hover:bg-amber-900/20 transition-all">
              View Demo
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Exclusive early access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transform Your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500">
                Habits
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to help you build lasting habits and achieve your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-800/50 border border-amber-900/20 rounded-xl hover:border-orange-800/40 transition-all group">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Daily Progress Tracking</h3>
              <p className="text-gray-300 leading-relaxed">
                Track your daily habits with visual progress indicators and streaks. Stay motivated with detailed analytics and insights.
              </p>
            </div>
            
            <div className="p-6 bg-slate-800/50 border border-amber-900/20 rounded-xl hover:border-orange-800/40 transition-all group">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Insights</h3>
              <p className="text-gray-300 leading-relaxed">
                Get AI-powered recommendations based on your patterns. Understand your habits better with detailed analytics.
              </p>
            </div>
            
            <div className="p-6 bg-slate-800/50 border border-amber-900/20 rounded-xl hover:border-orange-800/40 transition-all group">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Goal Setting</h3>
              <p className="text-gray-300 leading-relaxed">
                Set SMART goals and track your progress. Break down big goals into manageable daily actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section not included right now */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 mb-2">
                10K+
              </div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 mb-2">
                500K+
              </div>
              <div className="text-gray-300">Habits Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 mb-2">
                95%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 mb-2">
                1M+
              </div>
              <div className="text-gray-300">Daily Check-ins</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to elevate your
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500">
              lifestyle?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of users who have transformed their daily routines and achieved their goals. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all transform hover:scale-105">
              Start Free Trial
            </Link>
            <button className="px-8 py-4 border border-amber-800/50 text-orange-300 rounded-lg font-semibold hover:bg-amber-900/20 transition-all">
              Download E-book
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xl font-bold text-white">Flow State</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <span>© 2024 Flow State. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
