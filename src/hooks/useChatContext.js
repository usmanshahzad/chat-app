"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState({});
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const userId = localStorage.getItem('user_id');
      const plan = localStorage.getItem('active_plan');

      if (token && user && userId) {
        setToken(token);
        setUser(JSON.parse(user));
        setUserId(userId);
      }

      if (userId) {
        const res = await fetch(`/api/user/${userId}`);
        const updatedUser = await res.json();

        if (updatedUser?.currentActivePlan) {
          localStorage.setItem("active_plan", JSON.stringify(updatedUser?.currentActivePlan || {}));

          setActivePlan(updatedUser.currentActivePlan || {});
        }
      }

      setIsLoading(false);
    }

    init();
  }, []);

  const login = (name, phone) => {
    if (!phone) return alert("Enter phone number");
    if (!name) return alert("Enter name");

    setIsLoading(true);

    try {
      const userPayload = {
        name: name,
        phone: phone
      }

      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            localStorage.setItem("token", data?.data?.token);
            localStorage.setItem("user", JSON.stringify(data?.data?.details || {}));
            localStorage.setItem("user_id", data?.data?.id || null);
            localStorage.setItem("active_plan", JSON.stringify(data?.data?.currentActivePlan || {}));

            setToken(data?.data?.token);
            setUser(data?.data?.details);
            setUserId(data?.data?.id);
            setActivePlan(data?.data?.currentActivePlan);

            if (!data?.data?.currentActivePlan?.planId) {
              router.replace('/plans');
              return;
            }

            if (data?.data?.currentActivePlan?.planId) {
              router.replace('/chat');
              return;
            }
          }
        })

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("active_plan");
    localStorage.removeItem("user_id");

    setToken(null);
    setUserId(null);
    setActivePlan(null);
    setUser(null);

    router.push("/login");
  };

  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat, login, logout, user, userId, token, isLoading, activePlan, setActivePlan }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext);