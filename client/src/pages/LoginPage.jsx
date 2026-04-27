import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';

// Locked layout contract for login composition. Update only with explicit design sign-off.
const LOCKED_LOGIN_LAYOUT = Object.freeze({
  shell:
    'relative w-full max-w-[340px] pt-[100px] sm:max-w-[380px] sm:pt-[112px] md:max-w-[420px] md:pt-[120px] lg:max-w-[440px]',
  image:
    'pointer-events-none absolute right-[-54px] top-[-62px] z-20 w-[220px] drop-shadow-[8px_16px_16px_rgba(0,0,0,0.5)] drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)] sm:right-[-66px] sm:top-[-62px] sm:w-[244px] md:right-[-82px] md:top-[-80px] md:w-[278px] lg:top-[-91px] lg:w-[292px]',
  card:
    'relative z-10 w-full rounded-[2.5rem] bg-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] backdrop-blur-[80px] border border-white/20 border-t-white/60 border-l-white/60 sm:p-10',
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3efe8] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
        <div className={LOCKED_LOGIN_LAYOUT.shell}>
          <img
            src="/images/auth/boy.png"
            alt="Decorative 3D character"
            className={LOCKED_LOGIN_LAYOUT.image}
          />

          <section className={LOCKED_LOGIN_LAYOUT.card}>
            <p className="uppercase tracking-[0.15em] text-[10px] sm:text-xs font-bold text-slate-500">Welcome Back</p>
            <h1 className="mt-2 font-serif text-4xl sm:text-[44px] tracking-tight text-slate-900">Sign in</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Continue where you left off and shape your next set of priorities.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="uppercase tracking-[0.1em] text-[10px] font-bold text-slate-500 block pb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-white/10 text-slate-900 placeholder:text-slate-500 border border-white/20 border-t-white/50 border-l-white/50 focus:bg-white/30 focus:border-white focus:ring-4 focus:ring-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="uppercase tracking-[0.1em] text-[10px] font-bold text-slate-500 block pb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-2xl bg-white/10 text-slate-900 placeholder:text-slate-500 border border-white/20 border-t-white/50 border-l-white/50 focus:bg-white/30 focus:border-white focus:ring-4 focus:ring-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all"
                  required
                />
              </div>

              {error && (
                <p className="rounded-2xl border border-[rgba(234,88,12,0.35)] bg-[rgba(234,88,12,0.08)] px-3 py-2 text-sm text-orange-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="mt-6 h-12 w-full rounded-2xl bg-[#EB5E28] hover:bg-[#d95321] text-white shadow-[0_8px_20px_rgba(235,94,40,0.25)] transition-all flex items-center justify-center font-medium text-base"
              >
                {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <p className="mt-8 text-sm text-slate-500 text-center">
              New here?{' '}
              <Link to="/signup" className="font-semibold text-slate-900 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
