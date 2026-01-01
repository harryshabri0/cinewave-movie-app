import { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-3xl border border-gray-800">
        <div className="flex justify-center mb-6 text-red-600"><Film size={48} /></div>
        <h2 className="text-2xl font-bold text-center mb-8">Welcome Back</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-red-600 font-bold py-3 rounded-xl hover:bg-red-700 transition-all">Login</button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          New here? <Link to="/register" className="text-white font-bold">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;