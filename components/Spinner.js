import React from 'react'
import { Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
function SpinnerComp() {
  return (
    <div style={{
        height:"100vh",
        width:"100vw",
        position:"absolute",
        top:"0px",
        left:"0px",
        zIndex:10,
        backgroundColor:"rgba(0,0,0,0.3)",
        display: 'flex',
        alignItems:'center',
        justifyContent:'center'
    }}>
        <Spinner style={{ display: "block", width: "100px", height:"100px", color:"#ffae00", zIndex: 12, borderWidth: "1rem", borderRadius:"50px" }}/>
    </div>
  )
}

export default SpinnerComp