import React, { Component } from 'react';
import {Link, BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Register, {RegisterSuccess, onChangeRegisterInputs, register} from './Register';
import Login, {updateLoginInfo, login} from './Login';
import {updateTemplateEvent, createEvent, removeEvent} from './Event';
import ContentPage, {loadMore, loadLess} from './Feed';

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showingRows: [0],
      events: [],
      userInfo: {
        tag: '',
        author: '',
        name: '',
        profilePic: ''
      },
      templateRow: {
        msg: '',
        content_img_url: '',
        url: '',
        id: ''
      },
      loggedIn: false,
      loginInfo: {
        username: '',
        password: ''
      },
      registered: false,
      newUserInfo: {
        newUsername: '',
        newPassword: '',
        newTag: '',
        newName: '',
        newProfilePic: ''
      },
      loginErrors: [],
      registrationErrors: {
        inputErrors: [],
        uniqueErrors: {}
      }
    }
    this.createEvent = createEvent.bind(this);
    this.login = login.bind(this);
    this.updateLoginInfo = updateLoginInfo.bind(this);
    this.loadMore = loadMore.bind(this);
    this.loadLess = loadLess.bind(this);
    this.onChangeRegisterInputs = onChangeRegisterInputs.bind(this);
    this.register = register.bind(this);
    this.updateTemplateEvent = updateTemplateEvent.bind(this);
    this.removeEvent = removeEvent.bind(this);
  }

  render() {
    var fields = ["msg", "content_img_url", "url"];
    var registerFields = ["newUsername", "newPassword", "newTag", "newName", "newProfilePic"]
    return (
      <Router>
        <div>
        <Route path = "/home" render = {(props) => (this.state.loggedIn)?
          (<ContentPage {...props} showingRows = {this.state.showingRows} userInfo = {this.state.userInfo}
            events = {this.state.events} loadLess = {this.loadLess} loadMore = {this.loadMore}
            fields = {fields} templateRow = {this.state.templateRow} updateTemplateEvent = {this.updateTemplateEvent}
            createEvent = {this.createEvent} removeEvent = {this.removeEvent} />
          ) : (<Redirect to = "/" />)}
        />
        <Route exact path = "/" render = {(props) => (<Login {...props} loginInfo = {this.state.loginInfo}
          login = {this.login.bind(this)} loggedIn = {this.state.loggedIn}
          updateLoginInfo = {this.updateLoginInfo} errors = {this.state.loginErrors}/>
        )}
        />
        <Route path = "/register" render = {(props) => (<Register {...props} register = {this.register}
          onChangeInputs = {this.onChangeRegisterInputs} newUserInfo = {this.state.newUserInfo}
          registerFields = {registerFields} errors = {this.state.registrationErrors} registered = {this.state.registered}/>)}/>

        <Route path = "/submit" render = {(props) => (<RegisterSuccess {...props} />)} />
        </div>
      </Router>
    );
  }
}


export default App;
