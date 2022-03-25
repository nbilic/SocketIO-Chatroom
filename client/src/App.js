import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./app.css";
const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(false);
  const [avatar, setAvatar] = useState();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setSocket(io("http://localhost:8000"));
  }, []);

  const toDataURL = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = () => {
    setMessage("");
    socket.emit("newMessage", { user, message });
  };

  useEffect(() => {
    user && socket?.emit("newUser", { user, avatar });
    socket?.on("onlineUsers", (onlineUsers) => {
      setUsers(onlineUsers);
      console.log("called online");
    });

    socket?.on("chatMessages", (messages) => {
      setMessages(messages);
      console.log(messages);
    });
  }, [user, socket]);
  return (
    <div className="container">
      {!user && (
        <div className="login">
          <h5>Enter username: </h5>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h5>Select avatar: </h5>
          <input
            type="file"
            onChange={(e) => setAvatar(toDataURL(e.target.files[0]))}
          />
          <button onClick={() => setUser(username)}>Submit</button>
        </div>
      )}
      {user && (
        <div className="chat-container">
          <div className="left-side">
            <div className="chat-window">
              {messages.map((message) => (
                <div className="message-container">
                  <img src={message.user.avatar} className="avatar" alt="" />
                  <p className="username"> {message.user.username}:</p>
                  <p className="message-content">{message.message.content}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                placeholder="Enter message...."
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
          <div className="member-list">
            {users.map((user) => (
              <div className="user">
                <img src={user.avatar} alt="" className="avatar" />
                <p>{user.username}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
