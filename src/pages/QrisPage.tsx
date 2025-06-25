// src/QrisPage.jsx
import { Box, Center, Text, Image, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom'; // Assuming you use React Router for navigation
import { QRCodeSVG } from 'qrcode.react'; // Menggunakan named import untuk QRCodeSVG

export default function QrisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topUpAmount, neoId, whatsappNumber } = location.state || {}; // Get data passed from previous page

  // In a real application, you'd make an API call to your backend here
  // to generate the actual QRIS data based on topUpAmount, neoId, whatsappNumber.
  // For demonstration, we'll use a placeholder.
  const dummyQrisData = JSON.stringify({
    merchantId: "YOUR_MERCHANT_ID", // Replace with your actual merchant ID
    amount: topUpAmount,
    transactionId: `TXN-${Date.now()}`,
    neoId: neoId,
    whatsappNumber: whatsappNumber,
    // ... more QRIS data as per your payment gateway's specification
  });

  if (!topUpAmount) {
    return (
      <Center style={{ minHeight: '100vh', flexDirection: 'column' }}>
        <Text size="xl" color="red">No top-up amount selected. Please go back and choose a package.</Text>
        <Button onClick={() => navigate('/')} mt="md">Go Back</Button>
      </Center>
    );
  }

  return (
    <Box style={{ background: '#e6f2f7', minHeight: '100vh', padding: 20 }}>
      <Box
        style={{
          margin: '0 auto',
          maxWidth: 600,
          background: '#fff',
          padding: 40,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}
      >
        <Text
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '24px',
            color: '#333',
            textShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
        >
          Scan QRIS untuk Pembayaran
        </Text>

        <Text size="lg" mb="lg">
          Jumlah: <Text component="span" weight={700}>IDR {topUpAmount}</Text>
        </Text>
        <Text size="md" mb="lg">
          Neo ID: <Text component="span" weight={700}>{neoId}</Text>
        </Text>
        <Text size="md" mb="xl">
          WhatsApp: <Text component="span" weight={700}>{whatsappNumber}</Text>
        </Text>

        <Center style={{ marginBottom: 30, padding: 20, border: '1px solid #eee', borderRadius: 12 }}>
          {/* Menggunakan QRCodeSVG */}
          <QRCodeSVG
            value={dummyQrisData} // In production, this would be the actual QRIS payload from your backend
            size={256}
            level="H"
            includeMargin={true}
            // Anda bisa menambahkan properti khusus SVG di sini, misalnya:
            // bgColor="#ffffff"
            // fgColor="#000000"
            // imageSettings={{
            //   src: "/src/img/logo.png", // Path ke logo Anda
            //   x: null,
            //   y: null,
            //   height: 24,
            //   width: 24,
            //   excavate: true,
            // }}
          />
        </Center>

        <Text size="md" color="dimmed" mb="lg">
          Silakan scan kode QR di atas menggunakan aplikasi pembayaran favorit Anda (misalnya GoPay, OVO, Dana, LinkAja, Mobile Banking, dll.).
        </Text>

        <Button
          onClick={() => navigate('/')}
          size="lg"
          radius="xl"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
          styles={{
            root: {
              boxShadow: '0 8px 24px rgba(51, 154, 240, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 36px rgba(51, 154, 240, 0.6)'
              }
            }
          }}
        >
          Kembali ke Pilihan Top Up
        </Button>
      </Box>
    </Box>
  );
}