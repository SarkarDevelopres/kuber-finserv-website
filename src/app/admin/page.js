"use client"
import AdminSideBar from '@components/AdminSideBar'
import React, { useState, useEffect } from 'react'
import styles from './admin.module.css'
import { toast } from 'react-toastify';
import { FaUsers } from "react-icons/fa6";
import { MdOutlineContactPage } from "react-icons/md";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BsEnvelopeCheck } from "react-icons/bs";
import SpinnerComp from '@components/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    BarElement, Title,
    PointElement, LineElement
);

import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function LastGameComponent({ index, loantype, userId, amount, date }) {
    const [normalDate, setNormalDate] = useState("");

    useEffect(() => {
        setNormalDate(new Date(date).toLocaleDateString());
    }, [date]);

    return (
        <tr className={styles.gameCompDiv} style={{ borderBottom: "1px solid rgb(255,255,255,0.1)" }}>
            <td>{index + 1}</td>
            <td>{loantype}</td>
            <td>{userId}</td>
            <td>{amount}</td>
            <td>{normalDate || "..."}</td>
        </tr>
    );
}

export function LastTransactionComponent({ id, index, user, amount }) {
    return (
        <tr className={styles.gameCompDiv} style={{ borderBottom: "1px solid rgb(255,255,255,0.1)" }}>
            <td>{index + 1}</td>
            <td className={styles.gameCompData}>{id}</td>
            <td className={styles.gameCompData}>{user}</td>
            <td className={styles.gameCompData}>{-amount}</td>
        </tr>
    )
}


function Admin() {
    const [activeGames, setActiveGames] = useState(5)
    const [contactList, setContactList] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [appliedLoan, setAppliedLoan] = useState(0)
    const [sanctionedLoan, setSanctionedLoan] = useState(0)
    const [latestAppliedLoan, setLatestAppliedLoan] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [userGraphData, setUserGraphData] = useState([]);
    const [appliedLoanGraphData, setAppliedLoanGraphData] = useState([]);
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: "Users",
                data: [],
                borderColor: "#1ea5ffff",
                fill: true,
            },
        ],
    });
    const [barData, setBarData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Loans Applied',
                data: [],
                backgroundColor: ['rgb(2, 73, 81)', 'rgb(0, 56, 100)', 'rgb(54 174 233)', 'rgb(90 104 233)', 'rgb(5 80 150)'],
            },
        ],
    });
    const router = useRouter();

    const startUpData = async () => {
        try {
            if (typeof window === "undefined") return; // prevent SSR
            const adminToken = localStorage.getItem("adminToken");
            // if (!adminToken) throw new Error("No admin token found");

            const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/fetchStartUpData`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`,   // send token in header
                }
            });


            const res = await req.json();
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            console.log(res);

            setTotalUser(res.data.totalUsers);
            setContactList(res.data.totalContacts);
            setAppliedLoan(res.data.totalAppliedLoans);
            setSanctionedLoan(res.data.totalSanctionedLoans);
            setUserGraphData(res.data.userGraph);
            setAppliedLoanGraphData(res.data.appliedLoanGraph);
            setLatestAppliedLoan(res.data.latestAppliedLoans);
            setIsLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            return null;
        }
    }



    useEffect(() => {
        startUpData();
    }, [])

    useEffect(() => {
        if (userGraphData.length === 0) return;

        const currentMonth = new Date().getMonth() + 1;

        // Compute last 5 months (auto-handles January wrap)
        const monthsToShow = [];
        for (let i = 4; i >= 0; i--) {
            let m = currentMonth - i;
            if (m <= 0) m += 12;
            monthsToShow.push(m);
        }

        // Build chart labels and dataset dynamically
        const labels = monthsToShow.map(m => monthNames[m - 1]);
        const dataset = monthsToShow.map(m => {
            const found = userGraphData.find(d => d.month === m);
            return found ? found.totalUsers : 0;
        });

        setLineData({
            labels,
            datasets: [
                {
                    label: "Users",
                    data: dataset,
                    borderColor: "#1ea5ffff",
                    fill: true,
                },
            ],
        });
    }, [userGraphData]);

    useEffect(() => {
        if (appliedLoanGraphData.length === 0) return;

        const currentMonth = new Date().getMonth() + 1;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Get last 5 months (handles wrap-around)
        const monthsToShow = [];
        for (let i = 4; i >= 0; i--) {
            let m = currentMonth - i;
            if (m <= 0) m += 12;
            monthsToShow.push(m);
        }

        // Labels & data
        const labels = monthsToShow.map(m => monthNames[m - 1]);
        const dataset = monthsToShow.map(m => {
            const found = appliedLoanGraphData.find(d => d.month === m);
            return found ? found.totalApplied : 0;
        });

        // Optional: add a gradient of colors or use fixed ones
        const colors = [
            "rgb(2, 73, 81)",
            "rgb(0, 56, 100)",
            "rgb(54, 174, 233)",
            "rgb(90, 104, 233)",
            "rgb(5, 80, 150)",
        ];

        setBarData({
            labels,
            datasets: [
                {
                    label: "Loans Applied",
                    data: dataset,
                    backgroundColor: colors,
                },
            ],
        });
    }, [appliedLoanGraphData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#fff',   // Custom legend label color
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 20
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#FFAE00' // X-axis grid lines rgba(200, 200, 200, 0.2)
                },
                ticks: {
                    color: '#FFAE00' // optional: axis text color
                }
            },
            y: {
                grid: {
                    color: '#FFAE00' // Y-axis grid lines
                },
                ticks: {
                    color: '#FFAE00'
                }
            }
        }
    };

    return (
        <div className={styles.mainDiv}>
            {isLoading && <SpinnerComp/>}
            <AdminSideBar page={"home"} />
            <div className={styles.contentDiv}>
                <h2>Welcome Sir,</h2>
                <div className={styles.dataCardList}>
                    <div className={styles.dataCard}>
                        <FaUsers className={styles.dataIcon} />
                        <div className={styles.dataDetails}>
                            <p>Total Users</p>
                            <h3>{totalUser}</h3>
                        </div>
                    </div>
                    <div className={styles.dataCard}>
                        <MdOutlineContactPage className={styles.dataIcon} />
                        <div className={styles.dataDetails}>
                            <p>{`Contacts`}</p>
                            <h3>{contactList}</h3>
                        </div>
                    </div>
                    <div className={styles.dataCard}>
                        <SlEnvolopeLetter className={styles.dataIcon} />
                        <div className={styles.dataDetails}>
                            <p>{`Applied`}</p>
                            <h3>{appliedLoan}</h3>
                        </div>
                    </div>
                    <div className={styles.dataCard}>
                        <BsEnvelopeCheck className={styles.dataIcon} />
                        <div className={styles.dataDetails}>
                            <p>{`Sanctioned`}</p>
                            <h3>{sanctionedLoan}</h3>
                        </div>
                    </div>
                </div>
                <div className={styles.graphZone}>
                    <div className={styles.graphDiv}>
                        <Line data={lineData} options={options} />
                    </div>
                    <div className={styles.graphDiv}>
                        <Bar data={barData} options={options} />
                    </div>
                </div>
                <div className={styles.historyZone}>
                    <div className={styles.lastDataListDiv}>
                        <h3>Last Loan Applied</h3>
                        <div className={styles.gameCompDiv} style={{ backgroundColor: "#231a2b" }}>
                            <span className={styles.gameCompData}>Sl No</span>
                            <span className={styles.gameCompData}>Loan Type</span>
                            <span className={styles.gameCompData}>User Id</span>
                            <span className={styles.gameCompData}>Amount</span>
                            <span className={styles.gameCompData}>Date</span>
                        </div>
                        <table className={styles.historyTable}>
                            {
                                latestAppliedLoan.map((e, index) => {
                                    return <LastGameComponent key={index} index={index} userId={e.userId} loantype={e.loanType} amount={e.amount} date={e.createdAt} />
                                })
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin