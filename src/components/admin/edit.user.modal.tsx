"use client";
import { handleUpdateUserAction } from "@/actions/manage.user.action";
import { Modal, Input, Form, Row, Col, notification, Switch } from "antd";
import ImageCustomize from "../image/image.customize";
import { formatDateTime } from "@/utils/utils";
import { LockTwoTone, UnlockTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { StyleStatus } from "../ticked-user/table/user.render.table";
interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  setDataUser: (v: IUser) => void;
  dataUser: IUser | null;
}

const UpdateUserModal = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUser, setDataUser } =
    props;
  const [isBanStatus, setIsBanStatus] = useState(dataUser?.isBan!);
  const [isActiveStatus, setIsActiveStatus] = useState(dataUser?.isActive!);
  const [data, setData] = useState<IUser | null>(null);
  const [form] = Form.useForm();

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
  };

  const onFinish = async (values: IUpdateUserByManager) => {
    const data: IUpdateUserByManager = {
      _id: values._id,
      fullname: values.fullname,
      isActive: isActiveStatus,
      isBan: isBanStatus,
    };
    const res = await handleUpdateUserAction(data);
    notification.success({ message: res?.message });
    form.resetFields();
    setIsUpdateModalOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue({ _id: dataUser?._id });
    form.setFieldsValue({ fullname: dataUser?.fullname });
    form.setFieldsValue({ isActive: dataUser?.isActive });
    form.setFieldsValue({ isBan: dataUser?.isBan });
    form.setFieldsValue({ userName: dataUser?.userName });
    form.setFieldsValue({ email: dataUser?.email });
    form.setFieldsValue({ role: dataUser?.role });
    form.setFieldsValue({ accountType: dataUser?.accountType });
    form.setFieldsValue({ status: dataUser?.status });
    form.setFieldsValue({ codeExpired: dataUser?.codeExpired });
    form.setFieldsValue({ activeCode: dataUser?.activeCode });
    setData(dataUser);
    setIsBanStatus(dataUser?.isBan!);
    setIsActiveStatus(dataUser?.isActive!);
  }, [isUpdateModalOpen, dataUser, form]);
  return (
    <Modal
      style={{ top: 20 }}
      title="Update user"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
      width={"70%"}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ImageCustomize image={data?.image || ""} />
        </div>
        <div style={{ display: "flex", gap: 50 }}>
          <div>
            <Form.Item hidden label="ID" name="_id">
              <Input type="text" />
            </Form.Item>

            <Form.Item
              label="Full name"
              name="fullname"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input type="text" />
            </Form.Item>

            <Row gutter={[15, 15]}>
              <Col span={24} md={12}>
                <Form.Item
                  label="Username"
                  name="userName"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input disabled type="text" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input disabled type="email" />
                </Form.Item>
              </Col>
            </Row>

            <div>
              <Form.Item
                style={{ marginBottom: 0 }}
                label="Code"
                name="activeCode"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input disabled type="text" />
              </Form.Item>
              <div style={{ color: "#636e72" }}>
                Code Expired: {formatDateTime(data?.codeExpired ?? "")}
              </div>
            </div>
          </div>
          <div>
            <Row gutter={[15, 15]}>
              <Col span={24} md={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[
                    { required: true, message: "Please input your role!" },
                  ]}
                >
                  <Input disabled type="text" />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  label="Account Type"
                  name="accountType"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account type!",
                    },
                  ]}
                >
                  <Input disabled type="email" />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: "flex", gap: 10 }}>
              <div>Account Active:</div>
              <div>
                <Switch
                  defaultChecked={isActiveStatus}
                  onChange={(checked) => setIsActiveStatus(checked)}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
              <div>Ban Status:</div>
              <div>
                {isBanStatus === true ? (
                  <LockTwoTone
                    onClick={() => setIsBanStatus(false)}
                    twoToneColor={"#ff7675"}
                    style={{ fontSize: 20 }}
                  />
                ) : (
                  <UnlockTwoTone
                    style={{ fontSize: 20 }}
                    onClick={() => setIsBanStatus(true)}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 30,
              }}
            >
              <div>Status: </div>
              <div>
                <StyleStatus value={data?.status + ""} />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
