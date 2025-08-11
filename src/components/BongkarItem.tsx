import { Box, Text } from '@mantine/core';

interface BongkarItemProps {
  image: string;
  amount_id: number;
  amount: string;
  chipAmount: string;
  description: string;
  price: string;
  isValidated: boolean;
  onImageClick: (amount_id: number, amount: string, chipAmount: string) => void;
}

export default function BongkarItem({ 
  image,
  amount_id, 
  amount,
  chipAmount,
  description, 
  price,
  isValidated, 
  onImageClick
}: BongkarItemProps) {
  // ✅ REMOVED useNavigate - let parent handle navigation

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
  };

  const handleItemClick = () => {
    if (!isValidated) return;
    
    console.log('🔍 [BongkarItem] Calling onImageClick with data:', {
      amount_id,
      amount,
      chipAmount
    });
    
    // ✅ ONLY call parent handler - let parent handle navigation and validation
    onImageClick(amount_id, amount, chipAmount);
    
    // ✅ REMOVED duplicate navigation - parent will handle this
  };
  
  return (
    <Box
      style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '15px',
        padding: '15px 12px',
        textAlign: 'center',
        border: '3px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(15px)',
        cursor: isValidated ? 'pointer' : 'not-allowed',
        opacity: isValidated ? 1 : 0.5,
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔍 [BongkarItem] Box clicked, isValidated:', isValidated);
        handleItemClick();
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      
      {/* Icon Container */}
      <Box style={{
        background: 'linear-gradient(145deg, #8B4513, #A0522D)',
        borderRadius: '12px',
        padding: '12px',
        margin: '0 auto 12px',
        width: '85px',
        height: '85px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
        border: '2px solid #DAA520',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sparkle effects */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '12px',
          width: '3px',
          height: '3px',
          background: '#FFD700',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '12px',
          width: '2px',
          height: '2px',
          background: '#FFA500',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite 0.5s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '15px',
          width: '4px',
          height: '4px',
          background: '#FFD700',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite 1s'
        }} />
        
        {/* Coin Icon */}
        <img
          src={image}
          alt="Coin"
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1
          }}
        />
      </Box>

      {/* Text Content */}
      <Box>
        <Text style={{
          color: '#fff',
          fontSize: '13px',
          fontWeight: 700,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          marginBottom: '4px',
          letterSpacing: '0.5px'
        }}>
          {description}
        </Text>
        <Text style={{
          color: '#fff',
          fontSize: '11px',
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 600
        }}>
          {price}
        </Text>
      </Box>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </Box>
  );
}