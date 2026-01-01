import { useState } from 'react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Buat akun di Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Tambahkan Username ke profil Firebase
      await updateProfile(userCredential.user, { displayName: formData.username });
      
      navigate('/');
    } catch (err) {
      setError("Email already in use or password too weak.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-3xl border border-gray-800">
        <div className="flex justify-center mb-6 text-red-600"><Film size={48} /></div>
        <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Username" required
            className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-black border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-red-600 font-bold py-3 rounded-xl hover:bg-red-700 transition-all">Sign Up</button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-white font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;