import { useState, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import UpdateService, { Update, CreateUpdateDTO } from '../../../services/updateService';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import DatePicker from 'antd/es/date-picker';
import Table from 'antd/es/table';
import Modal from 'antd/es/modal';
import Space from 'antd/es/space';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../store/hooks';
import EnvUtil from '../../../utils/envUtil';

export default function UpdatesAdminPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { currentUser } = useAppSelector(state => state.user);

  useEffect(() => {
    // 在开发环境下，即使未登录也加载数据
    if (!EnvUtil.isProduction() || currentUser) {
      loadUpdates();
    }
  }, [currentUser]);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      // 同时获取英文和中文数据
      const [enUpdates, zhUpdates] = await Promise.all([
        UpdateService.getUpdates('en'),
        UpdateService.getUpdates('zh')
      ]);

      console.log(enUpdates);
      console.log(zhUpdates);
      
      // 合并中英文数据，确保 ID 匹配
      const combinedUpdates = enUpdates.map(enUpdate => {
        // 查找对应的中文数据
        const zhUpdate = zhUpdates.find(zh => zh.id === enUpdate.id);
        return {
          id: enUpdate.id,
          date: enUpdate.date,
          // 如果找到中文数据，则合并，否则使用英文数据
          title: {
            en: String(enUpdate.title),
            zh: String(zhUpdate?.title)
          },
          category: {
            en: String(enUpdate.category),
            zh: String(zhUpdate?.category)
          }
        };
      });

      console.log(combinedUpdates);
      
      setUpdates(combinedUpdates);
    } catch (error) {
      console.error('Failed to fetch updates:', error);
      message.error('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setIsEditing(false);
    setCurrentUpdateId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: Update) => {
    setIsEditing(true);
    setCurrentUpdateId(record.id);
    form.setFieldsValue({
      title_en: record.title.en,
      title_zh: record.title.zh,
      category_en: record.category.en,
      category_zh: record.category.zh,
      date: dayjs(record.date),
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const updateData: CreateUpdateDTO = {
        title: {
          en: values.title_en,
          zh: values.title_zh
        },
        date: values.date.format('YYYY-MM-DD'),
        category: {
          en: values.category_en,
          zh: values.category_zh
        }
      };

      if (isEditing && currentUpdateId) {
        // 更新现有动态
        await UpdateService.updateUpdate(currentUpdateId, updateData);
        message.success('Update successfully edited');
      } else {
        // 创建新动态
        await UpdateService.createUpdate(updateData);
        message.success('Update successfully created');
      }
      
      setIsModalVisible(false);
      loadUpdates();
    } catch (error) {
      console.error('Error submitting update:', error);
      message.error(`Failed to ${isEditing ? 'edit' : 'create'} update`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this update?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoading(true);
        try {
          await UpdateService.deleteUpdate(id);
          message.success('Update deleted successfully');
          loadUpdates();
        } catch (error) {
          console.error('Error deleting update:', error);
          message.error('Failed to delete update');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns: ColumnsType<Update> = [
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
      title: 'Category (English)',
      dataIndex: ['category', 'en'],
      key: 'category_en',
    },
    {
      title: 'Category (Chinese)',
      dataIndex: ['category', 'zh'],
      key: 'category_zh',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
        <h2 className="text-xl font-bold">Updates Management</h2>
        <Button 
          type="primary" 
          onClick={showAddModal}
          className="bg-blue-500"
        >
          Add New Update
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={isEditing ? "Edit Update" : "Add New Update"}
        open={isModalVisible}
        onCancel={handleCancel}
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
          name="update_form"
        >
          <Form.Item
            name="title_en"
            label="Title (English)"
            rules={[{ required: true, message: 'Please input the title in English' }]}
          >
            <Input placeholder="Enter title in English" />
          </Form.Item>
          <Form.Item
            name="title_zh"
            label="Title (Chinese)"
            rules={[{ required: true, message: 'Please input the title in Chinese' }]}
          >
            <Input placeholder="请输入中文标题" />
          </Form.Item>
          <Form.Item
            name="category_en"
            label="Category (English)"
            rules={[{ required: true, message: 'Please input the category in English' }]}
          >
            <Input placeholder="Enter category in English" />
          </Form.Item>
          <Form.Item
            name="category_zh"
            label="Category (Chinese)"
            rules={[{ required: true, message: 'Please input the category in Chinese' }]}
          >
            <Input placeholder="请输入中文分类" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
