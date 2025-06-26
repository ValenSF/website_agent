import { Box, Text, TextInput, Center, Button } from '@mantine/core';

interface InputSectionProps {
  neoId: string;
  setNeoId: (value: string) => void;
  whatsappNumber: string;
  setWhatsapp: (value: string) => void;
  isValidated: boolean;
  onValidation: () => void;
}

export default function InputSection({
  neoId,
  setNeoId,
  whatsappNumber,
  setWhatsapp,
  isValidated,
  onValidation
}: InputSectionProps) {
  const inputStyles = {
    root: { position: 'relative' as const },
    label: { 
      color: '#ffffff', 
      fontWeight: 700, 
      fontSize: '18px', 
      marginBottom: '12px', 
      textShadow: '0 1px 3px rgba(0,0,0,0.3)', 
      letterSpacing: '0.5px' 
    },
    input: {
      backgroundColor: 'rgba(255,255,255,0.95)', 
      border: '3px solid rgba(255,255,255,0.3)', 
      borderRadius: '16px', 
      fontSize: '18px', 
      padding: '16px 20px 16px 50px',
      fontWeight: 500, 
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
      '&:focus': { 
        backgroundColor: '#ffffff', 
        borderColor: '#4dabf7', 
        boxShadow: '0 0 0 4px rgba(77, 171, 247, 0.3), 0 12px 40px rgba(77, 171, 247, 0.2)', 
        transform: 'translateY(-3px) scale(1.02)' 
      },
      '&:hover': { 
        backgroundColor: '#ffffff', 
        transform: 'translateY(-2px)', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)' 
      },
      '&::placeholder': { color: '#999', opacity: 0.7 }
    }
  };

  const whatsappInputStyles = {
    ...inputStyles,
    input: {
      ...inputStyles.input,
      '&:focus': { 
        backgroundColor: '#ffffff', 
        borderColor: '#51cf66', 
        boxShadow: '0 0 0 4px rgba(81, 207, 102, 0.3), 0 12px 40px rgba(81, 207, 102, 0.2)', 
        transform: 'translateY(-3px) scale(1.02)' 
      }
    }
  };

  return (
    <Box style={{
      padding: '40px 32px',
      background: 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      margin: '32px 24px',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.18)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      <Text style={{
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '24px',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        letterSpacing: '0.5px'
      }}>
        🎮 Masukkan Data Anda 🎮
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TextInput
          label="Neo ID"
          placeholder="Masukkan Neo ID Anda"
          value={neoId}
          onChange={(e) => setNeoId(e.currentTarget.value)}
          size="xl"
          leftSection="👤"
          styles={inputStyles}
        />

        <TextInput
          label="No WhatsApp"
          placeholder="Masukkan nomor WhatsApp"
          value={whatsappNumber}
          onChange={(e) => setWhatsapp(e.currentTarget.value)}
          size="xl"
          leftSection="📱"
          styles={whatsappInputStyles}
        />
      </div>

      {/* Bottom decoration */}
      <div style={{
        position: 'absolute', 
        bottom: '0', 
        left: '0', 
        right: '0', 
        height: '4px',
        background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
        borderRadius: '0 0 24px 24px'
      }} />

      {/* Validate Button */}
      <Center mt={24}>
        <Button
          onClick={onValidation}
          size="xl"
          radius="xl"
          variant={isValidated ? "light" : "filled"}
          color={isValidated ? "green" : "blue"}
          leftSection={isValidated ? "✓" : "🔒"}
          styles={{
            root: {
              background: isValidated
                ? 'linear-gradient(45deg, #51cf66, #40c057)'
                : 'linear-gradient(45deg, #339af0, #228be6)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 32px',
              fontSize: '18px',
              fontWeight: 700,
              marginTop: '40px',
              marginLeft: '4px',
              boxShadow: isValidated
                ? '0 8px 32px rgba(81, 207, 102, 0.4)'
                : '0 8px 32px rgba(61, 79, 94, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.05)',
                boxShadow: isValidated
                  ? '0 12px 40px rgba(81, 207, 102, 0.6)'
                  : '0 12px 40px rgba(51, 154, 240, 0.6)'
              },
              '&:active': {
                transform: 'translateY(-1px) scale(1.02)'
              }
            }
          }}
        >
          {isValidated ? 'Data Sudah Tervalidasi ✨' : 'Validasi Data Sekarang'}
        </Button>
      </Center>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg); }
        }
      `}</style>
    </Box>
  );
}