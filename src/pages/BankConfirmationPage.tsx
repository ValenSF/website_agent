import React, { useState, useEffect } from "react";
import { Box, Text, Button, Modal, Loader } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from '../../services/apiService';

interface BankData {
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface LocationState {
  bankData?: BankData;
  amount?: string;
  chipAmount?: string;
  neoId?: string;
  whatsappNumber?: string;
  amountId?: number;
  agentReferral?: string;
}

export default function BankConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk modal dan loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info'); // 'info', 'error', 'success'
  const [transactionId, setTransactionId] = useState<number | null>(null);
  
  // State untuk Neo Player data
  const [senderNeoData, setSenderNeoData] = useState<{nick: string, coin: string} | null>(null);
  const [targetNeoData, setTargetNeoData] = useState<{nick: string, coin: string} | null>(null);
  const [isLoadingNeoData, setIsLoadingNeoData] = useState(false);

  // Ambil data dari state navigation
  const locationState = location.state as LocationState;
  const {
    bankData,
    amount,
    chipAmount,
    neoId,
    whatsappNumber,
    amountId,
    agentReferral
  } = locationState || {};

  // Data pengirim dari form yang sudah diisi
  const senderBank = bankData?.bankName || "-";
  const senderNeoPartyId = neoId || "-";
  const senderIDR = amount || "-";
  const senderAccountName = bankData?.accountHolderName || "-";
  const senderAccountNumber = bankData?.accountNumber || "-";
  const senderKoin = chipAmount || "-";

  // Data penerima (target) - menggunakan data dari API
  const targetNeoId = "168168";
  const targetUsername = targetNeoData?.nick || "CuanApp";
  const targetKoin = targetNeoData?.coin || chipAmount || "-";

  // Load Neo Player data when component mounts
  useEffect(() => {
    const loadNeoPlayerData = async () => {
      if (!neoId) return;
      
      setIsLoadingNeoData(true);
      
      try {
        // Load sender Neo data
        if (neoId) {
          const senderResponse = await apiService.getNeoPersonalInfo(neoId);
          if (senderResponse.status === 'success' && senderResponse.data) {
            setSenderNeoData({
              nick: senderResponse.data.Nick,
              coin: senderResponse.data.Coin
            });
          }
        }
        
        // Load target Neo data (168168)
        const targetResponse = await apiService.getNeoPersonalInfo("168168");
        if (targetResponse.status === 'success' && targetResponse.data) {
          setTargetNeoData({
            nick: targetResponse.data.Nick,
            coin: targetResponse.data.Coin
          });
        }
      } catch (error) {
        console.error('Error loading Neo player data:', error);
        // Set fallback data if API fails
        setSenderNeoData({ nick: 'Unknown', coin: '0' });
        setTargetNeoData({ nick: 'CuanApp', coin: '0' });
      } finally {
        setIsLoadingNeoData(false);
      }
    };
    
    loadNeoPlayerData();
  }, [neoId]);

  // Function to format currency (IDR)
  const formatCurrency = (amount: string) => {
    if (!amount) return "-";
    // Remove any non-numeric characters and format with thousand separators
    const numericAmount = amount.replace(/\D/g, '');
    return numericAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Nominal chip format (sesuaikan biar seperti gambar)
  function formatKoin(koin: string) {
    if (!koin) return "-";
    // Format 888.222.777.555
    return koin.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Function to format chip amount display
  const formatChipAmount = (chipAmount: string) => {
    const amount = parseInt(chipAmount);
    if (amount >= 1000) {
      return `${amount / 1000}B`;
    } else {
      return `${amount}M`;
    }
  };

  const formattedChipAmount = formatChipAmount(senderKoin);

  // Function to submit transaction
  const handleSubmitTransaction = async () => {
    // Validasi data yang diperlukan
    if (!bankData || !neoId || !whatsappNumber) {
      setModalType('error');
      setModalTitle('Data Tidak Lengkap');
      setModalMessage('Data transaksi tidak lengkap. Silakan kembali dan lengkapi data Anda.');
      setShowModal(true);
      return;
    }

    // Validasi amountId dan agentReferral
    if (!amountId) {
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('Amount ID tidak ditemukan. Silakan pilih nominal kembali.');
      setShowModal(true);
      return;
    }

    if (!agentReferral) {
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('Agent referral tidak ditemukan. Silakan hubungi customer service.');
      setShowModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API using the correct interface
      const requestData = {
        bank_id: bankData.bankId,
        amount_id: amountId,
        bank_account_no: bankData.accountNumber,
        bank_account_name: bankData.accountHolderName,
        agent_referral: agentReferral,
        neo_player_id: neoId,
        phone_no: whatsappNumber
      };

      console.log('Submitting transaction with data:', requestData);

      // Call web inquiry API using the correct method
      const response = await apiService.createWebInquiry(requestData);

      if (response.status === 'success' && response.data) {
        const { id } = response.data;
        setTransactionId(id);
        
        // Navigate to pending page
        navigate('/pending-bongkar', {
          state: {
            transactionId: id,
            amount,
            chipAmount,
            bankData,
            neoId,
            whatsappNumber
          }
        });
      } else {
        throw new Error(response.message || 'Transaksi gagal diproses');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      
      let errorMessage = 'Terjadi kesalahan saat memproses transaksi.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setModalType('error');
      setModalTitle('Transaksi Gagal');
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi tombol kembali
  function handleBack() {
    navigate(-1);
  }

  // Fungsi lanjut - submit transaction
  function handleNext() {
    handleSubmitTransaction();
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #40E0D0 70%, #20B2AA 100%)',
      minHeight: '100vh',
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Ocean Animation Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '-8%',
        width: '100px',
        height: '35px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '40px',
        animation: 'floatCloud1 18s infinite linear',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-10%',
        width: '80px',
        height: '30px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '35px',
        animation: 'floatCloud2 22s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Success Celebration Bubbles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        animation: 'celebrationBubble1 6s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '12%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '50%',
        animation: 'celebrationBubble2 8s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: 'linear-gradient(to top, #F4A460 0%, rgba(222,184,135,0.8) 50%, transparent 100%)',
        clipPath: 'polygon(0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 50%, 100% 100%, 0% 100%)',
        zIndex: 0
      }} />

      {/* Main Content Container dengan Background Image */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        backgroundImage: 'url(/img/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>

        {/* Board Container */}
        <Box style={{
          width: '100%',
          maxWidth: '350px',
          position: 'relative',
          minHeight: '650px'
        }}>
          
          {/* Cat Character - Separate and above everything */}
          <Box style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5
          }}>
            <Box style={{
              width: '140px',
              height: '140px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/img/shine.png"
                alt="Shine"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '-75px',
                  width: '280px',
                  height: '170px',
                  objectFit: 'contain',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />
              <img
                src="/img/cat.png"
                alt="Cat Character"
                style={{
                  width: '250px',
                  height: '120px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                fontSize: '18px',
                animation: 'sparkle 2s infinite',
                zIndex: 2
              }}>✨</div>
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '20px',
                fontSize: '16px',
                animation: 'sparkle 2s infinite 0.5s',
                zIndex: 2
              }}>✨</div>
              <div style={{
                position: 'absolute',
                bottom: '25px',
                right: '20px',
                fontSize: '14px',
                animation: 'sparkle 2s infinite 1s',
                zIndex: 2
              }}>✨</div>
            </Box>
          </Box>
          
          {/* Board Background - Moved down */}
          <img
            src="/img/papan.png"
            alt="Board Background"
            style={{
              position: 'absolute',
              top: '150px',
              left: 0,
              width: '100%',
              height: 'calc(100% - 120px)',
              objectFit: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Board Top (Header) - Moved down */}
          <img
            src="/img/papanatas.png"
            alt="Board Top"
            style={{
              position: 'absolute',
              top: '100px',
              left: 0,
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              zIndex: 2
            }}
          />

          {/* Content Container */}
          <Box style={{
            position: 'relative',
            zIndex: 3,
            padding: '140px 30px 40px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Title */}
            <Text style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#8B4513',
              marginBottom: '15px',
              fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
              textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
            }}>
              Konfirmasi Data Anda
            </Text>

            {/* Selected Amount Display */}
            <Box style={{
              padding: '15px',
              marginBottom: '20px',
              textAlign: 'left',
              background: 'rgba(139, 69, 19, 0.1)',
              borderRadius: '15px',
              border: '2px solid rgba(139, 69, 19, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              {/* Coin Image Container */}
              <Box style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(145deg, #8B4513, #A0522D)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                border: '2px solid #DAA520',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src="/img/coin.png"
                  alt="Coin"
                  style={{
                    width: '35px',
                    height: '35px',
                    objectFit: 'contain',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </Box>

              {/* Text Content */}
              <Box>
                <Text style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#8B4513',
                  marginBottom: '2px'
                }}>
                  BONGKAR {formattedChipAmount}
                </Text>
                <Text style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#8B4513'
                }}>
                  (IDR {formatCurrency(senderIDR)})
                </Text>
              </Box>
            </Box>

            {/* Rekening Pengirim */}
            <Box style={{ marginBottom: '16px', textAlign: 'left' }}>
              <Box
                style={{
                  background: '#00D1FF',
                  padding: '8px 0 7px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '12px',
                }}
              >
                <Text
                  style={{
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: '15px',
                    letterSpacing: 0.2,
                  }}
                >
                  Rekening Pengirim
                </Text>
              </Box>
              <Box>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                  Rekening Bank <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderBank}</span>
                </Text>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                  ID Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderNeoPartyId}</span>
                </Text>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                  Username Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                    {isLoadingNeoData ? 'Loading...' : (senderNeoData?.nick || 'Unknown')}
                  </span>
                </Text>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                  IDR <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{formatCurrency(senderIDR)}</span>
                </Text>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                  Nama Rekening <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderAccountName}</span>
                </Text>
                <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700 }}>
                  Koin <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                    {isLoadingNeoData ? 'Loading...' : formatKoin(senderNeoData?.coin || senderKoin)}
                  </span>
                </Text>
              </Box>
            </Box>

            {/* Kirim sesuai Neo ID di bawah */}
            <Box
              style={{
                background: '#FF7A1A',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#fff',
                marginBottom: '12px',
              }}
            >
              <Text style={{ fontWeight: 800, fontSize: '15px', letterSpacing: 0.2 }}>
                Kirim Sesuai Neo ID di Bawah
              </Text>
            </Box>

            {/* Target info */}
            <Box style={{ marginBottom: '12px', textAlign: 'left' }}>
              <Text style={{ fontSize: '14px', fontWeight: 900, color: '#E69034', marginBottom: '4px' }}>
                ID Neo Party <span style={{ float: 'right', fontWeight: 800, color: '#8B4513' }}>{targetNeoId}</span>
              </Text>
              <Text style={{ fontSize: '12px', fontWeight: 600, color: '#B5894F', marginBottom: '4px' }}>
                Username Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                  {isLoadingNeoData ? 'Loading...' : targetUsername}
                </span>
              </Text>
              <Text style={{ fontSize: '12px', fontWeight: 600, color: '#B5894F' }}>
                Koin <span style={{ float: 'right', fontWeight: 700, color: '#8B4513' }}>
                  {isLoadingNeoData ? 'Loading...' : formatKoin(targetKoin)}
                </span>
              </Text>
            </Box>

            {/* Catatan */}
            <Text
              style={{
                fontSize: '10px',
                color: '#E69034',
                marginTop: '8px',
                marginBottom: '8px',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              *Pastikan anda mengirim chip sesuai dengan jumlah yang telah dipilih agar proses lebih cepat
            </Text>

            {/* Warning */}
            <Box
              style={{
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '10px',
                padding: '8px 10px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                marginTop: '6px',
                marginBottom: '16px',
              }}
            >
              <Text
                style={{
                  fontSize: '10px',
                  color: '#8B4513',
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                Silakan pastikan kembali bahwa semua informasi yang Anda masukkan sudah benar. Kami tidak dapat melakukan perubahan apabila terjadi kesalahan
              </Text>
            </Box>

            {/* Tombol */}
            <Box style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button 
                onClick={handleBack} 
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(145deg, #FFA500, #FF8C00)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 165, 0, 0.4)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                Kembali
              </button>
              
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(145deg, #32CD32, #228B22)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(50, 205, 50, 0.4)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting && <Loader size="xs" color="white" />}
                {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
              </button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Modal for transaction status */}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
        centered
        closeOnClickOutside={true}
        closeOnEscape={true}
        withCloseButton={true}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Box style={{ textAlign: 'center', padding: '20px' }}>
          <Text style={{ 
            fontSize: '14px', 
            lineHeight: 1.5,
            color: modalType === 'error' ? '#e74c3c' : '#2c3e50'
          }}>
            {modalMessage}
          </Text>
          
          <Box style={{ marginTop: '20px' }}>
            <Button
              onClick={handleCloseModal}
              style={{
                background: modalType === 'error' 
                  ? 'linear-gradient(145deg, #e74c3c, #c0392b)'
                  : 'linear-gradient(145deg, #3498db, #2980b9)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {modalType === 'error' ? 'Tutup' : 'OK'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-8px) scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        
        @keyframes floatCloud1 {
          0% { transform: translateX(-100px); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateX(calc(100vw + 100px)); opacity: 0.2; }
        }
        
        @keyframes floatCloud2 {
          0% { transform: translateX(calc(100vw + 80px)); opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(-80px); opacity: 0.1; }
        }
        
        @keyframes celebrationBubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 0.6; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
        
        @keyframes celebrationBubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-35px) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(-70px) scale(0.7); opacity: 0; }
        }
        
        @keyframes floatCat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}