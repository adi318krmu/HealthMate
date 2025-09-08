/*
Rural Healthcare - Frontend (Single-file React demo)

How to use:
1) Create a React app (Vite or CRA). Install dependencies:
   npm install react-router-dom axios bcryptjs framer-motion
   (Tailwind needs setup per Tailwind docs)

2) Place this file as src/App.jsx and update index.js to render <App />.
3) Configure Tailwind and environment variables for API endpoints and Google Maps key.

This single-file demo contains multiple components in one file for convenience:
- Navbar, Home, SymptomChecker (chatbot), DoctorMap, Auth (Login/Register), AdminDashboard,
  Profile, Footer and some reusable UI elements.

IMPORTANT: This is frontend-only. Replace API endpoint URLs (API_BASE) below with your backend endpoints.

*/

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { motion } from 'framer-motion';

// ---------- CONFIG ----------
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const GOOGLE_MAPS_EMBED_KEY = process.env.REACT_APP_GOOGLE_MAPS_EMBED_KEY || 'YOUR_GOOGLE_MAPS_KEY';

// ---------- AUTH CONTEXT ----------
const AuthContext = createContext();
function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rural_user')) || null;
    } catch(e){ return null; }
  });
  const login = (userData, token) => {
    localStorage.setItem('rural_user', JSON.stringify(userData));
    localStorage.setItem('rural_token', token);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('rural_user');
    localStorage.removeItem('rural_token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------- NAVBAR ----------
function Navbar(){
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">Rural Health</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/symptom" className="hover:underline">Symptom Checker</Link>
          <Link to="/doctors" className="hover:underline">Find Doctors</Link>
          {user?.isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <>
              <Link to="/profile" className="px-3 py-1 border rounded">Profile</Link>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="px-3 py-1 bg-blue-600 text-white rounded">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ---------- HOME ----------
function Home(){
  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.header initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-gradient-to-r from-green-400 to-blue-400 p-8 rounded text-white">
        <h1 className="text-3xl font-bold">Rural Healthcare Assistant</h1>
        <p className="mt-2">Symptom checker, nearby doctors, multilingual support, and easy admin tools — built for small towns & villages.</p>
      </motion.header>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Symptom Checker" text="Chat with the assistant to quickly assess severity and get suggestions." linkTo="/symptom" />
        <Card title="Find Nearby Doctors" text="Locate clinics and filtered results within 5km." linkTo="/doctors" />
        <Card title="Admin Dashboard" text="Manage doctors, remedies, and users (admin only)." linkTo="/admin" />
      </div>

      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold">Why this matters</h2>
        <p className="mt-2">Many villages lack quick triage and language support. This demo focuses on guided triage, recommended nearby care, and offline-friendly UX patterns (form caching, simple data sync later).</p>
      </section>

      <Footer />
    </div>
  );
}

function Card({title, text, linkTo}){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded shadow">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-2">{text}</p>
      <Link to={linkTo} className="mt-4 inline-block text-blue-600 underline">Open</Link>
    </motion.div>
  );
}

// ---------- SYMPTOM CHECKER (Chatbot UI) ----------
function SymptomChecker(){
  const { user } = useAuth();
  const [messages, setMessages] = useState([{
    from: 'bot', text: 'Namaste! Describe your symptoms in your language — I can respond in Hindi, Punjabi, or English.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if(!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try{
      // Frontend calls backend which proxies to OpenAI (do NOT put OpenAI key in frontend)
      const resp = await axios.post(`${API_BASE}/symptom/analyze`, { text: userMsg.text }, { headers: { Authorization: `Bearer ${localStorage.getItem('rural_token') || ''}` } });
      // Expected response: { reply: string, severity: 'low'|'medium'|'high' }
      const botMsg = { from: 'bot', text: resp.data.reply, severity: resp.data.severity };
      setMessages(m => [...m, botMsg]);
    }catch(err){
      setMessages(m => [...m, { from: 'bot', text: 'Sorry, service is unavailable. Please try again later.' }]);
    }finally{ setLoading(false); }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Symptom Checker / Chatbot</h2>
      <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto">
        <div className="h-80 overflow-y-auto p-2 border rounded">
          {messages.map((m,i)=> (
            <div key={i} className={`mb-3 ${m.from==='user'? 'text-right':''}`}>
              <div className={`${m.from==='user' ? 'inline-block bg-blue-100 p-2 rounded' : 'inline-block bg-gray-100 p-2 rounded'}`}>
                <div className="text-sm">{m.text}</div>
                {m.severity && <div className="text-xs mt-1">Severity: <strong>{m.severity}</strong></div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type symptoms here (eg: fever, headache, sore throat)..." className="flex-1 border p-2 rounded" />
          <button onClick={send} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading? 'Analyzing...' : 'Send'}</button>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={() => setMessages(m => [...m, { from: 'bot', text: 'Tip: For emergencies, please call your local health hotline or visit the nearest clinic.' }])} className="px-3 py-1 border rounded">Emergency Tips</button>
          <button onClick={() => { setMessages([ { from:'bot', text: 'Namaste! Describe your symptoms...' } ]); setInput(''); }} className="px-3 py-1 border rounded">Reset Conversation</button>
        </div>

        <div className="mt-4">
          <SeverityIndicator messages={messages} />
        </div>
      </div>
    </div>
  );
}

function SeverityIndicator({ messages }){
  // Naive severity detection UI (backend should give accurate severity)
  const latest = [...messages].reverse().find(m=>m.severity);
  const level = latest?.severity || 'low';
  const color = level === 'high' ? 'bg-red-500' : level === 'medium' ? 'bg-yellow-400' : 'bg-green-400';
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`p-3 rounded ${color} text-white`}>Current severity: <strong className="ml-2">{level}</strong></motion.div>
  );
}

// ---------- DOCTOR MAP (Google Maps Embed with search) ----------
function DoctorMap(){
  const [query, setQuery] = useState('doctor');
  const [radiusKm, setRadiusKm] = useState(5);
  const [location, setLocation] = useState(null);
  const [manualCoords, setManualCoords] = useState('');

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }), () => {});
    }
  },[]);

  const buildEmbedSrc = () => {
    const center = location ? `${location.lat},${location.lng}` : (manualCoords || '26.9124,75.7873');
    // Using Google Maps search embed
    return `https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_EMBED_KEY}&q=${encodeURIComponent(query)}&center=${center}&zoom=13`;
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Find Nearby Doctors / Clinics</h2>
      <div className="bg-white rounded shadow p-4">
        <div className="flex gap-2 mb-4">
          <input value={query} onChange={e=>setQuery(e.target.value)} className="border p-2 rounded flex-1" />
          <input value={radiusKm} onChange={e=>setRadiusKm(e.target.value)} type="number" className="w-24 border p-2 rounded" />
          <input value={manualCoords} onChange={e=>setManualCoords(e.target.value)} placeholder="lat,lng (optional)" className="w-48 border p-2 rounded" />
          <button className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
        </div>

        <div className="w-full h-96">
          <iframe title="maps" src={buildEmbedSrc()} className="w-full h-full border-0 rounded" allowFullScreen loading="lazy" />
        </div>

        <div className="mt-3 text-sm text-gray-600">Note: This embed requires a valid Google Maps Embed key. Backend integration with Places API allows filtering by radius.</div>
      </div>
    </div>
  );
}

// ---------- AUTH: LOGIN / REGISTER ----------
function Auth(){
  const [isRegister, setIsRegister] = useState(false);
  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isRegister? 'Register' : 'Login'}</h2>
          <button onClick={()=>setIsRegister(!isRegister)} className="text-sm text-blue-600">{isRegister? 'Go to Login' : 'Create Account'}</button>
        </div>
        {isRegister ? <RegisterForm/> : <LoginForm/>}
      </div>
    </div>
  );
}

function LoginForm(){
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const resp = await axios.post(`${API_BASE}/auth/login`, { email, password });
      // resp: { token, user }
      login(resp.data.user, resp.data.token);
      navigate('/');
    }catch(err){ setErr(err.response?.data?.message || 'Login failed'); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
      {err && <div className="text-red-500">{err}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}

function RegisterForm(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      // Optional: Hash on frontend for extra safety (backend should always hash)
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(password, salt);
      const resp = await axios.post(`${API_BASE}/auth/register`, { name, email, password: hashed });
      navigate('/auth?registered=1');
    }catch(err){ setErr(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full border p-2 rounded" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
      {err && <div className="text-red-500">{err}</div>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Create account</button>
    </form>
  );
}

// ---------- ADMIN DASHBOARD (Protected) ----------
function AdminDashboard(){
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{ if(!user?.isAdmin) navigate('/'); }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Manage Doctors</h3>
          <p className="text-sm">Add/edit clinic info (this UI expects backend endpoints).</p>
          <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded">Add Doctor</button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Manage Remedies / FAQs</h3>
          <p className="text-sm">Create quick remedies database to be referenced by the symptom checker.</p>
          <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded">Add Remedy</button>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-bold">User List</h3>
        <p className="text-sm">(Backend: /admin/users)</p>
        <button className="mt-3 px-3 py-1 border rounded">Load users</button>
      </div>
    </div>
  );
}

// ---------- PROFILE ----------
function Profile(){
  const { user } = useAuth();
  if(!user) return <Navigate to="/auth" />;
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="bg-white p-4 rounded shadow mt-4 max-w-md">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p className="text-sm text-gray-600 mt-2">You can edit this info via the backend API (PUT /user/profile).</p>
      </div>
    </div>
  );
}

// ---------- FOOTER ----------
function Footer(){
  return (
    <footer className="mt-8 text-sm text-gray-600">
      <div>Built for hackathons — include backend, security checks, and offline sync for production.</div>
      <div className="mt-2">Made with ❤️ — mention React, Tailwind, Node, MongoDB, OpenAI, Google Maps in your slide.</div>
    </footer>
  );
}

// ---------- APP ----------
export default function App(){
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/symptom" element={<SymptomChecker/>} />
            <Route path="/doctors" element={<DoctorMap/>} />
            <Route path="/auth" element={<Auth/>} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="*" element={<div className="p-6">Page not found</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
 