"use client"
import React, { useState, useEffect } from 'react'
import EmpSideBar from '@/components/EmpSideBar'
import { MdSearch, MdPhone, MdEmail, MdPerson } from "react-icons/md";
import { FaUser, FaBuilding } from "react-icons/fa";
import { toast } from 'react-toastify';
import SpinnerComp from '@/components/Spinner';
import { useRouter } from 'next/navigation';
import { IoMailUnreadOutline } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useNotification } from "@/context/notificationContext";
import UnreadMessages from '../../../components/UnreadMessages';
import ReadMessages from '../../../components/ReadMessages';
import styles from "./style.module.css"

function EmpMessagePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { hasNotification, setHasNotification } = useNotification();
    const [readMessages, setReadMessages] = useState([
        {
            username: "sagniksarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
            replyTime: "2025-11-04T20:08:21.000Z",
            replyBy: "Admin",
            reply: "Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
        },
        {
            username: "samratsarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
            replyTime: "2025-11-04T20:08:21.000Z",
            replyBy: "emp087",
            reply: "Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
        },
        {
            username: "sagniksarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
            replyTime: "2025-11-04T20:08:21.000Z",
            replyBy: "Admin",
            reply: "Nam tempus feugiat mauris, consectetur adipiscing elit. Fusce posuere dictum sagittis quis mollis diam malesuada vitae. In in faucibus elit.",
        },

    ]);
    const [unReadMessages, setUnReadMessages] = useState([
        {
            username: "sagniksarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
        },
        {
            username: "samratsarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
        },
        {
            username: "sagniksarkar",
            phone: 7001809047,
            email: "sarkarindustries77@gmail.com",
            createdAt: "2025-11-04T14:02:11.000Z",
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere dictum sagittis. Nam tempus feugiat mauris, quis mollis diam malesuada vitae. In in faucibus elit.",
        },
    ]);
    const [repliedMessages, setRepliedMessages] = useState([])
    function formatISOToCustom(isoString) {
        const date = new Date(isoString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2); // YY format

        return `${hours}:${minutes}:${seconds}-${day}/${month}/${year}`;
    }

    const fetchMessages = async () => {
        let empToken = localStorage.getItem('empToken')
        if (!empToken || empToken == "" || empToken == null) {
            toast.error("Invaid Login");
            router.replace('/')
        }

        let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/employee/fetchMessages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${empToken}`,
            },
        });
        let res = await req.json();
        console.log(res);


        if (res.ok) {
            setHasNotification(false);
            let readMessages = res.messages.filter(m => m.isRead != false && m.isAnswered == false);
            let unreadMessages = res.messages.filter(m => m.isRead == false);
            let repliedMessages = res.messages.filter(m => m.isAnswered == true);

            setReadMessages([...readMessages]);
            setUnReadMessages([...unreadMessages]);
            setRepliedMessages([...repliedMessages]);
        }

    }

    useEffect(() => {
        fetchMessages();
    }, [])


    return (
        <div className="min-h-screen bg-gray-900 flex">
            <EmpSideBar page={"msg"} />
            {isLoading && <SpinnerComp />}
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Support & Help</h1>
                    <p className="text-gray-400">Handle all customer queries</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <IoMailUnreadOutline className="text-blue-400" />
                        <span>Unread Messages</span>
                        {/* #00679bb9 */}
                    </h3>
                    <div className={styles.messageBox}>
                        {
                            unReadMessages.map((e, i) => {
                                return <UnreadMessages
                                    key={i}
                                    id={e._id}
                                    username={e.username}
                                    phone={e.phone}
                                    email={e.email}
                                    isRead={e.isRead}
                                    isEmp={true}
                                    time={formatISOToCustom(e.createdAt)}
                                    messageBody={e.message}
                                    fetchMessages={() => fetchMessages()}
                                />
                            })
                        }
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <MdOutlineMarkEmailRead className="text-blue-400" />
                        <span>Read Messages</span>
                        {/* #00679bb9 */}
                    </h3>
                    <div className={styles.messageBox} >
                        {
                            readMessages.map((e, i) => {
                                return <UnreadMessages
                                    key={i}
                                    id={e._id}
                                    username={e.username}
                                    phone={e.phone}
                                    email={e.email}
                                    isRead={e.isRead}
                                    isEmp={true}
                                    time={formatISOToCustom(e.createdAt)}
                                    messageBody={e.message}
                                    fetchMessages={() => fetchMessages()}
                                />
                            })
                        }
                    </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <MdOutlineMarkEmailRead className="text-blue-400" />
                        <span>Replied Messages</span>
                        {/* #00679bb9 */}
                    </h3>
                    <div className={styles.messageBox} >
                        {
                            repliedMessages.map((e, i) => {
                                return <ReadMessages
                                    key={i}
                                    id={e._id}
                                    username={e.username}
                                    phone={e.phone}
                                    email={e.email}
                                    time={formatISOToCustom(e.createdAt)}
                                    messageBody={e.message}
                                    reply={e.replyText}
                                    replyBy={e.replyBy}
                                    replyTime={formatISOToCustom(e.replyTime)}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpMessagePage