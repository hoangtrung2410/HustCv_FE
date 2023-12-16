'use client'
import React, { useState } from 'react';
import {
    Button,
    Modal,
    DatePicker,
    Form,
    Input,
    Radio,
    Select,
    message,
    Card,
    Popover,
    Avatar,
} from 'antd';
import type { SelectProps } from 'antd';
import { MoreOutlined, CheckOutlined, FireOutlined, ReadOutlined, FormOutlined, TagOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPost } from '../shared/recruitmentPost.type';
import http from '../utils/http';
import moment from 'moment'
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];


const Post = () => {
    //hook
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [editPost, setEditPost] = useState<any>({})

    // Get QueryClient from the context
    const queryClient = useQueryClient()

    //api
    const addNewPostMutation = useMutation({
        mutationFn: async (values: IPost) => {
            const data = await http.post('/api/recruitmentPosts', values)
            return data
        },
        onSuccess: (data, variables, context) => {
            message.success('Đăng bài thành công!')
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error: any) => {
            message.error(error.response.data.message)
        }
    })

    const { data, isLoading, isError } = useQuery({
        queryKey: ['recruitmentPosts'],
        queryFn: async () => {
            try {
                const response = await http.get('/api/recruitmentPosts')        //chỗ này cần sửa api cho bản thân
                return response.data
            } catch (error) {

            }
        }
    })


    const deletePostMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await http.delete('/api/recruitmentPosts/' + id)
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Xoá bài đăng thành công')
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: any) => {
            const response = await http.put('/api/recruitmentPosts/' + id, values)
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Sửa bài đăng thành công')
            setIsModalEditOpen(false)
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })


    //component require
    const options: SelectProps['options'] = [
        {
            value: 'nodejs',
            label: 'NodeJS',
        },
        {
            value: 'reacjs',
            label: 'ReactJS',
        },
        {
            value: 'nextjs',
            label: 'NextJS'
        },
        {
            value: 'figma',
            label: 'Figma'
        },
        {
            value: 'express',
            label: 'ExpressJS'
        },
        {
            value: 'mysql',
            label: 'MySQL'
        },
        {
            value: 'mongodb',
            label: 'Mongo DB'
        }
    ];

    // for (let i = 10; i < 36; i++) {
    //     options.push({
    //         label: i.toString(36) + i,
    //         value: i.toString(36) + i,
    //     });
    // }


    //logic
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        deletePostMutation.mutate(deleteId)
        setIsModalConfirmOpen(false)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: any) => {
        values.dateClose = values.dateClose.toISOString()
        addNewPostMutation.mutate(values)
    }

    const onFinishEdit = (id: any, values: any) => {
        values.dateClose = values.dateClose.toISOString()
        updateMutation.mutate({ id, values })
    }

    const handleEdit = (post: any) => {
        setEditPost(post)
        setIsModalEditOpen(true)
    }

    const handleDelete = (id: any) => {
        setDeleteId(id)
        setIsModalConfirmOpen(true)
    }


    return (
        <>
            <div className="container mx-auto">
                <div >
                    <Button className='ml-[300px] my-5 bg-gradient-to-r from-[#121212] to-[#54151c]' type="primary" onClick={showModal}>
                        Đăng bài tuyển dụng mới
                    </Button>
                    <Modal title="Tạo bài đăng tuyển"
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Huỷ
                            </Button>
                        ]}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            layout="horizontal"
                            style={{ maxWidth: 800 }}
                            className='w-800px'
                            onFinish={onFinish}
                        >
                            <Form.Item label="Tiêu đề bài đăng" name='title'>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Mô tả bài đăng tuyển" name='describe'>
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item label="Yêu cầu" name='request'>
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item label="Hình thức" name='form'>
                                <Radio.Group>
                                    <Radio value="Onsite"> Onsite </Radio>
                                    <Radio value="Hybrid"> Hybrid </Radio>
                                    <Radio value="Remote"> Remote </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label='Kỹ năng' name='skill'>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Kỹ năng"
                                    // onChange={handleChange}
                                    options={options}
                                />
                            </Form.Item>
                            <Form.Item label='Mức lương' name='salary'>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Mức lương"
                                >
                                    <Option value="2.000.000 đ - 5.000.000 đ">2.000.000 đ - 5.000.000 đ</Option>
                                    <Option value="5.000.000 đ - 10.000.000 đ">5.000.000 đ - 10.000.000 đ</Option>
                                    <Option value="10.000.000 đ - 15.000.000 đ">10.000.000 đ - 15.000.000 đ</Option>
                                    <Option value="15.000.000 đ - 25.000.000 đ">15.000.000 đ - 25.000.000 đ</Option>
                                    <Option value="25.000.000 đ - 50.000.000 đ">25.000.000 đ - 50.000.000 đ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ngày hết hạn" name='dateClose'>
                                <DatePicker />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                                <Button className='bg-blue-600' type="primary" htmlType="submit">
                                    Đăng
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div className='mx-[300px]'>
                    {data?.map((post: any, index: number) => {
                        return (
                            <Card
                                key={post.id}
                                title={
                                    <>
                                        <p><Avatar className='mr-4' size='large' icon={<UserOutlined />} />Dinh Linh tuyen dung</p>
                                    </>
                                }
                                extra={
                                    <Popover
                                        content={
                                            <>
                                                <div className='mb-4 mt-2'>
                                                    <a onClick={() => handleEdit(post)}><EditOutlined className='mr-4' />Sửa bài đăng</a>
                                                </div>
                                                <div>
                                                    <a onClick={() => handleDelete(post.id)}><DeleteOutlined className='mr-4' />Xoá bài đăng</a>
                                                </div>
                                            </>
                                        }
                                        title="Hành động"
                                        trigger="click"
                                        placement="left"
                                        className='z-1'

                                    >
                                        <MoreOutlined />
                                    </Popover>
                                }
                                className='w-full mb-4'
                            >
                                <h3 className='font-bold text-lg'><TagOutlined className='mr-4' />{post.title}</h3>
                                <p className='my-3'><FormOutlined className='mr-4' />{post.describe}</p>
                                <div className='my-3'>
                                    <p><FireOutlined className='mr-4' />Yêu cầu: {post.request}</p>
                                    <p className='ml-4'><CheckOutlined className='mr-2' />Đúng giờ giấc</p>
                                    <p className='ml-4'><CheckOutlined className='mr-2' />Thật thà, khiêm tốn</p>
                                    <p className='ml-4'><CheckOutlined className='mr-2' />Chăm chỉ</p>
                                </div>
                                <p className='my-3'><HomeOutlined className='mr-4' />Hình thức: {post.form}</p>
                                <div className='my-3'>
                                    <p><ReadOutlined className='mr-4' />Kĩ năng cần thiết</p>
                                </div>
                                <p className='my-3'><MoneyCollectOutlined className='mr-4' />Mức lương: {post.salary}</p>
                                <p className='my-3'><FieldTimeOutlined className='mr-4' />Ngày kết thúc: {post.dateClose?.split('T')[0]}</p>
                            </Card>
                        )
                    })}
                </div >
                <div>
                    {isModalConfirmOpen ? (
                        <Modal
                            title="Chú ý"
                            open={isModalConfirmOpen}
                            onCancel={() => { setIsModalConfirmOpen(false) }}
                            footer={[
                                <Button key="back" onClick={() => setIsModalConfirmOpen(false)}>
                                    Huỷ
                                </Button>,
                                <Button danger key='ok' onClick={handleConfirm}>
                                    Xoá
                                </Button>
                            ]}
                        >
                            <p>Bạn có chắc muốn xoá bài viết này?</p>
                        </Modal>
                    ) : ''}
                </div>
                <div>
                    {isModalEditOpen ? (
                        <Modal title="Sửa bài đăng tuyển"
                            open={isModalEditOpen}
                            onCancel={() => { setIsModalEditOpen(false) }}
                            footer={[
                                <Button key="back" onClick={() => { setIsModalEditOpen(false) }}>
                                    Huỷ
                                </Button>
                            ]}
                        >
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                layout="horizontal"
                                style={{ maxWidth: 800 }}
                                className='w-800px'
                                onFinish={(values: any) => onFinishEdit(editPost.id, values)}
                            >
                                <Form.Item label="Tiêu đề bài đăng" name='title' initialValue={editPost.title}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Mô tả bài đăng tuyển" name='describe' initialValue={editPost.describe}>
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item label="Yêu cầu" name='request' initialValue={editPost.request}>
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item label="Hình thức" name='form' initialValue={editPost.form}>
                                    <Radio.Group>
                                        <Radio value="Onsite"> Onsite </Radio>
                                        <Radio value="Hybrid"> Hybrid </Radio>
                                        <Radio value="Remote"> Remote </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label='Kỹ năng' name='skill'>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Kỹ năng"
                                        // onChange={handleChange}
                                        options={options}
                                    />
                                </Form.Item>
                                <Form.Item label='Mức lương' name='salary' initialValue={editPost.salary}>
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Mức lương"
                                    >
                                        <Option value="2.000.000 đ - 5.000.000 đ">2.000.000 đ - 5.000.000 đ</Option>
                                        <Option value="5.000.000 đ - 10.000.000 đ">5.000.000 đ - 10.000.000 đ</Option>
                                        <Option value="10.000.000 đ - 15.000.000 đ">10.000.000 đ - 15.000.000 đ</Option>
                                        <Option value="15.000.000 đ - 25.000.000 đ">15.000.000 đ - 25.000.000 đ</Option>
                                        <Option value="25.000.000 đ - 50.000.000 đ">25.000.000 đ - 50.000.000 đ</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Ngày hết hạn" name='dateClose' initialValue={moment(editPost.dateClose)}>
                                    <DatePicker />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                                    <Button className='bg-blue-600' type="primary" htmlType="submit">
                                        Lưu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    ) : ''
                    }
                </div>
            </div >
        </>
    )
}

export default Post