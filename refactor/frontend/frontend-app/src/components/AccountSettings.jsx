import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Settings, User, Mail, Shield, AlertCircle, CheckCircle, Save } from 'lucide-react';

export default function AccountSettings() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Real implementation would connect to Firebase updateProfile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app we'd do: await updateProfile(user, { displayName });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsUpdating(false);
    }, 800);
  };
  
  if (!user) return null;
  
  const isGuest = user.email === "guest@currencyai.com" || !user.email;
  const userInitial = (displayName || "Guest").slice(0, 1).toUpperCase();

  return (
    <section className="page-section" style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      <div className="section-heading">
        <span><Settings size={20} /></span>
        <div>
          <h2>Account Settings</h2>
          <p>Manage your profile, preferences, and security settings.</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Column: Avatar & Basic Info */}
        <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #5f27cd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '20px', boxShadow: '0 8px 25px rgba(108, 92, 231, 0.4)' }}>
            {userInitial}
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>{displayName || "Guest User"}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>{user.email || "No email linked"}</p>
          
          <div style={{ background: isGuest ? 'rgba(255, 159, 67, 0.1)' : 'rgba(46, 204, 113, 0.1)', color: isGuest ? '#ff9f43' : '#2ecc71', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} />
            {isGuest ? "Guest Account" : "Verified Account"}
          </div>
        </div>
        
        {/* Right Column: Edit Form */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '25px', fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Profile Information</h3>
          
          {message && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: message.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', color: message.type === 'success' ? '#2ecc71' : '#e74c3c', fontSize: '14px' }}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '8px', color: 'var(--muted)' }}>
                <User size={16} /> Display Name
              </label>
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Enter your name"
                disabled={isGuest}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-color)', fontSize: '15px' }}
              />
            </div>
            
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '8px', color: 'var(--muted)' }}>
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email" 
                value={user.email || ""} 
                disabled 
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--muted)', fontSize: '15px', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Email address cannot be changed directly.</p>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <button 
                type="submit" 
                className="primary-btn" 
                disabled={isUpdating || isGuest}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
              >
                <Save size={18} />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
          
          {isGuest && (
            <div style={{ marginTop: '30px', padding: '16px', background: 'rgba(255, 159, 67, 0.05)', borderRadius: '8px', borderLeft: '4px solid #ff9f43' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-color)', margin: 0, lineHeight: '1.5' }}>
                <strong>Note:</strong> You are currently using a Guest account. Profile modifications are disabled. To manage settings, please log out and create a permanent account.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}
