import { auth } from '@clerk/nextjs/server';
import { Container, Title, Text, SimpleGrid, Button } from '@mantine/core';
import { db, sets, cards } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';
import { SetCard } from './components/SetCard';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">
          SciCard
        </Title>
        <Text>Please sign in to view your flashcard sets.</Text>
      </Container>
    );
  }

  // Fetch sets with card count
  const userSets = await db
    .select({
      id: sets.id,
      title: sets.title,
      description: sets.description,
      userId: sets.userId,
      folderId: sets.folderId,
      createdDate: sets.createdDate,
      lastUpdatedDate: sets.lastUpdatedDate,
      cardCount: sql<number>`cast(count(${cards.id}) as int)`,
    })
    .from(sets)
    .leftJoin(cards, eq(cards.setId, sets.id))
    .where(eq(sets.userId, userId))
    .groupBy(sets.id)
    .orderBy(desc(sets.lastUpdatedDate));

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="lg">
        Sets
      </Title>

      {userSets.length === 0 ? (
        <Text>
          There are no sets.{' '}
          <Link href="/add_set" style={{ textDecoration: 'underline' }}>
            Create a new set
          </Link>
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {userSets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
