import { Box } from '@mantine/core';
import TopUpItem from './TopUpItem';

interface TopUpGridProps {
  isValidated: boolean;
  onImageClick: (amount: string, topUpAmount: string) => void; // Add topUpAmount parameter
}

const topUpData = [
  { image: '/src/img/coin.png', amount: '10000', topUpAmount: '100', description: 'TOP UP 100M', price: '(IDR 10.000)' },
  { image: '/src/img/coin.png', amount: '15000', topUpAmount: '200', description: 'TOP UP 200M', price: '(IDR 15.000)' },
  { image: '/src/img/coin.png', amount: '21000', topUpAmount: '300', description: 'TOP UP 300M', price: '(IDR 21.000)' },
  { image: '/src/img/coin.png', amount: '28000', topUpAmount: '400', description: 'TOP UP 400M', price: '(IDR 28.000)' },
  { image: '/src/img/coin.png', amount: '34000', topUpAmount: '500', description: 'TOP UP 500M', price: '(IDR 34.000)' },
  { image: '/src/img/coin.png', amount: '41000', topUpAmount: '600', description: 'TOP UP 600M', price: '(IDR 41.000)' }
];

export default function TopUpGrid({ isValidated, onImageClick }: TopUpGridProps) {
  return (
    <Box style={{
      margin: '0 auto', // Center the container
      maxWidth: 400, // Sama dengan QrisPage
      width: '100%',
      padding: '20px'
    }}>
      <Box style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // 2 kolom
        gap: '15px', // Slightly reduced gap
        width: '100%'
      }}>
        {topUpData.map((item, index) => (
          <TopUpItem
            key={index}
            image={item.image}
            amount={item.amount}
            topUpAmount={item.topUpAmount}
            description={item.description}
            price={item.price}
            isValidated={isValidated}
            onImageClick={onImageClick}
          />
        ))}
      </Box>
    </Box>
  );
}