import React, {Component} from 'react';
import Template, {ProfilePic, UserHeading, Content, RemoveButton} from './Event';
import TitleBar from './TitleBar';
import './App.css';

function ContentPage(props){
  return(
    <div>
      <TitleBar />
      <ul style = {{margin: '0px 0px 0px 10%', padding: '0px', display: 'table', listStyleType: 'none'}}>

        <ViewOptions showingLength = {props.showingRows.length} userLength = {props.events.length} loadLess = {props.loadLess} loadMore = {props.loadMore} />

        <MainFeed showingRows = {props.showingRows}
          fields = {props.fields} templateRow = {props.templateRow} updateTemplateEvent = {props.updateTemplateEvent}
          createEvent = {props.createEvent} userInfo = {props.userInfo} events = {props.events} removeEvent = {props.removeEvent} />

        <ViewOptions showingLength = {props.showingRows.length} userLength = {props.events.length} loadLess = {props.loadLess} loadMore = {props.loadMore} />

      </ul>
    </div>
  );
}

function ViewOptions(props){
  return(
    <li style = {{textAlign: 'left', padding: '20px 0px 20px 0px'}}>
      {(props.showingLength > 1) && <ViewLessButton onClick = {() => props.loadLess()}/> }
      {(props.showingLength - 1 < props.userLength) && <ViewMoreButton onClick = {() => props.loadMore()}/> }
    </li>
  );
}
function MainFeed(props){
    return (
        props.showingRows.map((i, index) => {
          return (
            (i == props.showingRows.length - 1)?
            (
              <li key = {i} style = {{width: '682px', border: '1px solid lightgrey', padding: '10px 20px 20px 10px', whiteSpace: 'nowrap', display: 'inline-block'}}>
                <Template fields = {props.fields} templateRow = {props.templateRow} updateTemplateEvent = {props.updateTemplateEvent.bind(this)} createEvent = {props.createEvent.bind(this)} />
              </li>
            ) :
            (
              <li key = {i} style = {{width: '682px', border: '1px solid lightgrey', padding: '10px 20px 20px 10px', whiteSpace: 'nowrap', display: 'inline-block'}}>
                <ProfilePic url = {props.userInfo}/>
                <UserHeading tagPlus = {props.userInfo} />
                <Content content = {props.events[i]}/>
                <RemoveButton onClick = {() => props.removeEvent(i)} />
              </li>
            )
          );
        })
  );
}

function loadMore(){
  var arrayLength = this.state.showingRows.length;
  var newRows = this.state.showingRows.slice(0, arrayLength);
  for(var i = 0; i < 3; i++){
    if(this.state.events.length <= arrayLength - 1){
      break;
    }
    newRows.push(arrayLength);
    arrayLength = newRows.length;
  }
  this.setState({
    showingRows: newRows
  });
}

function loadLess(){
  var newRows = this.state.showingRows;
  for(var i = 0; i < 3; i++){
    newRows.splice(newRows.length - 1, 1);
    if(newRows.length == 1){
      break;
    }
  }
  this.setState({
    showingRows: newRows
  });
}

function ViewMoreButton(props){
  return(
    <button style = {{backgroundColor: '#F8F8F8', border: '1px solid lightgrey', padding: '5px 5px 5px 5px', borderRadius: '3px', width: '150px', height: '50px', fontSize: '13px'}}
    onClick = {props.onClick}><strong>View More</strong></button>
  );
}

function ViewLessButton(props){
  return(
    <button style = {{backgroundColor: '#F8F8F8', border: '1px solid lightgrey', padding: '5px 5px 5px 5px', borderRadius: '3px', width: '150px', height: '50px', fontSize: '13px'}}
    onClick = {props.onClick}><strong>View Less</strong></button>
  );
}

export default ContentPage;
export {loadMore, loadLess};
