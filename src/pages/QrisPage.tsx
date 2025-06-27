import { Box, Text, Button, Select } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function QrisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { topUpAmount, topUpValue, neoId, whatsappNumber } = location.state || {};

  useEffect(() => {
    if (!topUpAmount || !topUpValue || !neoId || !whatsappNumber) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [topUpAmount, topUpValue, neoId, whatsappNumber, navigate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSuccessPayment = () => {
    navigate('/success', {
      state: {
        amount: topUpAmount,
        topUpValue: topUpValue,
        neoId,
        whatsappNumber,
        transactionId: `TXN${Date.now()}`
      }
    });
  };

  // Payment methods dengan instruksi cara bayar
  const paymentMethods = [
    {
      value: 'gopay',
      label: 'GoPay',
      instructions: [
        '1. Buka aplikasi Gojek',
        '2. Pilih menu GoPay',
        '3. Tap "Scan QR"',
        '4. Scan QR code di atas',
        '5. Masukkan PIN GoPay',
        '6. Pembayaran selesai'
      ]
    },
    {
      value: 'ovo',
      label: 'OVO',
      instructions: [
        '1. Buka aplikasi OVO',
        '2. Tap "Scan" di beranda',
        '3. Scan QR code QRIS',
        '4. Konfirmasi nominal',
        '5. Masukkan PIN OVO',
        '6. Pembayaran berhasil'
      ]
    },
    {
      value: 'dana',
      label: 'DANA',
      instructions: [
        '1. Buka aplikasi DANA',
        '2. Pilih "Scan QR"',
        '3. Arahkan kamera ke QR code',
        '4. Periksa detail pembayaran',
        '5. Masukkan PIN DANA',
        '6. Transaksi selesai'
      ]
    },
    {
      value: 'bca',
      label: 'BCA mobile',
      instructions: [
        '1. Buka BCA mobile',
        '2. Pilih menu "QRIS"',
        '3. Tap "Bayar dengan QRIS"',
        '4. Scan QR code',
        '5. Masukkan PIN m-BCA',
        '6. Konfirmasi pembayaran'
      ]
    },
    {
      value: 'mandiri',
      label: 'Livin by Mandiri',
      instructions: [
        '1. Buka aplikasi Livin',
        '2. Pilih "QRIS"',
        '3. Tap "Scan & Pay"',
        '4. Scan QR code QRIS',
        '5. Konfirmasi detail',
        '6. Masukkan MPIN'
      ]
    },
    {
      value: 'bni',
      label: 'BNI Mobile',
      instructions: [
        '1. Buka BNI Mobile Banking',
        '2. Pilih menu "Transfer"',
        '3. Pilih "QRIS"',
        '4. Scan QR code',
        '5. Konfirmasi transaksi',
        '6. Masukkan PIN'
      ]
    },
    {
      value: 'cimb',
      label: 'CIMB Niaga',
      instructions: [
        '1. Buka OCTO Mobile',
        '2. Pilih "QRIS Payment"',
        '3. Scan QR code',
        '4. Verifikasi detail',
        '5. Masukkan PIN',
        '6. Pembayaran selesai'
      ]
    },
    {
      value: 'linkaja',
      label: 'LinkAja',
      instructions: [
        '1. Buka aplikasi LinkAja',
        '2. Tap "Scan"',
        '3. Scan QR code QRIS',
        '4. Konfirmasi pembayaran',
        '5. Masukkan PIN LinkAja',
        '6. Transaksi berhasil'
      ]
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.value === selectedPaymentMethod);

  return (
    <Box style={{
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #20B2AA 70%, #008B8B 100%)',
      minHeight: '100vh',
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Ocean Animations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '120px',
        height: '40px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50px',
        animation: 'floatCloud1 20s infinite linear',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-8%',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '30px',
        animation: 'floatCloud2 25s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Floating Bubbles */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble1 8s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '60%',
        right: '12%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'bubble2 10s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(to top, #F4A460 0%, #DEB887 40%, transparent 100%)',
        clipPath: 'polygon(0 60%, 15% 50%, 30% 60%, 45% 45%, 60% 55%, 75% 40%, 90% 50%, 100% 45%, 100% 100%, 0% 100%)',
        zIndex: 0
      }} />

      {/* Main Content Container */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        backgroundImage: 'url(/src/img/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}>

        {/* Content Overlay untuk readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Content Wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

          {/* Total Pembayaran Card */}
          <Box style={{
            background: 'rgba(255, 248, 220, 0.95)',
            borderRadius: '15px',
            padding: '18px 25px',
            marginBottom: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            border: '1px solid rgba(210, 180, 140, 0.6)',
            width: '100%',
            maxWidth: '340px',
            position: 'relative',
            marginTop: '20px'
          }}>
            <Text style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#8B4513',
              textAlign: 'left',
              marginBottom: '5px',
              fontFamily: '"Segoe UI", Arial, sans-serif'
            }}>
              Total Pembayaran
            </Text>

            <Text style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#8B4513',
              textAlign: 'left',
              fontFamily: '"Segoe UI", Arial Black, sans-serif'
            }}>
              IDR {parseInt(topUpAmount || '0').toLocaleString('id-ID')}
            </Text>

            {/* Top Up Amount dibawah IDR */}
            <Text style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#B8860B',
              textAlign: 'left',
              marginTop: '2px',
              fontFamily: '"Segoe UI", Arial, sans-serif'
            }}>
              {topUpValue}M
            </Text>

            {/* Countdown Timer */}
            <Text style={{
              fontSize: '11px',
              color: '#FF69B4',
              fontWeight: 600,
              position: 'absolute',
              bottom: '12px',
              right: '20px'
            }}>
              ⏰ {formatTime(countdown)}
            </Text>
          </Box>

          {/* QRIS Card menggunakan papanqris.png */}
          <Box style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            {/* QRIS Frame menggunakan papanqris.png */}
            <img
              src="/src/img/papanqris.png"
              alt="QRIS Frame with Cat"
              style={{
                width: '100%',
                height: 'auto',
                position: 'relative',
                zIndex: 2
              }}
            />
          </Box>

          {/* Payment Methods Card */}
          <Box style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            <img
              src="/src/img/papanbayar.png"
              alt="Payment Methods"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '15px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
              }}
            />
          </Box>

          {/* Dropdown Cara Bayar per Bank */}
          <Box style={{
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            <Select
              placeholder="Pilih metode pembayaran untuk melihat cara bayar"
              value={selectedPaymentMethod}
              onChange={(value: string | null) => setSelectedPaymentMethod(value || '')}
              data={paymentMethods.map(method => ({ value: method.value, label: method.label }))}
              style={{
                width: '100%'
              }}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #7CB342',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#333'
                },
                dropdown: {
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #7CB342',
                  borderRadius: '8px'
                },
                option: {
                  padding: '12px 16px',
                  fontSize: '14px',
                  '&[data-selected]': {
                    backgroundColor: '#7CB342',
                    color: 'white'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(124, 179, 66, 0.1)'
                  }
                }
              }}
            />
          </Box>

          {/* Instruksi Cara Bayar */}
          {selectedMethod && (
            <Box style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              border: '2px solid #7CB342',
              width: '100%',
              maxWidth: '340px'
            }}>
              <Text style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#7CB342',
                textAlign: 'center',
                marginBottom: '15px',
                fontFamily: '"Segoe UI", Arial, sans-serif'
              }}>
                Cara Bayar dengan {selectedMethod.label}
              </Text>

              <Box style={{ textAlign: 'left' }}>
                {selectedMethod.instructions.map((instruction, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: '13px',
                      color: '#333',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      fontFamily: '"Segoe UI", Arial, sans-serif'
                    }}
                  >
                    {instruction}
                  </Text>
                ))}
              </Box>

              {/* Button Sudah Bayar */}
              <Button
                onClick={handleSuccessPayment}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  background: 'linear-gradient(135deg, #7CB342 0%, #689F38 50%, #558B2F 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
                }}
              >
                Sudah Bayar
              </Button>
            </Box>
          )}

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            style={{
              borderRadius: '10px',
              height: '35px',
              fontWeight: 500,
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.8)',
              color: '#666',
              backdropFilter: 'blur(10px)',
              padding: '0 20px'
            }}
          >
            Kembali
          </Button>
        </div>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatCloud1 {
          0% { transform: translateX(-120px); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateX(calc(100vw + 120px)); opacity: 0.3; }
        }
        
        @keyframes floatCloud2 {
          0% { transform: translateX(calc(100vw + 60px)); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateX(-60px); opacity: 0.2; }
        }
        
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
        
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-40px) scale(1.3); opacity: 0.8; }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
      `}</style>
    </Box>
  );
}