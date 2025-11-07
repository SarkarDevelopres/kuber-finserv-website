"use client"
import React, { useState } from 'react'

function UnreadMessages({ username, phone, email, time, messageBody }) {
    const [isReply, setIsReply] = useState(false);
    const [msgTime, msgDate] = time.split('-');
    return (
        <div style={{ width: "100%", marginBottom: 15, padding: 10, borderRadius: 10, border: "none", backgroundColor: "#129b00b9", color: "#ffffffff", transition: "all 300ms ease-in-out" }}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                }}
            >
                <div
                    style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div>
                        <span style={{ paddingRight: 15 }}>{username}</span>
                        <span>{phone}</span>
                    </div>
                    <span>{email}</span>
                </div>
                <div
                    style={{
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end"
                    }}
                >
                    <span>{msgTime}</span>
                    <span>{msgDate}</span>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    paddingTop: 20,
                    paddingBottom: 20
                }}
            >
                <p>{messageBody}</p>
            </div>
            {!isReply && <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                <button
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        border: "none",
                        width: 100,
                        backgroundColor: "#5900ffff",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#31008dff";
                        e.target.style.cursor = "pointer"
                    }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = "#5900ffff" }}
                    onClick={() => { setIsReply(true) }}
                >
                    Reply
                </button>
            </div>}

            {
                isReply && <div style={{ width: "100%", paddingTop: 20 }}>
                    <textarea style={{ width: "100%", borderRadius: 10, border: "none", backgroundColor: "#fff", resize: "none", rowCount: 12, color: "#000", padding: 5, height: 100 }} />
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "end",
                            paddingTop: 10
                        }}
                    >
                        <button
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                border: "none",
                                width: 100,
                                backgroundColor: "#0033ffff",
                                marginRight: 10
                            }}
                            onClick={() => { setIsReply(false) }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#31008dff";
                                e.target.style.cursor = "pointer"
                            }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = "#0033ffff" }}
                        >
                            Hide
                        </button>
                        <button
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                border: "none",
                                width: 100, backgroundColor: "#5900ffff"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#31008dff";
                                e.target.style.cursor = "pointer"
                            }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = "#5900ffff" }}
                        >
                            Reply
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default UnreadMessages