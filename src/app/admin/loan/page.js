"use client"
import React, { useState, useEffect } from 'react'
import AdminSideBar from '@components/AdminSideBar'
import styles from '../admin.module.css'
import { MdSearch } from "react-icons/md";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IoMdCloseCircle } from "react-icons/io";
import SpinnerComp from '@components/Spinner';

function LoanPage() {
    const [loanList, setLoanList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [empData, setEmpData] = useState({
        name: "",
        phone: null,
        password: "",
        email: ""
    })
    const [currentUser, setCurrentUser] = useState({})
    const [searchData, setSearchData] = useState({ name: "", phone: null, email: "" });
    const fetchSingleUser = async () => {

        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/findSingleUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": searchData.username,
                "phone": searchData.phone,
                "email": searchData.email,
            })
        });

        const res = await req.json();
        console.log(res);
        if (res.ok) {
            toast.success(`${res.message}`);
            setEmployeeList([{ ...res.user }])
            setSearchData({ username: "", phone: null, email: "" })
        } else {
            toast.error(`${res.message}`);
        }
    }
    const fetchLoanList = async () => {

        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/fetchLoanList`);

        const res = await req.json();

        if (res.ok) {
            console.log(res);
            setIsLoading(false)
            setLoanList([...res.data])
        } else {
            toast.error(`${res.message}`);
        }
    }

    useEffect(() => {
        fetchLoanList();
    }, [])

    return (
        <div className={styles.mainDiv}>
            {isLoading && <SpinnerComp />}
            <AdminSideBar page={"loan"} />
            <div className={styles.contentDiv}>
                <h2>Loans</h2>
                <div className={styles.employeeSeacrhBar}>
                    <input placeholder='Enter Loan ID' value={searchData.email} onChange={(e) => setSearchData((p) => ({ ...p, email: e.target.value }))} />
                    <input placeholder='Enter Loan Type' value={searchData.username} onChange={(e) => setSearchData((p) => ({ ...p, username: e.target.value }))} />
                    <input placeholder='Enter Loan Status' value={searchData.phone} onChange={(e) => setSearchData((p) => ({ ...p, phone: e.target.value }))} />
                    <button onClick={fetchSingleUser}><MdSearch />Search</button>
                </div>
                <div className={styles.employeeTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Sl No.</th>
                                <th>Loan ID</th>
                                <th>Loan Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loanList.map((e, index) => {
                                    return (
                                        <tr
                                            onClick={() => {
                                                setCurrentUser({ id: e._id, name: e.name, phone: e.phone, email: e.email })
                                            }}
                                            className={styles.tableRow}
                                            key={index}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{e.loanId}</td>
                                            <td>{e.loanType}</td>
                                            <td>{e.amount}</td>
                                            <td>{e.status}</td>
                                            <td>{e.createdAt}</td>
                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default LoanPage