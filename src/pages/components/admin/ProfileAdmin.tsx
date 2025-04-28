import { useState, useEffect } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import type { ProfileAdmin } from '../../../types/profileAdmin';
import { InputNumber, message } from 'antd';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import TextArea from 'antd/es/input/TextArea';
import type { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import profileService from '../../../services/profileService';

export default function ProfileAdminPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBothProfiles();
  }, []);

  const fetchBothProfiles = async () => {
    try {
      const [enData, zhData] = await Promise.all([
        profileService.getProfile('en'),
        profileService.getProfile('zh')
      ]);
  
      const combinedData = {
        introduction_en: enData.introduction,
        introduction_zh: zhData.introduction,
        education: enData.education.map((edu: any, index: number) => ({
          school_en: edu.school,
          school_zh: zhData.education[index]?.school,
          degree_en: edu.degree,
          degree_zh: zhData.education[index]?.degree,
          department_en: edu.department,
          department_zh: zhData.education[index]?.department,
          description_en: edu.description,
          description_zh: zhData.education[index]?.description,
          period_en: edu.period,
          period_zh: zhData.education[index]?.period
        })),
        skills: enData.skills.map((skill: any, index: number) => ({
          name_en: skill.name,
          name_zh: zhData.skills[index]?.name,
          level: skill.level
        }))
      };
      
      form.setFieldsValue(combinedData);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      message.error('Failed to fetch profile data');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const updatedProfile: ProfileAdmin = {
        introduction: {
          en: values.introduction_en,
          zh: values.introduction_zh
        },
        education: values.education.map((edu: any) => ({
          school: {
            en: edu.school_en,
            zh: edu.school_zh
          },
          department: {
            en: edu.department_en,
            zh: edu.department_zh
          },
          degree: {
            en: edu.degree_en,
            zh: edu.degree_zh
          },
          description: {
            en: edu.description_en,
            zh: edu.description_zh
          },
          period:{
            en: edu.period_en,
            zh: edu.period_zh
          }
        })),
        skills: values.skills.map((skill: any) => ({
          name: {
            en: skill.name_en,
            zh: skill.name_zh
          },
          level: skill.level
        }))
      };

      await profileService.updateProfile(updatedProfile);
      message.success('Profile updated successfully');
      fetchBothProfiles();
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Profile Management</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl"
      >
        {/* Introduction */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Form.Item
            label="Introduction (English)"
            name="introduction_en"
            rules={[{ required: true, message: 'Please input English introduction' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
          <Form.Item
            label="Introduction (Chinese)"
            name="introduction_zh"
            rules={[{ required: true, message: 'Please input Chinese introduction' }]}
          >
            <TextArea rows={10} />
          </Form.Item>
        </div>

        {/* Education */}
        <h3 className="text-lg font-semibold mb-3">Education</h3>
        <Form.List name="education">
          {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'school_en']}
                        rules={[{ required: true, message: 'Missing school name (English)' }]}
                      >
                        <Input placeholder="School Name (English)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'department_en']}
                        rules={[{ required: true, message: 'Missing department (English)' }]}
                      >
                        <Input placeholder="Department (English)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'degree_en']}
                        rules={[{ required: true, message: 'Missing degree (English)' }]}
                      >
                        <Input placeholder="Degree (English)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'description_en']}
                        rules={[{ required: true, message: 'Missing description (English)' }]}
                      >
                        <TextArea rows={4} placeholder="Description (English)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'period_en']}
                        rules={[{ required: true, message: 'Missing period (English)' }]}
                      >
                        <Input placeholder="Period (e.g., 2018-2022)" />
                      </Form.Item>
                    </div>
                    <div className="space-y-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'school_zh']}
                        rules={[{ required: true, message: '请输入学校名称（中文）' }]}
                      >
                        <Input placeholder="学校名称（中文）" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'department_zh']}
                        rules={[{ required: true, message: '请输入院系（中文）' }]}
                      >
                        <Input placeholder="院系（中文）" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'degree_zh']}
                        rules={[{ required: true, message: '请输入学位（中文）' }]}
                      >
                        <Input placeholder="学位（中文）" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'description_zh']}
                        rules={[{ required: true, message: '请输入描述（中文）' }]}
                      >
                        <TextArea rows={4} placeholder="描述（中文）" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'period_zh']}
                        rules={[{ required: true, message: '请输入经历时间（中文）' }]}
                      >
                        <Input placeholder="经历时间（中文）" />
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item className="mt-2">
                    <Button type="link" danger onClick={() => remove(name)} block className="border border-transparent hover:border-dashed hover:border-red-500">
                      Remove
                    </Button>
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Education
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Skills */}
        <h3 className="text-lg font-semibold mb-3 mt-20">Skills</h3>
        <Form.List name="skills">
          {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key}>
                  <div className="grid grid-cols-4 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'name_en']}
                      rules={[{ required: true, message: 'Please input skill name (English)' }]}
                      className="mb-0"
                    >
                      <Input placeholder="Skill Name (English)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'name_zh']}
                      rules={[{ required: true, message: '请输入技能名称（中文）' }]}
                      className="mb-0"
                    >
                      <Input placeholder="技能名称（中文）" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'level']}
                      rules={[
                        { required: true, message: 'Please input skill level' },
                        { type: 'number', min: 0, max: 100, message: 'Level must be between 0 and 100' }
                      ]}
                      className="mb-0"
                    >
                      <InputNumber min={0} max={100} step={5}/>
                    </Form.Item>
                    <Form.Item className="">
                      <Button 
                        type="link" 
                        danger 
                        onClick={() => remove(name)} 
                        block
                        className="border border-transparent hover:border-dashed hover:border-red-500"
                      >
                        Remove
                      </Button>
                    </Form.Item>
                  </div>
                  
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Skill
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Submit Button */}
        <Form.Item>
          <Button 
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
