import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, message, Input } from 'antd';
import { 
  LeftOutlined, ClockCircleOutlined, UserOutlined, 
  CheckCircleFilled, EyeOutlined, HomeOutlined, EditOutlined, 
  CheckOutlined, SendOutlined, CloseOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import { api } from './api';

const { Title, Text, Link } = Typography;

// --- Shared Styles ---
const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  padding: '24px',
  paddingBottom: '100px',
};

const cardStyle = {
  width: '100%', borderRadius: '20px', border: 'none', 
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px', overflow: 'hidden'
};

const ChefHatSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

// ==========================================
// 1. RECIPE PREVIEW SCREEN
// ==========================================
export const RecipePreview = () => {
  const navigate = useNavigate();
  const [isAiEditorOpen, setIsAiEditorOpen] = useState(false);
  const [editRequest, setEditRequest] = useState("");

  const steps = [
    "Wash and soak rice for 30 minutes",
    "Marinate chicken with yogurt and spices for 1 hour",
    "Fry onions until golden brown, set aside half for garnish",
    "Cook marinated chicken with tomatoes",
    "Boil rice until 70% cooked, drain",
    "Layer rice and chicken in a heavy-bottomed pot",
    "Add saffron milk, fried onions, and ghee on top",
    "Cover and cook on low heat for 20 minutes",
    "Let it rest for 5 minutes before serving"
  ];

  const handleAiSubmit = () => {
    if (!editRequest.trim()) return;
    const hide = message.loading("AI is adjusting your recipe...", 0);
    setTimeout(() => {
      hide();
      message.success("Recipe updated based on your request!");
      setEditRequest("");
    }, 1600);
  };

  const handleFinalSubmit = async () => {
    const newRecipe = {
      title: "Grandmother's Special Biryani",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
      time: "2 hours",
      servings: "6 servings",
      diff: "Medium",
      diffColor: "#D48806",
      diffBg: "#FFFBE6",
      desc: "A traditional recipe from Hyderabad, India, a pinnacle of South Indian and Hyderabadi cooking.",
      story: "This rich, aromatic biryani uses a slow-cooking 'dum' method to trap the steam, infusing the basmati rice with exotic spices and tender meat.",
      ingredients: ["2 cups Basmati Rice", "500g Chicken", "Saffron strands", "Whole spices (cardamom, cloves, cinnamon)", "Crispy fried onions", "Ghee"],
      steps: ["Soak rice for 30 minutes", "Marinate meat in yogurt and spices overnight", "Parboil rice with whole spices", "Layer meat and rice in a heavy-bottomed pot", "Top with saffron milk and fried onions", "Seal pot and slow-cook on low heat for 45 mins"],
      rating: 4.9,
      cookedCount: 800
    };
    try {
      await api.createRecipe(newRecipe);
      message.success("Recipe submitted for review!");
      navigate('/submission-success');
    } catch (err) {
      message.error(err.message || "Failed to submit recipe");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Link onClick={() => navigate(-1)} style={{ color: '#555', fontWeight: 600 }}>
          <LeftOutlined /> Back
        </Link>
      </div>

      <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>Review Your Recipe</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '24px' }}>Check the details before submitting</Text>

      <Card style={cardStyle} bodyStyle={{ padding: 0 }}>
        <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80" alt="Biryani" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <div style={{ padding: '20px' }}>
          <Title level={3} style={{ margin: '0 0 16px 0', fontWeight: 800 }}>Grandmother's Special Biryani</Title>
          <div style={{ display: 'flex', gap: '16px', color: '#FF5238', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            <span style={{ color: '#666' }}><ClockCircleOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> 2 hours</span>
            <span style={{ color: '#666' }}><UserOutlined style={{ color: '#FF5238', marginRight: '4px' }}/> 6 servings</span>
            <span style={{ color: '#666' }}><ChefHatSmall /> Medium</span>
          </div>
        </div>
      </Card>

      <Card style={{...cardStyle, padding: '20px'}}>
        <Title level={4} style={{ fontWeight: 800, marginTop: 0 }}>Cooking Steps</Title>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: '#FFF0E6', color: '#FF5238', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', marginRight: '16px', flexShrink: 0 }}>
              {i + 1}
            </div>
            <Text style={{ color: '#000', fontWeight: 500, fontSize: '14px', paddingTop: '4px' }}>{step}</Text>
          </div>
        ))}
      </Card>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        {isAiEditorOpen ? (
          <Button 
            onClick={() => setIsAiEditorOpen(false)}
            style={{ height: '54px', flex: 1, borderRadius: '12px', fontWeight: 600, backgroundColor: '#E65100', color: 'white', border: 'none' }}
          >
            <CloseOutlined /> Close AI Chat
          </Button>
        ) : (
          <Button 
            onClick={() => setIsAiEditorOpen(true)}
            style={{ height: '54px', flex: 1, borderRadius: '12px', fontWeight: 600, borderColor: '#E2E8F0', color: '#333' }}
          >
            <ThunderboltOutlined style={{ color: '#8A2BE2', marginRight: '8px' }} /> Edit with AI
          </Button>
        )}
        
        <Button 
          style={{ height: '54px', flex: 1.5, borderRadius: '12px', fontWeight: 700, background: 'linear-gradient(90deg, #FF7E27 0%, #F83A3A 100%)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.25)' }}
          onClick={handleFinalSubmit}
        >
          <CheckOutlined /> Submit Recipe
        </Button>
      </div>

      {isAiEditorOpen && (
        <Card 
          style={{ 
            marginTop: '24px', borderRadius: '24px', border: 'none', 
            overflow: 'hidden', boxShadow: '0 12px 32px rgba(138, 43, 226, 0.15)' 
          }} 
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ background: '#8A2BE2', padding: '16px 20px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ThunderboltOutlined style={{ fontSize: '18px' }} />
              <Text strong style={{ color: 'white', fontSize: '16px' }}>AI Recipe Editor</Text>
            </div>
          </div>
          
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
             <ThunderboltOutlined style={{ fontSize: '48px', color: '#D1C4E9', marginBottom: '16px' }} />
            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '24px' }}>
              Try: "Make it less spicy", "Add more servings", <br/> or "Make it vegetarian"
            </Text>
            
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
              <Input 
                placeholder="Type your edit request..." 
                value={editRequest}
                onChange={(e) => setEditRequest(e.target.value)}
                onPressEnter={handleAiSubmit}
                style={{ borderRadius: '12px', height: '48px' }}
              />
              <Button 
                onClick={handleAiSubmit}
                type="primary" 
                icon={<SendOutlined />} 
                style={{ height: '48px', width: '48px', borderRadius: '12px', background: '#B37FEB', border: 'none' }} 
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// ==========================================
// 2. SUBMISSION SUCCESS SCREEN
// ==========================================
export const SubmissionSuccess = () => {
  const navigate = useNavigate();
  return (
    <div style={{...pageStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}}>
      <div style={{
        width: '80px', height: '80px', backgroundColor: '#24E19C',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
        color: 'white', fontSize: '40px', boxShadow: '0 8px 24px rgba(36, 225, 156, 0.3)'
      }}>
        <CheckCircleFilled />
      </div>
      <Title level={2} style={{ color: '#000', fontWeight: 800 }}>Recipe Submitted!</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '32px' }}>
        Your recipe has been successfully submitted and is now pending review.
      </Text>

      <Card style={{...cardStyle, padding: '24px', textAlign: 'left'}}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FFFBF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '16px' }}>
            ⏳
          </div>
          <div>
            <Text style={{ display: 'block', fontWeight: 800, fontSize: '15px' }}>Status: Pending Review</Text>
            <Text style={{ color: '#666', fontSize: '13px' }}>Track your submission in your profile</Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => navigate('/profile')} style={{ height: '44px', width: '50%', borderRadius: '8px', fontWeight: 600 }}>
            <EyeOutlined /> Status
          </Button>
          <Button 
            style={{ height: '44px', width: '50%', borderRadius: '8px', fontWeight: 700, backgroundColor: '#FF5238', color: 'white', border: 'none' }}
            onClick={() => navigate('/dashboard')}
          >
            <HomeOutlined /> Home
          </Button>
        </div>
      </Card>
    </div>
  );
};