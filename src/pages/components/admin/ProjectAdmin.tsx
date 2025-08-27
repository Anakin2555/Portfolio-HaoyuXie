import { useState, useEffect } from 'react';
// import { useTheme } from '../../../hooks/useTheme';
import ProjectService,{ ProjectAdmin as Project } from '../../../services/projectService';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Modal from 'antd/es/modal';
import Space from 'antd/es/space';
import Upload from 'antd/es/upload';
import Tag from 'antd/es/tag';
// import Select from 'antd/es/select';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppSelector } from '../../../store/hooks';
import EnvUtil from '../../../utils/envUtil';
import MarkdownPreview from '../MarkdownPreview';
import { IMG_URL } from '../../../utils/api';

export default function ProjectAdmin() {
//   const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { currentUser } = useAppSelector(state => state.user);
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [contentFileEN, setContentFileEN] = useState<UploadFile | null>(null);
  const [contentFileZH, setContentFileZH] = useState<UploadFile | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'zh'>('en');
  const [markdownContent, setMarkdownContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (!EnvUtil.isProduction() || currentUser) {
      loadProjects();
    }
  }, [currentUser]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const [enProjects, zhProjects] = await Promise.all([
        ProjectService.getProjects('en'),
        ProjectService.getProjects('zh')
      ]);
      const combinedProjects = enProjects.map(enProject => {
        const zhProject = zhProjects.find(zh => zh.id === enProject.id);
        return {
          id: enProject.id,
          title: {
            en: String(enProject.title),
            zh: String(zhProject?.title)
          },
          excerpt: {
            en: String(enProject.excerpt),
            zh: String(zhProject?.excerpt)
          },
          image: enProject.image,
          contentFile: {
            en: String(enProject.contentFile),
            zh: String(zhProject?.contentFile)
          },
          tags: enProject.tags,   
          demoUrl: enProject.demoUrl,
          githubUrl: enProject.githubUrl
        };
      });
      setProjects(combinedProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setIsEditing(false);
    setCurrentProjectId(null);
    form.resetFields();
    setImageFile(null);
    setContentFileEN(null);
    setContentFileZH(null);
    setTags([]);
    setIsModalVisible(true);
  };

  const showEditModal = (record: Project) => {
    setIsEditing(true);
    setCurrentProjectId(record.id);
    console.log(record);
    form.setFieldsValue({
      title_en: record.title.en,
      title_zh: record.title.zh,
      excerpt_en: record.excerpt.en,
      excerpt_zh: record.excerpt.zh,
      demoUrl: record.demoUrl,
      githubUrl: record.githubUrl,
    });
    
    // Set current image
    if (record.image) {
      setImageFile({
        uid: '-1',
        name: record.image.split('/').pop() || 'image',
        status: 'done',
        url: `${IMG_URL}/${record.image}`,
      });
    }
    
    // Set current content files
    if (record.contentFile) {
      if (record.contentFile.en) {
        setContentFileEN({
          uid: '-1',
          name: record.contentFile.en,
          status: 'done',
        });
      }
      
      if (record.contentFile.zh) {
        setContentFileZH({
          uid: '-1',
          name: record.contentFile.zh,
          status: 'done',
        });
      }
    }
    
    // Set current tags
    setTags(record.tags || []);
    
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePreview = async (language: 'en' | 'zh') => {
    const contentFile = language === 'en' ? contentFileEN : contentFileZH;
    
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
        content = await ProjectService.getProjectContent(contentFile.name, language);
      }
      
      setMarkdownContent(content);
      setPreviewLanguage(language);
      setPreviewVisible(true);
    } catch (error) {
      console.error('Error fetching markdown content:', error);
      message.error('Failed to preview markdown content');
    }
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const projectData = {
        id: currentProjectId,
        title:{
            en: values.title_en,
            zh: values.title_zh,
        },
        excerpt:{
            en: values.excerpt_en,
            zh: values.excerpt_zh,
        },
        image: imageFile?.url,
        contentFile:{
            en: contentFileEN?.name || '',
            zh: contentFileZH?.name || '',
        },
        tags: tags,
        demoUrl: values.demoUrl,
        githubUrl: values.githubUrl,
      };

      if (isEditing && currentProjectId) {
        // Update existing project
        await ProjectService.updateProject(currentProjectId, projectData as Project);
        message.success('Project successfully edited');
      } else {
        // Create new project
        await ProjectService.addProject(projectData as Project);
        message.success('Project successfully created');
      }
      
      setIsModalVisible(false);
      loadProjects();
    } catch (error) {
      console.error('Error submitting project:', error);
      message.error(`Failed to ${isEditing ? 'edit' : 'create'} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoading(true);
        try {
          await ProjectService.deleteProject(id);
          message.success('Project deleted successfully');
          loadProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('Failed to delete project');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleImageUpload: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0) {
      setImageFile(fileList[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleContentFileENUpload: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0) {
      setContentFileEN(fileList[0]);
    } else {
      setContentFileEN(null);
    }
  };

  const handleContentFileZHUpload: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0) {
      setContentFileZH(fileList[0]);
    } else {
      setContentFileZH(null);
    }
  };

  // Tag handlers
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const columns: ColumnsType<Project> = [
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
            onClick={() => showEditModal(record)}
            className="border border-transparent hover:border-dashed hover:border-blue-500 text-blue-500"
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDelete(record.id)}
            className="border border-transparent hover:border-dashed hover:border-red-500"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
    
    return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projects Management</h2>
        <Button 
          type="primary" 
          onClick={showAddModal}
          className="bg-blue-500"
        >
          Add New Project
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={projects} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEditing ? "Edit Project" : "Add New Project"}
        open={isModalVisible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading} 
            onClick={handleSubmit}
            className="bg-blue-500"
          >
            {isEditing ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="project_form"
        >
          <Form.Item
            name="title_en"
            label="Title (English)"
            rules={[{ required: true, message: 'Please input the project title in English' }]}
          >
            <Input placeholder="Enter project title in English" />
          </Form.Item>
          
          <Form.Item
            name="title_zh"
            label="标题 (中文)"
            rules={[{ required: true, message: 'Please input the project title in Chinese' }]}
          >
            <Input placeholder="请输入项目中文标题" />
          </Form.Item>
          
          <Form.Item
            name="excerpt_en"
            label="Excerpt (English)"
            rules={[{ required: true, message: 'Please input the project excerpt in English' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter project excerpt in English" />
          </Form.Item>
          
          <Form.Item
            name="excerpt_zh"
            label="摘要 (中文)"
            rules={[{ required: true, message: 'Please input the project excerpt in Chinese' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入项目中文摘要" />
          </Form.Item>
          
          <Form.Item
            label="Image"
            required
          >
            <Upload
              listType="picture-card"
              fileList={imageFile ? [imageFile] : []}
              onChange={handleImageUpload}
              maxCount={1}
              beforeUpload={() => false} // Prevent auto upload
            >
              {!imageFile && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <Form.Item
            label="Content File (Markdown)"
            required
          >
            <div className="mb-4">
              <div className="font-medium mb-2">English Markdown File</div>
              <div className="flex items-center space-x-2">
                <Upload
                  fileList={contentFileEN ? [contentFileEN] : []}
                  onChange={handleContentFileENUpload}
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                >
                  <Button icon={<UploadOutlined />}>Select English Markdown</Button>
                </Upload>
                
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => handlePreview('en')}
                  disabled={!contentFileEN}
                >
                  Preview
                </Button>
              </div>
              {contentFileEN && (
                <div className="mt-1 text-gray-500">
                  Current file: {contentFileEN.name}
                </div>
              )}
            </div>
            
        <div>
              <div className="font-medium mb-2">Chinese Markdown File</div>
              <div className="flex items-center space-x-2">
                <Upload
                  fileList={contentFileZH ? [contentFileZH] : []}
                  onChange={handleContentFileZHUpload}
                  maxCount={1}
                  beforeUpload={() => false} // Prevent auto upload
                >
                  <Button icon={<UploadOutlined />}>选择中文 Markdown</Button>
                </Upload>
                
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => handlePreview('zh')}
                  disabled={!contentFileZH}
                >
                  预览
                </Button>
              </div>
              {contentFileZH && (
                <div className="mt-1 text-gray-500">
                  当前文件: {contentFileZH.name}
                </div>
              )}
            </div>
          </Form.Item>
          
          <Form.Item
            label="Tags"
          >
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleClose(tag)}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  type="text"
                  size="small"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  style={{ width: 100 }}
                  autoFocus
                />
              ) : (
                <Tag onClick={showInput} className="cursor-pointer">
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </div>
          </Form.Item>
          
          <Form.Item
            name="demoUrl"
            label="Demo URL"
          >
            <Input placeholder="Enter demo URL" />
          </Form.Item>
          
          <Form.Item
            name="githubUrl"
            label="GitHub URL"
          >
            <Input placeholder="Enter GitHub URL" />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title={`Markdown Preview (${previewLanguage === 'en' ? 'English' : 'Chinese'})`}
        open={previewVisible}
        onCancel={handlePreviewCancel}
        width="80%"
        footer={[
          <Button key="close" onClick={handlePreviewCancel}>
            Close
          </Button>,
        ]}
      >
        <div className="max-h-[70vh] overflow-auto p-4 border rounded">
          <MarkdownPreview content={markdownContent} />
        </div>
      </Modal>
    </div>
  );
}
