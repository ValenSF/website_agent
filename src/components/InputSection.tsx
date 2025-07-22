import { Box, Text, TextInput, Center } from '@mantine/core';
import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { apiService, TopupResponse } from '../../services/apiService';


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
  onValidation,
}: InputSectionProps) {
  const [neoIdError, setNeoIdError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const hCaptchaRef = useRef<HCaptcha>(null);

  // Validasi hanya angka
  const validateNumberOnly = (value: string): boolean => {
    const numberOnlyRegex = /^[0-9]*$/;
    return numberOnlyRegex.test(value);
  };

  // Handler untuk Neo ID
  const handleNeoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === '') {
      setNeoId(value);
      setNeoIdError('');
      return;
    }
    if (!validateNumberOnly(value)) {
      setNeoIdError('Neo ID hanya boleh berisi angka');
      return;
    }
    if (value.length > 20) {
      setNeoIdError('Neo ID maksimal 20 digit');
      return;
    }
    setNeoId(value);
    setNeoIdError('');
  };

  // Handler untuk WhatsApp
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === '') {
      setWhatsapp(value);
      setWhatsappError('');
      return;
    }
    if (!validateNumberOnly(value)) {
      setWhatsappError('Nomor WhatsApp hanya boleh berisi angka');
      return;
    }
    if (value.length > 15) {
      setWhatsappError('Nomor WhatsApp maksimal 15 digit');
      return;
    }
    if (value.length < 10) {
      setWhatsappError('Nomor WhatsApp minimal 10 digit');
      setWhatsapp(value);
      return;
    }
    setWhatsapp(value);
    setWhatsappError('');
  };

  // Handler untuk hCaptcha
 const handleCaptchaVerify = async (token: string) => {
  console.log('✅ hCaptcha token:', token);
  setCaptchaToken(token);
  setBackendError(null);

    try {
      const response: TopupResponse = await apiService.createTopup({
        neo_id: neoId,
        whatsapp_number: apiService.formatPhoneNumber(whatsappNumber),
        'h-captcha-response': token,
      });

      console.log('📨 [API] Topup response:', response);

      if (response.status === 'success') {
        onValidation(); // Tampilkan pesan sukses
        setShowCaptcha(false);
        if (hCaptchaRef.current) {
          hCaptchaRef.current.resetCaptcha(); // Reset hCaptcha untuk sesi berikutnya
        }
      } else {
        setBackendError(response.message || 'Gagal memproses top-up. Silakan coba lagi.');
      }
    } catch (error: any) {
      console.error('❌ [API] Topup error:', error);
      setBackendError(error.message || 'Terjadi kesalahan server. Silakan coba lagi.');
    }
  };

  // Validasi sebelum menampilkan hCaptcha
  const handleValidation = () => {
    let hasError = false;

    // Validasi Neo ID
    if (!neoId.trim()) {
      setNeoIdError('Neo ID wajib diisi');
      hasError = true;
    } else if (!validateNumberOnly(neoId)) {
      setNeoIdError('Neo ID hanya boleh berisi angka');
      hasError = true;
    } else if (neoId.length < 3) {
      setNeoIdError('Neo ID minimal 3 digit');
      hasError = true;
    }

    // Validasi WhatsApp
    if (!whatsappNumber.trim()) {
      setWhatsappError('Nomor WhatsApp wajib diisi');
      hasError = true;
    } else if (!validateNumberOnly(whatsappNumber)) {
      setWhatsappError('Nomor WhatsApp hanya boleh berisi angka');
      hasError = true;
    } else if (whatsappNumber.length < 10) {
      setWhatsappError('Nomor WhatsApp minimal 10 digit');
      hasError = true;
    }

    // Jika tidak ada error, tampilkan hCaptcha
    if (!hasError) {
    setShowCaptcha(true);
    }
  };

  return (
    <Box style={{
      padding: '20px',
      margin: '20px 15px',
      position: 'relative',
      borderRadius: '20px'
    }}>
      {/* Board Background */}
      <Box style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/img/board.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '20px',
        zIndex: 0
      }} />

      {/* Content Container */}
      <Box style={{
        position: 'relative',
        zIndex: 1,
        padding: '25px 25px 30px'
      }}>
        <Text style={{
          fontFamily: '"Klavika Bold", "Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#8B4513',
          fontSize: '18px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '30px',
          marginTop: '-20px',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          letterSpacing: '0.5px'
        }}>
          🎮 Masukkan Data Anda 🎮
        </Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Neo ID Input */}
          <Box>
            <TextInput
              label="Neo ID"
              placeholder="Masukkan Neo ID Anda (hanya angka)"
              value={neoId}
              onChange={handleNeoIdChange}
              size="lg"
              leftSection="👤"
              error={neoIdError}
              styles={{
                root: { position: 'relative' },
                label: {
                  fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: '#8B4513',
                  fontWeight: 700,
                  fontSize: '16px',
                  marginBottom: '8px',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                },
                input: {
                  fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  backgroundColor: neoIdError ? 'rgba(255,235,235,0.9)' : 'rgba(255,248,220,0.9)',
                  border: neoIdError ? '3px solid #FF6B6B' : '3px solid #D2691E',
                  borderRadius: '12px',
                  fontSize: '16px',
                  padding: '12px 15px 12px 45px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  '&:focus': {
                    backgroundColor: neoIdError ? 'rgba(255,235,235,0.9)' : '#FFF8DC',
                    borderColor: neoIdError ? '#FF6B6B' : '#FF8C00',
                    boxShadow: neoIdError
                      ? '0 0 0 3px rgba(255, 107, 107, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)'
                      : '0 0 0 3px rgba(255, 140, 0, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  '&:hover': {
                    backgroundColor: neoIdError ? 'rgba(255,235,235,0.9)' : '#FFF8DC',
                    transform: 'translateY(-1px)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)'
                  },
                  '&::placeholder': {
                    fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }
                },
                error: {
                  color: '#FF6B6B',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '5px'
                }
              }}
            />
            {neoId && !neoIdError && neoId.length >= 3 && (
              <Text style={{
                color: '#32CD32',
                fontSize: '12px',
                fontWeight: 600,
                marginTop: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                ✅ Neo ID valid
              </Text>
            )}
          </Box>

          {/* WhatsApp Input */}
          <Box>
            <TextInput
              label="No WhatsApp"
              placeholder="Masukkan nomor WhatsApp (hanya angka)"
              value={whatsappNumber}
              onChange={handleWhatsappChange}
              size="lg"
              leftSection="📱"
              error={whatsappError}
              styles={{
                root: { position: 'relative' },
                label: {
                  fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: '#8B4513',
                  fontWeight: 700,
                  fontSize: '16px',
                  marginBottom: '8px',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                },
                input: {
                  fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  backgroundColor: whatsappError ? 'rgba(255,235,235,0.9)' : 'rgba(255,248,220,0.9)',
                  border: whatsappError ? '3px solid #FF6B6B' : '3px solid #D2691E',
                  borderRadius: '12px',
                  fontSize: '16px',
                  padding: '12px 15px 12px 45px',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  '&:focus': {
                    backgroundColor: whatsappError ? 'rgba(255,235,235,0.9)' : '#FFF8DC',
                    borderColor: whatsappError ? '#FF6B6B' : '#32CD32',
                    boxShadow: whatsappError
                      ? '0 0 0 3px rgba(255, 107, 107, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)'
                      : '0 0 0 3px rgba(50, 205, 50, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  '&:hover': {
                    backgroundColor: whatsappError ? 'rgba(255,235,235,0.9)' : '#FFF8DC',
                    transform: 'translateY(-1px)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)'
                  },
                  '&::placeholder': {
                    fontFamily: '"Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }
                },
                error: {
                  color: '#FF6B6B',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginTop: '5px'
                }
              }}
            />
            {whatsappNumber && !whatsappError && whatsappNumber.length >= 10 && (
              <Text style={{
                color: '#32CD32',
                fontSize: '12px',
                fontWeight: 600,
                marginTop: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                ✅ Nomor WhatsApp valid
              </Text>
            )}
          </Box>

          {/* hCaptcha (hanya muncul setelah validasi input berhasil) */}
          {showCaptcha && !isValidated && (
            <Center mt={20}>
              <Box style={{ border: '3px solid #D2691E', borderRadius: '12px', padding: '10px', backgroundColor: 'rgba(255,248,220,0.9)' }}>
                <HCaptcha
                  sitekey="6b4e4854-77de-4780-aa9c-0288a9b65e90" // Ganti dengan Site Key produksi di environment produksi
                  onVerify={handleCaptchaVerify}
                  ref={hCaptchaRef} // Tambahkan ref
                />
              </Box>
            </Center>
          )}
          {showCaptcha && !captchaToken && (
            <Text style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
              Harap selesaikan hCaptcha untuk melanjutkan
            </Text>
          )}
          {backendError && (
            <Text style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
              {backendError}
            </Text>
          )}
        </div>

        {/* Konfirmasi Button / Success Message */}
        <Center mt={30}>
          {!isValidated ? (
            <Box
              onClick={handleValidation}
              style={{
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <img
                src="/img/konfirmasi.png"
                alt="Konfirmasi"
                style={{
                  width: '200px',
                  height: 'auto',
                  display: 'block',
                  transition: 'all 0.3s ease'
                }}
              />
            </Box>
          ) : (
            <Box style={{
              background: 'linear-gradient(135deg, #32CD32, #228B22)',
              borderRadius: '15px',
              padding: '15px 25px',
              border: '3px solid #FFD700',
              boxShadow: '0 8px 25px rgba(50, 205, 50, 0.4)',
              animation: 'pulse 2s infinite',
              textAlign: 'center'
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontFamily: '"Klavika Bold", "Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                letterSpacing: '0.5px'
              }}>
                🎮 Silahkan top up sebanyak banyaknya 🎮
              </Text>
            </Box>
          )}
        </Center>

        {/* CSS Animation untuk pulse effect */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 8px 25px rgba(50, 205, 50, 0.4); }
            50% { transform: scale(1.02); box-shadow: 0 12px 35px rgba(50, 205, 50, 0.6); }
            100% { transform: scale(1); box-shadow: 0 8px 25px rgba(50, 205, 50, 0.4); }
          }
        `}</style>
      </Box>
    </Box>
  );
}