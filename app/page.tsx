'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { 
  Sparkles, 
  Code, 
  Zap, 
  Rocket, 
  Brain, 
  Palette,
  ArrowRight,
  Github,
  Star,
  Play,
  CheckCircle2,
  Globe,
  Layers,
  Lightbulb,
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Transform your ideas into fully functional React applications using advanced Cerebras AI models.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Code,
      title: 'Clean Code Output',
      description: 'Generate production-ready, well-structured code with modern React patterns and TypeScript.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Palette,
      title: 'Beautiful UI/UX',
      description: 'Every generated app comes with responsive design and beautiful Tailwind CSS styling.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Rocket,
      title: 'Instant Deployment',
      description: 'Deploy your generated applications to Vercel with a single click.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Built-in security best practices and authentication systems for professional applications.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Every generated app is fully responsive and optimized for mobile devices and tablets.',
      color: 'from-teal-500 to-blue-500',
    },
  ];

  const benefits = [
    'No coding experience required',
    'Production-ready applications',
    'Modern React & TypeScript',
    'Responsive design included',
    'One-click deployment',
    'Built-in authentication',
    'SEO optimized',
    'Database integration',
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <Sparkles className="h-10 w-10 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gradient">AI App Builder</span>
                <div className="text-xs text-muted-foreground font-medium">Powered by AI</div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-primary/10 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="btn-gradient shadow-glow">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Build Apps with{' '}
                <span className="text-gradient bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                Transform your ideas into fully functional React applications using natural language.
                No coding experience required - just describe what you want to build and watch the magic happen.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/auth/register">
                <Button size="lg" className="btn-gradient text-lg px-8 py-4 shadow-glow hover:shadow-glow-lg">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-primary/5">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Apps Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5K+</div>
                <div className="text-muted-foreground">Happy Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </motion.div>

            {/* Enhanced Demo Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <div className="relative flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <Zap className="h-20 w-20 text-primary mx-auto animate-float" />
                        <div className="absolute inset-0 h-20 w-20 bg-primary/20 rounded-full animate-ping mx-auto"></div>
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">Interactive Demo</h3>
                      <p className="text-gray-300 text-lg">Experience the power of AI-driven development</p>
                      <Button className="mt-4 btn-gradient">
                        <Play className="mr-2 h-4 w-4" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Star className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Why Choose Us</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Powerful <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to build modern web applications with AI assistance.
              From concept to deployment in minutes, not hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-3xl glass-effect-strong card-hover-intense card-glow h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <CheckCircle2 className="h-4 w-4 text-success mr-2" />
              <span className="text-sm font-medium text-success">Everything Included</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What You Get with <span className="text-gradient">Every App</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              No hidden costs, no additional setup required. Everything you need is included from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center p-4 rounded-xl glass-effect-subtle hover:glass-effect transition-all duration-300 group"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-foreground group-hover:text-success transition-colors duration-300">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              See It in <span className="text-gradient">Action</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Watch how AI transforms your ideas into functional applications in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 blur-3xl transform scale-110"></div>
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-full flex items-center justify-center border border-gray-700/50">
                <div className="text-center">
                  <motion.div
                    className="relative mb-8"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="h-12 w-12 text-white ml-1" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  </motion.div>
                  <h3 className="text-white text-3xl font-bold mb-4">Interactive Demo</h3>
                  <p className="text-gray-300 text-lg mb-6">Experience the magic of AI-powered development</p>
                  <Button className="btn-gradient text-lg px-8 py-4">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of developers who are already building with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Trusted by 10,000+ developers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t glass-effect py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-semibold">AI App Builder</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 AI App Builder. Built with ❤️ and AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}