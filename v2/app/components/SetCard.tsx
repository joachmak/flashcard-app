'use client';

import { Card, Text, Group, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Set } from '@/lib/db/schema';

interface SetCardProps {
  set: Set & { cardCount?: number };
}

export function SetCard({ set }: SetCardProps) {
  const router = useRouter();

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('nb-NO');
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('nb-NO', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="sm" withBorder>
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text
            size="xl"
            fw={700}
            style={{ cursor: 'pointer' }}
            onClick={() => router.push(`/view_set/${set.id}`)}
          >
            {set.title}
          </Text>
          <Text size="sm" c="dimmed">
            {set.cardCount || 0} card{set.cardCount !== 1 ? 's' : ''}
          </Text>
        </Group>
      </Card.Section>

      {set.description && (
        <Text pt="sm" size="sm">
          "{set.description}"
        </Text>
      )}

      <Group mt="md" gap="xl">
        <div>
          <Text size="sm" fw={700}>
            Date added
          </Text>
          <Text size="sm" c="dimmed">
            {formatDate(set.createdDate)}
          </Text>
        </div>
        <div>
          <Text size="sm" fw={700}>
            Last edited
          </Text>
          <Text size="sm" c="dimmed">
            {formatDateTime(set.lastUpdatedDate)}
          </Text>
        </div>
      </Group>

      <Group mt="md">
        <Button
          variant="light"
          color="blue"
          onClick={() => router.push(`/view_set/${set.id}`)}
        >
          View
        </Button>
        <Button
          variant="light"
          color="red"
          onClick={async () => {
            if (confirm('Are you sure you want to delete this set?')) {
              await fetch(`/api/sets/${set.id}`, { method: 'DELETE' });
              router.refresh();
            }
          }}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}
