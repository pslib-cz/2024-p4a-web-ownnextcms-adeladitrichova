// src/components/MainNavigation.tsx
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import {
    Home,
    BookOpen,
    PenTool,
    LogIn,
    LogOut,
    User,
    Menu as MenuIcon
} from 'lucide-react';
import {
    Paper,
    Container,
    Group,
    Button,
    Burger,
    Drawer,
    ScrollArea,
    Divider,
    UnstyledButton,
    Stack,
    Text,
    Avatar,
    Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function MainNavigation() {
    const { data: session } = useSession();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    const mainLinks = [
        { link: '/', label: 'Home', icon: Home },
        { link: '/articles', label: 'Articles', icon: BookOpen },
        ...(session ? [{ link: '/dashboard', label: 'Dashboard', icon: User }] : []),
    ];

    return (
        <Box pb={60}>
            <Paper
                shadow="sm"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    zIndex: 100,
                }}
            >
                <Container size="lg" h="100%">
                    <Group justify="space-between" h="100%">
                        {/* Logo */}
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Group>
                                <BookOpen size={30} color="#228be6" />
                                <Text
                                    size="xl"
                                    fw={700}
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                                >
                                    Article World
                                </Text>
                            </Group>
                        </Link>

                        {/* Desktop Navigation */}
                        <Group gap={5} visibleFrom="sm">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.link}
                                    href={link.link}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button
                                        variant="subtle"
                                        leftSection={<link.icon size={20} />}
                                    >
                                        {link.label}
                                    </Button>
                                </Link>
                            ))}

                            {session ? (
                                <Group ml="xl">
                                    <Avatar
                                        src={session.user?.image}
                                        radius="xl"
                                        size={36}
                                    />
                                    <Button
                                        variant="filled"
                                        color="red"
                                        leftSection={<LogOut size={20} />}
                                        onClick={() => signOut()}
                                    >
                                        Logout
                                    </Button>
                                </Group>
                            ) : (
                                <Button
                                    variant="filled"
                                    leftSection={<LogIn size={20} />}
                                    onClick={() => signIn('github')}
                                >
                                    Login
                                </Button>
                            )}
                        </Group>

                        {/* Mobile Menu Button */}
                        <Burger
                            opened={drawerOpened}
                            onClick={toggleDrawer}
                            hiddenFrom="sm"
                        />
                    </Group>
                </Container>
            </Paper>

            {/* Mobile Drawer */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - 60px)`} mx="-md">
                    <Divider my="sm" />

                    {session && (
                        <Group p="md">
                            <Avatar src={session.user?.image} radius="xl" />
                            <Box>
                                <Text fw={500}>{session.user?.name}</Text>
                                <Text size="xs" c="dimmed">{session.user?.email}</Text>
                            </Box>
                        </Group>
                    )}

                    <Divider my="sm" />

                    <Stack p="md" gap="sm">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.link}
                                href={link.link}
                                style={{ textDecoration: 'none' }}
                                onClick={closeDrawer}
                            >
                                <UnstyledButton
                                    py="xs"
                                    px="sm"
                                    w="100%"
                                    style={(theme) => ({
                                        borderRadius: theme.radius.sm,
                                        '&:hover': {
                                            backgroundColor: theme.colors.gray[0],
                                        },
                                    })}
                                >
                                    <Group>
                                        <link.icon size={20} />
                                        <Text size="sm">{link.label}</Text>
                                    </Group>
                                </UnstyledButton>
                            </Link>
                        ))}

                        <Divider my="sm" />

                        {session ? (
                            <Button
                                variant="filled"
                                color="red"
                                leftSection={<LogOut size={20} />}
                                onClick={() => {
                                    signOut();
                                    closeDrawer();
                                }}
                                fullWidth
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="filled"
                                leftSection={<LogIn size={20} />}
                                onClick={() => {
                                    signIn('github');
                                    closeDrawer();
                                }}
                                fullWidth
                            >
                                Login
                            </Button>
                        )}
                    </Stack>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}