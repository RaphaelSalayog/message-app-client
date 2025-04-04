"use client";

import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Typography, Form, Input, Layout, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { submitLoginApi } from "@/api/auth";
import { useAppDispatch } from "@/util/store";
import { setUser } from "@/util/storeSlices/userSlice";

const { Title, Text } = Typography;

type FieldType = {
    email: string;
    password: string;
};

export default function Login() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        try {
            setIsLoading(true);
            const resp = await submitLoginApi({ payload: values });
            if (resp?.ok) {
                router.push("/messages");
                localStorage.setItem("user", JSON.stringify(resp.data));
                dispatch(setUser(resp.data));
            } else {
                form.setFields([
                    {
                        name: "password",
                        errors: ["Invalid credentials"],
                    },
                ]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <title>RS | Login</title>
            <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
                <main className="w-full">
                    <Layout style={{ minHeight: "100vh" }}>
                        <Content
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                            }}
                        >
                            <div className="w-[20%] !space-y-6">
                                <div className="flex flex-col items-center justify-center !space-y-2">
                                    <Title
                                        level={3}
                                        style={{
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            letterSpacing: "0.05rem",
                                        }}
                                    >
                                        Messaging App
                                    </Title>
                                </div>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    name="basic"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Form.Item<FieldType>
                                        name="email"
                                        rules={[
                                            { required: true, message: "Please input your email!" },
                                        ]}
                                    >
                                        <Input placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item<FieldType>
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your password!",
                                            },
                                        ]}
                                    >
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full"
                                        loading={isLoading}
                                    >
                                        Login
                                    </Button>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                </main>
            </div>
        </>
    );
}
