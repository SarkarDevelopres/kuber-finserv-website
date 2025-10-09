import React from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
function Navbar() {
  return (
    <div className={styles.mainDiv}>
      <Link href='/'>
        <img className={styles.logo} src='../main-logo.png' />
      </Link>
      <div className={styles.navLinks}>
        <Link href='/admin/login'>Admin</Link>
        <Link href='/employee/login'>Employee</Link>
      </div>
    </div>
  )
}

export default Navbar