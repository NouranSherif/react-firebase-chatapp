import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router";

export default function Home() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError("Failed to log out. Please try again.");
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: inputValue,
        sender: currentUser?.email || "Anonymous",
        senderUid: currentUser?.uid,
        timestamp: serverTimestamp(),
      });
      setInputValue("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc"),
    );

    const unsubscribeFromMessages = onSnapshot(messagesQuery, (snapshot) => {
      const liveMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedTime = "";
        if (data.timestamp) {
          formattedTime = data.timestamp.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
        return {
          id: doc.id,
          ...data,
          timestamp: formattedTime,
        };
      });
      setMessages(liveMessages);
    });
    return () => {
      unsubscribeFromMessages();
    };
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("Not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans">
      <nav className="flex justify-between items-center px-6 h-16 bg-slate-900 text-white border-b border-neutral-800 shrink-0">
        <div className="font-bold text-lg tracking-wider">ChatApp</div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-neutral-400">
            {currentUser
              ? `Logged in as: ${userData?.username || "Loading..."}`
              : "Not logged in"}
          </span>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-white text-black text-sm font-semibold border border-white hover:bg-neutral-200 transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      {error && (
        <div className="bg-red-100 border-b border-red-200 text-red-700 px-6 py-2 text-center text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 flex justify-center items-center p-4 md:p-8 overflow-hidden">
        <div className="flex flex-col w-full max-w-4xl h-full bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-neutral-50">
            {messages.length === 0 ? (
              <p className="text-center text-neutral-400 mt-8 italic text-sm">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === currentUser?.email;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] px-4 py-2.5 rounded-lg border text-sm ${
                      isMe
                        ? "self-end bg-slate-900 text-white border-black"
                        : "self-start bg-white text-neutral-900 border-neutral-200"
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <span
                        className={`font-bold text-xs ${isMe ? "text-neutral-300" : "text-neutral-500"}`}
                      >
                        {isMe ? "You" : msg.sender.split("@")[0]}
                      </span>
                      <span
                        className={`text-[10px] ${isMe ? "text-neutral-400" : "text-neutral-400"}`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex p-4 border-t border-neutral-200 bg-white gap-3 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-md hover:bg-neutral-800 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
