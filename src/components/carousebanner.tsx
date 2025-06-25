import { Carousel } from '@mantine/carousel';
import { Card, Text, Button, Group } from '@mantine/core';
import '@mantine/carousel/styles.css';

export function CarouselBanner() {
  return (
    <Carousel height={220} slideSize="100%" withIndicators loop>
      <Carousel.Slide>
        <Card radius="md" padding="lg" style={{ backgroundColor: '#FF7A45', color: 'white', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div>
              <Text size="xs" fw={700}>GALANG DANA PILIHAN</Text>
              <Text size="lg" fw={800} lh={1.2}>Dari Seberkas Cahaya Jadi Jutaan Berkah</Text>
              <Text size="xs" mt="xs">Bantu Alirkan Listrik tuk Masyarakat Daerah Terpencil</Text>
            </div>
            <Group justify="flex-start">
              <Button variant="white" color="orange" radius="xl" size="xs">
                Donasi Sekarang
              </Button>
            </Group>
          </div>
        </Card>
      </Carousel.Slide>
    </Carousel>
  );
}
