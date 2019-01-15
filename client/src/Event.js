import React, {Component} from 'react';
import './App.css';

class Template extends Component{

  render(){

    return(

      <form>

        <div className="container-template">

          <textarea className="template-message" type="text" onChange={this.props.updateTemplateEvent}
            value={this.props.templateRow[this.props.fields[0]]} name={this.props.fields[0]}
            placeholder={this.props.fields[0]}
          />

          <textarea className="template-img" cols='50' rows='10' type="text" onChange={this.props.updateTemplateEvent}
            value={this.props.templateRow[this.props.fields[1]]} name={this.props.fields[1]}
            placeholder={this.props.fields[1]} >
          </textarea>

          <button className="button-create" onClick={this.props.createEvent} type="submit">
            <strong>Create Event!</strong>
          </button>

        </div>

      </form>
    );
  }
}

function updateTemplateEvent(event){
  const target = event.target;
  const name = target.name;
  var tempRow = this.state.templateRow;
  tempRow[name] = target.value;
  this.setState({
    templateRow: tempRow
  });
}

function createEvent(event){
  event.preventDefault();
  //Inserting new Event into mySQL
  fetch("/posted", {
    method: "POST",
    body: JSON.stringify({
      tag: this.state.userInfo['tag'],
      message: this.state.templateRow['msg'],
      content_img_url: this.state.templateRow['content_img_url'],
      content_url: this.state.templateRow['url']
    }),
    headers: {"Content-Type": "application/json"}
  }).then(
    (response) => {
      return response.json()
  }).then(
    (body) => {
      var newTemplateRow = this.state.templateRow;
      newTemplateRow['id'] = body['id'];
      this.setState({
        templateRow: newTemplateRow
      });
  });
  var newShowingRows = this.state.showingRows;
  while(newShowingRows.length != this.state.events.length + 2){
    newShowingRows.push(newShowingRows.length);
  }
  var newEvents = this.state.events;
  newEvents.push({
    id: this.state.templateRow['id'],
    profilePic: this.state.userInfo['profilePic'],
    name: this.state.userInfo['name'],
    tag: this.state.userInfo['tag'],
    author: this.state.userInfo['author'],
    msg: this.state.templateRow['msg'],
    content_img_url: this.state.templateRow['content_img_url'],
    url: this.state.templateRow['url']
  });
  this.setState({
    showingRows: newShowingRows,
    events: newEvents,
    templateRow: {
      msg: '',
      content_img_url: '',
      url: '',
      id: ''
    }
  });
}

function removeEvent(i){
  fetch("/delete", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id: this.state.events[i]['id']
    })
  });
  var newEvents = this.state.events;
  newEvents.splice(i, 1);
  var newShowingRows = this.state.showingRows;
  newShowingRows.splice(newShowingRows.length - 1);
  this.setState({
    events: newEvents,
    showingRows: newShowingRows
  })
}

function ProfilePic(props) {
  var src = props.url['profilePic'];
  return(
    <img className="img-profile" src={src} alt=""></img>
  );
}

function UserHeading(props) {
  var tag = "@";
  tag += props.tagPlus["tag"];
  var dateObj = new Date();
  var date = monthToString(dateObj.getMonth());
  date += " ";
  date += dateObj.getDate();
  var message = props.tagPlus["msg"];
  var author = props.tagPlus["author"];
  var name = props.tagPlus["name"];

  return(

    <div className="container-user-heading">

      <p className="header-name"><strong>{name}</strong></p>

      <p className="header-extra-info">{tag} {date}</p>

      <p className="header-message">{message}</p>

      <p className="header-author">
        {"{"}
        author: <a href="#">{author}</a>
        {"}"}
      </p>

    </div>
  );
}

function monthToString(numDate){
  var monthString = "";
  switch(numDate){
    case 0: monthString += "Jan";
      break;
    case 1: monthString += "Feb"
      break;
    case 2: monthString += "Mar"
      break;
    case 3: monthString += "Apr"
      break;
    case 4: monthString += "May"
      break;
    case 5: monthString += "Jun"
      break;
    case 6: monthString += "Jul"
      break;
    case 7: monthString += "Aug"
      break;
    case 8: monthString += "Sept"
      break;
    case 9: monthString += "Oct"
      break;
    case 10: monthString += "Nov"
      break;
    case 11: monthString += "Dec"
      break;
    default:
  }
  return monthString;
}

function Content(props){
  var content = props.content["content_img_url"];
  var url = props.content["url"];

  return(
      <a href={url}>
        <img className="img-content" src={content} alt="reactImage"></img>
      </a>
  );
}

function RemoveButton(props){
  return(
    <button class="button-remove" onClick={props.onClick}>
      <strong>Delete</strong>
    </button>
  );
}
export default Template;
export {updateTemplateEvent, createEvent, removeEvent, ProfilePic, UserHeading, Content, RemoveButton};
