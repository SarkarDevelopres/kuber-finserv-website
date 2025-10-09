"use client"
import React, { useState, useEffect } from 'react'
import AdminSideBar from '@components/AdminSideBar'
import styles from '../admin.module.css'
import { MdSearch } from "react-icons/md";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IoMdCloseCircle } from "react-icons/io";
import SpinnerComp from '@components/Spinner';

export function EmpModal({ empData, closeWindow, fetchUsers }) {

    const [loanList, setLoanList] = useState(0);
    const [contactLength, setContactLength] = useState(0);
    const fetchLoanList = async () => {
        let adminToken = localStorage.getItem('adminToken');

        let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/user/appliedLoanLength`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adminToken}`,   // send token in header
            },
            body: JSON.stringify({
                "userId": empData.id
            })
        })
        let res = await req.json();

        if (res.ok) {
            setLoanList(res.data)
        }
    }
    const fetchConatctLength = async () => {
        let adminToken = localStorage.getItem('adminToken');

        let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/user/contactLength`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`,   // send token in header
                },
                body: JSON.stringify({
                    "userId": empData.id
                })
            })
        let res = await req.json();
        if (res.ok) {
            setContactLength(res.data)
        }
    }

    const deleteUser = async () => {

        let confirmDelete = confirm("Permenantly delete employee ?");

        if (confirmDelete) {

            let adminToken = localStorage.getItem('adminToken');

            let req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteEmp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`,   // send token in header
                },
                body: JSON.stringify({
                    "empId": empData.id
                })
            });
            let res = await req.json();

            if (res.ok) {
                toast.success(`${res.message}`)
                fetchUsers();
                closeWindow();
            }

            else toast.error(`${res.message}`);
        }
    }

    useEffect(() => {
        fetchLoanList();
        fetchConatctLength();
    }, [empData.id])


    return (
        <div className={styles.userModalWrapper}>
            <div className={styles.userModalDiv}>
                <IoMdCloseCircle onClick={() => closeWindow()} />
                <div className={styles.modalDetailsDiv}>
                    <div className={styles.detailsField}>
                        <span>Name:</span>
                        <p>{empData.name}</p>
                    </div>
                    <div className={styles.detailsField}>
                        <span>Phone:</span>
                        <p>{empData.phone}</p>
                    </div>
                    <div className={styles.detailsField}>
                        <span>Email:</span>
                        <p>{empData.email}</p>
                    </div>
                    <div className={styles.detailsField}>
                        <span>Loans Applied:</span>
                        <p>{loanList}</p>
                    </div>
                    <div className={styles.detailsField}>
                        <span>Contacts:</span>
                        <p>{contactLength}</p>
                    </div>
                </div>
                <button onClick={deleteUser} className={styles.modalDeleteBtn}>Delete User</button>
            </div>
        </div>
    )
}


function UserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)
    const fetchTotalUsers = async () => {
        try {
            const adminToken = localStorage.getItem("adminToken");
            if (!adminToken) throw new Error("No admin token found");

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/user/getUserList`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${adminToken}`,   // send token in header
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            setUserList([...data.userList]);
            setIsLoading(false)
        } catch (err) {
            console.error("Fetch error:", err);
            return null;
        }
    }
    const [userList, setUserList] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [showUserModal, setShowUserModal] = useState(false)
    const [searchData, setSearchData] = useState({
        name: "",
        phone: null,
        email: ""
    });

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
            setUserList([{ ...res.user }])
            setSearchData({ username: "", phone: null, email: "" })
        } else {
            toast.error(`${res.message}`);
        }
    }
    useEffect(() => {
        fetchTotalUsers();
    }, [])

    return (
        <div className={styles.mainDiv}>
            {isLoading && <SpinnerComp/>}
            <AdminSideBar page={"usr"} />
            <div className={styles.contentDiv}>
                {
                    showUserModal && <EmpModal empData={currentUser} closeWindow={() => setShowUserModal(false)} fetchUsers={fetchTotalUsers} />
                }
                <h2>Users</h2>
                <div className={styles.employeeSeacrhBar}>
                    <input placeholder='Enter User Email' value={searchData.email} onChange={(e) => setSearchData((p) => ({ ...p, email: e.target.value }))} />
                    <input placeholder='Enter User Name' value={searchData.username} onChange={(e) => setSearchData((p) => ({ ...p, username: e.target.value }))} />
                    <input placeholder='Enter User Number' value={searchData.phone} onChange={(e) => setSearchData((p) => ({ ...p, phone: e.target.value }))} />
                    <button onClick={fetchSingleUser}><MdSearch />Search</button>
                </div>
                <div className={styles.employeeTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Sl No.</th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Email Address</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userList.map((e, index) => {
                                    return (
                                        <tr
                                            onClick={() => {
                                                setCurrentUser({ id: e._id, name: e.username, phone: e.phone, email: e.email }),
                                                    setShowUserModal(true)
                                            }}
                                            className={styles.tableRow}
                                            key={index}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{e._id}</td>
                                            <td>{e.username}</td>
                                            <td>{e.email}</td>
                                            <td>{e.phone}</td>
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

export default UserPage