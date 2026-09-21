import { useEffect, useRef, useState } from "react";
import Bubble from "./Bubble/Bubble";
import "./chatRoom.css";
import { getUserRoomMessages, updateMessageStatus } from "../../api/message";
import { dateConverter } from "../../utils/utils";
import { updateChatRoomOpenTime } from "../../api/chat";

export default function ChatRoom({
    selectedChat,
    setCurrentView,
    setSelectedChat,
    user,
    subscribe,
    publish,
    updateLastMessage,
}) {
    const [messages, setMessages] = useState([]);
    const activeChat = useRef();
    activeChat.current = selectedChat;
    useEffect(() => {
        getUserRoomMessages(selectedChat?.chatRoomId)
            .then((data) => {
                console.log("Fetched chat messages:", data);
                setMessages(data);
            })
            .catch((error) => {
                console.error("Error fetching chat messages:", error);
            });
    }, [selectedChat]);

    const [messageInput, setMessageInput] = useState("");

    const handleChange = (event) => {
        setMessageInput(event.target.value);
    };

    const bubbleContainerRef = useRef(null);

    useEffect(() => {
        // Recieved sent message from server with id via socket
        const sub = subscribe(
            `/user/queue/${selectedChat.chatRoomId}/sent_messages`,
            (message) => {
                if (message) {
                    console.log(message);
                    setMessages((prevMessages) =>
                        prevMessages.map((msg, index) => {
                            return index === prevMessages.length - 1
                                ? {
                                      ...msg,
                                      ...message,
                                  }
                                : msg;
                        }),
                    );
                    updateLastMessage(message);
                }
            },
        );

        // Recieving message from the chat room
        const sub1 = subscribe(
            `/user/queue/${selectedChat.chatRoomId}`,
            (message) => {
                if (message && message.chatRoomId === selectedChat.chatRoomId) {
                    console.log(message);
                    setMessages((prevMessages) => [...prevMessages, message]);
                    updateMessageStatus(message.id, "SEEN")
                        .then((msg) => {
                            console.log("Message status updated");
                            updateLastMessage(msg);
                        })
                        .catch((err) => {
                            throw err;
                        });
                }
            },
        );

        // Updating the messages status
        const sub2 = subscribe(
            `/user/queue/${selectedChat.chatRoomId}/update_message_status`,
            (message) => {
                if (message) {
                    console.log("Updating message status of ", message);
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === message.id
                                ? { ...msg, ...message }
                                : msg,
                        ),
                    );
                }
            },
        );

        return () => {
            sub();
            sub1();
            sub2();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribe]);

    useEffect(() => {
        // Scroll the empty div into view smoothly
        console.log(
            "Scrolling to bottom of chat room",
            bubbleContainerRef.current.scrollHeight,
        );
        bubbleContainerRef.current?.scrollTo({
            top: bubbleContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        selectedChat && publish("/app/chat_room_open", selectedChat.chatRoomId)
    }, [selectedChat, publish]);

    const sendMessage = () => {
        const message = {
            content: messageInput,
            sender: user,
            chatRoomId: selectedChat?.chatRoomId,
            status: "SENDING",
            lastUpdate: new Date().toISOString(),
        };
        setMessages((prevMessages) => [
            ...prevMessages,
            { ...message, id: new Date().toLocaleDateString() },
        ]);
        setMessageInput("");
        updateLastMessage(message);
        publish("/app/send_message", message);
    };

    return (
        <div className="chat-room-container">
            <div className="chat-room-header">
                <h5>{selectedChat ? selectedChat.name : "Username"}</h5>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setCurrentView("chat-list");
                        setSelectedChat(null);
                    }}
                >
                    X
                </button>
            </div>
            <div className="chat-room-messages" ref={bubbleContainerRef}>
                {messages && messages.length > 0
                    ? messages.map((message, index) =>
                          index === 0 ||
                          dateConverter(messages[index - 1].lastUpdate) !==
                              dateConverter(message.lastUpdate) ? (
                              <div key={message.id}>
                                  <div className="date-separator mt-2 mb-4">
                                      {dateConverter(message.lastUpdate)}
                                  </div>
                                  <Bubble
                                      message={message.content}
                                      sender={
                                          message.sender.username ===
                                          user.username
                                              ? "self"
                                              : "other"
                                      }
                                      first={"first"}
                                      index={index}
                                      len={messages.length}
                                      time={message.lastUpdate}
                                  />
                              </div>
                          ) : (
                              <Bubble
                                  key={message.id}
                                  message={message.content}
                                  sender={
                                      message.sender.username === user.username
                                          ? "self"
                                          : "other"
                                  }
                                  first={index !== 0 && messages[index - 1].sender.username !== message.sender.username ? "first" : "normal"}
                                  index={index}
                                  len={messages.length}
                                  time={message.lastUpdate}
                                  status={message.status}
                              />
                          ),
                      )
                    : "No messages yet. Start the conversation!"}
            </div>
            <div className="chat-room-input">
                <textarea
                    type="text"
                    placeholder="Type a message..."
                    rows={1}
                    value={messageInput}
                    onChange={handleChange}
                />
                <button className="btn btn-primary ms-3" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
