import { Box, Text, TextInput, Center } from '@mantine/core';
import { useState, useRef  } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { apiService, TopupResponse } from '../../services/apiService';

interface InputSectionProps {
  neoId: string;
  setNeoId: (value: string) => void;
  whatsappNumber: string;
  setWhatsapp: (value: string) => void;
  isValidated: boolean;
  onValidation: () => void;
}

export default function InputSectionTurnstile({
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
  const turnstileRef = useRef<any>(null);
  const validateNumberOnly = (value: string): boolean => /^[0-9]*$/.test(value);

  const handleNeoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === '') {
      setNeoId(value);
      setNeoIdError('');
      return;
    }
    if (!validateNumberOnly(value)) return setNeoIdError('Neo ID hanya boleh berisi angka');
    if (value.length > 20) return setNeoIdError('Neo ID maksimal 20 digit');
    setNeoId(value);
    setNeoIdError('');
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === '') {
      setWhatsapp(value);
      setWhatsappError('');
      return;
    }
    if (!validateNumberOnly(value)) return setWhatsappError('Nomor WhatsApp hanya boleh berisi angka');
    if (value.length > 15) return setWhatsappError('Nomor WhatsApp maksimal 15 digit');
    if (value.length < 10) {
      setWhatsappError('Nomor WhatsApp minimal 10 digit');
      setWhatsapp(value);
      return;
    }
    setWhatsapp(value);
    setWhatsappError('');
  };

  const handleCaptchaVerify = async (token: string) => {
    // token dari Turnstile
    setCaptchaToken(token);
    setBackendError(null);

    try {
      const response: TopupResponse = await apiService.createTopupCF({
      neo_id: neoId,
      whatsapp_number: apiService.formatPhoneNumber(whatsappNumber),
      'cf-turnstile-response': token, // <-- ini wajib cocok dgn backend
    });

      if (response.status === 'success') {
        onValidation();
        setShowCaptcha(false);
        setCaptchaToken(null);
        // reset widget
        try { turnstileRef.current?.reset(); } catch {}
      } else {
        setBackendError(response.message || 'Gagal memproses top-up. Silakan coba lagi.');
      }
    } catch (error: any) {
      setBackendError(error?.message || 'Terjadi kesalahan server. Silakan coba lagi.');
    }
  };

  const handleValidation = () => {
    let hasError = false;

    if (!neoId.trim()) {
      setNeoIdError('Neo ID wajib diisi'); hasError = true;
    } else if (!validateNumberOnly(neoId)) {
      setNeoIdError('Neo ID hanya boleh berisi angka'); hasError = true;
    } else if (neoId.length < 3) {
      setNeoIdError('Neo ID minimal 3 digit'); hasError = true;
    }

    if (!whatsappNumber.trim()) {
      setWhatsappError('Nomor WhatsApp wajib diisi'); hasError = true;
    } else if (!validateNumberOnly(whatsappNumber)) {
      setWhatsappError('Nomor WhatsApp hanya boleh berisi angka'); hasError = true;
    } else if (whatsappNumber.length < 10) {
      setWhatsappError('Nomor WhatsApp minimal 10 digit'); hasError = true;
    }

    if (!hasError) {
      setShowCaptcha(true);
      setBackendError(null);
    }
  };

  return (
    <Box style={{ padding: '20px', margin: '20px 15px', position: 'relative', borderRadius: '20px' }}>
      <Box style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/img/board.png)', backgroundSize: 'cover',
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '20px', zIndex: 0
      }} />

      <Box style={{ position: 'relative', zIndex: 1, padding: '25px 25px 30px' }}>
        <Text style={{
          fontFamily: '"Klavika Bold","Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
          color: '#8B4513', fontSize: '18px', fontWeight: 700, textAlign: 'center',
          marginBottom: '30px', marginTop: '-20px', textShadow: '1px 1px 2px rgba(255,255,255,0.8)', letterSpacing: '0.5px'
        }}>
          🎮 Masukkan Data Anda 🎮
        </Text>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Neo ID */}
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
                label: { fontFamily: '"Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', color: '#8B4513', fontWeight: 700, fontSize: '16px', marginBottom: '8px', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' },
                input: {
                  fontFamily: '"Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
                  backgroundColor: neoIdError ? 'rgba(255,235,235,0.9)' : 'rgba(255,248,220,0.9)',
                  border: neoIdError ? '3px solid #FF6B6B' : '3px solid #D2691E',
                  borderRadius: '12px', fontSize: '16px', padding: '12px 15px 12px 45px', fontWeight: 500,
                  transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                },
                error: { color: '#FF6B6B', fontSize: '12px', fontWeight: 600, marginTop: '5px' }
              }}
            />
            {neoId && !neoIdError && neoId.length >= 3 && (
              <Text style={{ color: '#32CD32', fontSize: '12px', fontWeight: 600, marginTop: '5px' }}>✅ Neo ID valid</Text>
            )}
          </Box>

          {/* WhatsApp */}
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
                label: { fontFamily: '"Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', color: '#8B4513', fontWeight: 700, fontSize: '16px', marginBottom: '8px', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' },
                input: {
                  fontFamily: '"Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
                  backgroundColor: whatsappError ? 'rgba(255,235,235,0.9)' : 'rgba(255,248,220,0.9)',
                  border: whatsappError ? '3px solid #FF6B6B' : '3px solid #D2691E',
                  borderRadius: '12px', fontSize: '16px', padding: '12px 15px 12px 45px', fontWeight: 500,
                  transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                },
                error: { color: '#FF6B6B', fontSize: '12px', fontWeight: 600, marginTop: '5px' }
              }}
            />
            {whatsappNumber && !whatsappError && whatsappNumber.length >= 10 && (
              <Text style={{ color: '#32CD32', fontSize: '12px', fontWeight: 600, marginTop: '5px' }}>✅ Nomor WhatsApp valid</Text>
            )}
          </Box>

          {/* Turnstile (muncul setelah validasi input berhasil) */}
          {showCaptcha && !isValidated && (
            <Center mt={20}>
              <Box style={{ border: '3px solid #D2691E', borderRadius: '12px', padding: '10px', backgroundColor: 'rgba(255,248,220,0.9)' }}>
                <Turnstile
                   ref={turnstileRef}
                      siteKey="0x4AAAAAABsQbC-_zGYRksMW"        // <- perbaiki: siteKey (K besar)
                      onSuccess={handleCaptchaVerify}          // <- ganti: onSuccess
                      options={{
                        action: 'topup',                       // opsional, enak buat audit di server
                        refreshExpired: 'auto',                // token akan refresh otomatis
                      }}
                      onError={() => turnstileRef.current?.reset()}   // opsional: recovery
                    />
              </Box>
            </Center>
          )}

          {showCaptcha && !captchaToken && (
            <Text style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
              Harap selesaikan verifikasi untuk melanjutkan
            </Text>
          )}

          {backendError && (
            <Text style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
              {backendError}
            </Text>
          )}
        </div>

        {/* Tombol Konfirmasi */}
        <Center mt={30}>
          {!isValidated ? (
            <Box
              onClick={handleValidation}
              style={{ position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              <img src="/img/konfirmasi.png" alt="Konfirmasi" style={{ width: '200px', height: 'auto', display: 'block', transition: 'all 0.3s ease' }} />
            </Box>
          ) : (
            <Box style={{
              background: 'linear-gradient(135deg, #32CD32, #228B22)',
              borderRadius: '15px', padding: '15px 25px', border: '3px solid #FFD700',
              boxShadow: '0 8px 25px rgba(50,205,50,0.4)', animation: 'pulse 2s infinite', textAlign: 'center'
            }}>
              <Text style={{
                color: '#FFFFFF', fontSize: '16px', fontWeight: 700, textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontFamily: '"Klavika Bold","Klavika",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', letterSpacing: '0.5px'
              }}>
                🎮 Silahkan top up sebanyak banyaknya 🎮
              </Text>
            </Box>
          )}
        </Center>

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
