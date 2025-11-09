"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { MdOutlineSupportAgent } from "react-icons/md";
import { socket } from "@/utils/socket";
import { useNotification } from "@/context/notificationContext";
interface AdminSideBarProps {
  page: "home" | "emp" | "usr" | "loan" | "cnct" | "set" | "msg",
}

function EmpSideBar({ page }: AdminSideBarProps) {
  const router = useRouter();
  const { hasNotification, setHasNotification } = useNotification();
  useEffect(() => {
    const connectSocket = async () => {
      try {
        const empToken = localStorage.getItem("empToken");
        if (!empToken) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/employee/authCheck`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${empToken}`,
          },
        });

        const data = await res.json();

        if (data.ok && data.id) {
          if (!socket.connected) {
            socket.connect();
          }
          socket.emit("join_employee", data.id);

          socket.on("new_user_message", (data) => {
            setHasNotification(true)
          });

          console.log("Joined employee room:", data.id);
        }
      } catch (err) {
        console.error("Socket connection error:", err);
      }
    };

    connectSocket();

    // cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected (EmpSideBar unmounted)");
      }
    };
  }, []);

  const getLinkStyles = (linkPage: string) => {
    const baseStyles = "flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 group border border-transparent hover:border-blue-500/30"
    const activeStyles = "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 border-blue-400/50"

    return page === linkPage
      ? `${baseStyles} ${activeStyles}`
      : baseStyles
  }

  const getIconStyles = (linkPage: string) => {
    const baseStyles = "w-6 h-6 transition-all duration-300 group-hover:scale-110"
    return page === linkPage ? "text-white" : "text-gray-400 group-hover:text-blue-400"
  }

  const logOut = () => {
    const confirmLogOut = confirm("Are you sure you want to log out?")

    if (confirmLogOut) {
      localStorage.clear()
      router.replace("/")
    }
  }

  const menuItems = [
    {
      key: "home",
      label: "Dashboard",
      href: '/employee/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      key: "usr",
      label: "Users",
      href: '/employee/user',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      key: "loan",
      label: "Loans",
      href: '/employee/loan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    // {
    //   key: "cnct",
    //   label: "Contacts",
    //   href: '/admin/contact',
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    //     </svg>
    //   )
    // },
    {
      key: "msg",
      label: "Support",
      href: '/employee/message',
      icon: (
        <MdOutlineSupportAgent style={{ fontSize: 25 }} />
      )
    }
  ]

  return (
    <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 min-h-screen p-8 flex flex-col backdrop-blur-lg bg-opacity-95 max-h-screen sticky top-0">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              EmpPanel
            </h2>
            <p className="text-gray-400 text-sm">Enterprise Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={getLinkStyles(item.key)}
          >
            {(item.key == "msg" && hasNotification && page != "msg") && <span style={{ width: 20, height: 20, backgroundColor: "red", position: "absolute", borderRadius: 10, right: 10 }}></span>}
            <div className={getIconStyles(item.key)}>
              {item.icon}
            </div>
            <span className="font-semibold text-lg">{item.label}</span>
            {page === item.key && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="pt-8 border-t border-gray-700/50">
        <button
          onClick={logOut}
          className="flex items-center space-x-4 w-full px-6 py-4 text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-500/30"
        >
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-semibold text-lg">Log Out</span>
        </button>
      </div>
    </div>
  )
}

export default EmpSideBar;