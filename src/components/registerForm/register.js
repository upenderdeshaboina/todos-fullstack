import { useState } from 'react'
import Cookies from 'js-cookie'
import './register.css'
import { Redirect,Link } from 'react-router-dom/cjs/react-router-dom.min'

const Register=()=>{
    const [email,setEmail]=useState('')
    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [isShow,setIsShow]=useState(false)

    const onChangeName=event=>{setName(event.target.value)}
    const onChangeEmail=event=>{setEmail(event.target.value)}
    const onChangePassword=event=>{setPassword(event.target.value)}


    const submitForm=async event=>{
        event.preventDefault()
        const data={name,email,password}
        const url=`https://todos-backend-6.onrender.com/add-user`
        const options={
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data)
        }

        const response=await fetch(url,options)
        if(response.ok){
            alert('User created successfully')
            const data=await response.json()
            Cookies.set('token',data.token)
        }else{
            const data=await response.json()
            alert(data.msg)
        }
    }

    const token=Cookies.get('jwtToken')
    if(token){
        return <Redirect to='/'/>
    }

    const onChangeType=()=>{
        setIsShow(prev=>!prev)
    }

    return(
        <div className="login-container">
            <h1>USER REGISTRATION</h1>
        <form onSubmit={submitForm} className="form">
            <div className="input-container">
                <label htmlFor="name" className="label">ENTER YOUR NAME</label>
                <input id='name' type='text' onChange={onChangeName} value={name} placeholder="Enter your name" className="input"/></div>
            <div className="input-container">
            <label htmlFor="name" className="label">ENTER YOUR EMAIL</label>
                <input type="email" onChange={onChangeEmail} value={email} placeholder="Enter your Email" className="input"/></div>
            <div className="input-container">
            <label htmlFor="name" className="label">ENTER YOUR PASSWORD</label>
                <input type={isShow?'text':'password'} onChange={onChangePassword} value={password} placeholder="Enter your password" className="input"/></div>
            
            <div className="checkbox-container">
                <div className="checkbox">
                    <input type="checkbox" id="forgot"  onChange={onChangeType}/>
                    <label htmlFor="forgot">show Password</label>
                </div>
                <div className="register">
                    <Link to='/login' className='link'>LOGIN</Link>
                </div>
            </div>
            <button type="submit" className="button">Register</button>
        </form></div>
    )
}
export default Register