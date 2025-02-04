// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import {
    Tabs,
    Table,
    Button,
    Group,
    Text,
    Modal,
    TextInput,
    Select
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    Plus,
    Pencil,
    Trash,
    Eye
} from 'lucide-react';

type Content = {
    id: string;
    title: string;
    type: 'article' | 'review';
    status: 'draft' | 'published';
    createdAt: Date;
};

export default function ContentDashboard() {
    const [opened, { open, close }] = useDisclosure(false);
    const [contents, setContents] = useState<Content[]>([
        {
            id: '1',
            title: 'First Article',
            type: 'article',
            status: 'published',
            createdAt: new Date(),
        },
        {
            id: '2',
            title: 'First Review',
            type: 'review',
            status: 'draft',
            createdAt: new Date(),
        }
    ]);

    const [activeTab, setActiveTab] = useState<string | null>('articles');
    const [newContent, setNewContent] = useState({
        title: '',
        type: activeTab === 'articles' ? 'article' : 'review',
        status: 'draft'
    });

    const handleCreateContent = () => {
        // Implement content creation logic
        const newItem: Content = {
            id: (contents.length + 1).toString(),
            ...newContent,
            createdAt: new Date(),
        };
        setContents([...contents, newItem]);
        close();
    };

    return (
        <div>
            <Group justify="space-between" mb="lg">
                <Text size="xl" fw={700}>
                    Content Management Dashboard
                </Text>
                <Button
                    leftSection={<Plus size={14} />}
                    onClick={open}
                >
                    Create New Content
                </Button>
            </Group>

            <Tabs
                value={activeTab}
                onChange={setActiveTab}
            >
                <Tabs.List>
                    <Tabs.Tab value="articles">Articles</Tabs.Tab>
                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="articles">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {contents
                                .filter(c => c.type === 'article')
                                .map((content) => (
                                    <Table.Tr key={content.id}>
                                        <Table.Td>{content.title}</Table.Td>
                                        <Table.Td>{content.status}</Table.Td>
                                        <Table.Td>
                                            {content.createdAt.toLocaleDateString()}
                                        </Table.Td>
                                        <Table.Td>
                                            <Group>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    leftSection={<Eye size={14} />}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="yellow"
                                                    leftSection={<Pencil size={14} />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    leftSection={<Trash size={14} />}
                                                >
                                                    Delete
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value="reviews">
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {contents
                                .filter(c => c.type === 'review')
                                .map((content) => (
                                    <Table.Tr key={content.id}>
                                        <Table.Td>{content.title}</Table.Td>
                                        <Table.Td>{content.status}</Table.Td>
                                        <Table.Td>
                                            {content.createdAt.toLocaleDateString()}
                                        </Table.Td>
                                        <Table.Td>
                                            <Group>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    leftSection={<Eye size={14} />}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="yellow"
                                                    leftSection={<Pencil size={14} />}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    leftSection={<Trash size={14} />}
                                                >
                                                    Delete
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>

            <Modal
                opened={opened}
                onClose={close}
                title="Create New Content"
            >
                <TextInput
                    label="Title"
                    placeholder="Enter content title"
                    value={newContent.title}
                    onChange={(event) => setNewContent({
                        ...newContent,
                        title: event.currentTarget.value
                    })}
                    mb="md"
                />
                <Select
                    label="Content Type"
                    value={newContent.type}
                    onChange={(value) => setNewContent({
                        ...newContent,
                        type: value as 'article' | 'review'
                    })}
                    data={[
                        { value: 'article', label: 'Article' },
                        { value: 'review', label: 'Review' }
                    ]}
                    mb="md"
                />
                <Select
                    label="Status"
                    value={newContent.status}
                    onChange={(value) => setNewContent({
                        ...newContent,
                        status: value as 'draft' | 'published'
                    })}
                    data={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'published', label: 'Published' }
                    ]}
                    mb="md"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={close}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateContent}>
                        Create
                    </Button>
                </Group>
            </Modal>
        </div>
    );
}