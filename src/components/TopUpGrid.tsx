import { Box, Center } from '@mantine/core';
import TopUpItem from './TopUpItem';

interface TopUpGridProps {
  isValidated: boolean;
  onImageClick: (amount: string) => void;
}

const topUpData = [
  { image: '/src/img/icon3.webp', amount: '15.500', description: 'Top Up 100 M (IDR 15.500)' },
  { image: '/src/img/icon3.webp', amount: '30.000', description: 'Top Up 200 M (IDR 30.000)' },
  { image: '/src/img/icon2.webp', amount: '15.500', description: 'Top Up 100 M (IDR 15.500)' },
  { image: '/src/img/icon2.webp', amount: '30.000', description: 'Top Up 200 M (IDR 30.000)' },
  { image: '/src/img/icon1.webp', amount: '15.500', description: 'Top Up 100 M (IDR 15.500)' },
  { image: '/src/img/icon1.webp', amount: '30.000', description: 'Top Up 200 M (IDR 30.000)' }
];

export default function TopUpGrid({ isValidated, onImageClick }: TopUpGridProps) {
  const renderRow = (startIndex: number) => (
    <Center mt={32} style={{ gap: '32px' }}>
      <TopUpItem
        image={topUpData[startIndex].image}
        amount={topUpData[startIndex].amount}
        description={topUpData[startIndex].description}
        isValidated={isValidated}
        onImageClick={onImageClick}
      />
      <TopUpItem
        image={topUpData[startIndex + 1].image}
        amount={topUpData[startIndex + 1].amount}
        description={topUpData[startIndex + 1].description}
        isValidated={isValidated}
        onImageClick={onImageClick}
      />
    </Center>
  );

  return (
    <Box>
      {renderRow(0)}
      {renderRow(2)}
      {renderRow(4)}
    </Box>
  );
}