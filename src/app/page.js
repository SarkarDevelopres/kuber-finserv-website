"use client"
import React, { useState } from 'react'
import Navbar from '@components/Navbar'
import styles from '@/styles/home.module.css'
function Home() {
  return (
    <div className={styles.mainDiv}>
      <Navbar />

    </div>
  )
}

export default Home