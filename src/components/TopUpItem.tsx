import { Group, Text } from '@mantine/core';

interface TopUpItemProps {
  image: string;
  amount: string;
  description: string;
  isValidated: boolean;
  onImageClick: (amount: string) => void;
}

export default function TopUpItem({ 
  image, 
  amount, 
  description, 
  isValidated, 
  onImageClick 
}: TopUpItemProps) {
  const handleMouseOver = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.backgroundColor = '#000';
    e.currentTarget.style.transition = 'background-color 0.3s ease';
    const textElement = e.currentTarget.nextElementSibling as HTMLElement;
    if (textElement) textElement.style.color = '#ffffff';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transition = 'background-color 0.3s ease';
    const textElement = e.currentTarget.nextElementSibling as HTMLElement;
    if (textElement) textElement.style.color = '#000000';
  };

  return (
    <Group style={{ position: 'relative' }}>
      <img
        src={image}
        alt="Top Up Icon"
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
        onClick={() => onImageClick(amount)}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
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
        {description}
      </Text>
    </Group>
  );
}