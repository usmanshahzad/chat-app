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
  const [allUsers, setAllUsers] = useState([]);
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

        if (updatedUser?.data?.currentActivePlan) {
          localStorage.setItem("active_plan", JSON.stringify(updatedUser?.data?.currentActivePlan || {}));

          setActivePlan(updatedUser?.data.currentActivePlan || {});
        }
      }

      if (userId) {
        const res = await fetch(`/api/user`);
        const users = await res.json();

        console.log("users", users);

        setAllUsers(users?.data || []);
      }

      setIsLoading(false);
    }

    init();
  }, []);

  const login = (loginData) => {
    if (!loginData.phone) return alert("Phone number is Required");
    if (!loginData.password) return alert("Name is Required");

    setIsLoading(true);

    try {
      const userPayload = loginData

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
            localStorage.setItem("user", JSON.stringify(data?.data?.user || {}));
            localStorage.setItem("user_id", data?.data?.user?.id || null);
            localStorage.setItem("active_plan", JSON.stringify(data?.data?.currentActivePlan || {}));

            setToken(data?.data?.token);
            setUser(data?.data?.user);
            setUserId(data?.data?.user?.id);
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

  const register = (loginData) => {
    if (!loginData.phone) return alert("Phone Number is Required");
    if (!loginData.name) return alert("Name is Required");
    if (!loginData.password) return alert("Password is Required");

    setIsLoading(true);

    try {
      const userPayload = loginData

      fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload)
      })
        .then(res => {
          const status = res.status;

          return res.json().then(data => ({ data, status }));
        })
        .then(data => {
          console.log("data", data);
          if (data.status === 200) {
            router.replace("/login");
            return;
          }

          if (data.status === 400) {
            const messages = data?.data?.errors;
            
            const errorText = Object.values(messages).join("\n");
            alert(errorText)
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
    <ChatContext.Provider value={{ selectedChat, setSelectedChat, login, register, logout, user, allUsers, userId, token, isLoading, activePlan, setActivePlan }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext);