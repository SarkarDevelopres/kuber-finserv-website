"use client"
import React, { useState } from 'react'
import Navbar from '@components/Navbar'
import styles from '@/styles/home.module.css'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const submit = () => {
    if (email==""||password=="") {
      toast.error("Fill all fields!")
    }
    router.replace('/admin');
  }
  return (
    <div className={styles.mainDiv}>
      <Navbar />
      <div className={styles.bodysection}>
        <h2>Admin Login</h2>
        <div className={styles.loginBox}>
          <div className={styles.inputDiv}>
            <p>Email</p>
            <input type='email' placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className={styles.inputDiv}>
            <p>Password</p>
            <input type='password' placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <button onClick={submit}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin