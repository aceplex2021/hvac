import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function AuthForm({ compact = false, onLoginSuccess }: { compact?: boolean, onLoginSuccess?: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp, user } = useAuth()
  const router = useRouter()
  const [pendingRedirect, setPendingRedirect] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log('AuthForm: handleSubmit called', { email, password, isSignUp })

    try {
      if (isSignUp) {
        console.log('AuthForm: calling signUp')
        await signUp(email, password)
        console.log('AuthForm: signUp success')
      } else {
        console.log('AuthForm: calling signIn')
        await signIn(email, password)
        console.log('AuthForm: signIn success')
        setPendingRedirect(true)
      }
    } catch (err) {
      console.error('AuthForm: error in handleSubmit', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  useEffect(() => {
    if (pendingRedirect && user) {
      const isAdmin = user.app_metadata?.role === 'admin' || user.email === 'admin@4voice.ai'
      if (onLoginSuccess) onLoginSuccess();
      if (isAdmin) {
        router.push('/admin/dashboard')
      } else {
        // Fetch business slug for this user and redirect to /[slug]/dashboard
        (async () => {
          try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseAnonKey);
            const { data, error } = await supabase
              .from('hvac_businesses')
              .select('slug')
              .eq('owner_id', user.id)
              .single();
            if (error || !data?.slug) {
              router.push('/dashboard'); // fallback
            } else {
              router.push(`/${data.slug}/dashboard`);
            }
          } catch (e) {
            router.push('/dashboard');
          }
        })();
      }
      setPendingRedirect(false)
    }
  }, [pendingRedirect, user, router])

  return (
    <div className={compact ? '' : 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'}>
      <div className={compact ? 'w-full space-y-8 py-2' : 'max-w-md w-full space-y-8'}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 