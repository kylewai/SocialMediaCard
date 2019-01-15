import React, {Component} from 'react';
import Template, {ProfilePic, UserHeading, Content, RemoveButton} from './Event';
import TitleBar from './TitleBar';
import './App.css';

function ContentPage(props){

  return(

    <div>

      <TitleBar />

      <ul className="feed-list">

        <ViewOptions showingLength={props.showingRows.length} userLength={props.events.length}
          loadLess={props.loadLess} loadMore={props.loadMore} />

        <MainFeed showingRows={props.showingRows}
          fields={props.fields} templateRow={props.templateRow} updateTemplateEvent={props.updateTemplateEvent}
          createEvent={props.createEvent} userInfo={props.userInfo} events={props.events} removeEvent={props.removeEvent} />

        <ViewOptions showingLength={props.showingRows.length} userLength={props.events.length}
          loadLess={props.loadLess} loadMore={props.loadMore} />

      </ul>

    </div>
  );
}

function ViewOptions(props){
  return(
    <li className="view-container">
      {(props.showingLength > 1) && <ViewLessButton onClick={() => props.loadLess()}/> }
      {(props.showingLength - 1 < props.userLength) && <ViewMoreButton onClick={() => props.loadMore()} /> }
    </li>
  );
}

function MainFeed(props){

    return(

        props.showingRows.map((i, index) => {
          return (
            (i == props.showingRows.length - 1)?
            (
              <li className="template-container" key={i}>

                <Template fields={props.fields} templateRow={props.templateRow}

                  updateTemplateEvent={props.updateTemplateEvent.bind(this)} createEvent={props.createEvent.bind(this)} />

              </li>
            ) :
            (
              <li className="event-container" key = {i}>

                <ProfilePic url={props.userInfo}/>

                <UserHeading tagPlus={props.userInfo} />

                <Content content={props.events[i]}/>

                <RemoveButton onClick={() => props.removeEvent(i)} />

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
    <button className="button-view-option" onClick = {props.onClick}>
      <strong>View More</strong>
    </button>
  );
}

function ViewLessButton(props){
  return(
    <button className="button-view-option" onClick={props.onClick}>
      <strong>View Less</strong>
    </button>
  );
}

export default ContentPage;
export {loadMore, loadLess};
