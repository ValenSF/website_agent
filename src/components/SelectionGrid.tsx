import { useState, memo, useEffect } from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';
import TopUpItem from './TopUpItem';
import BongkarItem from './BongkarItem';
import axios from "axios"

// Memoize item untuk hindari re-render
const MemoTopUpItem = memo(TopUpItem);
const MemoBongkarItem = memo(BongkarItem);

interface SelectionGridProps {
  isValidated: boolean;
  onTopUpClick: (amount: string, chipAmount: string) => void;
  onBongkarClick: (amount: string, chipAmount: string) => void;
}

const topUpData = [
  { image: '/img/coin.png', amount: '10000', chipAmount: '120', description: 'TOP UP 120M', price: '(IDR 10.000)' },
  { image: '/img/coin.png', amount: '20000', chipAmount: '250', description: 'TOP UP 250M', price: '(IDR 20.000)' },
  { image: '/img/coin.png', amount: '32500', chipAmount: '500', description: 'TOP UP 500M', price: '(IDR 32.500)' },
  { image: '/img/coin.png', amount: '50000', chipAmount: '750', description: 'TOP UP 750M', price: '(IDR 50.000)' },
  { image: '/img/coin.png', amount: '65000', chipAmount: '1000', description: 'TOP UP 1B', price: '(IDR 65.000)' },
  { image: '/img/coin.png', amount: '130000', chipAmount: '2000', description: 'TOP UP 2B', price: '(IDR 130.000)' },
  { image: '/img/coin.png', amount: '195000', chipAmount: '3000', description: 'TOP UP 3B', price: '(IDR 195.000)' },
  { image: '/img/coin.png', amount: '260000', chipAmount: '4000', description: 'TOP UP 4B', price: '(IDR 260.000)' },
  { image: '/img/coin.png', amount: '650000', chipAmount: '10000', description: 'TOP UP 10B', price: '(IDR 650.000)' },
  { image: '/img/coin.png', amount: '1950000', chipAmount: '30000', description: 'TOP UP 30B', price: '(IDR 1.950.000)' },
  { image: '/img/coin.png', amount: '2600000', chipAmount: '40000', description: 'TOP UP 40B', price: '(IDR 2.600.000)' }
  
];

const bongkarData = [
  { image: '/img/coin.png', amount: '12500', chipAmount: '250', description: 'BONGKAR 250M', price: '(IDR 12.500)' },
  { image: '/img/coin.png', amount: '27500', chipAmount: '500', description: 'BONGKAR 500M', price: '(IDR 27.500)' },
  { image: '/img/coin.png', amount: '45000', chipAmount: '750', description: 'BONGKAR 750M', price: '(IDR 45.000)' },
  { image: '/img/coin.png', amount: '60000', chipAmount: '1000', description: 'BONGKAR 1B', price: '(IDR 60.000)' },
  { image: '/img/coin.png', amount: '120000', chipAmount: '2000', description: 'BONGKAR 2B', price: '(IDR 120.000)' },
  { image: '/img/coin.png', amount: '180000', chipAmount: '3000', description: 'BONGKAR 3B', price: '(IDR 180.000)' },
  { image: '/img/coin.png', amount: '240000', chipAmount: '4000', description: 'BONGKAR 4B', price: '(IDR 240.000)' },
  { image: '/img/coin.png', amount: '600000', chipAmount: '10000', description: 'BONGKAR 10B', price: '(IDR 600.000)' },
  { image: '/img/coin.png', amount: '1800000', chipAmount: '30000', description: 'BONGKAR 30B', price: '(IDR 1.800.000)' },
  { image: '/img/coin.png', amount: '2400000', chipAmount: '40000', description: 'BONGKAR 40B', price: '(IDR 2.400.000)' }
];

function TopUpGrid({ isValidated, onClick }: { isValidated: boolean; onClick: (amount: string, chipAmount: string) => void }) {
  useEffect(() => {
    fetchList()
  }, [])

  const [dpList, setDpList] = useState([])

  async function fetchList() {
    try {
      const { data } = await axios.get('https://open-api.hidupcuan.org/api/deposit-amounts', {})

      // ✅ TopUp List: Filter dulu, baru map
      const dpList = data?.data
        .filter((val: any) => val.amount > 0)  // ✅ Filter dulu
        .map((val: any) => ({
          image: '/img/coin.png',
          amount: val.amount.toString(),
          chipAmount: val.display_chip_amount,
          description: `TOP UP ${val.display_chip_amount}`,
          price: val.display_currency  // ✅ Correct: pakai display_currency
        }))

      setDpList(dpList || [])  // ✅ Fallback to empty array
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Box style={{
      margin: '0 auto',
      maxWidth: 400,
      width: '100%',
      padding: '20px'
    }}>
      <Box style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        width: '100%'
      }}>
        {dpList?.map((item: any, index) => (
          <MemoTopUpItem
            key={index}
            image={item.image}
            amount={item.amount}
            topUpAmount={item.chipAmount}
            description={item.description}
            price={item.price}
            isValidated={isValidated}
            onImageClick={onClick}
          />
        ))}
      </Box>
    </Box>
  );
}

function BongkarGrid({ 
  isValidated, 
  onClick 
}: { 
  isValidated: boolean; 
  onClick: (amount: string, chipAmount: string) => void;
}) {
  useEffect(() => {
    fetchList()
  }, [])

  const [wdList, setWdList] = useState([])

  async function fetchList() {
    try {
      const { data } = await axios.get('https://open-api.hidupcuan.org/api/deposit-amounts', {})

      // ✅ Withdraw List: Filter dulu, baru map  
      const wdList = data?.data
        .filter((val: any) => val.wd_amount > 0)  // ✅ Filter dulu
        .map((val: any) => ({
          image: '/img/coin.png',
          amount: val.wd_amount.toString(),  // ✅ Correct: pakai wd_amount
          chipAmount: val.display_chip_amount,
          description: `BONGKAR ${val.display_chip_amount}`,
          price: `(IDR ${val.wd_amount.toLocaleString('id-ID')})`  // ✅ Correct: format wd_amount
        }))

      setWdList(wdList || [])  // ✅ Fallback to empty array
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box style={{
      margin: '0 auto',
      maxWidth: 400,
      width: '100%',
      padding: '20px'
    }}>
      <Box style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        width: '100%'
      }}>
        {wdList?.map((item: any, index) => (
          <MemoBongkarItem
            key={index}
            image={item.image}
            amount={item.amount}
            chipAmount={item.chipAmount}
            description={item.description}
            price={item.price}
            isValidated={isValidated}
            onImageClick={onClick}
          />
        ))}
      </Box>
    </Box>
  );
}

// Memoize grid juga
const MemoTopUpGrid = memo(TopUpGrid);
const MemoBongkarGrid = memo(BongkarGrid);

export default function SelectionGrid({ 
  isValidated, 
  onTopUpClick, 
  onBongkarClick
}: SelectionGridProps) {
  const [mode, setMode] = useState<'topup' | 'bongkar'>('topup');

  const handleToggle = (value: 'topup' | 'bongkar') => {
    setMode(value);
  };

  return (
    <Box>
      {/* Slide Button Toggle */}
      <ToggleSwitch onChange={handleToggle} checked={mode === 'bongkar'} />

      {/* Slider Container with Animation */}
      <Box style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 'auto',
      }}>
        <Box style={{
          display: 'flex',
          width: '200%',
          transition: 'transform 0.5s ease-in-out',
          transform: mode === 'topup' ? 'translateX(0)' : 'translateX(-50%)',
          willChange: 'transform',
        }}>
          <Box style={{ width: '50%', flexShrink: 0 }}>
            <MemoTopUpGrid isValidated={isValidated} onClick={onTopUpClick} />
          </Box>
          <Box style={{ width: '50%', flexShrink: 0 }}>
            <MemoBongkarGrid 
              isValidated={isValidated} 
              onClick={onBongkarClick} 
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface ToggleSwitchProps {
  onChange: (value: 'topup' | 'bongkar') => void;
  checked: boolean;
}

function ToggleSwitch({ onChange, checked }: ToggleSwitchProps) {
  const theme = useMantineTheme();

  const handleTopUpClick = () => {
    if (checked) {
      onChange('topup');
    }
  };

  const handleBongkarClick = () => {
    if (!checked) {
      onChange('bongkar');
    }
  };

  // Buat ukuran dinamis berdasarkan screen size
  const switchWidth = theme.breakpoints.sm ? 240 : 180;
  const knobWidth = theme.breakpoints.sm ? 100 : 70;
  const knobLeftChecked = `calc(100% - ${knobWidth + 10}px)`;
  const knobLeftUnchecked = '10px';
  const fontSize = theme.breakpoints.sm ? 16 : 12;
  const height = theme.breakpoints.sm ? 50 : 40;
  const knobHeight = theme.breakpoints.sm ? 40 : 30;
  const knobTop = theme.breakpoints.sm ? 5 : 5;
  const padding = theme.breakpoints.sm ? '0 10px' : '0 5px';
  const marginText = theme.breakpoints.sm ? 20 : 10;

  return (
    <Box style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '20px' 
    }}>
      <Box style={{
        position: 'relative',
        width: switchWidth,
        height: height,
        background: '#F5DEB3',
        borderRadius: height / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: padding,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Text 
          onClick={handleTopUpClick}
          style={{
            color: '#8B4513',
            fontWeight: 700,
            fontSize: fontSize,
            zIndex: 1,
            marginLeft: marginText,
            cursor: 'pointer',
          }}>
          TOP UP
        </Text>
        
        <Text 
          onClick={handleBongkarClick}
          style={{
            color: '#8B4513',
            fontWeight: 700,
            fontSize: fontSize,
            zIndex: 1,
            marginRight: marginText,
            cursor: 'pointer',
          }}>
          BONGKAR
        </Text>

        {/* Sliding knob */}
        <Box style={{
          position: 'absolute',
          left: checked ? knobLeftChecked : knobLeftUnchecked,
          top: knobTop,
          width: knobWidth,
          height: knobHeight,
          background: 'linear-gradient(145deg, #FFA500, #CD853F)',
          borderRadius: knobHeight / 2,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'left 0.3s ease',
          border: '2px solid #fff',
          pointerEvents: 'none',
        }} />
      </Box>
    </Box>
  );
}