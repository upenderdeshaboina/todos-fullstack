
import { Component } from "react";
import Cookies from 'js-cookie'
import './navbar.css'
import Popup from 'reactjs-popup'
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

class NavBar extends Component{
    state={userDetails:{},name:'',email:'',password:''}

    componentDidMount(){
        this.getData()
    }

    getData=async()=>{
        const token= Cookies.get('jwtToken')
        const url=`https://todos-backend-6.onrender.com/user-details`
        const options={
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'authorization': `Bearer ${token}`
            }
        }

        const response=await fetch(url,options)
        const data=await response.json()
        if(response.ok){
            this.setState({userDetails:data})
        }else{
            alert(data.msg)
            this.onClickLogout()
        }
    }

    handleSubmit=async(e)=>{
        e.preventDefault()
        const {name,email,password}=this.state
        const userData={name,email,password}
        const token=Cookies.get('jwtToken');
        const response=await fetch('https://todos-backend-6.onrender.com/update-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (response.ok) {
            this.setState({ name:data.name,email:data.email,password:data.password },this.getData);
            alert('User updated successfully')
        }else{
            alert(data.msg)
        }
    }

    

    onClickLogout=()=>{
        Cookies.remove('jwtToken')
        const {history}=this.props
        return history.push('/login')
    }

    onChangeName=event=>{
        this.setState({name:event.target.value})
    }

    onChangeEmail=event=>{
        this.setState({email:event.target.value})
    }

    onChangePassword=event=>{
        this.setState({password:event.target.value})
    }

    render(){
        const {userDetails,name,email,password}=this.state
        return (
            <nav className="nav">
                <h1 className="nav-heading">{userDetails.name}</h1>
                <button className="logout-btn" type="button" onClick={this.onClickLogout}>Logout</button>
                <Popup trigger={<button className="update-btn">Update User</button>} modal closeOnDocumentClick>
                    {close => (
                        <div className="modal">
                            <h2>Update User</h2>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={this.onChangeName}
                                        required
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={this.onChangeEmail}
                                        required
                                    />
                                </label>
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={this.onChangePassword}
                                        required
                                    />
                                </label>
                                <button type="submit">Update</button>
                            </form>
                        </div>
                    )}
                </Popup>
            </nav>
        )
    }
}
export default withRouter(NavBar)