"use client";

import { Avatar, Card, Descriptions, Typography } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/util/store";
import { getAllUsersApi } from "@/api/chat";
import socket from "@/util/socket";
import { pushReceivedMessage } from "@/util/storeSlices/chatSlice";
import { handleEmitTyping } from "@/util/socketEmits/typing";

const { Text } = Typography;

interface IUser {
    createdAt: string;
    email: string;
    id: number;
    name: string;
    updatedAt: string;
    lastSentMessage: {
        id: number;
        conversationId: number;
        senderId: number;
        receiverId: number;
        content: string;
        timestamp: string;
        createdAt: string;
        updatedAt: string;
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userDetails = useAppSelector((state) => state.user);

    const [users, setUsers] = useState<IUser[]>([]);
    const [currentReceiver, setCurrentReceiver] = useState<IUser | null>(null);
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        setCurrentUser(userDetails.name);
        const getUsers = async () => {
            const resp = await getAllUsersApi({
                payload: {
                    userId: userDetails.id,
                },
            });
            if (resp.ok) {
                setUsers(resp.data);
                setCurrentReceiver(resp.data[0]);

                router.push(`/messages?id=${resp.data[0].id}`);
            }
        };
        getUsers();
    }, [userDetails.name]);

    useEffect(() => {
        socket.on("receive-message", (message) => {
            dispatch(pushReceivedMessage(message));
            setUsers((prevState) =>
                prevState.map((user) => {
                    if (user.lastSentMessage?.conversationId) {
                        if (user.lastSentMessage.conversationId === message.conversationId) {
                            return { ...user, lastSentMessage: message };
                        }
                    } else {
                        if (
                            (message.senderId === user.id &&
                                message.receiverId === userDetails.id) ||
                            (message.senderId === userDetails.id && message.receiverId === user.id)
                        ) {
                            return { ...user, lastSentMessage: message };
                        }
                    }
                    return user;
                })
            );
        });
        return () => {
            socket.off("receive-message");
        };
    }, [userDetails.id]);

    const handleUserClick = (user: IUser) => {
        setCurrentReceiver(user);
        router.push(`/messages/?id=${user.id}`);
        handleEmitTyping({
            senderId: user.id,
            receiverId: currentReceiver ? +currentReceiver.id : 0,
            isTyping: false,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[50%] !space-y-6">
                <Descriptions
                    bordered
                    column={1}
                    size={"small"}
                    items={[
                        {
                            key: "1",
                            label: "User",
                            children: currentUser,
                        },
                    ]}
                    style={{ width: "30%", justifySelf: "end" }}
                />
                <Card title="Messages">
                    <div className="flex gap-x-12 h-[500px]">
                        <div className="space-y-2 w-[30%]">
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    className={`w-full flex items-center gap-x-5 p-3 rounded-sm border border-zinc-100 cursor-pointer hover:bg-zinc-100 ${
                                        currentReceiver &&
                                        currentReceiver.id === user.id &&
                                        "bg-zinc-100"
                                    }`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div>
                                        <Avatar
                                            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                                            style={{ backgroundColor: "#f56a00" }}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-start">
                                        <p>{user.name}</p>
                                        <Text type="secondary" style={{ textAlign: "left" }}>
                                            {user.lastSentMessage?.senderId === userDetails.id &&
                                                "You: "}
                                            {user.lastSentMessage?.content}
                                        </Text>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="col-span-2 flex flex-col border border-zinc-100 rounded-sm p-3 w-[70%]">
                            {children}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
