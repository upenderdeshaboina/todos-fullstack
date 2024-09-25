import {Component} from 'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoginForm from './components/loginForm/loginForm'
import Home from './components/Home/home'
import Register from './components/registerForm/register'
import './App.css'

class App extends Component{
  state={userDetails:{}}

  

  render(){
    const{userDetails}=this.state
    return (
      <div className='App'>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={Register} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
export default App