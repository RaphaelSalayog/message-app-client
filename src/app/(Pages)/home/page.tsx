"use client";

import { Avatar, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { getMessagesByConversationApi, createConversationApi, sendMessageApi } from "@/api/chat";
import { useSearchParams } from "next/navigation";
import socket from "@/util/socket";
import { useAppDispatch, useAppSelector } from "@/util/store";
import { setCurrentConversation } from "@/util/storeSlices/chatSlice";

let isTyping = false;
export default function Home() {
    const searchParams = useSearchParams();
    const receiverId = searchParams.get("id");
    const containerRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const { getCurrentConversation, getReceivedMessage } = useAppSelector((state) => state.chat);
    const user = useAppSelector((state) => state.user);

    const [conversation, setConversation] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [isReceiverTyping, setIsReceiverTyping] = useState(false);

    useEffect(() => {
        if (receiverId && user.id) {
            const getMessages = async () => {
                const respPostConversationApi = await createConversationApi({
                    payload: {
                        user1Id: user.id,
                        user2Id: +receiverId,
                    },
                });

                if (respPostConversationApi.statusText === "Created") {
                    dispatch(setCurrentConversation(respPostConversationApi.data));
                    const resp = await getMessagesByConversationApi({
                        payload: {
                            conversationId: respPostConversationApi.data.id,
                        },
                    });

                    if (resp.ok) {
                        setConversation(resp.data);
                    }
                }
            };

            getMessages();
        }
    }, [receiverId, user.id]);

    useEffect(() => {
        if (user.id) {
            socket.emit("register", user.id);
            socket.on("is-typing", ({ senderId, receiverId, isTyping }) => {
                setIsReceiverTyping(isTyping);
                console.log("sent");
            });
        }

        return () => {
            socket.off("receive-message");
            socket.off("is-typing");
        };
    }, [user.id]);

    useEffect(() => {
        setConversation((prev) => [...prev, getReceivedMessage]);
    }, [JSON.stringify(getReceivedMessage)]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);

        if (value && !isTyping) {
            socket.emit("typing", { senderId: user.id, receiverId: receiverId, isTyping: true });
            isTyping = true;
        } else if (!value) {
            socket.emit("typing", { senderId: user.id, receiverId: receiverId, isTyping: false });
            isTyping = false;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (message) {
            await sendMessageApi({
                payload: {
                    senderId: user.id,
                    receiverId: receiverId ? +receiverId : 0,
                    conversationId: +getCurrentConversation.id,
                    content: message,
                },
            });

            setMessage("");
            socket.emit("typing", { senderId: user.id, receiverId: receiverId, isTyping: false });
            isTyping = false;
        }
    };

    const displayMessage = (data: any[]) => {
        return data.map((message: any, index: number) => {
            if (message.senderId == user.id) {
                return (
                    <div key={message.id} className="flex justify-end">
                        <div className="flex flex-col items-end space-y-2 w-[50%]">
                            <p className="py-2 px-4 max-w-max rounded-3xl bg-[#1677ff] w-full text-white">
                                {message.content}
                            </p>
                        </div>
                    </div>
                );
            } else if (message.senderId == receiverId) {
                return (
                    <div key={message.id} className="flex items-end gap-x-3 w-[50%]">
                        <div>
                            <Avatar
                                src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                                style={{
                                    backgroundColor: "#f56a00",
                                    visibility:
                                        data[index + 1]?.senderId != receiverId
                                            ? "visible"
                                            : "hidden",
                                }}
                            />
                        </div>
                        <div className="grow space-y-2">
                            <p className="py-2 px-4 max-w-max rounded-3xl bg-zinc-100 w-full">
                                {message.content}
                            </p>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        });
    };

    return (
        <>
            <div className="grow flex flex-col justify-end overflow-auto">
                <div ref={containerRef} className="space-y-2 overflow-auto">
                    {displayMessage(conversation)}
                    {isReceiverTyping && (
                        <div className="flex items-end gap-x-3 w-[50%]">
                            <div>
                                <Avatar
                                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                                    style={{
                                        backgroundColor: "#f56a00",
                                    }}
                                />
                            </div>
                            <div className="h-[32px] flex items-center space-x-1 py-2 px-4 rounded-3xl bg-zinc-100">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <div
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{
                                        animationDelay: "0.2s",
                                        animationFillMode: "backwards",
                                    }}
                                />
                                <div
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{
                                        animationDelay: "0.4s",
                                        animationFillMode: "backwards",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-end gap-x-3 mt-3">
                <TextArea
                    value={message}
                    onChange={handleMessage}
                    onKeyDown={handleKeyDown}
                    placeholder="Type message"
                    autoSize={{ minRows: 1, maxRows: 3 }}
                />
                <Button
                    type="primary"
                    style={{ width: 50 }}
                    onClick={handleSend}
                    icon={<SendOutlined style={{ color: "white" }} />}
                />
            </div>
        </>
    );
}
