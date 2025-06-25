import { Card, Grid, Image, Text, Progress, Badge } from '@mantine/core';

export function DonasiCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Text fw={700} size="lg">Program Donasi Berkelanjutan</Text>

      <Grid gutter="xs">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card padding="sm" radius="md" withBorder>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Badge color="blue" variant="light">Aksi Bersama</Badge>
              <Image
                src="https://via.placeholder.com/300x150.png?text=Jembatan"
                height={100}
                fit="cover"
                radius="sm"
                alt="Donasi 1"
              />
              <Text size="sm" fw={600}>Bangun Jembatan Bantar Gadung</Text>
              <Text size="xs" c="gray">Tersedia</Text>
              <Text fw={700} size="sm" c="blue">Rp97.370.519</Text>
              <Progress value={70} size="xs" />
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Card padding="sm" radius="md" withBorder>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Badge color="red" variant="filled">URGENT</Badge>
              <Image
                src="https://via.placeholder.com/300x150.png?text=Ibu+Tunggal"
                height={100}
                fit="cover"
                radius="sm"
                alt="Donasi 2"
              />
              <Text size="sm" fw={600}>Bantu 50+ Ibu Tunggal & Perempuan Rentan</Text>
              <Text size="xs" c="gray">Tersedia</Text>
              <Text fw={700} size="sm" c="blue">Rp6.514.989</Text>
              <Progress value={35} size="xs" />
            </div>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
