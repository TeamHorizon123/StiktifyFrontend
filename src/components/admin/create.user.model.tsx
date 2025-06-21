import { handleCreateUserAction } from '@/actions/manage.user.action';
import {
    Modal, Input, Form, Row, Col,
    notification,
} from 'antd';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
    const {
        isCreateModalOpen, setIsCreateModalOpen
    } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);
    }

    const onFinish = async (values: ICreateUserByManager) => {
        if (values.password !== values.confirmPassword) {
            return notification.warning({ message: "Confirm password not match with password" })
        }
        const data: ICreateUserByManager = {
            fullname: values.fullname,
            email: values.email,
            password: values.password,
            userName: values.userName
        }
        const res = await handleCreateUserAction(data)
        if (res?.statusCode === 201) {
            notification.success({ message: res?.message })
            form.resetFields()
            setIsCreateModalOpen(false);
        } else {
            notification.warning({ message: res?.message })
        }
    };

    return (
        <Modal
            style={{ top: 50 }}
            title="Add new user"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    label="Full name"
                    name="fullname"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Username"
                            name="userName"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Email wrong format!' }
                            ]}
                        >
                            <Input type='email' />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input type='password' />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please input your confirm password!' }]}
                >
                    <Input type='password' />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default CreateUserModal;