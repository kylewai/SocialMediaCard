import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import TitleBar from './TitleBar';
import './App.css';

class Login extends Component{
  render(){

    return this.props.loggedIn? (<Redirect to="/home" />) : (

      <div>

        <TitleBar />

        <form>

          <div className="login-register-container">

            <div className="login-container">

              <input className="login-input" type="text" value={this.props.loginInfo['username']} name="username"
                placeholder="username" onChange={this.props.updateLoginInfo} />

              <br></br>

              <input className="login-input" type="password" value={this.props.loginInfo['password']} name="password"
                placeholder="password" onChange={this.props.updateLoginInfo} />

              <br></br>

              {this.props.errors.map((value, index) => {
                return <p className="error" key={index}>{value}</p>
              })}

              <button className="btn btn-primary" onClick={this.props.login} type="submit">Submit</button>

            </div>

            <br></br>

            <Link className="link-register" to="/register">
              <button className="btn btn-primary button-register">Register</button>
            </Link>

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

function Loading(props){
  return (props.loggedIn)? (<Redirect to="/home" />) : (
    <div>
      <TitleBar />
      <div className="loader" style={{margin: '8% 0% 0% 20%'}}></div>
    </div>
  );
}

export default Login;
export {updateLoginInfo, login, Loading};
