// App.tsx
import { Box, LoadingOverlay } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ErrorAlert from './components/ErrorAlert';
import SelectionGrid from './components/SelectionGrid'; // ✅ Changed from TopUpGrid to SelectionGrid
import { apiService, BankAccountData, BankAccountInquiryResponse } from './../services/apiService';

export default function App() {
  const [neoId, setNeoId] = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [txtErr, setTxtErr] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  
  // ✅ Loading state untuk validasi Neo ID
  const [isValidatingNeoId, setIsValidatingNeoId] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);
  const [isProcessingBongkar, setIsProcessingBongkar] = useState(false);
  const [notRegisteredData, setNotRegisteredData] = useState<any>(null);

// ✅ Helper function - letakkan SEBELUM handleBongkarClick
const shouldNavigateNotRegistered = (amount: string, chipAmount: string) => {
  return notRegisteredData && 
         notRegisteredData.amount === amount && 
         notRegisteredData.chipAmount === chipAmount;
};
  
  const navigate = useNavigate();

  // Extract referral code from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref') || urlParams.get('referral') || '';
    setReferralCode(ref);
    
    // Enhanced logging for debugging
    console.log('🔍 [APP] URL Debug:', {
      fullUrl: window.location.href,
      urlParams: Object.fromEntries(urlParams.entries()),
      extractedRef: ref,
      finalReferralCode: ref || 'default_ref'
    });
    
    // Store in sessionStorage as backup
    if (ref) {
      sessionStorage.setItem('referralCode', ref);
      console.log('✅ [APP] Referral code stored in sessionStorage:', ref);
    }
  }, []);

  const handleValidation = () => {
    // Enhanced validation
    if (neoId.trim() === '' || whatsappNumber.trim() === '') {
      setTxtErr('Mohon lengkapi semua field yang diperlukan');
      setShowError(true);
      setIsValidated(false);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Validate Neo ID format (numbers only, min 3 digits)
    if (!/^[0-9]{3,20}$/.test(neoId)) {
      setTxtErr('Neo ID harus berupa angka 3-20 digit');
      setShowError(true);
      setIsValidated(false);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Validate WhatsApp number format (numbers only, min 10 digits)
    if (!/^[0-9]{10,15}$/.test(whatsappNumber)) {
      setTxtErr('Nomor WhatsApp harus berupa angka 10-15 digit');
      setShowError(true);
      setIsValidated(false);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // ✅ Simple validation success
    setShowError(false);
    setIsValidated(true);
    setTxtErr('');
    
    // Save to storage untuk backup
    localStorage.setItem('neo_player_id', neoId.trim());
    sessionStorage.setItem('neo_player_id', neoId.trim());
    
    console.log('✅ [APP] Basic validation completed');
  };

  // ✅ Handler untuk TopUp (existing functionality)
  const handleTopUpClick = async (amount_id: number, topUpAmount: string, topUpValue: string) => {
    if (!isValidated) {
      setTxtErr('Mohon lengkapi dan validasi semua field terlebih dahulu');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Final validation before navigation
    if (!neoId.trim() || !whatsappNumber.trim()) {
      setTxtErr('Mohon lengkapi semua field yang diperlukan');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Get referral code first
    const finalReferralCode = referralCode || sessionStorage.getItem('referralCode') || 'default_ref';

    // ✅ Validate Neo ID by calling web-deposit endpoint
    setIsValidatingNeoId(true);
    setTxtErr('');
    
    try {
      console.log('🔍 [APP] Validating Neo ID before navigation:', neoId.trim());
      
      const amountId = amount_id;
      const formattedPhone = apiService.formatPhoneNumber(whatsappNumber);
      
      // Call web-deposit API to validate Neo ID
      const response = await apiService.createWebDeposit({
        amount_id: amountId,
        agent_referral: finalReferralCode,
        neo_player_id: neoId.trim(),
        phone_no: formattedPhone,
      });
      
      console.log('📨 [APP] Web-deposit validation response:', response);
      
      if (response.status === 'success') {
        console.log('✅ [APP] Validation successful, proceeding to QRIS');
        
        // Navigate to QRIS page with transaction data
        navigate('/qris', { 
          state: { 
            topUpAmount,
            topUpValue,
            neoId: neoId.trim(), 
            whatsappNumber: whatsappNumber.trim(),
            referralCode: finalReferralCode,
            // ✅ Pass transaction data yang sudah dibuat
            transactionData: response.data,
            transactionId: response.data?.id,
            qrCodeUrl: response.data?.data?.qr_url
          } 
        });
        
      } else {
        // Handle validation errors
        let errorMessage = 'Neo ID tidak valid';
        
        if (response.message === 'LoadPlayerDataFailed') {
          errorMessage = 'Neo ID tidak ditemukan. Pastikan ID Anda benar.';
        } else if (response.message) {
          errorMessage = response.message;
        }
        
        console.log('❌ [APP] Neo ID validation failed:', response.message);
        setTxtErr(errorMessage);
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
      }
      
    } catch (error) {
      console.error('🚨 [APP] Neo ID validation error:', error);
      setTxtErr('Terjadi kesalahan saat validasi Neo ID. Silakan coba lagi.');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setIsValidatingNeoId(false);
    }
  };

  // ✅ Complete handleBongkarClick function
const handleBongkarClick = async (amount_id: number, amount: string, chipAmount: string) => {
  // ✅ CHECK PERTAMA: Jika user sudah pernah klik dan mendapat not_registered response
  if (shouldNavigateNotRegistered(amount, chipAmount)) {
    console.log('🔄 [APP] User clicking again after not_registered notification, proceeding to bank-form...');
    
    const { response, finalReferralCode } = notRegisteredData;
    
    // Save data ke storage
    localStorage.setItem('neo_player_id', neoId.trim());
    localStorage.setItem('agent_referral', finalReferralCode);
    sessionStorage.setItem('neo_player_id', neoId.trim());
    sessionStorage.setItem('agent_referral', finalReferralCode);
    
    // Clear the not registered data
    setNotRegisteredData(null);
    
    // Navigate dengan data not registered
    navigate('/bank-form', {
      state: {
        amount_id,
        amount,
        chipAmount,
        neoId: neoId.trim(),
        neoPlayerId: neoId.trim(),
        whatsappNumber: whatsappNumber.trim(),
        agentReferral: finalReferralCode,
        bankAccounts: [],
        userInfo: null,
        agentInfo: response.data.agent_info,
        preValidated: true,
        registrationRequired: true,
        registrationMessage: response.message,
        registrationUrl: response.data.registration_url
      }
    });
    
    return; // ✅ STOP di sini jika sudah navigate
  }

  // ✅ VALIDATION - Klik pertama kali
  if (!isValidated) {
    setTxtErr('Mohon lengkapi dan validasi semua field terlebih dahulu');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    return;
  }

  // Final validation
  if (!neoId.trim() || !whatsappNumber.trim()) {
    setTxtErr('Mohon lengkapi semua field yang diperlukan');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
    return;
  }

  const finalReferralCode = referralCode || sessionStorage.getItem('referralCode') || 'default_ref';

  // ✅ Validate Neo ID dan load bank accounts setelah klik bongkar
  setIsProcessingBongkar(true);
  setTxtErr('');
  setShowError(false);
  
  try {
    console.log('🔍 [APP] Validating Neo ID and loading bank accounts:', {
      neoId: neoId.trim(),
      agentReferral: finalReferralCode
    });
    
    // Hit API bank-accounts untuk validasi sekaligus ambil data
    const response: BankAccountInquiryResponse = await apiService.getBankAccounts(neoId.trim(), finalReferralCode);
    
    console.log('📊 [APP] API Response full:', response);
    
    // ✅ Handle success case (user sudah terdaftar)
    if (response.status === 'success') {
      setNotRegisteredData(null); // Clear any previous not registered data
      console.log('✅ [APP] Bank accounts loaded successfully:', response.data.bank_accounts.length);
      
      // Save data ke storage
      localStorage.setItem('neo_player_id', neoId.trim());
      localStorage.setItem('agent_referral', finalReferralCode);
      sessionStorage.setItem('neo_player_id', neoId.trim());
      sessionStorage.setItem('agent_referral', finalReferralCode);

      // Navigate ke bank-form dengan data lengkap
      navigate('/bank-form', {
        state: {
          amount_id,
          amount,
          chipAmount,
          neoId: neoId.trim(),
          neoPlayerId: neoId.trim(),
          whatsappNumber: whatsappNumber.trim(),
          agentReferral: finalReferralCode,
          bankAccounts: response.data.bank_accounts,
          userInfo: {
            user_id: response.data.user_id,
            user_name: response.data.user_name,
            neo_player_id: response.data.neo_player_id
          },
          agentInfo: response.data.agent_info,
          preValidated: true,
          registrationRequired: false
        }
      });
      
    // ✅ Handle not registered case (Neo ID valid tapi belum daftar)
    } else if (response.status === 'not_registered') {
      console.log('⚠️ [APP] User not registered:', response.message);
      
      // ✅ TAMPILKAN NOTIFIKASI DAN SIMPAN DATA
      setTxtErr(`${response.message} - Klik tombol sekali lagi untuk melanjutkan proses bongkar.`);
      setShowError(true);
      setTimeout(() => setShowError(false), 6000);
      
      // Simpan data untuk navigate nanti jika user klik lagi
      setNotRegisteredData({
        amount_id,
        amount,
        chipAmount,
        response: response,
        finalReferralCode
      });
      
      return; // ✅ STOP di sini, tidak navigate sekarang
      
    // ✅ Handle validation errors (Neo ID tidak valid)
    } else {
      setNotRegisteredData(null); // Clear not registered data on error
      let errorMessage = 'Neo ID tidak valid';
      
      if (response.message === 'LoadPlayerDataFailed') {
        errorMessage = 'Neo ID tidak ditemukan. Pastikan ID Anda benar.';
      } else if (response.message) {
        errorMessage = response.message;
      }
      
      console.log('❌ [APP] Neo ID validation failed:', response.message);
      setTxtErr(errorMessage);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
      
  } catch (error: any) {
    setNotRegisteredData(null); // Clear not registered data on error
    console.error('🚨 [APP] Neo ID validation error:', error);
    
    // ✅ Better error handling
    let errorMessage = 'Terjadi kesalahan saat validasi Neo ID. Silakan coba lagi.';
    
    // Handle specific error cases
    if (error?.response) {
      if (error.response.status === 422) {
        // Validation errors from backend
        const errors = error.response.data?.errors;
        if (errors?.neo_player_id) {
          errorMessage = errors.neo_player_id[0];
        } else if (errors?.agent_referral) {
          errorMessage = errors.agent_referral[0];
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Silakan coba lagi nanti.';
      }
    } else if (error?.request) {
      errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }
    
    setTxtErr(errorMessage);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  } finally {
    setIsProcessingBongkar(false);
  }
};

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #20B2AA 70%, #008B8B 100%)',
      minHeight: '100vh', 
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* ✅ Loading overlay untuk Neo ID validation */}
      <LoadingOverlay visible={isValidatingNeoId} />
      
      {/* Debug referral code display (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          // position: 'fixed',
          // top: '10px',
          // right: '10px',
          // background: 'rgba(0,0,0,0.8)',
          // color: 'white',
          // padding: '8px 12px',
          // borderRadius: '5px',
          // fontSize: '12px',
          // zIndex: 9999,
          // fontFamily: 'monospace'
        }}>
          {/* <div>🔗 URL: {window.location.search}</div>
          <div>📋 Ref: <span style={{color: '#4CAF50'}}>{referralCode || 'none'}</span></div>
          <div>💾 Session: <span style={{color: '#FF9800'}}>{sessionStorage.getItem('referralCode') || 'none'}</span></div>
          <div>🔄 Validating: <span style={{color: '#2196F3'}}>{isValidatingNeoId ? 'YES' : 'NO'}</span></div> */}
        </div>
      )}
      
      {/* Full Ocean Experience - Animated Elements di area luar */}
      
      {/* Animated Clouds */}
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
        top: '20%',
        right: '-15%',
        width: '80px',
        height: '30px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '40px',
        animation: 'floatCloud2 25s infinite linear',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '35%',
        left: '-8%',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.35)',
        borderRadius: '30px',
        animation: 'floatCloud3 30s infinite linear',
        zIndex: 0
      }} />

      {/* Floating Bubbles */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '5%',
        width: '8px',
        height: '8px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble1 8s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'bubble2 10s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '70%',
        left: '10%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        animation: 'bubble3 6s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '5px',
        height: '5px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble4 9s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Water Waves Effect */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(to top, #F4A460 0%, #DEB887 40%, transparent 100%)',
        clipPath: 'polygon(0 60%, 15% 50%, 30% 60%, 45% 45%, 60% 55%, 75% 40%, 90% 50%, 100% 45%, 100% 100%, 0% 100%)',
        zIndex: 0,
        animation: 'waveMove 12s infinite ease-in-out'
      }} />

      {/* Additional Wave Layer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(to top, #CD853F 0%, rgba(205,133,63,0.8) 60%, transparent 100%)',
        clipPath: 'polygon(0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 50%, 100% 100%, 0% 100%)',
        zIndex: 1,
        animation: 'waveMove2 15s infinite ease-in-out reverse'
      }} />

      {/* Sparkle Effects */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '15%',
        fontSize: '12px',
        animation: 'sparkle 3s infinite ease-in-out',
        zIndex: 0
      }}>✨</div>

      <div style={{
        position: 'absolute',
        top: '60%',
        right: '25%',
        fontSize: '10px',
        animation: 'sparkle 4s infinite ease-in-out 1s',
        zIndex: 0
      }}>✨</div>

      <div style={{
        position: 'absolute',
        top: '45%',
        left: '8%',
        fontSize: '8px',
        animation: 'sparkle 5s infinite ease-in-out 2s',
        zIndex: 0
      }}>✨</div>

      {/* Fish Swimming Effect */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '-5%',
        fontSize: '16px',
        animation: 'swimFish 25s infinite linear',
        zIndex: 0
      }}>🐠</div>

      <div style={{
        position: 'absolute',
        top: '75%',
        right: '-8%',
        fontSize: '14px',
        animation: 'swimFish2 30s infinite linear reverse',
        zIndex: 0
      }}>🐟</div>

      {/* Main Content Container */}
      <Box
        style={{
          margin: '0 auto',
          minHeight: '100vh',
          maxWidth: 400,
          overflowX: 'hidden',
          backgroundImage: 'url(/img/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingBottom: 66,
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 0 50px rgba(0,0,0,0.2)'
        }}
      >
        {/* Optional: Subtle overlay untuk readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.03)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Header />
          
          <InputSection
            neoId={neoId}
            setNeoId={setNeoId}
            whatsappNumber={whatsappNumber}
            setWhatsapp={setWhatsapp}
            isValidated={isValidated}
            onValidation={handleValidation}
          />

          <ErrorAlert 
            showError={showError} 
            errorMessage={txtErr} // ✅ Pass custom error message
          />

          {/* ✅ Changed to SelectionGrid with both handlers */}
          <SelectionGrid
            isValidated={isValidated}
            onTopUpClick={handleTopUpClick}
            onBongkarClick={handleBongkarClick}
          />
        </div>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatCloud1 {
          0% { transform: translateX(-120px); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateX(calc(100vw + 120px)); opacity: 0.3; }
        }
        
        @keyframes floatCloud2 {
          0% { transform: translateX(calc(100vw + 80px)); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateX(-80px); opacity: 0.2; }
        }

        @keyframes floatCloud3 {
          0% { transform: translateX(-60px); opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { transform: translateX(calc(100vw + 60px)); opacity: 0.4; }
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
        
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(-50px) scale(0.7); opacity: 0; }
        }

        @keyframes bubble4 {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-35px) scale(1.2); opacity: 0.7; }
          100% { transform: translateY(-70px) scale(0.8); opacity: 0; }
        }

        @keyframes waveMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }

        @keyframes waveMove2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-15px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes swimFish {
          0% { transform: translateX(-50px) scaleX(1); }
          25% { transform: translateX(25vw) scaleX(1); }
          50% { transform: translateX(50vw) scaleX(-1); }
          75% { transform: translateX(75vw) scaleX(-1); }
          100% { transform: translateX(calc(100vw + 50px)) scaleX(1); }
        }

        @keyframes swimFish2 {
          0% { transform: translateX(calc(100vw + 50px)) scaleX(-1); }
          25% { transform: translateX(75vw) scaleX(-1); }
          50% { transform: translateX(50vw) scaleX(1); }
          75% { transform: translateX(25vw) scaleX(1); }
          100% { transform: translateX(-50px) scaleX(-1); }
        }

        @media (max-width: 768px) {
          /* Reduce animations on mobile for performance */
          @keyframes floatCloud1, @keyframes floatCloud2, @keyframes floatCloud3 {
            0% { transform: translateX(-60px); opacity: 0.2; }
            100% { transform: translateX(calc(100vw + 60px)); opacity: 0.2; }
          }
        }
      `}</style>
    </Box>
  );
}