'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Calendar,
  ChevronRight,
  Star,
  CheckCircle,
  Shield,
  Award,
  User,
  MessageSquare,
  HelpCircle,
  Map,
  Send,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { AuthForm } from '@/components/auth/AuthForm';

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

export default function BusinessLandingPage() {
  const params = useParams();
  const slug = params.slug;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomerLogin, setShowCustomerLogin] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data, error } = await supabase
          .from('hvac_businesses')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) {
          setBusiness(null);
        } else {
          setBusiness(data);
        }
      } catch {
        setBusiness(null);
      }
      setLoading(false);
    }
    if (slug) fetchBusiness();
  }, [slug]);

  useEffect(() => {
    if (showChat) {
      fetchMessages();
    }
  }, [showChat]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(name, avatar_url)
        `)
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            receiver_id: 'service_provider', // This should be replaced with actual service provider ID
          }
        ]);

      if (error) throw error;
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={business.logo} alt={`${business.name} logo`} className="h-8 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFAQ(!showFAQ)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-purple-50"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </button>
              <button
                onClick={() => setShowCustomerLogin(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
              >
                <User className="h-4 w-4 mr-2" />
                Customer Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What areas do you service?</h3>
                <p className="text-gray-600">We service all areas within a 30-mile radius of our main office.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do you offer emergency services?</h3>
                <p className="text-gray-600">Yes, we provide 24/7 emergency HVAC services.</p>
              </div>
              <div>
                <h3 className="font-semibold">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, cash, and checks.</p>
              </div>
            </div>
            <button
              onClick={() => setShowFAQ(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Customer Login Modal */}
      {showCustomerLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowCustomerLogin(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <AuthForm
              onLoginSuccess={() => {
                setShowCustomerLogin(false);
                window.location.href = `/${slug}/customer/portal`;
              }}
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-teal-50 to-orange-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">{business.name}</span>
              <span className="block bg-gradient-to-r from-purple-600 via-teal-500 to-orange-500 bg-clip-text text-transparent">{business.tagline}</span>
              </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {business.description}
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                href={`/${slug}/booking`}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 md:py-4 md:text-lg md:px-10"
              >
                Book a Service
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Professional HVAC solutions for your home or business
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(business?.services ?? []).map(function(service: any) {
              return (
                <div 
                  key={service.id}
                    className={`relative group cursor-pointer ${
                      activeService === service.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setActiveService(service.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
                    <div className="relative bg-white p-6 rounded-lg shadow-xl">
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <p className="mt-2 text-base text-gray-500">{service.description}</p>
                      <p className="mt-4 text-xl font-semibold text-purple-600">{service.price}</p>
                      <div className="mt-6">
                        <Link
                  href={`/${slug}/booking?service=${service.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                    >
                      Book Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                      </div>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Professional service you can trust
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {(business?.certifications ?? []).map(function(cert: any, index: number) {
              return (
                <div key={index} className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{cert}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Customer Reviews
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              What our customers say about us
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(business?.reviews ?? []).map(function(review: any) {
              return (
                <div key={review.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
                  <div className="relative bg-white p-6 rounded-lg shadow-xl">
                    <div className="flex items-center">
                    {[...Array(5)].map(function(_: any, i: number) {
                        return (
                          <Star
                          key={i}
                          className={`h-5 w-5 ${
                              i < review.rating ? 'text-orange-500 fill-current' : 'text-gray-300'
                          }`}
                          />
                        );
                      })}
                    </div>
                    <p className="mt-4 text-gray-600">{review.comment}</p>
                    <p className="mt-4 text-sm font-medium text-gray-900">{review.author}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Get in touch with our team
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl">
          <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                      <p className="mt-1 text-gray-600">{business?.contact_phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Email</h3>
                      <p className="mt-1 text-gray-600">{business?.contact_email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Address</h3>
                      <p className="mt-1 text-gray-600">{business ? `${business.address || ''}${business.city ? ', ' + business.city : ''}${business.state ? ', ' + business.state : ''}${business.zip_code ? ' ' + business.zip_code : ''}` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-orange-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                      <p className="mt-1 text-gray-600">
                        {business?.is24_7
                          ? '24/7'
                          : business?.business_hours
                            ? Object.entries(business.business_hours)
                                .map(([day, hours]: any) =>
                                  hours.open && hours.close
                                    ? `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${hours.close}`
                                    : null
                                )
                                .filter(Boolean)
                                .join(', ')
                            : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg transform group-hover:scale-105 transition duration-300"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl h-full">
                <div className="aspect-w-16 aspect-h-9">
                  {business && (business.address || business.city || business.state || business.zip_code) ? (
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(`${business.address || ''} ${business.city || ''} ${business.state || ''} ${business.zip_code || ''}`)}&output=embed`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
                      No address available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      {showChat && (
        <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          <div className="bg-gradient-to-r from-purple-600 to-teal-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">Chat with Us</h3>
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
                        message.sender_id === 'service_provider' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === 'service_provider'
                            ? 'bg-gray-100'
                            : 'bg-gradient-to-r from-purple-600 to-teal-500 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender_id === 'service_provider' && (
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
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg px-4 py-2 hover:from-purple-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-full p-4 shadow-lg hover:from-purple-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
} 