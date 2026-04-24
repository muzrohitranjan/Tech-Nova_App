import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin } from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  PlusOutlined, 
  BookOutlined, 
  StarFilled, 
  FireFilled, 
  AudioOutlined, 
  FilePdfOutlined, 
  EditOutlined, 
  RightOutlined, 
  BulbFilled,
  LeftOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { api } from './api';

const { Title, Text, Link } = Typography;

const pageStyle = {
  backgroundColor: '#FCF4F1',
  minHeight: '100vh',
  paddingBottom: '80px',
};

// --- CENTRAL RECIPE DATABASE ---
// This is the source of truth for the app
export const recipesData = [
  { 
    id: 1, 
    title: "Punjabi Chole Bhature", 
    img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80", 
    time: "1 hour", 
    servings: "4 servings", 
    diff: "Medium",
    rating: 4.9,
    cookedCount: 2840 
  },
  { 
    id: 2, 
    title: "Kerala Chicken Curry", 
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80", 
    time: "45 mins", 
    servings: "6 servings", 
    diff: "Medium",
    rating: 4.8,
    cookedCount: 3100
  },
  { 
    id: 3, 
    title: "Hyderabadi Dum Biryani", 
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80", 
    time: "2 hours", 
    servings: "6 servings", 
    diff: "Hard",
    rating: 5.0,
    cookedCount: 1520
  },
  { 
    id: 4, 
    title: "Bengali Fish Curry", 
    img: "https://images.unsplash.com/photo-1599020792689-9fde4588c052?auto=format&fit=crop&w=400&q=80", 
    time: "40 mins", 
    servings: "4 servings", 
    diff: "Medium",
    rating: 4.7,
    cookedCount: 940
  }
];

// --- CUSTOM SVG ICONS ---
const ChefHatWhite = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
    <line x1="6" y1="17" x2="18" y2="17"></line>
  </svg>
);

const OpenBookOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

// ==========================================
// 1. DASHBOARD (HOME) SCREEN
// ==========================================
export const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Chef");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.name) setUserName(parsedUser.name.split(' ')[0]);
    }
    api.getRecipes({ status: 'approved' })
      .then(data => { setRecipes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Sorts by rating then by popularity (number of people who cooked it)
  const popularRecipes = [...recipes].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.cookedCount - a.cookedCount;
  }).slice(0, 3);

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', 
        padding: '50px 24px 60px 24px', 
        borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800 }}>Hello, {userName}!</Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>What would you like to cook today?</Text>
      </div>

      <div style={{ padding: '0 24px', marginTop: '-30px' }}>
        
        {/* Main Navigation Action Cards */}
        <Card onClick={() => navigate('/recipes')} style={{ borderRadius: '20px', border: 'none', marginBottom: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#FF6B6B', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChefHatWhite /></div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800, fontSize: '17px' }}>Start Guided Cooking</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>Step-by-step instructions</Text>
          </div>
        </Card>

        <Card onClick={() => navigate('/add-recipe')} style={{ borderRadius: '20px', border: 'none', marginBottom: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#6B9AFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}><PlusOutlined /></div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800, fontSize: '17px' }}>Add / Record Recipe</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>Document your family recipes</Text>
          </div>
        </Card>

        <Card onClick={() => navigate('/recipes')} style={{ borderRadius: '20px', border: 'none', marginBottom: '32px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }} bodyStyle={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#20D68A', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><OpenBookOutline /></div>
          <div>
            <Title level={4} style={{ margin: 0, fontWeight: 800, fontSize: '17px' }}>Browse Recipes</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>Explore cultural dishes</Text>
          </div>
        </Card>

        {/* Popular Recipes Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3} style={{ margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FireFilled style={{ color: '#FF4D4F' }}/> Popular Recipes
          </Title>
          <Text onClick={() => navigate('/recipes')} style={{ color: '#F83A3A', fontWeight: 700, cursor: 'pointer' }}>See All</Text>
        </div>

        {/* Dynamic Recipe Ranking */}
        {popularRecipes.map((recipe, index) => (
          <Card key={index} onClick={() => navigate('/recipe-detail', { state: { recipe } })} style={{ borderRadius: '20px', border: 'none', marginBottom: '16px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={recipe.img} alt={recipe.title} style={{ width: '85px', height: '85px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, lineHeight: 1.2 }}>{recipe.title}</Title>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
                <Text type="secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><ClockCircleOutlined style={{ marginRight: '4px' }} /> {recipe.time}</Text>
                <Text type="secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><UserOutlined style={{ marginRight: '4px' }} /> {recipe.servings}</Text>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ backgroundColor: '#FFFBE6', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <StarFilled style={{ color: '#FAAD14', fontSize: '10px' }} />
                  <Text style={{ fontSize: '11px', fontWeight: 700, color: '#D48806' }}>{recipe.rating}</Text>
                </div>
                <div style={{ backgroundColor: '#FFF1F0', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FireFilled style={{ color: '#FF4D4F', fontSize: '10px' }} />
                  <Text style={{ fontSize: '11px', fontWeight: 700, color: '#CF1322' }}>{(recipe.cookedCount/1000).toFixed(1)}k Cooks</Text>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. ADD RECIPE (SELECTION) SCREEN
// ==========================================
export const AddRecipe = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link onClick={() => navigate('/dashboard')} style={{ color: '#555', fontWeight: 600, fontSize: '15px' }}><LeftOutlined /> Back</Link>
      </div>
      
      <Title level={2} style={{ color: '#000', fontWeight: 800, margin: 0 }}>Add Your Recipe</Title>
      <Text style={{ color: '#555', fontSize: '15px', display: 'block', marginBottom: '32px' }}>
        Choose how you'd like to document your recipe
      </Text>

      {/* Method 1: Record - Pink Gradient */}
      <Card onClick={() => navigate('/voice-recording')} style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #FF1E6D 0%, #FF4D4D 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px' }}>
          <AudioOutlined />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Record Voice</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Share your recipe by speaking. Perfect for capturing family stories.</Text>
        </div>
        <RightOutlined style={{ color: '#BFBFBF' }} />
      </Card>

      {/* Method 2: Audio Upload - Orange Gradient */}
      <Card onClick={() => navigate('/upload-audio')} style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #FF7E27 0%, #FFB75E 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px' }}>
          <UploadOutlined />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Upload Audio</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Already have an audio recording? Upload it here for AI processing.</Text>
        </div>
        <RightOutlined style={{ color: '#BFBFBF' }} />
      </Card>

      {/* Method 3: PDF Upload - Purple Gradient */}
      <Card onClick={() => navigate('/upload-pdf')} style={{ borderRadius: '24px', border: 'none', marginBottom: '20px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }} bodyStyle={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #8A2BE2 0%, #6A5ACD 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px' }}>
          <FilePdfOutlined />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Upload PDF / Image</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Scan a handwritten note or upload a PDF of an old family cookbook.</Text>
        </div>
        <RightOutlined style={{ color: '#BFBFBF' }} />
      </Card>

      {/* AI Informative Tip Box */}
      <div style={{ backgroundColor: '#EBF3FF', borderRadius: '16px', padding: '20px', marginTop: '32px', border: '1px solid #D6E6FF' }}>
        <Text style={{ color: '#1A5DAB', fontSize: '13px', lineHeight: '1.5', display: 'block' }}>
          💡 <strong>Tip:</strong> Our AI will analyze your recipe and ask questions to capture cultural context and family traditions.
        </Text>
      </div>
    </div>
  );
};