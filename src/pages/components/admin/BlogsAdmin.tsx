import { useState, useEffect } from 'react';
import BlogService, { BlogPostAdmin as Blog } from '../../../services/blogService';
import ThoughtService, { ThoughtAdmin as Thought } from '../../../services/thoughtService';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Modal from 'antd/es/modal';
import Space from 'antd/es/space';
import Upload from 'antd/es/upload';
import DatePicker from 'antd/es/date-picker';
import Tabs from 'antd/es/tabs';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from '../../../store/hooks';
import EnvUtil from '../../../utils/envUtil';
import MarkdownPreview from '../MarkdownPreview';
import dayjs from 'dayjs';
import { IMG_URL } from '../../../utils/api';

export default function BlogsAdmin() {
  // Shared state
  const [, setActiveTab] = useState<'blogs' | 'thoughts'>('blogs');
  const { currentUser } = useAppSelector(state => state.user);

  // Blogs state
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isBlogModalVisible, setIsBlogModalVisible] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  const [blogForm] = Form.useForm();
  const [blogImageFile, setBlogImageFile] = useState<UploadFile | null>(null);
  const [blogContentFileEN, setBlogContentFileEN] = useState<UploadFile | null>(null);
  const [blogContentFileZH, setBlogContentFileZH] = useState<UploadFile | null>(null);
  const [blogPreviewVisible, setBlogPreviewVisible] = useState(false);
  const [blogPreviewLanguage, setBlogPreviewLanguage] = useState<'en' | 'zh'>('en');
  const [blogMarkdownContent, setBlogMarkdownContent] = useState('');

  // Thoughts state
  const [loadingThoughts, setLoadingThoughts] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isThoughtModalVisible, setIsThoughtModalVisible] = useState(false);
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [currentThoughtId, setCurrentThoughtId] = useState<string | null>(null);
  const [thoughtForm] = Form.useForm();

  // Get image URL for blogs
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '';
    return `${IMG_URL}/${imageName}`;
  };

  // Load data on component mount
  useEffect(() => {
    if (!EnvUtil.isProduction() || currentUser) {
      loadBlogs();
      loadThoughts();
    }
  }, [currentUser]);

  // BLOG FUNCTIONS
  const loadBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const [enBlogs, zhBlogs] = await Promise.all([
        BlogService.getBlogPosts('en'),
        BlogService.getBlogPosts('zh')
      ]);
      const combinedBlogs = enBlogs.map(enBlog => {
        const zhBlog = zhBlogs.find(zh => zh.id === enBlog.id);
        return {
          id: enBlog.id,
          title: {
            en: String(enBlog.title),
            zh: String(zhBlog?.title)
          },
          date: enBlog.date,
          excerpt: {
            en: String(enBlog.excerpt),
            zh: String(zhBlog?.excerpt)
          },
          readTime: enBlog.readTime,
          image: enBlog.image,
          contentFile: {
            en: String(enBlog.contentFile),
            zh: String(zhBlog?.contentFile)
          }
        };
      });
      setBlogs(combinedBlogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      message.error('Failed to fetch blogs');
    } finally {
      setLoadingBlogs(false);
    }
  };

  const showAddBlogModal = () => {
    setIsEditingBlog(false);
    setCurrentBlogId(null);
    blogForm.resetFields();
    setBlogImageFile(null);
    setBlogContentFileEN(null);
    setBlogContentFileZH(null);
    setIsBlogModalVisible(true);
  };

  const showEditBlogModal = (record: Blog) => {
    setIsEditingBlog(true);
    setCurrentBlogId(record.id);
    
    blogForm.setFieldsValue({
      title_en: record.title.en,
      title_zh: record.title.zh,
      excerpt_en: record.excerpt.en,
      excerpt_zh: record.excerpt.zh,
      date: record.date ? dayjs(record.date) : undefined,
      readTime: record.readTime,
    });
    
    // Set current image
    if (record.image) {
      const imageName = record.image.split('/').pop() || 'image';
      setBlogImageFile({
        uid: '-1',
        name: imageName,
        status: 'done',
        url: getImageUrl(imageName),
      });
    }
    
    // Set current content files
    if (record.contentFile) {
      if (record.contentFile.en) {
        setBlogContentFileEN({
          uid: '-1',
          name: record.contentFile.en,
          status: 'done',
        });
      }
      
      if (record.contentFile.zh) {
        setBlogContentFileZH({
          uid: '-1',
          name: record.contentFile.zh,
          status: 'done',
        });
      }
    }
    
    setIsBlogModalVisible(true);
  };

  const handleBlogCancel = () => {
    setIsBlogModalVisible(false);
  };

  const handleBlogPreview = async (language: 'en' | 'zh') => {
    const contentFile = language === 'en' ? blogContentFileEN : blogContentFileZH;
    
    if (!contentFile) {
      message.info(`No ${language === 'en' ? 'English' : 'Chinese'} markdown file uploaded`);
      return;
    }
    
    try {
      let content: string;
      
      // 如果是新上传的文件（还未保存到服务器）
      if (contentFile.originFileObj instanceof File) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(contentFile.originFileObj as File);
        });
      } else {
        // 如果是已经保存到服务器的文件
        content = await BlogService.getBlogContent(contentFile.name, language);
      }
      
      setBlogMarkdownContent(content);
      setBlogPreviewLanguage(language);
      setBlogPreviewVisible(true);
    } catch (error) {
      console.error('Error fetching markdown content:', error);
      message.error('Failed to preview markdown content');
    }
  };

  const handleBlogPreviewCancel = () => {
    setBlogPreviewVisible(false);
  };

  const handleBlogSubmit = async () => {
    try {
      const values = await blogForm.validateFields();
      setLoadingBlogs(true);
      
      // Extract just the filename if a full URL is provided
      const imageName = blogImageFile?.name || '';
      
      const blogData = {
        id: currentBlogId,
        title: {
          en: values.title_en,
          zh: values.title_zh,
        },
        date: values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
        excerpt: {
          en: values.excerpt_en,
          zh: values.excerpt_zh,
        },
        readTime: values.readTime,
        image: imageName,
        contentFile: {
          en: blogContentFileEN?.name || '',
          zh: blogContentFileZH?.name || '',
        }
      };

      if (isEditingBlog && currentBlogId) {
        // Update existing blog
        await BlogService.updateBlogPost(blogData as Blog);
        message.success('Blog post successfully edited');
      } else {
        // Create new blog
        await BlogService.addBlogPost(blogData as Blog);
        message.success('Blog post successfully created');
      }
      
      setIsBlogModalVisible(false);
      loadBlogs();
    } catch (error) {
      console.error('Error submitting blog post:', error);
      message.error(`Failed to ${isEditingBlog ? 'edit' : 'create'} blog post`);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this blog post?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoadingBlogs(true);
        try {
          // You'll need to implement this method in BlogService
          await BlogService.deleteBlogPost(id);
          message.success('Blog post deleted successfully');
          loadBlogs();
        } catch (error) {
          console.error('Error deleting blog post:', error);
          message.error('Failed to delete blog post');
        } finally {
          setLoadingBlogs(false);
        }
      }
    });
  };

  const handleBlogImageUpload: UploadProps['onChange'] = async ({ fileList }) => {
    if (fileList.length > 0) {


      try{
        const originalName = await BlogService.uploadBlogImg(fileList[0].originFileObj as File);
        setBlogImageFile({
          ...fileList[0],
          name: originalName
        });
        message.success('Blog image uploaded successfully');

      } catch (error) {
        console.error('Error uploading blog image:', error);
        message.error('Failed to upload blog image');
      }
    } else {
      setBlogImageFile(null);
    }
  };

  const handleBlogContentFileENUpload: UploadProps['onChange'] = async ({ fileList }) => {
    if (fileList.length > 0) {
      try {
        const file = fileList[0].originFileObj;
        if (file instanceof File) {
          const filename = await BlogService.uploadBlogFile(file, 'en');
          setBlogContentFileEN({
            ...fileList[0],
            name: filename
          });
          message.success('English blog file uploaded successfully');
        }
      } catch (error) {
        console.error('Error uploading English blog file:', error);
        message.error('Failed to upload English blog file');
        setBlogContentFileEN(null);
      }
    } else {
      setBlogContentFileEN(null);
    }
  };

  const handleBlogContentFileZHUpload: UploadProps['onChange'] = async ({ fileList }) => {
    if (fileList.length > 0) {
      try {
        const file = fileList[0].originFileObj;
        if (file instanceof File) {
          const filename = await BlogService.uploadBlogFile(file, 'zh');
          setBlogContentFileZH({
            ...fileList[0],
            name: filename
          });
          message.success('Chinese blog file uploaded successfully');
        }
      } catch (error) {
        console.error('Error uploading Chinese blog file:', error);
        message.error('Failed to upload Chinese blog file');
        setBlogContentFileZH(null);
      }
    } else {
      setBlogContentFileZH(null);
    }
  };

  const blogColumns: ColumnsType<Blog> = [
    {
      title: 'Title (English)',
      dataIndex: ['title', 'en'],
      key: 'title_en',
    },
    {
      title: 'Title (Chinese)',
      dataIndex: ['title', 'zh'],
      key: 'title_zh',
    },
    {
      title: 'Excerpt (English)',
      dataIndex: ['excerpt', 'en'],
      key: 'excerpt_en',
      ellipsis: true,
    },
    {
      title: 'Excerpt (Chinese)',
      dataIndex: ['excerpt', 'zh'],
      key: 'excerpt_zh',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link"
            onClick={() => showEditBlogModal(record)}
            className="border border-transparent hover:border-dashed hover:border-blue-500 text-blue-500"
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDeleteBlog(record.id)}
            className="border border-transparent hover:border-dashed hover:border-red-500"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // THOUGHTS FUNCTIONS
  const loadThoughts = async () => {
    setLoadingThoughts(true);
    try {
      const [enThoughts, zhThoughts] = await Promise.all([
        ThoughtService.getThoughts('en'),
        ThoughtService.getThoughts('zh')
      ]);
      const combinedThoughts = enThoughts.map(enThought => {
        const zhThought = zhThoughts.find(zh => zh.id === enThought.id);
        return {
          id: enThought.id,
          title: {
            en: String(enThought.title),
            zh: String(zhThought?.title)
          },
          content: {
            en: String(enThought.content),
            zh: String(zhThought?.content)
          },
          fullContent: {
            en: String(enThought.fullContent),
            zh: String(zhThought?.fullContent)
          },
          date: enThought.date
        };
      });
      setThoughts(combinedThoughts);
    } catch (error) {
      console.error('Failed to fetch thoughts:', error);
      message.error('Failed to fetch thoughts');
    } finally {
      setLoadingThoughts(false);
    }
  };

  const showAddThoughtModal = () => {
    setIsEditingThought(false);
    setCurrentThoughtId(null);
    thoughtForm.resetFields();
    setIsThoughtModalVisible(true);
  };

  const showEditThoughtModal = (record: Thought) => {
    setIsEditingThought(true);
    setCurrentThoughtId(record.id);
    
    thoughtForm.setFieldsValue({
      thought_title_en: record.title.en,
      thought_title_zh: record.title.zh,
      thought_content_en: record.content.en,
      thought_content_zh: record.content.zh,
      thought_fullContent_en: record.fullContent.en,
      thought_fullContent_zh: record.fullContent.zh,
      thought_date: record.date ? dayjs(record.date) : undefined,
    });
    
    setIsThoughtModalVisible(true);
  };

  const handleThoughtCancel = () => {
    setIsThoughtModalVisible(false);
  };

  const handleThoughtSubmit = async () => {
    try {
      const values = await thoughtForm.validateFields();
      setLoadingThoughts(true);
      
      const thoughtData = {
        id: currentThoughtId,
        title: {
          en: values.thought_title_en,
          zh: values.thought_title_zh,
        },
        content: {
          en: values.thought_content_en,
          zh: values.thought_content_zh,
        },
        fullContent: {
          en: values.thought_fullContent_en,
          zh: values.thought_fullContent_zh,
        },
        date: values.thought_date ? values.thought_date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
      };

      if (isEditingThought && currentThoughtId) {
        // Update existing thought
        await ThoughtService.updateThought(thoughtData as Thought);
        message.success('Thought successfully edited');
      } else {
        // Create new thought
        await ThoughtService.addThought(thoughtData as Thought);
        message.success('Thought successfully created');
      }
      
      setIsThoughtModalVisible(false);
      loadThoughts();
    } catch (error) {
      console.error('Error submitting thought:', error);
      message.error(`Failed to ${isEditingThought ? 'edit' : 'create'} thought`);
    } finally {
      setLoadingThoughts(false);
    }
  };

  const handleDeleteThought = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this thought?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoadingThoughts(true);
        try {
          await ThoughtService.deleteThought(id);
          message.success('Thought deleted successfully');
          loadThoughts();
        } catch (error) {
          console.error('Error deleting thought:', error);
          message.error('Failed to delete thought');
        } finally {
          setLoadingThoughts(false);
        }
      }
    });
  };

  const thoughtColumns: ColumnsType<Thought> = [
    {
      title: 'Title (English)',
      dataIndex: ['title', 'en'],
      key: 'title_en',
    },
    {
      title: 'Title (Chinese)',
      dataIndex: ['title', 'zh'],
      key: 'title_zh',
    },
    {
      title: 'Content (English)',
      dataIndex: ['content', 'en'],
      key: 'content_en',
      ellipsis: true,
    },
    {
      title: 'Content (Chinese)',
      dataIndex: ['content', 'zh'],
      key: 'content_zh',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link"
            onClick={() => showEditThoughtModal(record)}
            className="border border-transparent hover:border-dashed hover:border-blue-500 text-blue-500"
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDeleteThought(record.id)}
            className="border border-transparent hover:border-dashed hover:border-red-500"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 'blogs',
      label: 'Blog Posts',
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Blog Posts Management</h2>
            <Button 
              type="primary" 
              onClick={showAddBlogModal}
              className="bg-blue-500"
            >
              Add New Blog Post
            </Button>
          </div>
          
          <Table 
            columns={blogColumns} 
            dataSource={blogs} 
            rowKey="id" 
            loading={loadingBlogs}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'thoughts',
      label: 'Thoughts',
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Thoughts Management</h2>
            <Button 
              type="primary" 
              onClick={showAddThoughtModal}
              className="bg-blue-500"
            >
              Add New Thought
            </Button>
          </div>
          
          <Table 
            columns={thoughtColumns} 
            dataSource={thoughts} 
            rowKey="id" 
            loading={loadingThoughts}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <Tabs 
        defaultActiveKey="blogs" 
        items={items}
        onChange={(key) => setActiveTab(key as 'blogs' | 'thoughts')}
      />

      {/* Blog Modal */}
      <Modal
        title={isEditingBlog ? "Edit Blog Post" : "Add New Blog Post"}
        open={isBlogModalVisible}
        onCancel={handleBlogCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleBlogCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loadingBlogs} 
            onClick={handleBlogSubmit}
            className="bg-blue-500"
          >
            {isEditingBlog ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={blogForm}
          layout="vertical"
          name="blog_form"
        >
          <Form.Item
            name="title_en"
            label="Title (English)"
            rules={[{ required: true, message: 'Please input the blog title in English' }]}
          >
            <Input placeholder="Enter blog title in English" />
          </Form.Item>
          
          <Form.Item
            name="title_zh"
            label="标题 (中文)"
            rules={[{ required: true, message: 'Please input the blog title in Chinese' }]}
          >
            <Input placeholder="请输入博客中文标题" />
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="excerpt_en"
            label="Excerpt (English)"
            rules={[{ required: true, message: 'Please input the blog excerpt in English' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter blog excerpt in English" />
          </Form.Item>
          
          <Form.Item
            name="excerpt_zh"
            label="摘要 (中文)"
            rules={[{ required: true, message: 'Please input the blog excerpt in Chinese' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入博客中文摘要" />
          </Form.Item>
          
          <Form.Item
            name="readTime"
            label="Read Time"
            rules={[{ required: true, message: 'Please input the estimated read time' }]}
          >
            <Input placeholder="e.g., 5 min read" />
          </Form.Item>
          
          <Form.Item
            label="Image"
            required
          >
            <Upload
              listType="picture-card"
              fileList={blogImageFile ? [blogImageFile] : []}
              onChange={handleBlogImageUpload}
              maxCount={1}
              beforeUpload={() => false} // Prevent auto upload
            >
              {!blogImageFile && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {blogImageFile && (
              <div className="mt-2 text-gray-500">
                Image: {blogImageFile.name}
              </div>
            )}
          </Form.Item>
          
          <Form.Item
            label="Content File (Markdown)"
            required
          >
            <div className="mb-4">
              <div className="font-medium mb-2">English Markdown File</div>
              <div className="flex items-center space-x-2">
                <Upload
                  fileList={blogContentFileEN ? [blogContentFileEN] : []}
                  onChange={handleBlogContentFileENUpload}
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                >
                  <Button icon={<UploadOutlined />}>Select English Markdown</Button>
                </Upload>
                
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => handleBlogPreview('en')}
                  disabled={!blogContentFileEN}
                >
                  Preview
                </Button>
              </div>
              {blogContentFileEN && (
                <div className="mt-1 text-gray-500">
                  Current file: {blogContentFileEN.name}
                </div>
              )}
            </div>
            
            <div>
              <div className="font-medium mb-2">Chinese Markdown File</div>
              <div className="flex items-center space-x-2">
                <Upload
                  fileList={blogContentFileZH ? [blogContentFileZH] : []}
                  onChange={handleBlogContentFileZHUpload}
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                >
                  <Button icon={<UploadOutlined />}>选择中文 Markdown</Button>
                </Upload>
                
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => handleBlogPreview('zh')}
                  disabled={!blogContentFileZH}
                >
                  预览
                </Button>
              </div>
              {blogContentFileZH && (
                <div className="mt-1 text-gray-500">
                  当前文件: {blogContentFileZH.name}
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Thought Modal */}
      <Modal
        title={isEditingThought ? "Edit Thought" : "Add New Thought"}
        open={isThoughtModalVisible}
        onCancel={handleThoughtCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleThoughtCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loadingThoughts} 
            onClick={handleThoughtSubmit}
            className="bg-blue-500"
          >
            {isEditingThought ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={thoughtForm}
          layout="vertical"
          name="thought_form"
        >
          <Form.Item
            name="thought_title_en"
            label="Title (English)"
            rules={[{ required: true, message: 'Please input the thought title in English' }]}
          >
            <Input placeholder="Enter thought title in English" />
          </Form.Item>
          
          <Form.Item
            name="thought_title_zh"
            label="标题 (中文)"
            rules={[{ required: true, message: 'Please input the thought title in Chinese' }]}
          >
            <Input placeholder="请输入想法中文标题" />
          </Form.Item>
          
          <Form.Item
            name="thought_date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="thought_content_en"
            label="Content (English)"
            rules={[{ required: true, message: 'Please input the content in English' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter content in English" />
          </Form.Item>
          
          <Form.Item
            name="thought_content_zh"
            label="内容 (中文)"
            rules={[{ required: true, message: 'Please input the content in Chinese' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入中文内容" />
          </Form.Item>
          
          <Form.Item
            name="thought_fullContent_en"
            label="Full Content (English)"
            rules={[{ required: true, message: 'Please input the full content in English' }]}
          >
            <Input.TextArea rows={6} placeholder="Enter full content in English" />
          </Form.Item>
          
          <Form.Item
            name="thought_fullContent_zh"
            label="完整内容 (中文)"
            rules={[{ required: true, message: 'Please input the full content in Chinese' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入完整中文内容" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Blog Preview Modal */}
      <Modal
        title={`Blog Content Preview (${blogPreviewLanguage === 'en' ? 'English' : 'Chinese'})`}
        open={blogPreviewVisible}
        onCancel={handleBlogPreviewCancel}
        width="80%"
        footer={[
          <Button key="close" onClick={handleBlogPreviewCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="max-h-[70vh] overflow-auto p-4 border rounded">
          <MarkdownPreview content={blogMarkdownContent} />
        </div>
      </Modal>
        </div>
    );
}
