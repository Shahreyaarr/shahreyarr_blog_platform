import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '@/store';
import { Camera, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // NEW SECURE CREDENTIALS - CHANGE HERE IF NEEDED
 // TEMPORARY: Direct comparison (remove env vars for now)
  if (username === 'Bismillah@' && password === 'DubAi@687') {
    localStorage.setItem('adminAuth', 'true');
    window.location.href = '/admin/dashboard';
  } else {
    setError('Invalid username or password');
  }
};
    const success = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    
    if (success) {
      // Update store
      const { login } = useAdminStore.getState();
      login(username, password);
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Sahr E Yaar</h1>
          <p className="text-white/70">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to manage your portfolio</p>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-8">
          <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">
            &larr; Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
