import { TextInput, Paper, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export function Navbar() {
  return (
    <Paper shadow="sm" p="sm" radius="md" style={{ backgroundColor: '#00AEEF' }}>
      <TextInput
        placeholder='Coba cari "Tolong menolong"'
        leftSection={<IconSearch size={rem(18)} />}
        radius="xl"
        size="md"
        styles={{
          input: {
            backgroundColor: '#ffffff',
            border: 'none',
          },
        }}
      />
    </Paper>
  );
}
