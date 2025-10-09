"use client"
import Link from 'next/link'
import React from 'react'
import { useRouter } from "next/navigation";
import styles from './adminsidebar.module.css'
function AdminSideBar({ page }) {
    const router = useRouter();
    let home = (<span>Home</span>)
    let emp = (<span>Employee</span>)
    let user = (<span>Users</span>)
    let loan = (<span>Loans</span>)
    let contact = (<span>Contacts</span>)
    let set = (<span>Settings</span>)
  
    if (page == "home") {
        home = (<span style={{ backgroundColor: '#ffae00 ', color:'rgb(0, 0, 128) ' }}>Home</span>)
    }
    else if (page == "emp") {
        emp = (<span style={{ backgroundColor: '#ffae00', color:'rgb(0, 0, 128) ' }}>Employee</span>)
    }
    else if (page == "usr") {
        user = (<span style={{ backgroundColor: '#ffae00 ', color:'rgb(0, 0, 128) ' }}>Users</span>)
    }
    else if (page == "loan") {
        loan = (<span style={{ backgroundColor: '#ffae00 ', color:'rgb(0, 0, 128) ' }}>Loans</span>)
    }
    else if (page == "cnct") {
        contact = (<span style={{ backgroundColor: '#ffae00 ', color:'rgb(0, 0, 128) ' }}>Contacts</span>)
    }
    else if (page == "set") {
        set = (<span style={{ backgroundColor: '#ffae00 ', color:'rgb(0, 0, 128) ' }}>Settings</span>)
    }


    const logOut = () => {
        let confirmLogOut = confirm("Sure Want to Log-Out ?");

        if (confirmLogOut) {
            localStorage.clear();
            router.replace("/");
        }
    }

    return (
        <div className={styles.sideBarMainDiv}>
            <div className={styles.linksBar}>
                <Link href={'/admin/'}>{home}</Link>
                <Link href={'/admin/employee'}>{emp}</Link>
                <Link href={'/admin/user'}>{user}</Link>
                <Link href={'/admin/loan'}>{loan}</Link>
                <Link href={'/admin/contact'}>{contact}</Link>
                <Link href={'/admin/setting'}>{set}</Link>
                <button onClick={logOut}>Log Out</button>
            </div>
        </div>
    )
}

export default AdminSideBar