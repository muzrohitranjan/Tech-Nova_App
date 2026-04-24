import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Progress, Input, message, Spin } from 'antd';
import { 
  LeftOutlined, AudioOutlined, UploadOutlined, FilePdfOutlined, 
  BulbFilled, CheckCircleFilled, RightOutlined, LoadingOutlined 
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

// --- Shared Styles ---
const pageStyle = { backgroundColor: '#FCF4F1', minHeight: '100vh', padding: '24px' };
const actionCardStyle = { 
    display: 'flex', alignItems: 'center', backgroundColor: '#FFF', borderRadius: '20px', 
    padding: '16px 20px', marginBottom: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
    cursor: 'pointer', border: 'none' 
};
const dropZoneStyle = {
    border: '2px dashed #D9D9D9', borderRadius: '20px', padding: '40px 20px',
    textAlign: 'center', backgroundColor: '#FFF', cursor: 'pointer', marginBottom: '24px'
};

const IconBox = ({ gradient, children }) => (
  <div style={{
    width: '56px', height: '56px', borderRadius: '16px',
    background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#FFF', fontSize: '28px', marginRight: '16px', flexShrink: 0
  }}>{children}</div>
);

// ==========================================
// 1. RECORD VOICE SCREEN
// ==========================================
export const RecordVoice = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRecording(false);
    navigate('/ai-processing');
  };

  return (
    <div style={pageStyle}>
      <Link onClick={() => navigate('/add-recipe')} style={{ color: '#555', fontWeight: 600 }}><LeftOutlined /> Back</Link>
      <Title level={2} style={{ marginTop: '24px', fontWeight: 800 }}>Record Your Recipe</Title>
      <Text style={{ color: '#666', fontSize: '15px' }}>Speak naturally about your recipe and cooking process</Text>

      <Card style={{ borderRadius: '24px', border: 'none', marginTop: '40px', textAlign: 'center', padding: '40px 20px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 24px auto',
            background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isRecording ? '0 0 0 15px rgba(248, 58, 58, 0.1)' : 'none',
            transition: 'all 0.3s'
        }}>
          <AudioOutlined style={{ fontSize: '48px', color: 'white' }} />
        </div>
        <Title level={1} style={{ margin: 0, fontWeight: 800 }}>{formatTime(seconds)}</Title>
        <Text type="secondary">{isRecording ? "Recording..." : "Ready to record"}</Text>
        
        {!isRecording ? (
          <Button onClick={() => setIsRecording(true)} size="large" style={{ marginTop: '32px', height: '54px', borderRadius: '16px', background: '#E65100', color: 'white', width: '100%', border: 'none', fontWeight: 700 }}>
            <AudioOutlined /> Start Recording
          </Button>
        ) : (
          <Button onClick={handleStop} size="large" style={{ marginTop: '32px', height: '54px', borderRadius: '16px', background: '#000', color: 'white', width: '100%', border: 'none', fontWeight: 700 }}>
            Stop & Process
          </Button>
        )}
      </Card>

      <div style={{ backgroundColor: '#EBF3FF', borderRadius: '16px', padding: '16px', marginTop: '32px' }}>
         <Text style={{ color: '#1A5DAB', fontSize: '13px' }}>
           <BulbFilled style={{ color: '#FFB75E', marginRight: '8px' }} />
           <strong>Recording Tips:</strong> Speak clearly, include quantities, and share any special techniques or family stories.
         </Text>
      </div>
    </div>
  );
};

// ==========================================
// 2. UPLOAD AUDIO / PDF SCREENS
// ==========================================
export const UploadAudio = () => <FileUploader type="Audio" icon={<UploadOutlined />} format="MP3, WAV, M4A, AAC" />;
export const UploadPDF = () => <FileUploader type="PDF Document" icon={<FilePdfOutlined />} format="PDF documents only" />;

const FileUploader = ({ type, icon, format }) => {
  const navigate = useNavigate();
  return (
    <div style={pageStyle}>
      <Link onClick={() => navigate('/add-recipe')} style={{ color: '#555', fontWeight: 600 }}><LeftOutlined /> Back</Link>
      <Title level={2} style={{ marginTop: '24px', fontWeight: 800 }}>Upload {type}</Title>
      <Text style={{ color: '#666', fontSize: '15px' }}>Upload your recipe recording for AI analysis</Text>

      <div style={{ ...dropZoneStyle, marginTop: '40px' }} onClick={() => navigate('/ai-processing')}>
        <div style={{ fontSize: '48px', color: '#BFBFBF', marginBottom: '16px' }}>{icon}</div>
        <Text strong style={{ fontSize: '16px', display: 'block' }}>Click to upload {type}</Text>
        <Text type="secondary">{format}</Text>
      </div>

      <div style={{ backgroundColor: '#EBF3FF', borderRadius: '16px', padding: '16px' }}>
         <Text style={{ color: '#1A5DAB', fontSize: '13px' }}>
           <strong>Note:</strong> Max file size: 50MB. AI will extract structured data from your upload.
         </Text>
      </div>
    </div>
  );
};

// ==========================================
// 3. AI PROCESSING SCREEN
// ==========================================
export const AiProcessing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Transcribing audio/text...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/cultural-questions'), 500);
          return 100;
        }
        if (p === 25) setStatus("Extracting ingredients...");
        if (p === 50) setStatus("Identifying cooking steps...");
        if (p === 75) setStatus("Preparing cultural questions...");
        return p + 1;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ ...pageStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #FF7E27 0%, #F83A3A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        <LoadingOutlined style={{ fontSize: '40px', color: 'white' }} />
      </div>
      <Title level={2} style={{ fontWeight: 800 }}>Analyzing Your Recipe</Title>
      <Text style={{ color: '#666', fontSize: '16px', marginBottom: '40px', maxWidth: '300px', display: 'block' }}>
        Our AI is extracting structured data from your recipe, including ingredients and steps.
      </Text>

      <Card style={{ width: '100%', borderRadius: '24px', border: 'none', textAlign: 'left', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
          <Text strong style={{ fontSize: '15px' }}>{status}</Text>
        </div>
        <Progress percent={progress} strokeColor={{ '0%': '#FF7E27', '100%': '#F83A3A' }} showInfo={false} />
      </Card>
    </div>
  );
};

// ==========================================
// 4. CULTURAL QUESTIONS SCREEN
// ==========================================
export const CulturalQuestions = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const questions = [
    { q: "What is the cultural origin or region of this recipe?", hint: "e.g., Southern Italy, Kerala India, Mexico City..." },
    { q: "Are there any family traditions or stories associated with this dish?", hint: "Share any special memories or occasions..." },
    { q: "Are there any special techniques or tips passed down in your family?", hint: "e.g., specific cooking methods, ingredient choices..." },
    { q: "What occasions or celebrations is this recipe typically made for?", hint: "e.g., holidays, family gatherings, everyday meals..." }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/recipe-preview');
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text type="secondary" strong>Question {step} of 4</Text>
        <Text style={{ color: '#E65100', fontWeight: 800 }}>{step * 25}%</Text>
      </div>
      <Progress percent={step * 25} showInfo={false} strokeColor="#E65100" style={{ marginBottom: '32px' }} />

      <Card style={{ borderRadius: '24px', border: 'none', padding: '20px', minHeight: '340px', boxShadow: '0 12px 32px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#FFF0E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E65100', fontWeight: 800, marginBottom: '24px' }}>
          {step}
        </div>
        <Title level={3} style={{ fontWeight: 800, lineHeight: 1.3, marginBottom: '24px' }}>{questions[step-1].q}</Title>
        <Input.TextArea rows={6} placeholder={questions[step-1].hint} style={{ borderRadius: '16px', padding: '16px', backgroundColor: '#F8F9FA' }} />
      </Card>

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
        <Button size="large" onClick={() => setStep(step > 1 ? step - 1 : 1)} style={{ flex: 1, height: '54px', borderRadius: '16px', fontWeight: 600 }}>Skip</Button>
        <Button type="primary" size="large" onClick={handleNext} style={{ flex: 2, height: '54px', borderRadius: '16px', background: '#E65100', border: 'none', fontWeight: 700 }}>
          {step === 4 ? "Review Recipe" : "Next Question"} <RightOutlined />
        </Button>
      </div>
    </div>
  );
};