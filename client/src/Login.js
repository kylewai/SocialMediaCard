import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import TitleBar from './TitleBar';
import './App.css';

class Login extends Component{
  render(){
    return this.props.loggedIn? (<Redirect to = "/home" />) : (
      <div>
        <TitleBar />
        <form>
          <div style = {{margin: '10% 30% 0% 30%'}}>
            <div style = {{display: 'inline-block', border: '2px solid lightgrey', padding: '20px', width: '100%'}}>
              <input type = "text" value = {this.props.loginInfo['username']} name = "username"
                placeholder = "username" onChange = {this.props.updateLoginInfo} style = {{borderTop: 0,
                  borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>
              <br></br>
              <input type = "password" value = {this.props.loginInfo['password']} name = "password"
                placeholder = "password" onChange = {this.props.updateLoginInfo} style = {{borderTop: 0,
                  borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>
              <br></br>
              {this.props.errors.map((value, index) => {
                return <p key = {index} style = {{color: 'red'}}>{value}</p>
              })}
              <button onClick = {this.props.login} type = "submit" className = "btn btn-primary">Submit</button>
            </div>
            <br></br>
            <Link to = "/register" style = {{textDecoration: 'none', color: 'white'}}><button className = "btn btn-primary" style = {{marginTop: '10px', width: '100%'}}>
            Register</button></Link>
          </div>
        </form>
      </div>
    );
  }
}

function updateLoginInfo(event){
  const target = event.target;
  const name = target.name;
  var newLogin = this.state.loginInfo;
  newLogin[name] = target.value;
  this.setState({
    loginInfo: newLogin
  });
}

function login(event){
  event.preventDefault();
  if(this.state.loginInfo.username === "" || this.state.loginInfo.password === ""){
    var errors = this.state.loginErrors;
    var emptyInputError = "Username and password must be filled out";

    if(!errors.find(function(error){ return error === "Username and password must be filled out"})){
      errors.push(emptyInputError);
    }
    this.setState({
      loginErrors: errors
    });
    return;
  }
  fetch("/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: this.state.loginInfo.username,
        password: this.state.loginInfo.password
      })
  }).then((response) => {
    return response.json();
  }).then((body) => {
    if(body['loggedIn']){
      this.setState({
        loggedIn: true,
        events: body['data'],
        userInfo: body['userInfo']
      });
    }
  });
}

export default Login;
export {updateLoginInfo, login};
