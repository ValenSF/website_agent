import { Box, Alert } from '@mantine/core';

interface ErrorAlertProps {
  showError: boolean;
}

export default function ErrorAlert({ showError }: ErrorAlertProps) {
  if (!showError) return null;

  return (
    <Box style={{ margin: '0 24px' }}>
      <Alert
        color="red"
        title="⚠️ Data Belum Lengkap!"
        radius="lg"
        styles={{
          root: {
            background: 'linear-gradient(45deg, #ff6b6b, #fa5252)',
            border: 'none',
            color: 'white',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
            animation: 'shake 0.5s ease-in-out'
          },
          title: {
            color: 'white',
            fontWeight: 700
          }
        }}
      >
        Harap isi Neo ID dan Nomor WhatsApp terlebih dahulu sebelum memilih paket top up!
      </Alert>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </Box>
  );
}