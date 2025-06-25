// src/pages/PaymentSuccessPage.tsx
import { Center, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Center style={{ minHeight: '100vh' }}>
      <div>
        <Title align="center" order={2} mb="md">Pembayaran Berhasil!</Title>
        <Text align="center" mb="lg">Terima kasih telah melakukan pembayaran.</Text>
        <Button fullWidth onClick={() => navigate('/')}>Kembali ke Beranda</Button>
      </div>
    </Center>
  );
}
