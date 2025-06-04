'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Clock, BarChart, MessageSquare, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    name: string;
    avatar_url: string;
  };
}

export default function LandingPage() {
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase
        .from('messages')
        .select(`*, sender:profiles(name, avatar_url)`)
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (showChat) {
      fetchMessages();
    }
  }, [showChat, fetchMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: session.user.id,
            receiver_id: 'support', // This should be replaced with actual support ID
          }
        ]);

      if (error) throw error;
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Chat Widget */}
      {showChat && (
        <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">Chat with Support</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === 'support' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === 'support'
                            ? 'bg-gray-100'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender_id === 'support' && (
                            <span className="text-sm font-medium">
                              {message.sender?.name || 'Support'}
                            </span>
                          )}
                        </div>
                        <p>{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Chat Bubble */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-teal-50 to-orange-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">The Future of</span>
              <span className="block bg-gradient-to-r from-purple-600 via-teal-500 to-orange-500 bg-clip-text text-transparent">HVAC Management</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              AI-powered tools and modern technology to help your HVAC business thrive in the digital age.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 md:py-4 md:text-lg md:px-10"
                >
                  Get Started Free
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/demo"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 md:py-4 md:text-lg md:px-10"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose HVAC.app?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Built for modern HVAC businesses with cutting-edge technology
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* AI-Powered Service Intelligence */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">AI-Powered Service Intelligence</h3>
                <p className="mt-2 text-base text-gray-500">
                  Smart scheduling, predictive maintenance, and intelligent service recommendations powered by AI.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Smart scheduling and routing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Predictive maintenance alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Service history analysis</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modern Customer Experience */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Modern Customer Experience</h3>
              <p className="mt-2 text-base text-gray-500">
                  Deliver exceptional service with real-time updates and seamless communication.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
                    <span className="text-sm text-gray-600">Real-time service tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
                    <span className="text-sm text-gray-600">Instant communication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-500 mr-2" />
                    <span className="text-sm text-gray-600">Digital service records</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Business Intelligence */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Business Intelligence</h3>
                <p className="mt-2 text-base text-gray-500">
                  Make data-driven decisions with powerful analytics and insights.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Customer insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm text-gray-600">Revenue optimization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              See It In Action
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Experience our platform with an interactive demo
            </p>
          </div>
          <div className="mt-12 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-[500px]"
                src="https://www.youtube.com/embed/your-demo-video"
                title="HVAC.app Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by HVAC Professionals
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Join hundreds of HVAC businesses already using our platform
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">500+</div>
                <div className="mt-2 text-sm text-gray-500">Active Businesses</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600">50K+</div>
                <div className="mt-2 text-sm text-gray-500">Services Managed</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">98%</div>
                <div className="mt-2 text-sm text-gray-500">Customer Satisfaction</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">24/7</div>
                <div className="mt-2 text-sm text-gray-500">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Choose the plan that works best for your business.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-purple-500">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-medium text-gray-900">Basic</h3>
                <p className="mt-4 text-gray-500">Perfect for small HVAC businesses</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$99</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <Link
                  href="/register?plan=basic"
                  className="mt-8 block w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white text-center px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-teal-600"
                >
                  Get Started
                </Link>
              </div>
              <div className="px-6 py-8 bg-gray-50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Service booking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Basic invoicing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Customer management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Service history</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Email notifications</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-purple-500">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-medium text-gray-900">Gold</h3>
                <p className="mt-4 text-gray-500">For growing HVAC businesses</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$249</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <Link
                  href="/register?plan=gold"
                  className="mt-8 block w-full bg-gradient-to-r from-purple-600 to-teal-500 text-white text-center px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-teal-600"
                >
                  Get Started
                </Link>
              </div>
              <div className="px-6 py-8 bg-gray-50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">All Basic features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Technician dispatch</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Work progress tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Customer chatbot</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Advanced reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Custom branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Multi-location support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Advanced scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Team management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to streamline your HVAC business?
            </h2>
            <p className="mt-4 text-lg text-purple-100">
              Join thousands of HVAC businesses already using our platform.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold">HVAC.app</h3>
              <p className="mt-4 text-gray-400">
                Streamline your HVAC business with our all-in-one platform.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-gray-400 hover:text-white">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-center">
              &copy; {new Date().getFullYear()} HVAC.app. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
