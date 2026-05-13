import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Shield, Save, LogOut, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put('/auth/updatedetails', profileData);
      updateUser(res.data.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('New passwords do not match');
    }
    
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await api.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your workspace account and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6 bg-blue-600 border-none shadow-xl shadow-blue-200">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black italic mb-4">
              {user?.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-sm text-blue-100 mb-6">{user?.email}</p>
            <button 
              onClick={logout}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
          
          <div className="card p-6">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Account Overview</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Role</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase">Administrator</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Status</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          {(success || error) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                success ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-bold">{success || error}</span>
            </motion.div>
          )}

          {/* Profile Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 tracking-tight">Personal Information</h4>
                <p className="text-xs text-slate-400 font-medium">Update your profile display settings</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all outline-none text-sm font-bold text-slate-900"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all outline-none text-sm font-bold text-slate-900"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-4 flex justify-end">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="btn btn-primary px-8 flex items-center gap-2 group"
                >
                  <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Update Profile
                </button>
              </div>
            </form>
          </motion.div>

          {/* Password Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 tracking-tight">Security & Password</h4>
                <p className="text-xs text-slate-400 font-medium">Protect your workspace with a strong password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-amber-500 transition-all outline-none text-sm font-bold text-slate-900"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">New Password</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-bold text-slate-900"
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Confirm New Password</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-bold text-slate-900"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <p className="text-[10px] text-slate-400 font-bold max-w-xs italic leading-relaxed">
                  Note: Updating your password will require you to stay logged in on your other devices.
                </p>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="btn bg-slate-900 text-white hover:bg-black px-8 flex items-center gap-2 group border-none"
                >
                  <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Change Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
