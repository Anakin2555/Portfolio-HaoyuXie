import { useState, useEffect } from 'react';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
// import Modal from 'antd/es/modal';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Tabs from 'antd/es/tabs';
import Popconfirm from 'antd/es/popconfirm';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Comment } from '../../../types';
import CommentService from '../../../services/commentService';
import { useAppSelector } from '../../../store/hooks';
import EnvUtil from '../../../utils/envUtil';
import dayjs from 'dayjs';

export default function MessageAdmin() {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [pageIds, setPageIds] = useState<string[]>([]);
    const { currentUser } = useAppSelector(state => state.user);

    useEffect(() => {
        if (!EnvUtil.isProduction() || currentUser) {
            loadAllComments();
        }
    }, [currentUser]);

    const loadAllComments = async () => {
        setLoading(true);
        try {
            // First get all possible pageIds
            const pages = await CommentService.getPageIds();
            
            // Check if pages is an array before proceeding
            if (!Array.isArray(pages)) {
                console.error('Expected pages to be an array, got:', pages);
                setPageIds([]);
                setComments([]);
                message.error('Invalid data format received from server');
                return;
            }
            
            setPageIds(pages);

            // Then fetch all comments for each pageId
            const allCommentsPromises = pages.map((pageId: string) => 
                CommentService.getComments(pageId)
            );
            
            const allCommentsArrays = await Promise.all(allCommentsPromises);
            
            // Flatten arrays and set state
            const allComments = allCommentsArrays.flat();
            setComments(allComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            setPageIds([]);
            setComments([]);
            message.error('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (id: string) => {
        try {
            // Call API to delete comment
            await CommentService.deleteComment(id);
            
            message.success('Comment deleted successfully');
            
            // Refresh comments
            loadAllComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Failed to delete comment');
        }
    };

    const columns: ColumnsType<Comment> = [
        {
            title: 'Visitor',
            key: 'visitor',
            render: (_, record) => (
                <div>
                    <div><strong>Name:</strong> {record.visitor.name}</div>
                    <div><strong>IP:</strong> {record.visitor.ip}</div>
                    <div>
                        <strong>Location:</strong> {record.visitor.location ? 
                            `${record.visitor.location.city}, ${record.visitor.location.country}` : 
                            'Unknown'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        },
        {
            title: 'Content',
            dataIndex: 'text',
            key: 'text',
            width: '40%',
            render: (text) => (
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {text}
                </div>
            ),
        },
        {
            title: 'Reply To',
            key: 'parentId',
            render: (_, record) => record.parentId ? (
                <Tag color="blue">
                    Reply to comment #{record.parentId.substring(0, 8)}
                </Tag>
            ) : (
                <Tag color="green">
                    Top-level comment
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to delete this comment?"
                        onConfirm={() => handleDeleteComment(record.id)}
                        okText="Yes"
                        cancelText="No"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button 
                            type="link" 
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Filter comments by pageId
    const getCommentsForPage = (pageId: string) => {
        return comments.filter(comment => comment.pageId === pageId);
    };

    // Generate tab items for each pageId
    const items = Array.isArray(pageIds) && pageIds.length > 0 
        ? pageIds.map(pageId => ({
            key: pageId,
            label: `Page: ${pageId}`,
            children: (
                <div>
                    <Table 
                        columns={columns} 
                        dataSource={getCommentsForPage(pageId)} 
                        rowKey="id" 
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        expandable={{
                            expandedRowRender: (record: Comment) => record.replies && record.replies.length > 0 ? (
                                <div className="pl-8">
                                    <h3 className="text-lg font-semibold mb-3">Replies</h3>
                                    <Table 
                                        columns={columns} 
                                        dataSource={record.replies} 
                                        rowKey="id" 
                                        pagination={false}
                                        size="small"
                                    />
                                </div>
                            ) : null,
                            rowExpandable: (record: Comment) => record.replies && record.replies.length > 0,
                        }}
                    />
                </div>
            ),
        }))
        : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Messages Management</h1>
                <Button 
                    type="primary" 
                    onClick={loadAllComments}
                    className="bg-blue-500"
                >
                    Refresh
                </Button>
            </div>
            
            {Array.isArray(pageIds) && pageIds.length > 0 ? (
                <Tabs 
                    items={items}
                    type="card"
                />
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No comments found</p>
                </div>
            )}
        </div>
    );
}