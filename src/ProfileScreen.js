import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Avatar, Tag } from 'antd';
import { 
  SettingOutlined, LogoutOutlined, UserOutlined, CrownFilled, MailOutlined,
  TrophyOutlined, StarFilled, SafetyCertificateOutlined, FileSearchOutlined
} from '@ant-design/icons';
import { api } from './api';

const { Title, Text } = Typography;

const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  paddingBottom: '100px',
};

// Custom Chef Hat Icon
const ChefHatSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D48806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// Custom Ribbon/Badge Icon
const RibbonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D48806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

export const Profile = () => {
  const navigate = useNavigate();
  const [cookedRecipes, setCookedRecipes] = useState([]);
  const [user, setUser] = useState({ name: "User", email: "user@test.com", isAdmin: false });
  
  // State for Admin Data
  const [adminStats, setAdminStats] = useState({ approved: 0, pending: 0, total: 0 });

  // Load User Data, Cooked History, and Admin Stats
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.isAdmin) {
        api.getAdminStats().then(stats => {
          setAdminStats({
            approved: stats.approved || 0,
            pending: stats.pending || 0,
            total: stats.total || 0
          });
        }).catch(() => {});
      }
    }

    const history = JSON.parse(localStorage.getItem('cookedRecipes') || '[]');
    setCookedRecipes(history);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Helper to get first letter for Avatar
  const getAvatarContent = () => {
    if (user.name && user.name !== "User") {
      return user.name.charAt(0).toUpperCase();
    }
    return <UserOutlined style={{ color: '#FF7E27' }} />;
  };

  return (
    <div style={pageStyle}>
      {/* --- Dynamic Header Gradient --- */}
      <div style={{ 
        background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', 
        padding: '60px 24px 80px 24px', 
        borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', color: 'white' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <Avatar 
            size={70} 
            style={{ backgroundColor: 'white', color: '#FF7E27', fontSize: '28px', fontWeight: 800 }}
          >
            {getAvatarContent()}
          </Avatar>
          <div>
            {/* --- DISPLAYS DYNAMIC NAME --- */}
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>
                {user.name}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MailOutlined /> {user.email}
            </Text>
          </div>
        </div>
        
        {user.isAdmin && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '20px', display: 'inline-block' }}>
            <Text style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>
              <CrownFilled style={{ color: '#FAAD14', marginRight: '6px' }} /> Administrator
            </Text>
          </div>
        )}
      </div>

      <div style={{ padding: '0 24px', marginTop: '-40px' }}>
        
        {user.isAdmin ? (
          
          /* --- ADMIN PROFILE CONTENT --- */
          <>
            {/* Admin Stats Row */}
            <Row gutter={12} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#52C41A' }}>{adminStats.approved}</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Approved</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#FAAD14' }}>{adminStats.pending}</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Pending</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#333' }}>{adminStats.total}</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Total</Text>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions for Admin */}
            <Card style={{ borderRadius: '20px', border: 'none', marginBottom: '24px', backgroundColor: '#FFFBF5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '20px' }}>
              <Title level={5} style={{ margin: '0 0 16px 0', fontWeight: 800, color: '#555' }}>
                  Admin Actions
              </Title>
              <Button 
                block 
                type="primary" 
                icon={<FileSearchOutlined />}
                onClick={() => navigate('/recipe-moderation')} 
                style={{ height: '48px', borderRadius: '12px', marginBottom: '12px', background: 'linear-gradient(90deg, #FAAD14 0%, #FFD700 100%)', border: 'none', fontWeight: 700, color: '#000', boxShadow: '0 4px 12px rgba(250, 173, 20, 0.3)' }}
              >
                Review Pending Recipes
              </Button>
              <Button 
                block 
                type="primary" 
                icon={<SafetyCertificateOutlined />}
                onClick={() => navigate('/admin-dashboard')} 
                style={{ height: '48px', borderRadius: '12px', background: 'linear-gradient(90deg, #9b00ff 0%, #ff007b 100%)', border: 'none', fontWeight: 700, boxShadow: '0 4px 12px rgba(255, 0, 123, 0.3)' }}
              >
                Open Admin Dashboard
              </Button>
            </Card>

            <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '8px' }}>
              <Button type="text" block onClick={() => navigate('/settings')} icon={<SettingOutlined style={{ fontSize: '18px', color: '#555' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F0F0F0', color: '#333' }}>
                <span style={{flex: 1}}>Settings</span>
                <span style={{color: '#999'}}>→</span>
              </Button>
              <Button type="text" block onClick={handleLogout} icon={<LogoutOutlined style={{ fontSize: '18px', color: '#E00000' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#E00000' }}>
                Logout
              </Button>
            </Card>
          </>

        ) : (

          /* --- STANDARD USER PROFILE CONTENT --- */
          <>
            {/* Stats Row */}
            <Row gutter={12} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#333' }}>0</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Submitted</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#333' }}>0</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Approved</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ borderRadius: '16px', border: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '16px 8px' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#333' }}>0</Title>
                  <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>Pending</Text>
                </Card>
              </Col>
            </Row>

            {/* My Achievements (Tags) */}
            <Card style={{ borderRadius: '20px', border: 'none', marginBottom: '24px', backgroundColor: '#FFFBF5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '20px' }}>
              <Title level={5} style={{ margin: '0 0 16px 0', fontWeight: 800, color: '#555' }}>
                <RibbonIcon /> My Achievements
              </Title>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Tag style={{ border: 'none', background: 'linear-gradient(90deg, #b020a2 0%, #df28b0 100%)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', margin: 0 }}>
                  <TrophyOutlined style={{ color: '#FFD700', marginRight: '4px' }} /> Quick Cook
                </Tag>
                <Tag style={{ border: 'none', background: 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '13px', margin: 0 }}>
                  <TrophyOutlined style={{ color: '#FFD700', marginRight: '4px' }} /> Master Chef
                </Tag>
              </div>
            </Card>

            {/* Cooked Recipes */}
            <Title level={5} style={{ margin: '0 0 16px 0', fontWeight: 800, color: '#555' }}>
              <ChefHatSmall /> Cooked Recipes ({cookedRecipes.length})
            </Title>
            
            {cookedRecipes.length === 0 ? (
               <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: '14px', fontStyle: 'italic' }}>
                 You haven't cooked any recipes yet.
               </Text>
            ) : (
              cookedRecipes.map((recipe, index) => (
                <Card key={index} style={{ borderRadius: '16px', border: 'none', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={5} style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{recipe.title}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <StarFilled style={{ color: '#FFB75E', fontSize: '16px' }} />
                      <Text style={{ fontWeight: 800, color: '#333', fontSize: '15px' }}>{recipe.rating || 5}</Text> 
                    </div>
                  </div>
                </Card>
              ))
            )}

            {/* My Submitted Recipes */}
            <Title level={5} style={{ margin: '24px 0 16px 0', fontWeight: 800, color: '#555' }}>
              My Submitted Recipes
            </Title>
            <Card style={{ borderRadius: '20px', border: 'none', marginBottom: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '32px 20px' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: '20px', fontSize: '14px' }}>
                You haven't submitted any recipes yet
              </Text>
              <Button 
                onClick={() => navigate('/add-recipe')}
                style={{ height: '44px', borderRadius: '8px', fontWeight: 700, background: 'linear-gradient(90deg, #D45106 0%, #D43806 100%)', color: 'white', border: 'none', padding: '0 24px' }}
              >
                Add Your First Recipe
              </Button>
            </Card>

            {/* Settings & Logout */}
            <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '8px' }}>
              <Button type="text" block onClick={() => navigate('/settings')} icon={<SettingOutlined style={{ fontSize: '18px', color: '#555' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #F0F0F0', color: '#333' }}>
                <span style={{flex: 1}}>Settings</span>
                <span style={{color: '#999'}}>→</span>
              </Button>
              <Button type="text" block onClick={handleLogout} icon={<LogoutOutlined style={{ fontSize: '18px', color: '#E00000' }} />} style={{ height: '56px', textAlign: 'left', padding: '0 16px', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', color: '#E00000' }}>
                Logout
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};