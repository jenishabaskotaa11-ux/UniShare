import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, login, signup } = useApp();
  
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('riya@university.edu');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [studentId, setStudentId] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      login(email, password);
    } else {
      signup({
        name: name || 'Apex Student',
        email,
        password,
        program: program || 'Undergraduate Student',
        university: 'Apex University',
      });
    }
  };

  const handleQuickDemo = () => {
    login('riya@university.edu', 'demo123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-surface-container-high p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">
                {mode === 'signin' ? 'Campus Student Sign In' : 'Join UniShare Campus'}
              </h3>
              <p className="text-[11px] text-outline">Verified Apex University Community</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-outline hover:text-on-surface bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Sign In Button */}
        <button
          onClick={handleQuickDemo}
          className="w-full p-3 rounded-2xl bg-secondary-container/50 hover:bg-secondary-container border border-secondary/30 text-xs font-bold text-on-surface flex items-center justify-between transition-colors shadow-2xs"
        >
          <div className="flex items-center space-x-2.5 text-left">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Riya Sharma"
              className="w-8 h-8 rounded-full object-cover border border-secondary"
            />
            <div>
              <span className="block font-bold">1-Click Demo Login</span>
              <span className="text-[10px] text-outline font-normal">
                Riya Sharma (CS Sophomore • 320 pts)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-secondary">arrow_forward</span>
        </button>

        <div className="flex items-center my-2 text-[10px] text-outline uppercase tracking-wider before:content-[''] before:flex-1 before:border-b before:border-surface-container after:content-[''] after:flex-1 after:border-b after:border-surface-container before:mr-3 after:ml-3">
          or continue with student email
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam Evans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="APX-2026-XXXX"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                    Degree / Program
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MechEng Y2"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              University Email (.edu)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-on-surface"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-hover shadow-sm transition-all"
          >
            {mode === 'signin' ? 'Sign In to Campus Account' : 'Create Verified Student Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-outline border-t border-surface-container">
          {mode === 'signin' ? (
            <p>
              New to Apex University UniShare?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-primary font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already verified?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-primary font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
