import React, { useState, useEffect } from "react";
import { Gift, Star, Shield, Clock, Heart, Sparkles, CheckCircle, ArrowRight, Calendar, DollarSign, User, MessageCircle, Zap } from "lucide-react";
import GiftForm from "./components/GiftForm"


const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F3F3F3 100%)',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  floatingBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1
  },
  floatingCircle1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '256px',
    height: '256px',
    background: 'conic-gradient(from 0deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.4))',
    borderRadius: '50%',
    filter: 'blur(50px)',
    animation: 'float1 6s ease-in-out infinite'
  },
  floatingCircle2: {
    position: 'absolute',
    top: '75%',
    right: '25%',
    width: '320px',
    height: '320px',
    background: 'conic-gradient(from 120deg, rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.4))',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'float2 8s ease-in-out infinite'
  },
  floatingCircle3: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '200px',
    height: '200px',
    background: 'conic-gradient(from 240deg, rgba(59, 130, 246, 0.5), rgba(16, 185, 129, 0.3), rgba(245, 158, 11, 0.4))',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: 'float3 5s ease-in-out infinite'
  },
  sparkleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2
  },
  sparkle: {
    position: 'absolute',
    color: '#fbbf24',
    animation: 'sparkle 3s ease-in-out infinite',
    fontSize: '1.5rem'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '5rem',
    opacity: 0,
    transform: 'translateY(40px)',
    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  heroVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative'
  },
  logo: {
    width: '200px',
    height: '200px',
    objectFit: 'contain',
    borderRadius: '50%',
    border: '4px solid rgba(124, 58, 237, 0.3)',
    boxShadow: '0 15px 35px rgba(124, 58, 237, 0.2), 0 0 60px rgba(124, 58, 237, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    animation: 'logoFloat 3s ease-in-out infinite'
  },
  logoGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent)',
    animation: 'pulse 2s ease-in-out infinite',
    zIndex: -1
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6, #10b981)',
    backgroundSize: '400% 400%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '2rem',
    position: 'relative',
    display: 'inline-block',
    animation: 'gradientShift 4s ease-in-out infinite',
    textShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#6b7280',
    maxWidth: '800px',
    margin: '0 auto 2rem auto',
    lineHeight: '1.6',
    opacity: 0,
    animation: 'fadeInUp 1s ease-out 0.5s forwards'
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    opacity: 0,
    animation: 'fadeInUp 1s ease-out 0.8s forwards'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '0.75rem 1.25rem',
    borderRadius: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    fontSize: '0.875rem',
    color: '#6b7280',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  badgeHover: {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    background: 'rgba(255, 255, 255, 1)'
  },
  heroButton: {
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    color: 'white',
    padding: '1.25rem 2.5rem',
    borderRadius: '2rem',
    border: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    marginTop: '2rem',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 15px 35px rgba(124, 58, 237, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  },
  heroButtonShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.6s ease'
  },
  section: {
    marginBottom: '6rem',
    opacity: 0,
    transform: 'translateY(50px)',
    transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  sectionVisible: {
    opacity: 1,
    transform: 'translateY(0)'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '3rem',
    position: 'relative'
  },
  sectionTitleUnderline: {
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    borderRadius: '2px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    padding: '2.5rem',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  featureCardHover: {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    background: 'rgba(255, 255, 255, 1)'
  },
  featureCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1))',
    opacity: 0,
    transition: 'opacity 0.4s ease'
  },
  iconContainer: {
    width: '5rem',
    height: '5rem',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    color: 'white',
    position: 'relative',
    transition: 'all 0.4s ease'
  },
  iconBounce: {
    animation: 'bounce 2s ease-in-out infinite'
  },
  statsContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    padding: '3rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    textAlign: 'center'
  },
  statItem: {
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    padding: '1rem',
    borderRadius: '1rem',
    position: 'relative'
  },
  statItemHover: {
    transform: 'translateY(-8px) scale(1.05)',
    background: 'rgba(124, 58, 237, 0.05)'
  },
  statNumber: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6)',
    backgroundSize: '200% 200%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    animation: 'gradientShift 3s ease-in-out infinite'
  },
  exampleCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    padding: '2rem',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  exampleCardHover: {
    transform: 'translateY(-8px) rotate(1deg)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
  },
  formContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    padding: '3rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  quickActionSection: {
    textAlign: 'center',
    padding: '4rem 3rem',
    background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.9), rgba(224, 231, 255, 0.9))',
    backdropFilter: 'blur(20px)',
    borderRadius: '2rem',
    marginBottom: '5rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  },
  quickActionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #1f2937, #374151)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem'
  },
  quickActionSubtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem auto'
  },
  quickActionButton: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    padding: '1.25rem 2.5rem',
    borderRadius: '2rem',
    border: 'none',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  },
  pulsingOrb: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1), transparent)',
    animation: 'pulse 4s ease-in-out infinite',
    zIndex: -1
  }
};

// Enhanced CSS animations
const styleSheet = `
  @keyframes float1 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.3;
    }
    33% { 
      transform: translate(30px, -30px) rotate(120deg);
      opacity: 0.5;
    }
    66% { 
      transform: translate(-20px, 20px) rotate(240deg);
      opacity: 0.4;
    }
  }
  
  @keyframes float2 {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.4;
    }
    50% { 
      transform: translate(-40px, -20px) rotate(180deg);
      opacity: 0.6;
    }
  }
  
  @keyframes float3 {
    0%, 100% { 
      transform: translate(0, 0) scale(1);
      opacity: 0.5;
    }
    50% { 
      transform: translate(20px, -30px) scale(1.1);
      opacity: 0.3;
    }
  }
  
  @keyframes logoFloat {
    0%, 100% { 
      transform: translateY(0px) scale(1);
    }
    50% { 
      transform: translateY(-8px) scale(1.02);
    }
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes sparkle {
    0%, 100% { 
      opacity: 0; 
      transform: scale(0) rotate(0deg);
    }
    50% { 
      opacity: 1; 
      transform: scale(1) rotate(180deg);
    }
  }
  
  @keyframes fadeInUp {
    0% { 
      opacity: 0; 
      transform: translateY(30px);
    }
    100% { 
      opacity: 1; 
      transform: translateY(0);
    }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { 
      transform: translate3d(0,0,0);
    }
    40%, 43% { 
      transform: translate3d(0,-8px,0);
    }
    70% { 
      transform: translate3d(0,-4px,0);
    }
    90% { 
      transform: translate3d(0,-2px,0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 0.3; 
      transform: scale(1);
    }
    50% { 
      opacity: 0.6; 
      transform: scale(1.05);
    }
  }
  
  @keyframes slideInUp {
    0% { 
      transform: translateY(30px); 
      opacity: 0; 
    }
    100% { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }
`;

export default function EnhancedGiftPlatform() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Add stylesheet
    const style = document.createElement('style');
    style.textContent = styleSheet;
    document.head.appendChild(style);

    // Initialize visibility after component mounts
    setTimeout(() => {
      setIsVisible({
        hero: true,
        features: true,
        stats: true,
        examples: true,
        form: true
      });
    }, 300);

    // Create sparkles
    const createSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 3}s`,
          symbol: ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]
        });
      }
      setSparkles(newSparkles);
    };

    createSparkles();
    const sparkleInterval = setInterval(createSparkles, 8000);

    return () => {
      document.head.removeChild(style);
      clearInterval(sparkleInterval);
    };
  }, []);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
    setSubmitted(true);
    // Scroll to success message after submission
    setTimeout(() => {
      document.getElementById('success-message')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const features = [
    {
      icon: Gift,
      title: "اطلب بسهولة",
      description: "املأ نموذج بسيط، وحدد تفاصيلك، واستلم هديتك في وقت قياسي",
      color: "linear-gradient(135deg, #7c3aed, #9333ea)",
      bgColor: "rgba(243, 244, 255, 0.8)"
    },
    {
      icon: Star,
      title: "هدايا بتصميمك",
      description: "أضف لمستك الخاصة واجعل هديتك تعكس مشاعرك وتبقى في الذاكرة",
      color: "linear-gradient(135deg, #f59e0b, #f97316)",
      bgColor: "rgba(255, 251, 235, 0.8)"
    },
    {
      icon: Shield,
      title: "ثقة وطمأنينة",
      description: "كل طلب آمن مع متابعة شاملة من التحضير حتى التوصيل",
      color: "linear-gradient(135deg, #10b981, #059669)",
      bgColor: "rgba(236, 253, 245, 0.8)"
    }
  ];

  const stats = [
    { number: "1000+", label: "عميل راضي", icon: Heart },
    { number: "500+", label: "هدية تم توصيلها", icon: Gift },
    { number: "24/7", label: "خدمة العملاء", icon: Clock },
    { number: "99%", label: "معدل الرضا", icon: Star }
  ];

  const examples = [
    {
      name: "هدية عيد ميلاد لسارة",
      occasion: "عيد ميلاد",
      budget: 8000,
      color: "#3b82f6",
      image: "🎂"
    },
    {
      name: "هدية ذكرى للوالدين",
      occasion: "ذكرى سنوية",
      budget: 20000,
      color: "#f97316",
      image: "💕"
    },
    {
      name: "هدية تخرج لأحمد",
      occasion: "تخرج",
      budget: 15000,
      color: "#10b981",
      image: "🎓"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Enhanced Floating Background */}
      <div style={styles.floatingBg}>
        <div style={styles.floatingCircle1}></div>
        <div style={styles.floatingCircle2}></div>
        <div style={styles.floatingCircle3}></div>
      </div>

      {/* Sparkles Layer */}
      <div style={styles.sparkleLayer}>
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            style={{
              ...styles.sparkle,
              left: sparkle.left,
              top: sparkle.top,
              animationDelay: sparkle.delay
            }}
          >
            {sparkle.symbol}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {/* Enhanced Hero Section with Better Logo Positioning */}
        <div 
          style={{
            ...styles.hero,
            ...(isVisible.hero ? styles.heroVisible : {})
          }}
        > 
          <div style={styles.logoContainer}>
            <div style={styles.logoGlow}></div>
           
          </div>

          <h1 style={styles.heroTitle}>
            هديتك.. على ذوقك والباقي علينا
          </h1>

          <p style={styles.heroSubtitle}>
            اطلب بسهولة، أضف لمستك الخاصة، وامنح أحبّتك هدية لا تُنسى
          </p>

          <div style={styles.badges}>
            {['تفاصيل شخصية', 'جودة مضمونة', 'سعر مناسب'].map((text, idx) => (
              <span 
                key={idx} 
                style={{
                  ...styles.badge,
                  ...(hoveredCard === `badge-${idx}` ? styles.badgeHover : {})
                }}
                onMouseEnter={() => setHoveredCard(`badge-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CheckCircle size={16} color="#10b981" style={{ marginRight: '8px' }} />
                {text}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              style={styles.heroButton}
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.5)';
                e.target.querySelector('.shine').style.left = '100%';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.4)';
                e.target.querySelector('.shine').style.left = '-100%';
              }}
            >
              <div className="shine" style={styles.heroButtonShine}></div>
              ابدأ طلبك الآن
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div 
          style={{
            ...styles.section,
            ...(isVisible.features ? styles.sectionVisible : {})
          }}
        >
          <h2 style={styles.sectionTitle}>
            لماذا نحن الخيار الأفضل؟
            <div style={styles.sectionTitleUnderline}></div>
          </h2>
          <div style={styles.grid}>
            {features.map((feature, idx) => (
              <div 
                key={idx}
                style={{
                  ...styles.featureCard,
                  backgroundColor: feature.bgColor,
                  ...(hoveredCard === `feature-${idx}` ? styles.featureCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(`feature-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  style={{
                    ...styles.featureCardGlow,
                    opacity: hoveredCard === `feature-${idx}` ? 1 : 0
                  }}
                ></div>
                <div style={{ 
                  ...styles.iconContainer, 
                  background: feature.color,
                  ...(hoveredCard === `feature-${idx}` ? styles.iconBounce : {})
                }}>
                  <feature.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Action Section */}
        <div 
          style={{
            ...styles.section,
            ...(isVisible.features ? styles.sectionVisible : {})
          }}
        >
          <div style={styles.quickActionSection}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Zap size={32} color="#3b82f6" style={{ marginRight: '12px' }} />
              <h2 style={styles.quickActionTitle}>لا تنتظر أكثر!</h2>
              <Zap size={32} color="#8b5cf6" style={{ marginLeft: '12px' }} />
            </div>
            
            <p style={styles.quickActionSubtitle}>
              خطوات بسيطة تفصلك عن هديتك المثالية. املأ النموذج واتركنا نحقق لك ما تحلم به
            </p>
            
            <button 
              style={styles.quickActionButton}
              onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4)';
              }}
            >
              اطلب هديتك الآن
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        {/* Enhanced Examples Section */}
        <div 
          style={{
            ...styles.section,
            ...(isVisible.examples ? styles.sectionVisible : {})
          }}
        >
          <h2 style={styles.sectionTitle}>
            أمثلة على طلبات الهدايا
            <div style={styles.sectionTitleUnderline}></div>
          </h2>
          <div style={styles.grid}>
            {examples.map((gift, idx) => (
              <div 
                key={idx}
                style={{
                  ...styles.exampleCard,
                  ...(hoveredCard === `example-${idx}` ? styles.exampleCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(`example-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ 
                    fontSize: '2.5rem',
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === `example-${idx}` ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)'
                  }}>{gift.image}</div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white',
                    backgroundColor: gift.color,
                    boxShadow: `0 4px 15px ${gift.color}40`,
                    animation: hoveredCard === `example-${idx}` ? 'pulse 1s ease-in-out infinite' : 'none'
                  }}>
                    مكتملة ✓
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                  {gift.name}
                </h3>
                <div style={{ color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Calendar size={16} color="#7c3aed" style={{ marginRight: '8px' }} />
                    {gift.occasion}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontWeight: '600', color: '#10b981' }}>
                    <DollarSign size={16} style={{ marginRight: '8px' }} />
                    {gift.budget.toLocaleString()} DZD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div 
          style={{
            ...styles.section,
            ...(isVisible.stats ? styles.sectionVisible : {})
          }}
        >
          <div style={styles.statsContainer}>
            <div style={styles.statsGrid}>
              {stats.map((stat, idx) => (
                <div 
                  key={idx}
                  style={{
                    ...styles.statItem,
                    ...(hoveredCard === `stat-${idx}` ? styles.statItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(`stat-${idx}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === `stat-${idx}` ? 'scale(1.2) rotate(5deg)' : 'scale(1)'
                  }}>
                    <stat.icon size={32} color="#7c3aed" />
                  </div>
                  <div style={styles.statNumber}>{stat.number}</div>
                  <div style={{ color: '#6b7280', fontWeight: '600' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Form Section */}
        <div 
          id="form-section"
          style={{
            ...styles.section,
            ...(isVisible.form ? styles.sectionVisible : {})
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={styles.sectionTitle}>
              ✨ اطلب هديتك الآن
              <div style={styles.sectionTitleUnderline}></div>
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              املأ النموذج أدناه وسنتواصل معك لتحقيق أفكارك
            </p>
          </div>
          
          <div style={{
            maxWidth: '64rem',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.02), rgba(236, 72, 153, 0.02))',
              pointerEvents: 'none'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <GiftForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </div>

        {/* Enhanced Success Message */}
        {submitted && (
          <div 
            id="success-message" 
            style={{
              maxWidth: '64rem',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95), rgba(236, 253, 245, 0.95))',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '3rem',
              boxShadow: '0 25px 50px rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(187, 247, 208, 0.6)',
              animation: 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1), transparent)',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '6rem',
                height: '6rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto',
                boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)',
                animation: 'bounce 2s ease-in-out infinite'
              }}>
                <CheckCircle size={48} color="white" />
              </div>
              <h3 style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #047857, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem'
              }}>
                تم إرسال طلبك بنجاح! 🎉
              </h3>
              <p style={{
                fontSize: '1.5rem',
                color: '#059669',
                marginBottom: '2rem',
                fontWeight: '600'
              }}>
                شكراً {submittedData?.recipientName ? `على طلب هدية ${submittedData.recipientName}` : 'لك'}! 
                سنتواصل معك قريباً لمناقشة التفاصيل.
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1.5rem',
                padding: '2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  
                  <div>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <strong>وقت الاستجابة المتوقع:</strong>
                    </p>
                    <p style={{ color: '#f59e0b', fontSize: '1.25rem', fontWeight: 'bold' }}>
                      خلال 24 ساعة ⏰
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Call to Action */}
        {!submitted && (
          <div 
            style={{
              ...styles.section,
              ...(isVisible.features ? styles.sectionVisible : {})
            }}
          >
            <div style={{
              ...styles.quickActionSection,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(236, 72, 153, 0.9))',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                animation: 'float1 10s ease-in-out infinite'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Sparkles size={32} style={{ marginRight: '12px' }} />
                  <h2 style={{
                    ...styles.quickActionTitle,
                    color: 'white',
                    background: 'none',
                    WebkitTextFillColor: 'white'
                  }}>جاهز لتحقيق أحلامك؟</h2>
                  <Sparkles size={32} style={{ marginLeft: '12px' }} />
                </div>
                
                <p style={{
                  ...styles.quickActionSubtitle,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  انضم إلى آلاف العملاء الراضين واطلب هديتك المثالية اليوم
                </p>
                
                <button 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#7c3aed',
                    padding: '1.25rem 2.5rem',
                    borderRadius: '2rem',
                    border: 'none',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                    e.target.style.background = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                  }}
                >
                  اطلب هديتك الآن
                  <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
