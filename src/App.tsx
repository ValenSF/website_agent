import { Box, Center, Text, TextInput, Group, Button, Alert } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const [neoId, setNeoId] = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleValidation = () => {
    if (neoId.trim() === '' || whatsappNumber.trim() === '') {
      setShowError(true);
      setIsValidated(false);
      setTimeout(() => setShowError(false), 3000);
    } else {
      setShowError(false);
      setIsValidated(true);
    }
  };

  const handleImageClick = (topUpAmount) => {
    if (!isValidated) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    navigate('/qris', { state: { topUpAmount, neoId, whatsappNumber } });
  };

  const handleMouseOver = (e, textElement) => {
    if (!isValidated) return;
    e.currentTarget.style.backgroundColor = '#000';
    e.currentTarget.style.transition = 'background-color 0.3s ease';
    if (textElement) textElement.style.color = '#ffffff';
  };

  const handleMouseOut = (e, textElement) => {
    if (!isValidated) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transition = 'background-color 0.3s ease';
    if (textElement) textElement.style.color = '#000000';
  };

  return (
    <Box style={{ background: '#e6f2f7', minHeight: '100vh', padding: 0 }}>
      <Box
        style={{
          margin: '0 auto',
          minHeight: '100vh',
          maxWidth: 600,
          overflowX: 'hidden',
          background: '#fff',
          paddingBottom: 66,
        }}
      >
        {/* Header Image with Absolute Text */}
        <Box style={{ position: 'relative' }}>
          <img
            src="/src/img/judul.jpg"
            alt="Judul"
            style={{ width: '92%', display: 'block', marginLeft: '24px', border: '2px solid #000', marginRight: '200px' }}
          />
          <Text
            style={{
              position: 'absolute',
              top: '92%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              color: '#000000',
              borderRadius: 8,
              fontWeight: 100,
              fontSize: 18,
              textAlign: 'center',
              width: '80%',
            }}
          >
            BELI DISINI, PASTI UNTUNG BERKALI KALI LIPAT 🔥
          </Text>
        </Box>

        {/* Input Fields Section */}
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
              styles={{
                root: { position: 'relative' },
                label: { color: '#ffffff', fontWeight: 700, fontSize: '18px', marginBottom: '12px', textShadow: '0 1px 3px rgba(0,0,0,0.3)', letterSpacing: '0.5px' },
                input: {
                  backgroundColor: 'rgba(255,255,255,0.95)', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '16px', fontSize: '18px', padding: '16px 20px 16px 50px',
                  fontWeight: 500, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                  '&:focus': { backgroundColor: '#ffffff', borderColor: '#4dabf7', boxShadow: '0 0 0 4px rgba(77, 171, 247, 0.3), 0 12px 40px rgba(77, 171, 247, 0.2)', transform: 'translateY(-3px) scale(1.02)' },
                  '&:hover': { backgroundColor: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
                  '&::placeholder': { color: '#999', opacity: 0.7 }
                }
              }}
            />

            <TextInput
              label="No WhatsApp"
              placeholder="Masukkan nomor WhatsApp"
              value={whatsappNumber}
              onChange={(e) => setWhatsapp(e.currentTarget.value)}
              size="xl"
              leftSection="📱"
              styles={{
                root: { position: 'relative' },
                label: { color: '#ffffff', fontWeight: 700, fontSize: '18px', marginBottom: '12px', textShadow: '0 1px 3px rgba(0,0,0,0.3)', letterSpacing: '0.5px' },
                input: {
                  backgroundColor: 'rgba(255,255,255,0.95)', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '16px', fontSize: '18px', padding: '16px 20px 16px 50px',
                  fontWeight: 500, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                  '&:focus': { backgroundColor: '#ffffff', borderColor: '#51cf66', boxShadow: '0 0 0 4px rgba(81, 207, 102, 0.3), 0 12px 40px rgba(81, 207, 102, 0.2)', transform: 'translateY(-3px) scale(1.02)' },
                  '&:hover': { backgroundColor: '#ffffff', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' },
                  '&::placeholder': { color: '#999', opacity: 0.7 }
                }
              }}
            />
          </div>

          {/* Bottom decoration */}
          <div style={{
            position: 'absolute', bottom: '0', left: '0', right: '0', height: '4px',
            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
            borderRadius: '0 0 24px 24px'
          }} />

          {/* Validate Button */}
          <Center mt={24}>
            <Button
              onClick={handleValidation}
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
        </Box>

        {/* Error Alert */}
        {showError && (
          <Box style={{ margin: '0 24px' }}>
            <Alert
              color="red"
              title="⚠️ Data Belum Lengkap!"
              radius="lg"
              styles={{
                root: {
                  background: 'linear-gradient(45deg, #ff6b6b, #fa5252)',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                  animation: 'shake 0.5s ease-in-out'
                },
                title: {
                  color: 'white',
                  fontWeight: 700
                }
              }}
            >
              Harap isi Neo ID dan Nomor WhatsApp terlebih dahulu sebelum memilih paket top up!
            </Alert>
          </Box>
        )}

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(180deg); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>

        {/* Image Sections - Mengembalikan Group dan position: absolute pada teks */}
        <Box> {/* Menggunakan Box sebagai wrapper umum untuk baris-baris gambar */}
          <Center mt={32} style={{ gap: '32px' }}>
            {/* Group Kiri (Top Up 100 M) */}
            <Group style={{ position: 'relative' }}> {/* Group sebagai kontainer relatif */}
              <img
                src="/src/img/icon3.webp"
                alt="Icon Kiri"
                style={{
                  width: 250,
                  height: 350,
                  objectFit: 'contain',
                  border: '2px solid #000',
                  margin: '10px', // Margin agar gambar tetap di tengah Group
                  opacity: isValidated ? 1 : 0.3,
                  filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('15.500')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute', // Kembali ke position absolute
                  top: '80%',
                  left: '50%', // Tengah dari gambar
                  transform: 'translateX(-50%)', // Agar teks benar-benar di tengah
                  transition: 'color 0.3s ease',
                  width: '100%' // Agar teks memanjang sesuai lebar Group
                }}
              >
                Top Up 100 M (IDR 15.500)
              </Text>
            </Group>

            {/* Group Kanan (Top Up 200 M) */}
            <Group style={{ position: 'relative' }}> {/* Group sebagai kontainer relatif */}
              <img
                src="/src/img/icon3.webp"
                alt="Icon Kanan"
                style={{
                  width: 250,
                  height: 350,
                  objectFit: 'contain',
                  border: '2px solid #000',
                  margin: '10px',
                  opacity: isValidated ? 1 : 0.3,
                  filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('30.000')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute', // Kembali ke position absolute
                  top: '80%',
                  left: '50%', // Tengah dari gambar
                  transform: 'translateX(-50%)',
                  transition: 'color 0.3s ease',
                  width: '100%'
                }}
              >
                Top Up 200 M (IDR 30.000)
              </Text>
            </Group>
          </Center>

          <Center mt={32} style={{ gap: '32px' }}>
            {/* Group Kiri (Top Up 100 M) */}
            <Group style={{ position: 'relative' }}>
              <img
                src="/src/img/icon2.webp"
                alt="Icon Kiri"
                style={{
                  width: 250, height: 350, objectFit: 'contain', border: '2px solid #000', margin: '10px',
                  opacity: isValidated ? 1 : 0.3, filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('15.500')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute',
                  top: '80%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'color 0.3s ease',
                  width: '100%'
                }}
              >
                Top Up 100 M (IDR 15.500)
              </Text>
            </Group>

            {/* Group Kanan (Top Up 200 M) */}
            <Group style={{ position: 'relative' }}>
              <img
                src="/src/img/icon2.webp"
                alt="Icon Kanan"
                style={{
                  width: 250, height: 350, objectFit: 'contain', border: '2px solid #000', margin: '10px',
                  opacity: isValidated ? 1 : 0.3, filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('30.000')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute',
                  top: '80%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'color 0.3s ease',
                  width: '100%'
                }}
              >
                Top Up 200 M (IDR 30.000)
              </Text>
            </Group>
          </Center>

          <Center mt={32} style={{ gap: '32px' }}>
            {/* Group Kiri (Top Up 100 M) */}
            <Group style={{ position: 'relative' }}>
              <img
                src="/src/img/icon1.webp"
                alt="Icon Kiri"
                style={{
                  width: 250, height: 350, objectFit: 'contain', border: '2px solid #000', margin: '10px',
                  opacity: isValidated ? 1 : 0.3, filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('15.500')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute',
                  top: '80%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'color 0.3s ease',
                  width: '100%'
                }}
              >
                Top Up 100 M (IDR 15.500)
              </Text>
            </Group>

            {/* Group Kanan (Top Up 200 M) */}
            <Group style={{ position: 'relative' }}>
              <img
                src="/src/img/icon1.webp"
                alt="Icon Kanan"
                style={{
                  width: 250, height: 350, objectFit: 'contain', border: '2px solid #000', margin: '10px',
                  opacity: isValidated ? 1 : 0.3, filter: isValidated ? 'none' : 'grayscale(100%)',
                  cursor: isValidated ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease'
                }}
                onClick={() => handleImageClick('30.000')}
                onMouseOver={(e) => handleMouseOver(e, e.currentTarget.nextElementSibling)}
                onMouseOut={(e) => handleMouseOut(e, e.currentTarget.nextElementSibling)}
              />
              <Text
                className="image-text"
                mt="10px"
                align="center"
                style={{
                  color: isValidated ? '#000000' : '#999999',
                  position: 'absolute',
                  top: '80%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'color 0.3s ease',
                  width: '100%'
                }}
              >
                Top Up 200 M (IDR 30.000)
              </Text>
            </Group>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}