import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useAdminStore } from '@/store';

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useAdminStore(s => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (login(username, password)) {
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-earth flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-charcoal">Sahr E Yaar</h1>
          <p className="text-muted text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="font-display text-2xl text-charcoal mb-1">Welcome back</h2>
          <p className="text-muted text-sm mb-6">Sign in to manage your site</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required
                className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required
                  className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm pr-12 transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-charcoal text-white font-medium text-sm hover:bg-charcoal/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted text-sm hover:text-charcoal transition-colors">← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
