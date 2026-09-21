import { useCallback, useEffect, useRef, useState } from "react";
import ChatList from "../ChatList/chatList";
import "./chatWindow.css";
import ChatRoom from "../ChatRoom/chatRoom";
import Sidebar from "../Sidebar/sideBar";
import ChatListItem from "../ChatListItem/chatListItem";
import {
    acceptUserRequest,
    connectRequest,
    getConnectRequests,
    getChatListItems,
    getSearchUserType,
    searchUsers,
} from "../../api/user";
import { useStompSocket } from "../../utils/useWebSocket";
import { updateMessageStatus } from "../../api/message";

export function UserDetails({
    setCurrentView,
    selectedChat,
    connectRequests,
    setConnectRequests,
}) {
    const [searchUserType, setSearchUserType] = useState();

    const newConnectRequest = () => {
        console.log(selectedChat);
        connectRequest(selectedChat.username)
            .then((data) => {
                console.log(data);
                setSearchUserType("Requested");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const acceptRequest = (event) => {
        console.log(event.target.value);
        acceptUserRequest(selectedChat.id)
            .then((data) => {
                console.log(data);
                setConnectRequests(
                    connectRequests.filter(
                        (req) => req.username !== selectedChat.username,
                    ),
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleMessage = () => {
        setCurrentView("home/chat-list/room");
    };

    const renderCta = (userType) => {
        switch (userType) {
            case "NewConnection":
                return (
                    <>
                        <div className="cta-container mt-2 pb-5">
                            <button className="" onClick={newConnectRequest}>
                                <i className="fa-solid fa-link"></i>
                                <span className="d-inline ms-2">Request</span>
                            </button>
                        </div>
                    </>
                );

            case "Connection":
                return (
                    <>
                        <p className="user-type-in-owner">
                            User is already in contacts
                        </p>
                        <div className="cta-container mt-2 pb-5">
                            <button className="" onClick={handleMessage}>
                                <i className="fa-solid fa-link"></i>
                                <span className="d-inline ms-2">Message</span>
                            </button>
                        </div>
                    </>
                );
            case "Requested":
                return <p className="user-type-in-owner">Request sent</p>;
            default:
                return "";
        }
    };

    useEffect(() => {
        getSearchUserType(selectedChat.username)
            .then((data) => {
                console.log(data);
                setSearchUserType(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [selectedChat]);

    return (
        <div className="user-information mt-4 p-5">
            <div className="avatar mb-3"></div>
            <div className="user-details mb-2">
                <h4>{selectedChat.name}</h4>
                <h6>@{selectedChat.username}</h6>
                <p
                    style={{
                        textAlign: "start",
                        marginTop: "1rem",
                    }}
                >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Maiores, aliquid nemo! Suscipit iusto maxime est modi
                    commodi facere, corrupti architecto molestiae ex nemo quasi
                    quod voluptatum dolore enim laborum adipisci!
                </p>
            </div>
            {selectedChat.userId ? (
                <div className="cta-container mt-2 pb-5">
                    <button className="" onClick={acceptRequest}>
                        <i className="fa-solid fa-link"></i>
                        <span className="d-inline ms-2">Accept</span>
                    </button>
                </div>
            ) : (
                renderCta(searchUserType)
            )}

            <hr />
        </div>
    );
}

export default function ChatWindow({
    cookie,
    setIsAuthenticated,
    removeCookie,
    setLoading,
    user,
    toast,
}) {
    const [currentView, setCurrentView] = useState("home/chat-list"); // "chat-list", "chat-room", "settings", "connect-friends", "requests"
    const [selectedChat, setSelectedChat] = useState(null);
    const [sideActive, setSideActive] = useState(false);
    const [connectRequests, setConnectRequests] = useState([]);

    useEffect(() => {
        const fetchInitialChats = async () => {
            const contacts = await getChatListItems();
            console.log("Fetched chat list items:", contacts);
            setChats(contacts);
        };
        console.log(cookie.userProfile);
        setLoading(true);
        fetchInitialChats();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { subscribe, publish } = useStompSocket("http://localhost:8080/ws", {
        connectHeaders: {
            Authorization: `Bearer ${cookie.userTk}`,
        },
    });
    const [chats, setChats] = useState([]);

    const updateUnread = useCallback((chatRoomId) => {
        if (currentView.includes("chat-list")) {
            setChats((prevChats) => {
                return prevChats.map((chat) =>
                    chat.chatRoomId === chatRoomId
                        ? {
                              ...chat,
                              unread:
                                  selectedChatRef.current &&
                                  selectedChatRef.current.chatRoomId ===
                                      chatRoomId
                                      ? 0
                                      : chat.unread + 1,
                          }
                        : chat,
                );
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedChatRef = useRef(selectedChat);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
        selectedChatRef.current &&
            updateUnread(selectedChatRef.current.chatRoomId);
    }, [selectedChat, updateUnread]);


    const updateLastMessage = useCallback((msg) => {
        console.log(msg);
        setChats((prevChats) => {
            return [
                {
                    ...prevChats.find(chat => chat.chatRoomId === msg.chatRoomId),
                    lastMessage: msg
                },
                ...prevChats.filter(chat => chat.chatRoomId !== msg.chatRoomId)
            ]
        });
    }, []);

    useEffect(() => {
        const sub = subscribe("/user/queue/new_messages", (message) => {
            if (
                !selectedChatRef.current ||
                selectedChatRef.current.chatRoomId !== message.chatRoomId
            ) {
                toast("New message from " + message.sender.username)
                updateMessageStatus(message.id, "DELIVERED")
                    .then((msg) => {
                        updateLastMessage(msg);
                    })
                    .catch((err) => {
                        throw err;
                    });
                updateUnread(message.chatRoomId);
            }
        });

        return () => {
            sub();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribe, updateUnread, updateLastMessage]);

    useEffect(() => {
        const handlePopState = (event) => {
            const path = currentView.split("/");
            console.log(path);
            const lastView = path.pop();
            console.log(path.join("/"));
            if (lastView === "home" || path.length === 1) {
                setCurrentView("home/chat-list");
            } else {
                setCurrentView(path.join("/"));
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [currentView]);

    const [searchResult, setSearchResult] = useState();

    const handleSearch = (event) => {
        const query = event.target.value;
        console.log(query);
        if (query !== "") {
            searchUsers(query)
                .then((data) => {
                    console.log(data);
                    setSearchResult(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setSearchResult([]);
        }
    };

    useEffect(() => {
        // setSelectedChat(undefined);
        if (currentView.includes("requests")) {
            getConnectRequests()
                .then((data) => {
                    console.log(data);
                    setConnectRequests(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [currentView]);

    return (
        <div
            className={`chat-window parent ${currentView === "chat-room" ? "chat-room-active" : ""}`}
        >
            <div className="div1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 128 128"
                >
                    <circle cx="64" cy="64" r="20" fill="#0f1011" />
                    <path
                        fill="#0f1011cb"
                        d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.846 35.846 0 0 0 64 28c-19.882 0-36 16.118-36 36a35.846 35.846 0 0 0 3.94 16.391c.851 1.663.643 3.712-.678 5.033L16.646 100.04c-1.702 1.702-4.519 1.531-5.858-.468C3.974 89.399 0 77.163 0 64 0 28.654 28.654 0 64 0c13.163 0 25.399 3.974 35.572 10.788Z"
                    />
                    <path
                        fill="#0f101157"
                        d="M100.04 111.354c1.702 1.702 1.531 4.519-.468 5.858C89.399 124.026 77.164 128 64 128c-13.164 0-25.399-3.974-35.572-10.788-2-1.339-2.17-4.156-.468-5.858l14.615-14.616c1.322-1.32 3.37-1.53 5.033-.678A35.847 35.847 0 0 0 64 100a35.846 35.846 0 0 0 16.392-3.94c1.662-.852 3.712-.643 5.032.678l14.616 14.616Z"
                    />
                </svg>
            </div>
            <div className="chat-window-header div2">
                <h4 className="mt-2">Connect</h4>
            </div>
            <div
                className={`chat-window-sidebar div3 ${sideActive ? "active" : ""}`}
            >
                <Sidebar
                    cookie={cookie}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    setSideActive={setSideActive}
                    sideActive={sideActive}
                    setIsAuthenticated={setIsAuthenticated}
                    removeCookie={removeCookie}
                    setLoading={setLoading}
                    user={user}
                />
            </div>
            <div className={`chat-window-main div4`}>
                {currentView.includes("search") && (
                    <div className="search-user-view">
                        <div className="search-user-container">
                            <h5 className="ms-3 mt-3">Search users</h5>
                            <div className="input-search ms-3 me-3">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="user-search-result mt-3">
                                {searchResult && searchResult.length > 0
                                    ? searchResult.map((user) => {
                                          return (
                                              <ChatListItem
                                                  key={user.id}
                                                  item={user}
                                                  setSelectedChat={
                                                      setSelectedChat
                                                  }
                                                  selectedChat={selectedChat}
                                                  type={"search-result"}
                                                  setCurrentView={
                                                      setCurrentView
                                                  }
                                                  currentView={currentView}
                                              />
                                          );
                                      })
                                    : "Search above to view more results"}
                                <ChatListItem
                                    type={"search-result"}
                                    setCurrentView={setCurrentView}
                                    currentView={currentView}
                                />
                            </div>
                        </div>
                        {currentView.includes("user") && selectedChat ? (
                            <div className="user-information-container">
                                <UserDetails
                                    selectedChat={selectedChat}
                                    setSelectedChat={setSelectedChat}
                                    type="searchUser"
                                    setCurrentView={setCurrentView}
                                />
                            </div>
                        ) : (
                            <p className="info"></p>
                        )}
                    </div>
                )}
                {currentView.includes("chat-list") && (
                    <div className="chat-view">
                        <ChatList
                            setCurrentView={setCurrentView}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                            chats={chats}
                            setChats={setChats}
                            user={user}
                            publish={publish}
                            updateUnread={updateUnread}
                        />
                        {currentView.includes("chat-room") && selectedChat ? (
                            <ChatRoom
                                selectedChat={selectedChat}
                                setCurrentView={setCurrentView}
                                setSelectedChat={setSelectedChat}
                                user={user}
                                subscribe={subscribe}
                                publish={publish}
                                updateLastMessage={updateLastMessage}
                            />
                        ) : (
                            "Select chat to start conversation"
                        )}
                    </div>
                )}
                {currentView.includes("requests") && (
                    <div className="request-view">
                        <div className="request-list">
                            <div className="header mt-3 ms-3">
                                <h5>Requests</h5>
                                <div className="input-search">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="request-list-container">
                                {connectRequests.length > 0 &&
                                    connectRequests.map((req) => {
                                        console.log(req);
                                        return (
                                            <ChatListItem
                                                key={req.id}
                                                setCurrentView={setCurrentView}
                                                type={"request"}
                                                setSelectedChat={
                                                    setSelectedChat
                                                }
                                                selectedChat={selectedChat}
                                                item={req}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                        {currentView.includes("request-user-details") ? (
                            <div className="request-details">
                                <UserDetails
                                    selectedChat={selectedChat}
                                    setSelectedChat={setSelectedChat}
                                    setConnectRequests={setConnectRequests}
                                    connectRequests={connectRequests}
                                    type="searchUser"
                                />
                            </div>
                        ) : (
                            "Select request to view details"
                        )}
                    </div>
                )}
                {currentView.includes("settings") && (
                    <div className="settings-view">
                        <nav className="settings-nav">
                            <div className="cta ms-3 mt-3">
                                <div className="icon">
                                    <i className="fa-solid fa-circle-user"></i>
                                </div>
                                <div className="content">Account</div>
                            </div>
                            <div className="cta ms-3">
                                <div className="icon"></div>
                                <div className="content"></div>
                            </div>
                            <div className="cta ms-3">
                                <div className="icon"></div>
                                <div className="content"></div>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
