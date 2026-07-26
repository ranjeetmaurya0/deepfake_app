import React, { useState, useEffect } from 'react';
import { MOCK_USERS, generateSampleJwt } from '../data/authData';
import { AuthUser, DecodedJwtToken } from '../types';
import { Key, Lock, Shield, User, RefreshCw, CheckCircle2, AlertTriangle, Cpu, Copy, Check, Terminal, Clock, ShieldCheck, Eye } from 'lucide-react';

interface JwtTokenSimulatorProps {
  activeUser: AuthUser;
  onUserChange: (user: AuthUser) => void;
}

export const JwtTokenSimulator: React.FC<JwtTokenSimulatorProps> = ({ activeUser, onUserChange }) => {
  const [emailInput, setEmailInput] = useState<string>(activeUser.email);
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [decodedToken, setDecodedToken] = useState<DecodedJwtToken>(generateSampleJwt(activeUser));
  const [copied, setCopied] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 mins countdown
  const [activeTab, setActiveTab] = useState<'payload' | 'header' | 'signature'>('payload');

  useEffect(() => {
    setEmailInput(activeUser.email);
    setDecodedToken(generateSampleJwt(activeUser));
    setTimeRemaining(900);
  }, [activeUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = MOCK_USERS.find((u) => u.email.toLowerCase() === emailInput.toLowerCase()) || {
      id: 'usr-custom-999',
      email: emailInput,
      fullName: emailInput.split('@')[0],
      role: 'ROLE_RESEARCHER' as const,
      organization: 'External Partner Lab',
      createdAt: new Date().toISOString()
    };
    onUserChange(matched);
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'mock_refresh_token_7days' })
      });
      if (res.ok) {
        setDecodedToken(generateSampleJwt(activeUser));
        setTimeRemaining(900);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyRawToken = () => {
    navigator.clipboard.writeText(decodedToken.rawToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0f1e] rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Spring Security 6 Stateless JWT Auth & Session Inspector
            </h2>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
              BEARER TOKEN SIMULATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate JWT token issuance, payload claim verification, access token expiration, and Spring Security Stateless Context authentication.
          </p>
        </div>

        {/* Quick User Role Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/10 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 pl-2">Quick Role:</span>
          {MOCK_USERS.map((usr) => (
            <button
              key={usr.id}
              onClick={() => onUserChange(usr)}
              id={`switch-user-role-${usr.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeUser.id === usr.id
                  ? usr.role === 'ROLE_ADMIN'
                    ? 'bg-rose-500 text-slate-950'
                    : usr.role === 'ROLE_RESEARCHER'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-700 text-white'
                  : 'bg-transparent text-slate-400 hover:text-white'
              }`}
            >
              {usr.role.replace('ROLE_', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Login Form & Active Identity Badge */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
            1. Authenticate & Obtain Bearer Token
          </span>

          {/* Active User Card */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            activeUser.role === 'ROLE_ADMIN'
              ? 'bg-gradient-to-r from-rose-950/60 to-slate-950 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              : activeUser.role === 'ROLE_RESEARCHER'
              ? 'bg-gradient-to-r from-cyan-950/60 to-slate-950 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              : 'bg-slate-900/60 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Active Session Identity</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                activeUser.role === 'ROLE_ADMIN'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  : activeUser.role === 'ROLE_RESEARCHER'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-600'
              }`}>
                {activeUser.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-purple-300" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-white font-mono truncate">{activeUser.fullName}</h4>
                <p className="text-xs text-slate-400 font-mono truncate">{activeUser.email}</p>
                <p className="text-[10px] text-cyan-300 font-mono mt-0.5">{activeUser.organization}</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Email / Username</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <button
              type="submit"
              id="authenticate-jwt-login-btn"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Key className="w-4 h-4" />
              <span>Issue New Bearer JWT Token</span>
            </button>
          </form>
        </div>

        {/* Right Column: Decoded JWT Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">Decoded JWT Token Structural Viewer</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Expires in:</span>
                <span className="text-cyan-300 font-bold">{Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s</span>
                <button
                  onClick={handleRefreshToken}
                  disabled={isRefreshing}
                  id="refresh-jwt-token-btn"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer ml-2"
                  title="Refresh Token"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Token Claims Sub-tabs */}
            <div className="flex gap-2 font-mono text-xs border-b border-white/5 pb-2">
              <button
                onClick={() => setActiveTab('payload')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'payload' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Payload Claims (Data)
              </button>
              <button
                onClick={() => setActiveTab('header')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'header' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Header (Alg & Typ)
              </button>
              <button
                onClick={() => setActiveTab('signature')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'signature' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                }`}
              >
                HMAC-SHA256 Signature
              </button>
            </div>

            {/* JSON Payload Inspector */}
            <pre className="bg-[#050914] p-4 rounded-xl border border-white/10 font-mono text-[11px] text-purple-200 overflow-x-auto min-h-[160px]">
              <code>
                {activeTab === 'payload' && JSON.stringify(decodedToken.payload, null, 2)}
                {activeTab === 'header' && JSON.stringify(decodedToken.header, null, 2)}
                {activeTab === 'signature' && `HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  secret_key_spring_boot_jwt_2025\n) -> ${decodedToken.signature}`}
              </code>
            </pre>

            {/* Copy Token & Verification Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Spring Security Context: Authenticated via Stateless Bearer Filter</span>
              </div>

              <button
                onClick={handleCopyRawToken}
                id="copy-raw-jwt-btn"
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied Raw JWT!' : 'Copy Raw Token'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
