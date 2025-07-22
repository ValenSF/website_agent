import { Box, Alert } from '@mantine/core';

interface ErrorAlertProps {
  errorMessage?: string;
  showError: boolean;
}

export default function ErrorAlert({ errorMessage }: ErrorAlertProps) {
  // Custom message for unique constraint violation
  const getCustomErrorMessage = () => {
    if (
      errorMessage &&
      errorMessage.includes('duplicate key value violates unique constraint "users_username_unique"')
    ) {
      const usernameMatch = errorMessage.match(/Key \(username\)=\((.*?)\)/);
      const username = usernameMatch ? usernameMatch[1] : 'nomor WhatsApp';
      return `Nomor WhatsApp ${username} sudah terdaftar menjadi username! Silakan ganti username dengan menghubungi costumer service`;
    }
    // Jangan tampilkan pesan default jika errorMessage tidak ada
    return errorMessage || '';
  };

  const customMessage = getCustomErrorMessage();

  if (!customMessage) return null;

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
            animation: 'shake 0.60s ease-in-out'
          },
          title: {
            color: 'white',
            fontWeight: 700
          },
          body: {
            color: 'white'
          }
        }}
      >
        {customMessage}
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
