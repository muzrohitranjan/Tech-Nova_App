import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Switch, Button, Divider, Input, message, Modal, Tag, Select } from 'antd';
import { 
  UserOutlined, BellOutlined, BgColorsOutlined, EyeOutlined, SoundOutlined,
  RightOutlined, DeleteOutlined, MailOutlined, LockOutlined, LeftOutlined, 
  SaveOutlined, CheckCircleOutlined, CloseCircleOutlined, GlobalOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Error reading localStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export const Settings = () => {
  const navigate = useNavigate();

  // --- Dynamic Account States ---
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : { name: "Guest", email: "guest@example.com", isAdmin: false };
  });
  const [userName, setUserName] = useState(currentUser.name);
  const userEmail = currentUser.email; 
  const isAdmin = currentUser.isAdmin; // Check if Admin
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- Language State ---
  const [appLanguage, setAppLanguage] = usePersistedState('app_ui_language', 'English');

  // --- Secure Password States ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // --- Persisted Toggle States (Standard) ---
  const [pushNotif, setPushNotif] = usePersistedState('app_push', true);
  const [emailNotif, setEmailNotif] = usePersistedState('app_email_notif', true);
  const [statusUpdates, setStatusUpdates] = usePersistedState('app_status_update', true);
  const [weeklyDigest, setWeeklyDigest] = usePersistedState('app_weekly_digest', false);
  const [darkMode, setDarkMode] = usePersistedState('app_dark_mode', false);
  const [showEmail, setShowEmail] = usePersistedState('app_show_email', false);
  const [dataCollection, setDataCollection] = usePersistedState('app_data_collection', true);
  
  // Cooking Mode
  const [voiceGuidance, setVoiceGuidance] = usePersistedState('app_voice_guide', true);
  const [autoAdvance] = usePersistedState('app_auto_advance', false); 
  const [keepScreenOn, setKeepScreenOn] = usePersistedState('app_wake_lock', true);
  
  // --- Admin Specific Toggles ---
  const [submissionAlerts, setSubmissionAlerts] = usePersistedState('admin_sub_alerts', true);
  const [strictMode, setStrictMode] = usePersistedState('admin_strict_mode', false);

  const [fontSize, setFontSize] = usePersistedState('app_font_size', 'medium');
  const [visibility, setVisibility] = usePersistedState('app_visibility', 'public');

  const fontScale = fontSize === 'small' ? 0.9 : fontSize === 'large' ? 1.1 : 1.0;
  const pageBg = darkMode ? '#121212' : '#FCF4F1';
  const cardBg = darkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = darkMode ? '#F0F0F0' : '#000000';
  const textSecColor = darkMode ? '#AAAAAA' : '#555555';

  const pageStyle = { backgroundColor: pageBg, minHeight: '100vh', paddingBottom: '40px', transition: 'all 0.3s ease' };
  const cardStyle = { borderRadius: '24px', border: 'none', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', backgroundColor: cardBg, transition: 'all 0.3s ease' };
  const iconBoxStyle = { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' };

  // --- FULL UI DARK MODE INJECTION ---
  const globalDarkThemeCSS = `
    body, .ant-layout, .ant-layout-content { background-color: #121212 !important; color: #f0f0f0 !important; transition: background-color 0.3s ease; }
    .ant-typography, h1, h2, h3, h4, h5, span { color: #f0f0f0 !important; }
    .custom-bottom-nav { background-color: #1e1e1e !important; border-top: 1px solid #333 !important; }
    .ant-menu { background-color: #1e1e1e !important; color: #aaa !important; }
  `;

  const createToggleHandler = (setter) => (checked) => {
    setter(checked);
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...currentUser, name: userName };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser)); 
    setIsEditing(false);
    message.success('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    localStorage.removeItem('currentUser');
    message.error('Account permanently deleted.');
    navigate('/login');
  };

  const handleDisableAccount = () => {
    setShowDeleteModal(false);
    localStorage.removeItem('currentUser');
    message.warning('Account temporarily disabled.');
    navigate('/login');
  };

  const hasMinLength = passwords.new.length >= 8;
  const hasUpperAndLower = /(?=.*[a-z])(?=.*[A-Z])/.test(passwords.new);
  const hasNumber = /(?=.*\d)/.test(passwords.new);
  const isPasswordValid = hasMinLength && hasUpperAndLower && hasNumber;
  const doPasswordsMatch = passwords.new === passwords.confirm && passwords.new !== '';

  const handlePasswordSubmit = () => {
    if (!passwords.current) return message.error('Please enter your current password');
    if (!isPasswordValid) return message.error('New password does not meet security requirements');
    if (!doPasswordsMatch) return message.error('New passwords do not match');

    message.success('Password securely updated!');
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div style={pageStyle}>
      {darkMode && <style>{globalDarkThemeCSS}</style>}
      
      {/* --- Delete / Disable Account Modal --- */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: cardBg, borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <Title level={4} style={{ margin: '0 0 12px 0', fontWeight: 800, color: textColor }}>Account Options</Title>
            <Text style={{ color: textSecColor, fontSize: `${15 * fontScale}px`, display: 'block', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete your account? You can also choose to temporarily disable it.
            </Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button type="primary" danger style={{ height: '48px', borderRadius: '12px', fontWeight: 700 }} onClick={handleDeleteAccount}>
                Delete Permanently
              </Button>
              <Button style={{ height: '48px', borderRadius: '12px', fontWeight: 700, borderColor: '#FF7E27', color: '#FF7E27' }} onClick={handleDisableAccount}>
                Temporary Disable
              </Button>
              <Button type="text" style={{ height: '48px', borderRadius: '12px', fontWeight: 600, color: textSecColor }} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Change Password Modal --- */}
      <Modal 
        title={<span style={{ color: textColor, fontWeight: 800 }}>Update Password</span>} 
        open={showPasswordModal} 
        onCancel={() => setShowPasswordModal(false)} 
        footer={null} 
        centered
        styles={{ content: { backgroundColor: cardBg, borderRadius: '24px' }, header: { backgroundColor: cardBg } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>Current Password</Text>
            <Input.Password size="large" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>New Password</Text>
            <Input.Password size="large" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
            
            <div style={{ marginTop: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: darkMode ? '#2A2A2A' : '#F8F9FA', padding: '12px', borderRadius: '12px' }}>
              <span style={{ color: hasMinLength ? '#52C41A' : textSecColor }}>{hasMinLength ? <CheckCircleOutlined /> : <CloseCircleOutlined />} Minimum 8 characters</span>
              <span style={{ color: hasUpperAndLower ? '#52C41A' : textSecColor }}>{hasUpperAndLower ? <CheckCircleOutlined /> : <CloseCircleOutlined />} One uppercase & one lowercase</span>
              <span style={{ color: hasNumber ? '#52C41A' : textSecColor }}>{hasNumber ? <CheckCircleOutlined /> : <CloseCircleOutlined />} At least one number</span>
            </div>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: textColor }}>Confirm New Password</Text>
            <Input.Password size="large" status={passwords.confirm.length > 0 && !doPasswordsMatch ? "error" : ""} value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
          </div>
          <Button type="primary" onClick={handlePasswordSubmit} style={{ height: '48px', marginTop: '16px', background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', border: 'none', fontWeight: 700, borderRadius: '12px' }}>
            Securely Update Password
          </Button>
        </div>
      </Modal>

      {/* --- Header --- */}
      <div style={{ background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', padding: '50px 24px 60px 24px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', color: 'white' }}>
        <Button type="link" icon={<LeftOutlined />} onClick={() => navigate(-1)} style={{ color: 'white', padding: 0, marginBottom: '16px', fontWeight: 600 }}>Back</Button>
        <Title level={1} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Settings</Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: `${15 * fontScale}px` }}>Customize your experience</Text>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-30px' }}>
        
        {/* --- 1. Account Section --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{...iconBoxStyle, backgroundColor: '#FFF0E6', color: '#FF7E27'}}><UserOutlined /></div>
              <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Account</Title>
            </div>
            {isEditing ? (
              <Text onClick={() => setIsEditing(false)} style={{ color: '#F83A3A', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Cancel</Text>
            ) : (
              <Text onClick={() => setIsEditing(true)} style={{ color: '#F83A3A', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Edit</Text>
            )}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: textSecColor }}>Name</Text>
                <Input size="large" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ borderRadius: '12px', padding: '10px 14px', fontWeight: 500, backgroundColor: darkMode ? '#333' : '#FFF', color: textColor }} />
              </div>
              <div>
                <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px', color: textSecColor }}>Email</Text>
                <Input size="large" value={userEmail} disabled style={{ borderRadius: '12px', padding: '10px 14px', fontWeight: 500, backgroundColor: darkMode ? '#222' : '#F5F5F5', color: textSecColor }} />
              </div>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveProfile} style={{ height: '48px', borderRadius: '12px', fontWeight: 700, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', border: 'none', marginTop: '4px', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' }}>
                Save Changes
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}><UserOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/> {currentUser.name}</Text>
              <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}><MailOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/> {userEmail}</Text>
              
              <div onClick={() => setShowPasswordModal(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <LockOutlined style={{ color: textSecColor, marginRight: '16px', fontSize: '16px' }}/>
                <Text style={{ fontSize: `${15 * fontScale}px`, color: textColor, fontWeight: 500 }}>Change Password</Text>
              </div>
            </div>
          )}
        </Card>

        {/* --- 2. Notifications --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#E6F4FF', color: '#1677FF'}}><BellOutlined /></div>
            <Title level={4} style={{ margin: 0, fontWeight: 800, color: textColor }}>Notifications</Title>
          </div>
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Push Notifications</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Receive alerts on your device</Text></div>
            <Switch checked={pushNotif} onChange={createToggleHandler(setPushNotif)} style={{ backgroundColor: pushNotif ? '#FF7E27' : '#D9D9D9' }} />
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Email Notifications</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Get updates via email</Text></div>
            <Switch checked={emailNotif} onChange={createToggleHandler(setEmailNotif)} style={{ backgroundColor: emailNotif ? '#FF7E27' : '#D9D9D9' }} />
          </div>
          {!isAdmin && (
            <>
              <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
              <div style={rowStyle}>
                <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Recipe Status Updates</Text><Text style={{ fontSize: '12px', color: textSecColor }}>When your recipes are reviewed</Text></div>
                <Switch checked={statusUpdates} onChange={createToggleHandler(setStatusUpdates)} style={{ backgroundColor: statusUpdates ? '#FF7E27' : '#D9D9D9' }} />
              </div>
            </>
          )}
        </Card>

        {/* --- 3. Appearance & Language --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#F9F0FF', color: '#B37FEB'}}><BgColorsOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Appearance</Title>
          </div>
          
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Dark Mode</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Switch to dark theme</Text></div>
            <Switch checked={darkMode} onChange={createToggleHandler(setDarkMode)} style={{ backgroundColor: darkMode ? '#FF7E27' : '#D9D9D9' }} />
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          
          <div style={{ marginTop: '16px', marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, marginBottom: '12px', color: textColor }}>Font Size</Text>
            <div style={{ display: 'flex', border: `1px solid ${darkMode ? '#444' : '#E2E8F0'}`, borderRadius: '12px', padding: '4px' }}>
              {['Small', 'Medium', 'Large'].map(size => {
                const isActive = fontSize === size.toLowerCase();
                return (
                  <div 
                    key={size}
                    onClick={() => setFontSize(size.toLowerCase())}
                    style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', backgroundColor: isActive ? '#FF7E27' : 'transparent', color: isActive ? 'white' : textSecColor, fontWeight: isActive ? 700 : 500 }}
                  >{size}</div>
                )
              })}
            </div>
          </div>

          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: `${15 * fontScale}px`, marginBottom: '12px', color: textColor }}>
               <GlobalOutlined /> App Language
            </Text>
            <Select 
              value={appLanguage} 
              onChange={(val) => setAppLanguage(val)} 
              style={{ width: '100%', height: '45px' }}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Hindi', label: 'हिंदी (Hindi)' },
                { value: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' },
                { value: 'Tamil', label: 'தமிழ் (Tamil)' },
                { value: 'Telugu', label: 'తెలుగు (Telugu)' },
                { value: 'Malayalam', label: 'മലയാളം (Malayalam)' }
              ]}
            />
          </div>
        </Card>

        {/* --- 4. Privacy --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#E6F7F0', color: '#52C41A'}}><EyeOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>Privacy</Title>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, marginBottom: '12px', color: textColor }}>Profile Visibility</Text>
            <div style={{ display: 'flex', border: `1px solid ${darkMode ? '#444' : '#E2E8F0'}`, borderRadius: '12px', padding: '4px' }}>
              {['Public', 'Private'].map(vis => {
                const isActive = visibility === vis.toLowerCase();
                return (
                  <div 
                    key={vis}
                    onClick={() => setVisibility(vis.toLowerCase())}
                    style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: '8px', cursor: 'pointer', backgroundColor: isActive ? '#FF7E27' : 'transparent', color: isActive ? 'white' : textSecColor, fontWeight: isActive ? 700 : 500 }}
                  >{vis}</div>
                )
              })}
            </div>
          </div>
          <div style={rowStyle}>
            <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Data Collection</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Help improve the app</Text></div>
            <Switch checked={dataCollection} onChange={createToggleHandler(setDataCollection)} style={{ backgroundColor: dataCollection ? '#FF7E27' : '#D9D9D9' }} />
          </div>
        </Card>

        {/* --- 5. Cooking Mode --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{...iconBoxStyle, backgroundColor: '#FFF1F0', color: '#FF4D4F'}}><SoundOutlined /></div>
            <Title level={4} style={{ margin: '0', fontWeight: 800, color: textColor }}>
              Cooking Mode
            </Title>
          </div>
          <div style={rowStyle}>
            <div>
               <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Voice Guidance</Text>
               <Text style={{ fontSize: '12px', color: textSecColor }}>Read steps aloud</Text>
            </div>
            <Switch checked={voiceGuidance} onChange={createToggleHandler(setVoiceGuidance)} style={{ backgroundColor: voiceGuidance ? '#FF7E27' : '#D9D9D9' }} />
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div>
              <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: `${15 * fontScale}px`, color: textSecColor }}>
                Auto-Advance Steps <Tag color="blue" style={{ borderRadius: '12px', border: 'none', margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 6px' }}>Beta</Tag>
              </Text>
              <Text style={{ fontSize: '12px', color: textSecColor }}>Move to next step automatically (Coming soon)</Text>
            </div>
            <Switch disabled={true} checked={autoAdvance} />
          </div>
          <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}>
            <div>
              <Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Keep Screen On</Text>
              <Text style={{ fontSize: '12px', color: textSecColor }}>Prevent screen from sleeping</Text>
            </div>
            <Switch checked={keepScreenOn} onChange={createToggleHandler(setKeepScreenOn)} style={{ backgroundColor: keepScreenOn ? '#FF7E27' : '#D9D9D9' }} />
          </div>
        </Card>

        {/* --- 6. Admin Controls (ONLY VISIBLE IF ADMIN) --- */}
        {isAdmin && (
          <Card style={{...cardStyle, border: '1px solid #E6D8FF', backgroundColor: darkMode ? '#2B1A3A' : '#FAF5FF'}} bodyStyle={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{...iconBoxStyle, backgroundColor: '#F0E6FF', color: '#9b00ff'}}><SafetyCertificateOutlined /></div>
              <Title level={4} style={{ margin: '0', fontWeight: 800, color: darkMode ? '#E6D8FF' : '#9b00ff' }}>Admin Controls</Title>
            </div>
            <div style={rowStyle}>
              <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Submission Alerts</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Notify me of new pending recipes</Text></div>
              <Switch checked={submissionAlerts} onChange={createToggleHandler(setSubmissionAlerts)} style={{ backgroundColor: submissionAlerts ? '#9b00ff' : '#D9D9D9' }} />
            </div>
            <Divider style={{ margin: '8px 0', borderColor: darkMode ? '#442A5C' : '#E6D8FF' }} />
            <div style={rowStyle}>
              <div><Text strong style={{ display: 'block', fontSize: `${15 * fontScale}px`, color: textColor }}>Strict Moderation</Text><Text style={{ fontSize: '12px', color: textSecColor }}>Require 2 approvals per recipe</Text></div>
              <Switch checked={strictMode} onChange={createToggleHandler(setStrictMode)} style={{ backgroundColor: strictMode ? '#9b00ff' : '#D9D9D9' }} />
            </div>
          </Card>
        )}

        {/* --- 7. About --- */}
        <Card style={cardStyle} bodyStyle={{ padding: '24px' }}>
          <Title level={4} style={{ margin: '0 0 20px 0', fontWeight: 800, color: textColor }}>About</Title>
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Version</Text><Text style={{ color: textSecColor }}>1.0.0</Text></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Terms of Service</Text><RightOutlined style={{ color: textSecColor }} /></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Privacy Policy</Text><RightOutlined style={{ color: textSecColor }} /></div>
          <Divider style={{ margin: '12px 0', borderColor: darkMode ? '#333' : '#F0F0F0' }} />
          <div style={rowStyle}><Text strong style={{ fontSize: `${15 * fontScale}px`, color: textColor }}>Help & Support</Text><RightOutlined style={{ color: textSecColor }} /></div>
        </Card>

        {/* --- 8. Danger Zone --- */}
        <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '24px' }}>
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => setShowDeleteModal(true)} 
            style={{ color: '#CF1322', fontWeight: 700, fontSize: '16px', height: 'auto', padding: '8px 16px', backgroundColor: darkMode ? 'rgba(207, 19, 34, 0.1)' : 'transparent' }}
          >
            Delete Account
          </Button>
        </div>
        
      </div>
    </div>
  );
};