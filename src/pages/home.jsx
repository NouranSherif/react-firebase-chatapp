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
  const [, setLoading] = useState(true);
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
        return { id: doc.id, ...data, timestamp: formattedTime };
      });
      setMessages(liveMessages);
    });
    return () => unsubscribeFromMessages();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
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

  const displayName =
    userData?.username || currentUser?.email?.split("@")[0] || "User";
  const initial = displayName[0].toUpperCase();

  return (
    <div className="flex flex-col h-screen bg-navy-50 overflow-hidden">
      <nav className="flex items-center justify-between px-6 h-[58px] bg-navy-900 shrink-0 shadow-md">
        <div className="font-sans text-xl text-white flex items-center gap-2.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 animate-pulse" />
          ChatApp
        </div>
        <div className="flex items-center gap-3">
          {currentUser && (
            <>
              <div className="flex items-center gap-2.5 px-3 py-1.25 bg-navy-800 border border-navy-700 rounded-full">
                <div className="w-6.75 h-6.75 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-[0.66rem] font-semibold text-sky-300 shrink-0">
                  {initial}
                </div>
                <span className="text-[0.78rem] text-navy-200 max-w-32.5 truncate">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[0.76rem] font-medium text-navy-300 border border-navy-700 px-3.5 py-1.5 rounded-md hover:bg-navy-800 hover:text-white transition-all duration-150 cursor-pointer"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </nav>
      {error && (
        <div className="px-5 py-2 bg-red-50 border-b border-red-200 text-red-600 text-xs text-center shrink-0">
          {error}
        </div>
      )}
      <main className="flex-1 overflow-hidden flex items-center justify-center p-5">
        <div className="w-full max-w-210 h-full flex flex-col bg-white border border-navy-100 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(10,22,40,0.08)] relative">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-navy-300 to-transparent z-10 pointer-events-none" />
          <div className="flex-1 overflow-y-auto bg-navy-50 p-5 flex flex-col gap-2.5 messages-scroll">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-1.5 py-16">
                <span className="font-display italic text-4xl text-navy-200 mb-3">
                  ✦
                </span>
                <p className="text-sm text-navy-400">No messages yet.</p>
                <p className="text-xs text-navy-300">
                  Be the first to say something.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === currentUser?.email;
                const senderName = isMe ? "You" : msg.sender.split("@")[0];
                const msgInitial = msg.sender[0].toUpperCase();

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 animate-rise ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-6.75 h-6.75 rounded-full flex items-center justify-center text-[0.65rem] font-semibold shrink-0 ${
                        isMe
                          ? "bg-navy-800 text-white"
                          : "bg-white border border-navy-200 text-navy-500"
                      }`}
                    >
                      {msgInitial}
                    </div>
                    <div
                      className={`max-w-[68%] px-3.5 py-2.5 rounded-xl ${
                        isMe
                          ? "bg-navy-800 rounded-br-[3px] shadow-sm"
                          : "bg-white border border-navy-100 rounded-bl-[3px] shadow-sm"
                      }`}
                    >
                      <div className="flex items-baseline gap-2.5 mb-1">
                        <span
                          className={`text-[0.63rem] font-semibold tracking-widest uppercase ${
                            isMe ? "text-navy-300" : "text-navy-400"
                          }`}
                        >
                          {senderName}
                        </span>
                        <span
                          className={`font-mono text-[0.58rem] ml-auto ${isMe ? "text-navy-400" : "text-navy-300"}`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                      <p
                        className={`text-[0.875rem] leading-relaxed whitespace-pre-wrap wrap-break-word ${isMe ? "text-white" : "text-navy-800"}`}
                      >
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2.5 p-3.5 border-t border-navy-100 bg-white shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write a message…"
              className="flex-1 bg-navy-50 border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 placeholder-navy-300 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-200/60 transition-all"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
