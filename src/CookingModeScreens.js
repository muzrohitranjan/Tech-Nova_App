import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Typography, Progress, Rate, Tag } from 'antd';
import { 
    LeftOutlined, RightOutlined, AudioOutlined, ReloadOutlined, 
    HomeOutlined, BookOutlined, TrophyFilled, GlobalOutlined
  } from '@ant-design/icons';
const { Title, Text } = Typography;

// --- EXPANDED MOCK TRANSLATION DICTIONARY ---
const mockTranslations = {
  // --- SHARED STEPS ---
  "Sauté onions and ginger-garlic paste until golden": {
    'Hindi': "प्याज और अदरक-लहसुन के पेस्ट को सुनहरा होने तक भूनें",
    'Kannada': "ಈರುಳ್ಳಿ ಮತ್ತು ಶುಂಠಿ-ಬೆಳ್ಳುಳ್ಳಿ ಪೇಸ್ಟ್ ಅನ್ನು ಹೊಂಬಣ್ಣ ಬರುವವರೆಗೆ ಹುರಿಯಿರಿ",
    'Tamil': "வெங்காயம் மற்றும் இஞ்சி-பூண்டு விழுது பொன்னிறமாகும் வரை வதக்கவும்",
    'Telugu': "ఉల్లిపాయలు మరియు అల్లం వెల్లుల్లి పేస్ట్ బంగారు రంగు వచ్చేవరకు వేయించాలి",
    'Malayalam': "ഉള്ളിയും ഇഞ്ചി-വെളുത്തുള്ളി പേസ്റ്റും സ്വർണ്ണ നിറമാകുന്നത് വരെ വഴറ്റുക"
  },

  // --- PUNJABI CHOLE BHATURE ---
  "Soak chickpeas overnight and pressure cook until soft": {
    'Hindi': "छोले को रात भर भिगोएं और नरम होने तक प्रेशर कुक करें",
    'Kannada': "ಕಡಲೆಯನ್ನು ರಾತ್ರಿಯಿಡೀ ನೆನೆಸಿ ಮತ್ತು ಮೃದುವಾಗುವವರೆಗೆ ಪ್ರೆಶರ್ ಕುಕ್ ಮಾಡಿ",
    'Tamil': "கொண்டைக்கடலையை இரவு முழுவதும் ஊறவைத்து, மிருதுவாகும் வரை பிரஷர் குக் செய்யவும்",
    'Telugu': "శనగలను రాత్రిపూట నానబెట్టి, మెత్తబడే వరకు ప్రెషర్ కుక్ చేయండి",
    'Malayalam': "കടല രാത്രി മുഴുവൻ കുതിർക്കാൻ വെക്കുക, മൃദുവാകുന്നതുവരെ പ്രഷർ കുക്ക് ചെയ്യുക"
  },
  "Add tomato puree and chole masala, cook until oil separates": {
    'Hindi': "टमाटर की प्यूरी और छोले मसाला डालें, तेल अलग होने तक पकाएं",
    'Kannada': "ಟೊಮೆಟೊ ಪ್ಯೂರಿ ಮತ್ತು ಚೋಲೆ ಮಸಾಲ ಸೇರಿಸಿ, ಎಣ್ಣೆ ಬೇರ್ಪಡುವವರೆಗೆ ಬೇಯಿಸಿ",
    'Tamil': "தக்காளி கூழ் மற்றும் சோலே மசாலா சேர்த்து, எண்ணெய் பிரியும் வரை சமைக்கவும்",
    'Telugu': "టొమాటో ప్యూరీ మరియు చోలే మసాలా వేసి, నూనె వేరు పడే వరకు ఉడికించాలి",
    'Malayalam': "തക്കാളി പ്യൂരിയും ചോലെ മസാലയും ചേർക്കുക, എണ്ണ വേർതിരിയുന്നതുവരെ വേവിക്കുക"
  },
  "Mix in the boiled chickpeas and simmer for 15 minutes": {
    'Hindi': "उबले हुए छोले मिलाएं और 15 मिनट तक धीमी आंच पर पकाएं",
    'Kannada': "ಬೇಯಿಸಿದ ಕಡಲೆಯನ್ನು ಬೆರೆಸಿ ಮತ್ತು 15 ನಿಮಿಷಗಳ ಕಾಲ ಕಡಿಮೆ ಉರಿಯಲ್ಲಿ ಬೇಯಿಸಿ",
    'Tamil': "வேகவைத்த கொண்டைக்கடலையை கலந்து 15 நிமிடங்கள் இளஞ்சூட்டில் கொதிக்க வைக்கவும்",
    'Telugu': "ఉడికించిన శనగలను కలిపి 15 నిమిషాలు సన్నని మంట మీద ఉడికించాలి",
    'Malayalam': "വേവിച്ച കടല ചേർത്ത് 15 മിനിറ്റ് വേവിക്കുക"
  },
  "Fry the bhature dough in hot oil until puffed": {
    'Hindi': "भटूरे के आटे को गरम तेल में फूलने तक तलें",
    'Kannada': "ಭಟೂರೆ ಹಿಟ್ಟನ್ನು ಬಿಸಿ ಎಣ್ಣೆಯಲ್ಲಿ ಉಬ್ಬುವವರೆಗೆ ಕರಿಯಿರಿ",
    'Tamil': "பட்டுரா மாவை சூடான எண்ணெயில் உப்பும் வரை பொரிக்கவும்",
    'Telugu': "భటూరే పిండిని వేడి నూనెలో ఉబ్బే వరకు వేయించాలి",
    'Malayalam': "ഭട്ടൂര മാവ് ചൂടായ എണ്ണയിൽ വീർക്കുന്നതുവരെ വറുത്തെടുക്കുക"
  },
  "Serve hot, garnished with coriander and onions": {
    'Hindi': "धनिया और प्याज से सजाकर गरमागरम परोसें",
    'Kannada': "ಕೊತ್ತಂಬರಿ ಮತ್ತು ಈರುಳ್ಳಿಯಿಂದ ಅಲಂಕರಿಸಿ, ಬಿಸಿಯಾಗಿ ಬಡಿಸಿ",
    'Tamil': "கொத்தமல்லி மற்றும் வெங்காயத்தால் அலங்கரித்து, சூடாக பரிமாறவும்",
    'Telugu': "కొత్తిమీర మరియు ఉల్లిపాయలతో అలంకరించి, వేడిగా వడ్డించండి",
    'Malayalam': "മല്ലിയിലയും ഉള്ളിയും ഉപയോഗിച്ച് അലങ്കരിച്ച് ചൂടോടെ വിളമ്പുക"
  },

  // --- KERALA CHICKEN CURRY ---
  "Marinate chicken with turmeric and salt": {
    'Hindi': "हल्दी और नमक के साथ चिकन को मैरीनेट करें",
    'Kannada': "ಅರಿಶಿನ ಮತ್ತು ಉಪ್ಪಿನೊಂದಿಗೆ ಚಿಕನ್ ಅನ್ನು ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿ",
    'Tamil': "மஞ்சள் மற்றும் உப்புடன் சிக்கனை ஊறவைக்கவும்",
    'Telugu': "పసుపు మరియు ఉప్పుతో చికెన్‌ను మ్యారినేట్ చేయండి",
    'Malayalam': "മഞ്ഞളും ഉപ്പും ഉപയോഗിച്ച് ചിക്കൻ മാരിനേറ്റ് ചെയ്യുക"
  },
  "Add tomatoes and curry spices, cook until oil separates": {
    'Hindi': "टमाटर और करी मसाले डालें, तेल अलग होने तक पकाएं",
    'Kannada': "ಟೊಮ್ಯಾಟೊ ಮತ್ತು ಕರಿ ಮಸಾಲೆಗಳನ್ನು ಸೇರಿಸಿ, ಎಣ್ಣೆ ಬೇರ್ಪಡುವವರೆಗೆ ಬೇಯಿಸಿ",
    'Tamil': "தக்காளி மற்றும் கறி மசாலா சேர்த்து, எண்ணெய் பிரியும் வரை சமைக்கவும்",
    'Telugu': "టొమాటోలు మరియు కర్రీ మసాలా వేసి, నూనె వేరు పడే వరకు ఉడికించాలి",
    'Malayalam': "തക്കാളിയും കറി മസാലകളും ചേർക്കുക, എണ്ണ വേർതിരിയുന്നതുവരെ വേവിക്കുക"
  },
  "Add the chicken and sear on all sides": {
    'Hindi': "चिकन डालें और सभी तरफ से भूनें",
    'Kannada': "ಚಿಕನ್ ಸೇರಿಸಿ ಮತ್ತು ಎಲ್ಲಾ ಕಡೆ ಹುರಿಯಿರಿ",
    'Tamil': "சிக்கனை சேர்த்து அனைத்து பக்கங்களிலும் வதக்கவும்",
    'Telugu': "చికెన్ వేసి అన్ని వైపులా వేయించాలి",
    'Malayalam': "ചിക്കൻ ചേർത്ത് എല്ലാ വശവും മൊരിച്ചെടുക്കുക"
  },
  "Pour in coconut milk and simmer for 25 minutes": {
    'Hindi': "नारियल का दूध डालें और 25 मिनट तक धीमी आंच पर पकाएं",
    'Kannada': "ತೆಂಗಿನ ಹಾಲು ಸುರಿಯಿರಿ ಮತ್ತು 25 ನಿಮಿಷಗಳ ಕಾಲ ಕಡಿಮೆ ಉರಿಯಲ್ಲಿ ಬೇಯಿಸಿ",
    'Tamil': "தேங்காய் பால் ஊற்றி 25 நிமிடங்கள் இளஞ்சூட்டில் கொதிக்க வைக்கவும்",
    'Telugu': "కొబ్బరి పాలు పోసి 25 నిమిషాలు సన్నని మంట మీద ఉడికించాలి",
    'Malayalam': "തേങ്ങാപ്പാൽ ഒഴിച്ച് 25 മിനിറ്റ് ചെറുതീയിൽ വേവിക്കുക"
  },
  "Garnish with fresh curry leaves and serve hot": {
    'Hindi': "ताजा करी पत्ते से सजाकर गरमागरम परोसें",
    'Kannada': "ತಾಜಾ ಕರಿಬೇವಿನ ಎಲೆಗಳಿಂದ ಅಲಂಕರಿಸಿ ಮತ್ತು ಬಿಸಿಯಾಗಿ ಬಡಿಸಿ",
    'Tamil': "புதிய கறிவேப்பிலையால் அலங்கரித்து சூடாக பரிமாறவும்",
    'Telugu': "తాజా కరివేపాకుతో అలంకరించి వేడిగా వడ్డించండి",
    'Malayalam': "കറിവേപ്പില വെച്ച് അലങ്കരിച്ചു ചൂടോടെ വിളമ്പുക"
  },

  // --- HYDERABADI DUM BIRYANI ---
  "Soak rice for 30 minutes": {
    'Hindi': "चावल को 30 मिनट के लिए भिगो दें",
    'Kannada': "ಅಕ್ಕಿಯನ್ನು 30 ನಿಮಿಷಗಳ ಕಾಲ ನೆನೆಸಿಡಿ",
    'Tamil': "அரிசியை 30 நிமிடம் ஊறவைக்கவும்",
    'Telugu': "బియ్యాన్ని 30 నిమిషాలు నానబెట్టండి",
    'Malayalam': "അരി 30 മിനിറ്റ് കുതിർക്കാൻ വെക്കുക"
  },
  "Marinate meat in yogurt and spices overnight": {
    'Hindi': "मांस को दही और मसालों में रात भर मैरीनेट करें",
    'Kannada': "ಮೊಸರು ಮತ್ತು ಮಸಾಲೆಗಳಲ್ಲಿ ಮಾಂಸವನ್ನು ರಾತ್ರಿಯಿಡೀ ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿ",
    'Tamil': "இறைச்சியை தயிர் மற்றும் மசாலாக்களில் இரவு முழுவதும் ஊறவைக்கவும்",
    'Telugu': "మాంసాన్ని పెరుగు మరియు మసాలా దినుసులలో రాత్రిపూట మ్యారినేట్ చేయండి",
    'Malayalam': "ഇറച്ചി തൈരും മസാലകളും ചേർത്ത് രാത്രി മുഴുവൻ വെക്കുക"
  },
  "Parboil rice with whole spices": {
    'Hindi': "चावल को साबुत मसालों के साथ आधा उबाल लें",
    'Kannada': "ಸಂಪೂರ್ಣ ಮಸಾಲೆಗಳೊಂದಿಗೆ ಅಕ್ಕಿಯನ್ನು ಅರ್ಧ ಬೇಯಿಸಿ",
    'Tamil': "முழு மசாலாக்களுடன் அரிசியை பாதி வேகவைக்கவும்",
    'Telugu': "మసాలా దినుసులతో బియ్యాన్ని సగం ఉడికించాలి",
    'Malayalam': "മുഴുവൻ മസാലകൾക്കൊപ്പം അരി പകുതി വേവിക്കുക"
  },
  "Layer meat and rice in a heavy-bottomed pot": {
    'Hindi': "एक भारी तले वाले बर्तन में मांस और चावल की परत लगाएं",
    'Kannada': "ಭಾರವಾದ ತಳದ ಪಾತ್ರೆಯಲ್ಲಿ ಮಾಂಸ ಮತ್ತು ಅಕ್ಕಿಯ ಪದರಗಳನ್ನು ಹಾಕಿ",
    'Tamil': "ஒரு கனமான அடிப்பகுதி கொண்ட பாத்திரத்தில் இறைச்சி மற்றும் அரிசியை அடுக்குகளாக வைக்கவும்",
    'Telugu': "మందపాటి అడుగు ఉన్న కుండలో మాంసం మరియు బియ్యం పొరలుగా వేయండి",
    'Malayalam': "കട്ടിയുള്ള അടിഭാഗമുള്ള പാത്രത്തിൽ ഇറച്ചിയും അരിയും അടുക്കുകളായി വെക്കുക"
  },
  "Top with saffron milk and fried onions": {
    'Hindi': "ऊपर से केसर का दूध और तले हुए प्याज डालें",
    'Kannada': "ಮೇಲೆ ಕೇಸರಿ ಹಾಲು ಮತ್ತು ಹುರಿದ ಈರುಳ್ಳಿ ಹಾಕಿ",
    'Tamil': "மேலே குங்குமப்பூ பால் மற்றும் வறுத்த வெங்காயத்தை சேர்க்கவும்",
    'Telugu': "పైన కుంకుమపువ్వు పాలు మరియు వేయించిన ఉల్లిపాయలు వేయండి",
    'Malayalam': "മുകളിൽ കുങ്കുമപ്പൂവ് പാലും വറുത്ത ഉള്ളിയും ചേർക്കുക"
  },
  "Seal pot and slow-cook on low heat for 45 mins": {
    'Hindi': "बर्तन को सील करें और 45 मिनट तक धीमी आंच पर पकाएं",
    'Kannada': "ಪಾತ್ರೆಯನ್ನು ಮುಚ್ಚಿ ಮತ್ತು 45 ನಿಮಿಷಗಳ ಕಾಲ ಕಡಿಮೆ ಉರಿಯಲ್ಲಿ ಬೇಯಿಸಿ",
    'Tamil': "பாத்திரத்தை மூடி, குறைந்த தீயில் 45 நிமிடங்கள் மெதுவாக சமைக்கவும்",
    'Telugu': "కుండను సీల్ చేసి, 45 నిమిషాల పాటు సన్నని మంట మీద నెమ్మదిగా ఉడికించాలి",
    'Malayalam': "പാത്രം അടച്ചു 45 മിനിറ്റ് ചെറുതീയിൽ വേവിക്കുക"
  },

  // --- BENGALI FISH CURRY ---
  "Marinate fish with salt and turmeric": {
    'Hindi': "मछली को नमक और हल्दी के साथ मैरीनेट करें",
    'Kannada': "ಮೀನನ್ನು ಉಪ್ಪು ಮತ್ತು ಅರಿಶಿನದೊಂದಿಗೆ ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿ",
    'Tamil': "மீனை உப்பு மற்றும் மஞ்சள் சேர்த்து ஊறவைக்கவும்",
    'Telugu': "చేపలను ఉప్పు మరియు పసుపుతో మ్యారినేట్ చేయండి",
    'Malayalam': "മത്സ്യം ഉപ്പും മഞ്ഞളും ചേർത്ത് മാരിനേറ്റ് ചെയ്യുക"
  },
  "Lightly fry the fish in mustard oil and set aside": {
    'Hindi': "मछली को सरसों के तेल में हल्का तल लें और अलग रख दें",
    'Kannada': "ಸಾಸಿವೆ ಎಣ್ಣೆಯಲ್ಲಿ ಮೀನನ್ನು ಲಘುವಾಗಿ ಹುರಿಯಿರಿ ಮತ್ತು ಪಕ್ಕಕ್ಕೆ ಇರಿಸಿ",
    'Tamil': "மீனை கடுகு எண்ணெயில் லேசாக வறுத்து தனியாக வைக்கவும்",
    'Telugu': "ఆవనూనెలో చేపలను కొద్దిగా వేయించి పక్కన పెట్టండి",
    'Malayalam': "മത്സ്യം കടുകെണ്ണയിൽ ചെറുതായി വറുത്തു മാറ്റിവെക്കുക"
  },
  "Temper the remaining oil with Panch Phoron and green chilies": {
    'Hindi': "बचे हुए तेल में पंच फोरन और हरी मिर्च का तड़का लगाएं",
    'Kannada': "ಉಳಿದ ಎಣ್ಣೆಗೆ ಪಂಚ್ ಫೋರಾನ್ ಮತ್ತು ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ ಒಗ್ಗರಣೆ ಕೊಡಿ",
    'Tamil': "மீதமுள்ள எண்ணெயில் பஞ்ச் போரோன் மற்றும் பச்சை மிளகாய் தாளிக்கவும்",
    'Telugu': "మిగిలిన నూనెలో పంచ్ ఫోరాన్ మరియు పచ్చిమిర్చి వేసి తాలింపు వేయండి",
    'Malayalam': "ബാക്കിയുള്ള എണ്ണയിൽ പഞ്ച് ഫോറോണും പച്ചമുളകും ചേർത്ത് താളിക്കുക"
  },
  "Add water, turmeric, and mustard paste to form a light gravy": {
    'Hindi': "हल्की ग्रेवी बनाने के लिए पानी, हल्दी और सरसों का पेस्ट डालें",
    'Kannada': "ತೆಳುವಾದ ಗ್ರೇವಿ ಮಾಡಲು ನೀರು, ಅರಿಶಿನ ಮತ್ತು ಸಾಸಿವೆ ಪೇಸ್ಟ್ ಸೇರಿಸಿ",
    'Tamil': "லேசான குழம்பு செய்ய தண்ணீர், மஞ்சள் மற்றும் கடுகு விழுது சேர்க்கவும்",
    'Telugu': "తేలికపాటి గ్రేవీ చేయడానికి నీరు, పసుపు మరియు ఆవాల పేస్ట్ వేయండి",
    'Malayalam': "ചെറിയ ഗ്രേവി ഉണ്ടാക്കാൻ വെള്ളവും മഞ്ഞളും കടുക് പേസ്റ്റും ചേർക്കുക"
  },
  "Gently slide the fried fish into the simmering gravy": {
    'Hindi': "तली हुई मछली को उबलती हुई ग्रेवी में धीरे से डालें",
    'Kannada': "ಹುರಿದ ಮೀನನ್ನು ಕುದಿಯುವ ಗ್ರೇವಿಗೆ ನಿಧಾನವಾಗಿ ಹಾಕಿ",
    'Tamil': "வறுத்த மீனை கொதிக்கும் குழம்பில் மெதுவாக சேர்க்கவும்",
    'Telugu': "వేయించిన చేపలను మరుగుతున్న గ్రేవీలోకి నెమ్మదిగా వదలండి",
    'Malayalam': "വറുത്ത മത്സ്യം തിളക്കുന്ന ഗ്രേവിയിലേക്ക് പതുക്കെ ചേർക്കുക"
  },
  "Cook for 5-7 minutes and serve with steamed rice": {
    'Hindi': "5-7 मिनट तक पकाएं और उबले हुए चावल के साथ परोसें",
    'Kannada': "5-7 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ ಮತ್ತು ಅನ್ನದೊಂದಿಗೆ ಬಡಿಸಿ",
    'Tamil': "5-7 நிமிடங்கள் சமைத்து, வேகவைத்த சாதத்துடன் பரிமாறவும்",
    'Telugu': "5-7 నిమిషాలు ఉడికించి, అన్నంతో వడ్డించండి",
    'Malayalam': "5-7 മിനിറ്റ് വേവിച്ചു ചോറിനൊപ്പം വിളമ്പുക"
  }
};

const getTranslatedText = (englishText, targetLang) => {
  if (targetLang === 'English') return englishText;
  return mockTranslations[englishText]?.[targetLang] || englishText;
};

// ==========================================
// 1. COOKING MODE SCREEN
// ==========================================
export const CookingMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || { title: "Recipe", steps: ["Step 1"] };
  const selectedLang = location.state?.selectedLang || 'English'; 
  
  const [currentStep, setCurrentStep] = useState(0);
  const progress = Math.round(((currentStep + 1) / recipe.steps.length) * 100);

  const currentEnglishText = recipe.steps[currentStep];
  const translatedText = getTranslatedText(currentEnglishText, selectedLang);

  useEffect(() => {
    const blockNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', blockNavigation);
    return () => window.removeEventListener('popstate', blockNavigation);
  }, []);

  const handleVoiceHint = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(translatedText);
      const langMap = {
        'Hindi': 'hi-IN',
        'Kannada': 'kn-IN',
        'Tamil': 'ta-IN',
        'Telugu': 'te-IN',
        'Malayalam': 'ml-IN',
        'English': 'en-US'
      };
      speech.lang = langMap[selectedLang] || 'en-US';
      speech.rate = 0.85; 
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser doesn't support voice synthesis.");
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/cooking-completed', { state: { recipe } });
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ background: 'linear-gradient(135deg, #E65100 0%, #F83A3A 100%)', padding: '40px 24px 24px 24px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Title level={4} style={{ color: '#FFF', margin: 0, maxWidth: '70%' }}>{recipe.title}</Title>
          {selectedLang !== 'English' && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GlobalOutlined style={{ color: '#FFF', fontSize: '12px' }} />
              <Text style={{ color: '#FFF', fontSize: '12px', fontWeight: 600 }}>{selectedLang}</Text>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', marginTop: '16px', fontSize: '12px', fontWeight: 600 }}>
          <span>Step {currentStep + 1} of {recipe.steps.length}</span>
          <span>{progress}% Complete</span>
        </div>
        <Progress percent={progress} showInfo={false} strokeColor="#FFF" trailColor="rgba(255,255,255,0.3)" strokeWidth={6} style={{ marginTop: '8px' }} />
      </div>

      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.06)', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #FFB75E 0%, #F83A3A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 auto 32px auto' }}>
            {currentStep + 1}
          </div>
          <Title level={3} style={{ fontWeight: 700, lineHeight: 1.4, color: '#000' }}>
            {translatedText}
          </Title>
        </Card>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button onClick={handleVoiceHint} icon={<AudioOutlined />} size="large" style={{ height: '54px', borderRadius: '16px', backgroundColor: '#1890FF', color: '#FFF', border: 'none', fontWeight: 600, fontSize: '15px' }}>
            Voice Hint
          </Button>
          <Button onClick={handleVoiceHint} icon={<ReloadOutlined />} size="large" style={{ height: '54px', borderRadius: '16px', fontWeight: 600, fontSize: '15px', color: '#333', border: '1px solid #E2E8F0' }}>
            Repeat Step
          </Button>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)} icon={<LeftOutlined />} style={{ width: '40%', height: '54px', borderRadius: '16px', fontWeight: 600, fontSize: '15px', border: '1px solid #E2E8F0', color: '#333' }}>
              Previous
            </Button>
            <Button onClick={handleNext} style={{ width: '60%', height: '54px', borderRadius: '16px', background: 'linear-gradient(90deg, #E65100 0%, #F83A3A 100%)', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '16px', boxShadow: '0 4px 12px rgba(248, 58, 58, 0.2)' }}>
              {currentStep === recipe.steps.length - 1 ? 'Complete' : 'Next Step'} <RightOutlined />
            </Button>
          </div>
        </div>

        <div style={{ marginTop: '32px', backgroundColor: '#FFF', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
           <Text style={{ display: 'block', fontSize: '13px', color: '#666', fontWeight: 600, marginBottom: '16px' }}>Quick Jump</Text>
           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
             {recipe.steps.map((_, i) => (
               <div key={i} onClick={() => setCurrentStep(i)} style={{ 
                 width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                 backgroundColor: i === currentStep ? '#E65100' : (i < currentStep ? '#FFF0E6' : '#F5F5F5'),
                 color: i === currentStep ? '#FFF' : (i < currentStep ? '#E65100' : '#999'),
                 transition: 'all 0.3s'
               }}>{i + 1}</div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COOKING COMPLETED SCREEN
// ==========================================
export const CookingCompleted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe || { id: 999, title: "Recipe", img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=400&q=80", time: "30 mins", diff: "Easy" };

  const [rating, setRating] = useState(5);

  // Initial save on component mount
  useEffect(() => {
    if (recipe && recipe.id) {
      const cookedHistory = JSON.parse(localStorage.getItem('cookedRecipes') || '[]');
      const isAlreadyLogged = cookedHistory.length > 0 && cookedHistory[0].id === recipe.id;
      
      if (!isAlreadyLogged) {
        const newRecord = { 
          ...recipe, 
          rating: rating,
          cookedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        };
        localStorage.setItem('cookedRecipes', JSON.stringify([newRecord, ...cookedHistory]));
      }
    }
  }, [recipe]);

  // Update the saved history when user changes the star rating
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    const cookedHistory = JSON.parse(localStorage.getItem('cookedRecipes') || '[]');
    if (cookedHistory.length > 0 && cookedHistory[0].id === recipe.id) {
      cookedHistory[0].rating = newRating;
      localStorage.setItem('cookedRecipes', JSON.stringify(cookedHistory));
    }
  };

  return (
    <div style={{ backgroundColor: '#FCF4F1', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #FFB75E 0%, #F83A3A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '24px' }}>🎉</div>
      <Title level={2} style={{ fontWeight: 800, margin: 0 }}>Congratulations!</Title>
      <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginTop: '8px' }}>You've successfully completed</Text>
      <Text style={{ fontSize: '18px', fontWeight: 800, color: '#FF5238' }}>{recipe.title}</Text>

      <Card style={{ width: '100%', borderRadius: '20px', border: 'none', marginTop: '32px', padding: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <Text strong style={{ display: 'block', marginBottom: '16px' }}>How did it turn out?</Text>
        <Rate value={rating} onChange={handleRatingChange} style={{ fontSize: '32px', color: '#FFB75E' }} />
      </Card>

      <Card style={{ width: '100%', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)', marginTop: '20px', color: '#FFF', boxShadow: '0 8px 24px rgba(233, 30, 99, 0.25)' }}>
        <TrophyFilled style={{ fontSize: '24px', marginBottom: '8px' }} />
        <Title level={4} style={{ color: '#FFF', margin: 0 }}>Achievement Unlocked!</Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>You've completed your 10th recipe</Text>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Tag color="rgba(255,255,255,0.2)" style={{ border: 'none', color: '#FFF', borderRadius: '10px' }}>Master Chef</Tag>
          <Tag color="rgba(255,255,255,0.2)" style={{ border: 'none', color: '#FFF', borderRadius: '10px' }}>Quick Cook</Tag>
        </div>
      </Card>

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', width: '100%' }}>
        <Button onClick={() => navigate('/recipes')} icon={<BookOutlined />} size="large" style={{ flex: 1, borderRadius: '12px', height: '50px', fontWeight: 600 }}>More Recipes</Button>
        <Button onClick={() => navigate('/dashboard')} icon={<HomeOutlined />} size="large" style={{ flex: 1, borderRadius: '12px', height: '50px', backgroundColor: '#F83A3A', color: '#FFF', border: 'none', fontWeight: 700 }}>Home</Button>
      </div>
    </div>
  );
};