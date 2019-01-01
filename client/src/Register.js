import React, {Component} from 'react';
import {Link, BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import TitleBar from './TitleBar';
import './App.css';

class Register extends Component{
  render(){
    return this.props.registered? (<Redirect to = "/submit" />) : (
      <div>
        <TitleBar />
        <form>
          <div style = {{margin: '10% 20% 0% 30%'}}>
            <div style = {{display: 'inline-block', border: '2px solid lightgrey', padding: '20px', width: '100%'}}>
              <input type = "text" value = {this.props.newUserInfo[this.props.registerFields[0]]} name = "newUsername"
                placeholder = "username" onChange = {this.props.onChangeInputs} style = {{borderTop: 0,
                borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>

              {this.props.errors['uniqueErrors']['username'] &&
                <p style = {{color: 'red'}}>{this.props.errors['uniqueErrors']['username']}</p>}

              <br></br>
              <input type = "password" value = {this.props.newUserInfo[this.props.registerFields[1]]} name = "newPassword"
                placeholder = "password" onChange = {this.props.onChangeInputs} style = {{borderTop: 0,
                borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>

              {this.props.errors['uniqueErrors']['password'] &&
                <p style = {{color: 'red'}}>{this.props.errors['uniqueErrors']['password']}</p>}

              <br></br>
              <input type = "text" value = {this.props.newUserInfo[this.props.registerFields[2]]} name = "newTag"
                placeholder = "tag" onChange = {this.props.onChangeInputs} style = {{borderTop: 0,
                borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>

              {this.props.errors['uniqueErrors']['tag'] &&
                <p style = {{color: 'red'}}>{this.props.errors['uniqueErrors']['tag']}</p>}

              <br></br>
              <input type = "text" value = {this.props.newUserInfo[this.props.registerFields[3]]} name = "newName"
                placeholder = "name" onChange = {this.props.onChangeInputs} style = {{borderTop: 0,
                borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>

              {this.props.errors['uniqueErrors']['name'] &&
                <p style = {{color: 'red'}}>{this.props.errors['uniqueErrors']['name']}</p>}
              <br></br>
              <input type = "text" value = {this.props.newUserInfo[this.props.registerFields[4]]} name = "newProfilePic"
                placeholder = "profile picture URL" onChange = {this.props.onChangeInputs} style = {{borderTop: 0,
                borderLeft: 0, borderRight: 0, marginBottom: '15px'}}/>
              <br></br>
              {this.props.errors['inputErrors'].map((value, index) => {
                return <p key = {index} style = {{color: 'red'}}>{value}</p>
              })}
              <button onClick = {this.props.register} type = "submit" className = "btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function RegisterSuccess(props){
  return(
    <div>
      <TitleBar />
      <div style = {{margin: '10% 0% 0% 40%', display: 'inline-block', border: '2px solid grey', padding: '40px', backgroundColor: '#EEF1F1'}}>
        <p><strong>Successfully Registered!</strong></p>
        <br></br>
        <Link to = "/" style = {{textDecoration: 'none'}}>Sign in</Link>
      </div>
    </div>
  );
}

function onChangeRegisterInputs(event){
  var target = event.target;
  var name = target.name;
  var newUserInfo = this.state.newUserInfo;
  newUserInfo[name] = target.value;
  this.setState({
    newUserInfo: newUserInfo
  });
}

function register(event){
  event.preventDefault();
  var errors = this.state.registrationErrors;
  errors['inputErrors'] = [];
  if(this.state.newUserInfo.newUsername === "" || this.state.newUserInfo.newPassword === ""
    || this.state.newUserInfo.newTag === "" || this.state.newUserInfo.newName === ""
    || this.state.newUserInfo.newProfilePic === ""){

    var errors = this.state.registrationErrors;
    var emptyInputError = "All fields must be filled out";
    errors['inputErrors'] = [];
    errors['inputErrors'].push(emptyInputError);
    this.setState({
      registrationErrors: errors
    });
    return;
  }
  this.setState({
    registrationErrors: errors
  });

  fetch("/checkErr", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(this.state.newUserInfo)
  }).then((response) => {
    return response.json();
  }).then((body) => {
    var newRegistrationErr = this.state.registrationErrors;
    newRegistrationErr['uniqueErrors'] = body['uniqueErrors'];
    this.setState({
      registrationErrors: newRegistrationErr
    });
    console.log("hello");
    return newRegistrationErr['uniqueErrors'];
  }).then((err) => {
    // console.log(err);
    // if(Object.keys(err).length == 0){
      fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state.newUserInfo)
      }).then(
        this.setState({registered: true})
      );
    }
  });
}

export default Register;
export {RegisterSuccess, onChangeRegisterInputs, register};
