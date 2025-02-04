// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    Tabs,
    Table,
    Button,
    Group,
    Text,
    Modal,
    TextInput,
    Textarea,
    Select,
    Notification,
    MultiSelect,
    Switch,
    LoadingOverlay,
    Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Pencil,
    Trash,
    Eye,
    Check,
    X
} from 'lucide-react';

type Content = {
    id: string;
    title: string;
    content: string;
    type: 'article' | 'review';
    status: 'draft' | 'published';
    createdAt: Date;
    categoryId?: string;
    tags?: string[];
    rating?: number;
};

type Category = {
    id: string;
    name: string;
};

type Tag = {
    id: string;
    name: string;
};

export default function ContentDashboard() {
    const [opened, { open, close }] = useDisclosure(false);
    const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [contents, setContents] = useState<Content[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>('articles');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();

    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });

    const [newContent, setNewContent] = useState({
        title: '',
        content: '',
        type: 'article' as 'article' | 'review',
        status: 'draft' as 'draft' | 'published',
        categoryId: '',
        tags: [] as string[],
        rating: 0,
    });

    const [editingContent, setEditingContent] = useState<Content | null>(null);

    useEffect(() => {
        fetchContents();
        fetchCategories();
        fetchTags();
    }, []);

    const fetchContents = async () => {
        setPageLoading(true);
        try {
            const articlesRes = await fetch('/api/articles');
            if (!articlesRes.ok) {
                const error = await articlesRes.json();
                throw new Error(error.error || 'Failed to fetch articles');
            }
            const articles = await articlesRes.json();

            // For now, we'll only handle articles until we set up reviews
            const formattedContents = articles.map((article: any) => ({
                ...article,
                type: 'article',
                status: article.published ? 'published' : 'draft',
                createdAt: new Date(article.createdAt)
            }));

            setContents(formattedContents);
        } catch (error) {
            console.error('Fetch contents error:', error);
            showNotification(error instanceof Error ? error.message : 'Error fetching content', 'error');
        } finally {
            setPageLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const handleCreateContent = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newContent.title,
                    content: newContent.content,
                    published: newContent.status === 'published',
                    categoryId: newContent.categoryId,
                    tags: newContent.tags,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create content');
            }

            const created = await response.json();
            await fetchContents();
            showNotification('Content created successfully!', 'success');
            close();
            resetForm();
        } catch (error) {
            console.error('Create content error:', error);
            showNotification(error instanceof Error ? error.message : 'Error creating content', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateContent = async () => {
        if (!editingContent) return;

        setLoading(true);
        try {
            const endpoint = editingContent.type === 'article'
                ? `/api/articles/${editingContent.id}`
                : `/api/reviews/${editingContent.id}`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editingContent.title,
                    content: editingContent.content,
                    published: editingContent.status === 'published',
                    categoryId: editingContent.categoryId,
                    tags: editingContent.tags,
                    ...(editingContent.type === 'review' && { rating: editingContent.rating }),
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            await fetchContents();
            showNotification('Content updated successfully!', 'success');
            closeEdit();
        } catch (error) {
            console.error('Error updating content:', error);
            showNotification(
                error instanceof Error ? error.message : 'Error updating content',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'article' | 'review') => {
        if (!window.confirm('Are you sure you want to delete this content?')) return;

        try {
            const endpoint = type === 'article' ? `/api/articles/${id}` : `/api/reviews/${id}`;
            const response = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            await fetchContents();
            showNotification('Content deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting content:', error);
            showNotification(
                error instanceof Error ? error.message : 'Error deleting content',
                'error'
            );
        }
    };

    const resetForm = () => {
        setNewContent({
            title: '',
            content: '',
            type: 'article',
            status: 'draft',
            categoryId: '',
            tags: [],
            rating: 0,
        });
    };

    const ContentForm = ({ content, setContent, isEdit = false }: any) => (
        <>
            <TextInput
                label="Title"
                placeholder="Enter title"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                required
                mb="md"
            />
            <Textarea
                label="Content"
                placeholder="Enter content"
                value={content.content}
                onChange={(e) => setContent({ ...content, content: e.target.value })}
                required
                minRows={3}
                mb="md"
            />
            <Select
                label="Category"
                placeholder="Select category"
                data={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                value={content.categoryId}
                onChange={(value) => setContent({ ...content, categoryId: value })}
                mb="md"
            />
            <MultiSelect
                label="Tags"
                placeholder="Select tags"
                data={tags.map(tag => ({ value: tag.id, label: tag.name }))}
                value={content.tags}
                onChange={(value) => setContent({ ...content, tags: value })}
                mb="md"
            />
            {content.type === 'review' && (
                <Select
                    label="Rating"
                    placeholder="Select rating"
                    data={[1,2,3,4,5].map(n => ({ value: n.toString(), label: `${n} stars` }))}
                    value={content.rating.toString()}
                    onChange={(value) => setContent({ ...content, rating: parseInt(value || '0') })}
                    mb="md"
                />
            )}
            <Switch
                label="Published"
                checked={content.status === 'published'}
                onChange={(e) => setContent({
                    ...content,
                    status: e.currentTarget.checked ? 'published' : 'draft'
                })}
                mb="md"
            />
        </>
    );

    return (
        <Paper p="md" radius="md">
            <LoadingOverlay visible={pageLoading} />

            {notification.show && (
                <Notification
                    color={notification.type === 'success' ? 'green' : 'red'}
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    icon={notification.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                    className="fixed top-4 right-4 z-50"
                >
                    {notification.message}
                </Notification>
            )}

            <Group mb="lg">
                <Text size="xl">Content Management</Text>
                <Button
                    onClick={open}
                >
                    Create New Content
                </Button>
            </Group>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="articles">Articles</Tabs.Tab>
                    <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="articles">
                    <Table striped highlightOnHover mt="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {contents
                                .filter(c => c.type === 'article')
                                .map((content) => (
                                    <Table.Tr key={content.id}>
                                        <Table.Td>{content.title}</Table.Td>
                                        <Table.Td>
                                            <Text color={content.status === 'published' ? 'green' : 'orange'}>
                                                {content.status}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>{content.createdAt.toLocaleDateString()}</Table.Td>
                                        <Table.Td>
                                            <Group>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    onClick={() => router.push(`/articles/${content.id}`)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="yellow"
                                                    onClick={() => {
                                                        setEditingContent(content);
                                                        openEdit();
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => handleDelete(content.id, 'article')}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value="reviews">
                    <Table striped highlightOnHover mt="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Title</Table.Th>
                                <Table.Th>Rating</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {contents
                                .filter(c => c.type === 'review')
                                .map((content) => (
                                    <Table.Tr key={content.id}>
                                        <Table.Td>{content.title}</Table.Td>
                                        <Table.Td>{content.rating} / 5</Table.Td>
                                        <Table.Td>
                                            <Text color={content.status === 'published' ? 'green' : 'orange'}>
                                                {content.status}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>{content.createdAt.toLocaleDateString()}</Table.Td>
                                        <Table.Td>
                                            <Group>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    onClick={() => router.push(`/reviews/${content.id}`)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="yellow"
                                                    onClick={() => {
                                                        setEditingContent(content);
                                                        openEdit();
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => handleDelete(content.id, 'review')}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>

            {/* Create Modal */}
            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    resetForm();
                }}
                title="Create New Content"
                size="lg"
            >
                <ContentForm
                    content={newContent}
                    setContent={setNewContent}
                />
                <Group mt="md">
                    <Button
                        variant="subtle"
                        onClick={() => {
                            close();
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateContent}
                        loading={loading}
                    >
                        Create
                    </Button>
                </Group>
            </Modal>

            {/* Edit Modal */}
            <Modal
                opened={editModalOpened}
                onClose={() => {
                    closeEdit();
                    setEditingContent(null);
                }}
                title="Edit Content"
                size="lg"
            >
                {editingContent && (
                    <>
                        <ContentForm
                            content={editingContent}
                            setContent={setEditingContent}
                            isEdit={true}
                        />
                        <Group mt="md">
                            <Button
                                variant="subtle"
                                onClick={() => {
                                    closeEdit();
                                    setEditingContent(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateContent}
                                loading={loading}
                            >
                                Update
                            </Button>
                        </Group>
                    </>
                )}
            </Modal>
        </Paper>
    );
}