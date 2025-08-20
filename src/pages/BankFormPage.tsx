import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, TextInput, Select, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService, BankData, BankAccountData } from '../../services/apiService';

interface BankFormData {
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface LocationState {
  amount_id?: number;
  amount?: string;
  chipAmount?: string;
  neoPlayerId?: string;
  neoId?: string;
  agentReferral?: string;
  bankAccounts?: BankAccountData[];
  userInfo?: {
    user_id: number;
    user_name: string;
    neo_player_id: string;
  };
  agentInfo?: {
    id: number;
    username: string;
    referral_code: string;
  };
  preValidated?: boolean;
  whatsappNumber?: string;
}



// Helper function untuk menyimpan neo_player_id dari App.tsx
const saveNeoPlayerIdToStorage = (neoId: string) => {
  if (neoId && neoId.trim()) {
    localStorage.setItem('neo_player_id', neoId.trim());
    sessionStorage.setItem('neo_player_id', neoId.trim());
    console.log('✅ [BankFormPage] Neo Player ID saved to storage:', neoId.trim());
  }
};

export default function BankFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const locationState = location.state as LocationState;
  const selectedAmount = locationState?.amount || "15.000";
  const selectedAmountId = locationState?.amount_id || 0;
  const selectedChipAmount = locationState?.chipAmount || "200M";

  // Dynamic neo_player_id dan agent_referral
  const [neoPlayerId, setNeoPlayerId] = useState<string>('');
  const [agentReferral, setAgentReferral] = useState<string>('');
  const [isNeoPlayerIdReady, setIsNeoPlayerIdReady] = useState(false);

  const [formData, setFormData] = useState<BankFormData>({
    bankId: 0,
    bankName: '',
    accountNumber: '',
    accountHolderName: ''
  });

  const [errors, setErrors] = useState<Partial<BankFormData>>({});
  const [banksList, setBanksList] = useState<BankData[]>([]);
  const [savedBankAccounts, setSavedBankAccounts] = useState<BankAccountData[]>([]);
  const [selectedSavedAccount, setSelectedSavedAccount] = useState<string>('');
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [isLoadingSavedAccounts, setIsLoadingSavedAccounts] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showNeoIdInput, setShowNeoIdInput] = useState(false);
  const [neoIdInputValue, setNeoIdInputValue] = useState('');
  
  // Ref to prevent multiple API calls
  const hasFetchedRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);

  // Get neo_player_id dan agent_referral from multiple sources
  useEffect(() => {
    const getPlayerData = () => {
      console.log('🔍 [BankFormPage] Starting data detection...');
      
      // Priority 1: From navigation state (from App.tsx)
      const navState = location.state as LocationState;
      console.log('🔍 [BankFormPage] Navigation state:', navState);
      
      let foundNeoId = '';
      let foundAgentReferral = '';
      
      // Neo Player ID detection
      if (navState?.neoPlayerId) {
        foundNeoId = navState.neoPlayerId;
        console.log('✅ [BankFormPage] Neo Player ID from navigation (neoPlayerId):', foundNeoId);
      } else if (navState?.neoId) {
        foundNeoId = navState.neoId;
        console.log('✅ [BankFormPage] Neo Player ID from navigation (neoId):', foundNeoId);
      }
      
      // Agent Referral detection
      if (navState?.agentReferral) {
        foundAgentReferral = navState.agentReferral;
        console.log('✅ [BankFormPage] Agent Referral from navigation:', foundAgentReferral);
      }
      
      // If pre-loaded bank accounts exist, use them
      if (navState?.bankAccounts && navState.preValidated) {
        console.log('✅ [BankFormPage] Using pre-loaded bank accounts from App.tsx:', navState.bankAccounts.length);
        setSavedBankAccounts(navState.bankAccounts);
        setIsLoadingSavedAccounts(false);
        
        if (navState.bankAccounts.length > 0) {
          setShowManualForm(false);
          setShowNeoIdInput(false);
        } else {
          setShowManualForm(true);
          setShowNeoIdInput(false);
        }
        
        // Also save user and agent info if available
        if (navState.userInfo) {
          console.log('✅ [BankFormPage] User info from App.tsx:', navState.userInfo);
        }
        if (navState.agentInfo) {
          console.log('✅ [BankFormPage] Agent info from App.tsx:', navState.agentInfo);
        }
      }
      
      // Fallback to storage if navigation state is empty
      if (!foundNeoId) {
        const storedNeoId = localStorage.getItem('neo_player_id') || sessionStorage.getItem('neo_player_id');
        if (storedNeoId) {
          foundNeoId = storedNeoId;
          console.log('✅ [BankFormPage] Neo Player ID from storage:', foundNeoId);
        }
      }
      
      if (!foundAgentReferral) {
        const storedAgentReferral = localStorage.getItem('agent_referral') || sessionStorage.getItem('agent_referral') || 'default_ref';
        foundAgentReferral = storedAgentReferral;
        console.log('✅ [BankFormPage] Agent Referral from storage:', foundAgentReferral);
      }
      
      // URL parameters fallback
      const urlParams = new URLSearchParams(window.location.search);
      if (!foundNeoId) {
        const urlNeoId = urlParams.get('neo_id') || urlParams.get('neo_player_id');
        if (urlNeoId) {
          foundNeoId = urlNeoId;
          console.log('✅ [BankFormPage] Neo Player ID from URL:', foundNeoId);
        }
      }
      
      if (!foundAgentReferral || foundAgentReferral === 'default_ref') {
        const urlAgentReferral = urlParams.get('ref') || urlParams.get('referral');
        if (urlAgentReferral) {
          foundAgentReferral = urlAgentReferral;
          console.log('✅ [BankFormPage] Agent Referral from URL:', foundAgentReferral);
        }
      }
      
      // Save to storage
      if (foundNeoId) {
        saveNeoPlayerIdToStorage(foundNeoId);
      }
      if (foundAgentReferral) {
        localStorage.setItem('agent_referral', foundAgentReferral);
        sessionStorage.setItem('agent_referral', foundAgentReferral);
      }
      
      console.log('🔍 [BankFormPage] Final data:', { foundNeoId, foundAgentReferral });
      return { neoId: foundNeoId, agentReferral: foundAgentReferral };
    };

    const { neoId, agentReferral } = getPlayerData();
    setNeoPlayerId(neoId);
    setAgentReferral(agentReferral);
    setIsNeoPlayerIdReady(true);
  }, [location]);

  // Load banks from API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        console.log('🔍 [BankFormPage] Fetching banks...');
        const response = await apiService.getBanks();
        
        if (response.status === 'success' && response.data && Array.isArray(response.data)) {
          setBanksList(response.data);
          console.log('✅ [BankFormPage] Banks loaded:', response.data.length);
        } else {
          console.error('❌ [BankFormPage] Failed to load banks:', response.message);
          setBanksList([]);
        }
      } catch (error) {
        console.error('❌ [BankFormPage] Error loading banks:', error);
        setBanksList([]);
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  // Reset fetch status when neo_player_id changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [neoPlayerId, agentReferral]);

  // Load saved bank accounts (only if not pre-loaded from App.tsx)
  useEffect(() => {
    if (!isNeoPlayerIdReady) return;

    // Skip if already pre-loaded from App.tsx
    const navState = location.state as LocationState;
    if (navState?.bankAccounts && navState.preValidated) {
      console.log('ℹ️ [BankFormPage] Using pre-loaded bank accounts, skipping API call');
      hasFetchedRef.current = true; // Mark as fetched
      return;
    }

    // Skip if no data to fetch
    if (!neoPlayerId || !agentReferral) {
      console.log('ℹ️ [BankFormPage] No neoPlayerId or agentReferral, showing input form');
      setShowNeoIdInput(true);
      setShowManualForm(true);
      setSavedBankAccounts([]);
      setIsLoadingSavedAccounts(false);
      return;
    }

    // Prevent multiple API calls
    if (hasFetchedRef.current || isLoadingSavedAccounts) {
      console.log('ℹ️ [BankFormPage] Already fetched or loading, skipping API call');
      return;
    }

    // Cancel previous request if exists
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    const fetchSavedBankAccounts = async () => {
      console.log('🔍 [BankFormPage] Starting fetchSavedBankAccounts:', { neoPlayerId, agentReferral });
      
      // Create new abort controller
      fetchControllerRef.current = new AbortController();
      hasFetchedRef.current = true;
      setIsLoadingSavedAccounts(true);
      
      try {
        const response = await apiService.getBankAccounts(neoPlayerId, agentReferral);
        
        // Check if request was aborted
        if (fetchControllerRef.current?.signal.aborted) {
          console.log('ℹ️ [BankFormPage] Request was aborted');
          return;
        }
        
        if (response.status === 'success' && response.data && response.data.bank_accounts) {
          setSavedBankAccounts(response.data.bank_accounts);
          console.log('✅ [BankFormPage] Saved accounts loaded:', response.data.bank_accounts.length);
          
          if (response.data.bank_accounts.length > 0) {
            setShowManualForm(false);
            setShowNeoIdInput(false);
          } else {
            setShowManualForm(true);
            setShowNeoIdInput(false);
          }
        } else {
          console.log('ℹ️ [BankFormPage] No saved accounts found');
          setSavedBankAccounts([]);
          setShowManualForm(true);
          setShowNeoIdInput(false);
        }
      } catch (error) {
        if (fetchControllerRef.current?.signal.aborted) {
          console.log('ℹ️ [BankFormPage] Request was aborted');
          return;
        }
        
        console.error('❌ [BankFormPage] Error loading saved accounts:', error);
        setSavedBankAccounts([]);
        setShowManualForm(true);
        setShowNeoIdInput(false);
      } finally {
        if (!fetchControllerRef.current?.signal.aborted) {
          setIsLoadingSavedAccounts(false);
        }
      }
    };

    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(fetchSavedBankAccounts, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [neoPlayerId, agentReferral, isNeoPlayerIdReady]); // Remove 'location' from dependencies

  // Convert banks data to select options
  const bankOptions = React.useMemo(() => {
    if (!banksList || !Array.isArray(banksList)) {
      return [];
    }
    
    return banksList.map(bank => ({
      value: bank.id.toString(),
      label: bank.name
    }));
  }, [banksList]);

  // Convert saved accounts to select options
  const savedAccountOptions = React.useMemo(() => {
    return savedBankAccounts.map(account => ({
      value: account.id.toString(),
      label: account.formatted_account
    }));
  }, [savedBankAccounts]);

  // Function to format chip amount display
  const formatChipAmount = (value: string): string => {
    const numValue = parseInt(value);
    
    if (numValue >= 1000) {
      const billions = numValue / 1000;
      if (billions % 1 === 0) {
        return `${billions}`;
      } else {
        return `${billions.toFixed(1)}`;
      }
    }
    
    return `${value}`;
  };

  const formattedChipAmount = formatChipAmount(selectedChipAmount);

  // Handle saved account selection
  const handleSavedAccountChange = (value: string | null) => {
    if (value) {
      const accountId = parseInt(value);
      const selectedAccount = savedBankAccounts.find(acc => acc.id === accountId);
      
      if (selectedAccount) {
        setSelectedSavedAccount(value);
        
        // Auto-fill form with selected account data
        setFormData({
          bankId: selectedAccount.bank_id,
          bankName: selectedAccount.bank_name,
          accountNumber: selectedAccount.bank_account_no,
          accountHolderName: selectedAccount.bank_account_name
        });
        
        // Clear errors
        setErrors({});
        
        console.log('✅ [BankFormPage] Auto-filled from saved account:', selectedAccount);
      }
    } else {
      setSelectedSavedAccount('');
      setFormData({
        bankId: 0,
        bankName: '',
        accountNumber: '',
        accountHolderName: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BankFormData> = {};

    if (!formData.bankId || formData.bankId === 0) {
      newErrors.bankName = 'Pilih bank terlebih dahulu';
    }

    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Nomor rekening harus diisi';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Nomor rekening hanya boleh berisi angka';
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Nomor rekening minimal 8 digit';
    }

    if (!formData.accountHolderName) {
      newErrors.accountHolderName = 'Nama rekening harus diisi';
    } else if (formData.accountHolderName.length < 3) {
      newErrors.accountHolderName = 'Nama rekening minimal 3 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const formatCurrency = (amount: string) => {
  if (!amount) return "-";
  // Remove any non-numeric characters and format with thousand separators
  const numericAmount = amount.replace(/\D/g, '');
  return numericAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = () => {
  if (validateForm()) {
    // Get amount ID using the existing helper function
    const amountId = selectedAmountId;
    console.log('AMOUNT ID: ', amountId)
    
    navigate('/bank-confirmation', {
      state: {
        amount: selectedAmount,
        chipAmount: selectedChipAmount,
        bankData: {
          ...formData,
          bankId: formData.bankId // pastikan bankId ada
        },
        neoId: neoPlayerId, // dari state
        whatsappNumber: locationState.whatsappNumber,
        amountId: amountId, // TAMBAHKAN INI - dari getBongkarAmountId
        agentReferral: agentReferral // TAMBAHKAN INI - dari state
      }
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleBankChange = (value: string | null) => {
    if (value && banksList && banksList.length > 0) {
      const bankId = parseInt(value);
      const selectedBank = banksList.find(bank => bank.id === bankId);
      
      setFormData(prev => ({
        ...prev,
        bankId: bankId,
        bankName: selectedBank?.name || ''
      }));
      
      if (errors.bankName) {
        setErrors(prev => ({ ...prev, bankName: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        bankId: 0,
        bankName: ''
      }));
    }
  };

  // Handle neo_player_id input submission
  const handleNeoIdSubmit = async () => {
    if (!neoIdInputValue.trim()) {
      alert('Silakan masukkan Neo Player ID');
      return;
    }

    // Validate neo_player_id (basic validation)
    if (!/^\d+$/.test(neoIdInputValue.trim())) {
      alert('Neo Player ID harus berupa angka');
      return;
    }

    const newNeoId = neoIdInputValue.trim();
    setNeoPlayerId(newNeoId);
    setShowNeoIdInput(false);
    
    // Save to localStorage
    localStorage.setItem('neo_player_id', newNeoId);
    
    console.log('✅ [BankFormPage] Neo Player ID set manually:', newNeoId);
  };

  // Handle neo_player_id change/edit
  const handleChangeNeoId = () => {
    setShowNeoIdInput(true);
    setNeoIdInputValue(neoPlayerId);
    setSavedBankAccounts([]);
    setShowManualForm(true);
  };

  const handleInputChange = (field: keyof BankFormData, value: string) => {
    if (field === 'accountNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Loading state
  if (isLoadingBanks || !isNeoPlayerIdReady) {
    return (
      <Box style={{ 
        background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #40E0D0 70%, #20B2AA 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ color: 'white', fontSize: '18px' }}>
          Memuat data...
        </Text>
      </Box>
    );
  }

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
          minHeight: '700px'
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
              top: '120px',
              left: 0,
              width: '100%',
              height: 'calc(100% - 80px)',
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
              top: '80px',
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
            padding: '120px 30px 60px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Form Content */}
            <Box style={{ marginTop: '0px' }}>
              <Text style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '15px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                {showNeoIdInput ? 'Masukkan Neo Player ID' : 'Isi Data Bank Anda'}
              </Text>

              {/* NEO PLAYER ID INPUT SECTION */}
              {showNeoIdInput && (
                <Box style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <Text style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#8B4513'
                  }}>
                    Neo Player ID
                  </Text>
                  <TextInput
                    placeholder="Masukkan Neo Player ID Anda"
                    value={neoIdInputValue}
                    onChange={(e) => setNeoIdInputValue(e.target.value)}
                    inputMode="numeric"
                    maxLength={15}
                    styles={{
                      input: {
                        borderRadius: '10px',
                        border: '2px solid rgba(139, 69, 19, 0.3)',
                        padding: '8px',
                        fontSize: '12px',
                        '&:focus': {
                          borderColor: '#8B4513'
                        }
                      }
                    }}
                  />
                  
                  <Box style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button
                      onClick={handleNeoIdSubmit}
                      style={{
                        background: 'linear-gradient(145deg, #32CD32, #228B22)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        boxShadow: '0 4px 12px rgba(50, 205, 50, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Lanjutkan
                    </button>
                    
                    {neoPlayerId && (
                      <button
                        onClick={() => {
                          setShowNeoIdInput(false);
                          setNeoIdInputValue('');
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #8B4513',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          color: '#8B4513',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Batal
                      </button>
                    )}
                  </Box>
                </Box>
              )}

              {/* NEO PLAYER ID DISPLAY & CHANGE OPTION */}
              {!showNeoIdInput && neoPlayerId && (
                <Box style={{
                  padding: '10px',
                  marginBottom: '15px',
                  textAlign: 'left',
                  background: 'rgba(139, 69, 19, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(139, 69, 19, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Text style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#8B4513',
                      marginBottom: '2px'
                    }}>
                      Neo Player ID
                    </Text>
                    <Text style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#8B4513'
                    }}>
                      {neoPlayerId}
                    </Text>
                  </Box>
                  {/* <button
                    onClick={handleChangeNeoId}
                    style={{
                      background: 'transparent',
                      border: '1px solid #8B4513',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#8B4513',
                      fontSize: '9px',
                      cursor: 'pointer'
                    }}
                  >
                    Ubah
                  </button> */}
                </Box>
              )}

              {/* LOADING STATE FOR SAVED ACCOUNTS */}
              {isLoadingSavedAccounts && (
                <Box style={{
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <Text style={{
                    fontSize: '12px',
                    color: '#8B4513'
                  }}>
                    Memuat data bank tersimpan...
                  </Text>
                </Box>
              )}

              {/* SAVED ACCOUNTS SECTION */}
              {!showNeoIdInput && !isLoadingSavedAccounts && savedBankAccounts.length > 0 && !showManualForm && (
                <Box style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <Text style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#8B4513'
                  }}>
                    Pilih Rekening Tersimpan
                  </Text>
                  <Select
                    placeholder="Pilih rekening yang tersimpan"
                    data={savedAccountOptions}
                    value={selectedSavedAccount}
                    onChange={handleSavedAccountChange}
                    clearable
                    searchable
                    styles={{
                      input: {
                        borderRadius: '10px',
                        border: '2px solid rgba(139, 69, 19, 0.3)',
                        padding: '8px',
                        fontSize: '12px',
                        '&:focus': {
                          borderColor: '#8B4513'
                        }
                      }
                    }}
                  />
                  
                  <Box style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button
                      onClick={() => setShowManualForm(true)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #8B4513',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: '#8B4513',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Atau Isi Manual
                    </button>
                  </Box>
                </Box>
              )}

              {/* Selected Amount Display - hanya tampil jika tidak input neo_id */}
              {!showNeoIdInput && !isLoadingSavedAccounts && (
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
                      (IDR {formatCurrency(selectedAmount)})
                    </Text>
                  </Box>
                </Box>
              )}

              {/* MANUAL FORM SECTION */}
              {!showNeoIdInput && !isLoadingSavedAccounts && (showManualForm || savedBankAccounts.length === 0) && (
                <>
                  {savedBankAccounts.length > 0 && (
                    <Box style={{ marginBottom: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => setShowManualForm(false)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #8B4513',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          color: '#8B4513',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Kembali ke Rekening Tersimpan
                      </button>
                    </Box>
                  )}

                  <Box style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <Text style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#8B4513'
                    }}>
                      Pilih Bank
                    </Text>
                    <Select
                      placeholder="Pilih bank Anda"
                      data={bankOptions}
                      value={formData.bankId > 0 ? formData.bankId.toString() : null}
                      onChange={handleBankChange}
                      error={errors.bankName}
                      disabled={bankOptions.length === 0}
                      clearable
                      searchable
                      styles={{
                        input: {
                          borderRadius: '10px',
                          border: '2px solid rgba(139, 69, 19, 0.3)',
                          padding: '8px',
                          fontSize: '12px',
                          '&:focus': {
                            borderColor: '#8B4513'
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <Text style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#8B4513'
                    }}>
                      Nomor Rekening
                    </Text>
                    <TextInput
                      placeholder="Masukkan nomor rekening"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      error={errors.accountNumber}
                      inputMode="numeric"
                      maxLength={20}
                      styles={{
                        input: {
                          borderRadius: '10px',
                          border: '2px solid rgba(139, 69, 19, 0.3)',
                          padding: '8px',
                          fontSize: '12px',
                          '&:focus': {
                            borderColor: '#8B4513'
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <Text style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      color: '#8B4513'
                    }}>
                      Nama Rekening
                    </Text>
                    <TextInput
                      placeholder="Masukkan nama pemilik rekening"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      error={errors.accountHolderName}
                      styles={{
                        input: {
                          borderRadius: '10px',
                          border: '2px solid rgba(139, 69, 19, 0.3)',
                          padding: '8px',
                          fontSize: '12px',
                          '&:focus': {
                            borderColor: '#8B4513'
                          }
                        }
                      }}
                    />
                  </Box>

                  {/* Warning Text */}
                  <Box style={{
                    background: 'rgba(255, 165, 0, 0.1)',
                    borderRadius: '10px',
                    padding: '10px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 165, 0, 0.3)'
                  }}>
                    <Text style={{
                      fontSize: '10px',
                      color: '#8B4513',
                      textAlign: 'center',
                      lineHeight: '1.4'
                    }}>
                      Silakan pastikan kembali bahwa semua informasi yang Anda masukkan sudah benar. 
                      Kami tidak dapat melakukan perubahan apabila terjadi kesalahan
                    </Text>
                  </Box>
                </>
              )}

              {/* Action Buttons */}
              {!showNeoIdInput && !isLoadingSavedAccounts && (
                <Box style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  <button onClick={handleBack} style={{
                    background: 'linear-gradient(145deg, #FFA500, #FF8C00)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(255, 165, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}>
                    Kembali
                  </button>
                  
                  <button onClick={handleSubmit} style={{
                    background: 'linear-gradient(145deg, #32CD32, #228B22)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(50, 205, 50, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}>
                    Lanjutkan
                  </button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

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