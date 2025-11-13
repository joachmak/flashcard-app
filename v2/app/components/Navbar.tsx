'use client';

import { Container, Group, Text } from '@mantine/core';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  return (
    <Container size="lg" py="md">
      <Group justify="space-between">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text
            size="xl"
            fw={700}
            style={{
              letterSpacing: '5px',
              cursor: 'pointer',
              transition: 'letter-spacing 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.letterSpacing = '9px')}
            onMouseLeave={(e) => (e.currentTarget.style.letterSpacing = '5px')}
          >
            SCI CARD
          </Text>
        </Link>

        <Group gap="lg">
          <SignedIn>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text style={{ cursor: 'pointer' }}>Home</Text>
            </Link>
            <Link href="/add_set" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text style={{ cursor: 'pointer' }}>Add new set</Text>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Text style={{ cursor: 'pointer' }}>Sign In</Text>
            </SignInButton>
          </SignedOut>
        </Group>
      </Group>
    </Container>
  );
}
