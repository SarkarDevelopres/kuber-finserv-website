"use client"
import AdminSideBar from '@/components/AdminSideBar'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { FaUsers, FaHandHoldingUsd, FaChartLine } from "react-icons/fa";
import { MdOutlineContactPage, MdTrendingUp } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { BsEnvelopeCheck, BsGraphUp } from "react-icons/bs";
import { MdCurrencyExchange } from "react-icons/md";
import { RiHeartsFill } from "react-icons/ri";
import SpinnerComp from '@/components/Spinner';
import { useRouter } from 'next/navigation';
import { useNotification } from "@/context/notificationContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    BarElement, Title,
    PointElement, LineElement,
    Filler
);

import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface LoanData {
    userId: string;
    loanType: string;
    amount: number;
    createdAt: string;
}

interface GraphData {
    month: number;
    totalUsers?: number;
    totalApplied?: number;
}

export function LastLoanComponent({ index, loanType, userId, amount, date }: {
    index: number;
    loanType: string;
    userId: string;
    amount: number;
    date: string
}) {
    const [normalDate, setNormalDate] = useState("");

    useEffect(() => {
        setNormalDate(new Date(date).toLocaleDateString());
    }, [date]);

    return (
        <tr className="hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/30">
            <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-medium text-blue-400">{loanType}</td>
            <td className="px-6 py-4 text-sm text-gray-300 font-mono">{userId.slice(0, 8)}...</td>
            <td className="px-6 py-4 text-sm text-green-400 font-semibold">₹{amount.toLocaleString()}</td>
            <td className="px-6 py-4 text-sm text-gray-400">{normalDate || "..."}</td>
        </tr>
    );
}

function Admin() {
    const [contactList, setContactList] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [appliedLoan, setAppliedLoan] = useState(0)
    const [sanctionedLoan, setSanctionedLoan] = useState(0)
    const [latestAppliedLoan, setLatestAppliedLoan] = useState<LoanData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [userGraphData, setUserGraphData] = useState<GraphData[]>([]);
    const [appliedLoanGraphData, setAppliedLoanGraphData] = useState<GraphData[]>([]);
    const { hasNotification, setHasNotification } = useNotification();
    const router = useRouter();

    const [lineData, setLineData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: "Users Growth",
                data: [] as number[],
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 3,
            },
        ],
    });

    const [barData, setBarData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: 'Applied Loans',
                data: [] as number[],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(139, 92, 246)',
                    'rgb(59, 130, 246)',
                    'rgb(14, 165, 233)',
                    'rgb(6, 182, 212)',
                ],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    });

    // Dummy data generator
    const generateDummyData = () => {
        // Stats
        setTotalUser(1247);
        setContactList(89);
        setAppliedLoan(543);
        setSanctionedLoan(387);

        // Latest loans
        const loans: LoanData[] = [
            { userId: "user_001", loanType: "Pro", amount: 21, createdAt: new Date().toISOString() },
            { userId: "user_042", loanType: "Premium", amount: 34, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { userId: "user_156", loanType: "Free", amount: 5, createdAt: new Date(Date.now() - 172800000).toISOString() },
            { userId: "user_289", loanType: "Pro", amount: 10, createdAt: new Date(Date.now() - 259200000).toISOString() },
            { userId: "user_332", loanType: "Pro", amount: 12, createdAt: new Date(Date.now() - 345600000).toISOString() },
        ];
        setLatestAppliedLoan(loans);

        // Graph data
        const userData: GraphData[] = [
            { month: 8, totalUsers: 980 },
            { month: 9, totalUsers: 1045 },
            { month: 10, totalUsers: 1120 },
            { month: 11, totalUsers: 1190 },
            { month: 12, totalUsers: 1247 },
        ];
        setUserGraphData(userData);

        const loanData: GraphData[] = [
            { month: 8, totalApplied: 420 },
            { month: 9, totalApplied: 465 },
            { month: 10, totalApplied: 498 },
            { month: 11, totalApplied: 512 },
            { month: 12, totalApplied: 543 },
        ];
        setAppliedLoanGraphData(loanData);

        setIsLoading(false);
    };

    const startUpData = async () => {
        try {
            let adminToken = localStorage.getItem('adminToken')
            if (!adminToken || adminToken == "" || adminToken == null) {
                toast.error("Invaid Login");
                router.replace('/')
            }
            let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/fetchStartUpData`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`,   // send token in header
                },
            });
            let res = await req.json()
            if (res.ok) {
                setTotalUser(res.data.totalUsers);
                setContactList(res.data.totalContacts);
                setAppliedLoan(res.data.totalAppliedLoans);
                setSanctionedLoan(res.data.totalSanctionedLoans);
                setUserGraphData(res.data.userGraph);
                setAppliedLoanGraphData(res.data.appliedLoanGraph);
                setLatestAppliedLoan(res.data.latestAppliedLoans);

                if (res.data.notification) {
                    setHasNotification(true);
                }
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load dashboard data");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        startUpData();
    }, [])

    useEffect(() => {
        if (userGraphData.length === 0) return;

        const currentMonth = new Date().getMonth() + 1;
        const monthsToShow = [];
        for (let i = 4; i >= 0; i--) {
            let m = currentMonth - i;
            if (m <= 0) m += 12;
            monthsToShow.push(m);
        }

        const labels = monthsToShow.map(m => monthNames[m - 1]);
        const dataset = monthsToShow.map(m => {
            const found = userGraphData.find(d => d.month === m);
            return found ? found.totalUsers! : 0;
        });

        setLineData({
            labels,
            datasets: [
                {
                    label: "Users Growth",
                    data: dataset,
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                },
            ],
        });
    }, [userGraphData]);

    useEffect(() => {
        if (appliedLoanGraphData.length === 0) return;

        const currentMonth = new Date().getMonth() + 1;
        const monthsToShow = [];
        for (let i = 4; i >= 0; i--) {
            let m = currentMonth - i;
            if (m <= 0) m += 12;
            monthsToShow.push(m);
        }

        const labels = monthsToShow.map(m => monthNames[m - 1]);
        const dataset = monthsToShow.map(m => {
            const found = appliedLoanGraphData.find(d => d.month === m);
            return found ? found.totalApplied! : 0;
        });

        setBarData({
            labels,
            datasets: [
                {
                    label: "Applied Loans",
                    data: dataset,
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(14, 165, 233, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                    ],
                    borderColor: [
                        'rgb(99, 102, 241)',
                        'rgb(139, 92, 246)',
                        'rgb(59, 130, 246)',
                        'rgb(14, 165, 233)',
                        'rgb(6, 182, 212)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                },
            ],
        });
    }, [appliedLoanGraphData]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#d1d5db',
                    font: {
                        size: 12,
                        weight: '600',
                    },
                    padding: 20,
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#f3f4f6',
                bodyColor: '#d1d5db',
                borderColor: 'rgba(59, 130, 246, 0.5)',
                borderWidth: 1,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(55, 65, 81, 0.5)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                    }
                }
            }
        }
    };

    const statsCards = [
        {
            icon: <FaUsers className="text-2xl" />,
            label: "Total Users",
            value: totalUser,
            change: "+12.3%",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: <MdOutlineContactPage className="text-2xl" />,
            label: "Contacts",
            value: contactList,
            change: "+5.7%",
            color: "from-emerald-500 to-green-500",
            bgColor: "bg-emerald-500/10"
        },
        {
            icon: <RiFileList3Line className="text-2xl" />,
            label: "Loans Applied",
            value: appliedLoan,
            change: "+8.1%",
            color: "from-purple-500 to-indigo-500",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: <BsEnvelopeCheck className="text-2xl" />,
            label: "Sanctioned",
            value: sanctionedLoan,
            change: "+15.2%",
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">

            <AdminSideBar page={"home"} />

            <div className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <div key={index} className={`${card.bgColor} rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                                    {card.icon}
                                </div>
                                <span className="text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-full">
                                    {card.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{card.value.toLocaleString()}</h3>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Users Growth Chart */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <FaChartLine className="text-blue-400" />
                                <span>Users Growth</span>
                            </h3>
                            <span className="text-green-400 text-sm font-semibold">+12.3% growth</span>
                        </div>
                        <div className="h-80">
                            <Line data={lineData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Loans Applied Chart */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                <BsGraphUp className="text-purple-400" />
                                <span>Applied Loans</span>
                            </h3>
                            <span className="text-green-400 text-sm font-semibold">+8.1% increase</span>
                        </div>
                        <div className="h-80">
                            <Bar data={barData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Recent Loans Table */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <FaHandHoldingUsd className="text-green-400" />
                            <span>User Latest Data</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loan Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                                {latestAppliedLoan.map((loan, index) => (
                                    <LastLoanComponent
                                        key={index}
                                        index={index}
                                        loanType={loan.loanType}
                                        userId={loan.userId}
                                        amount={loan.amount}
                                        date={loan.createdAt}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin