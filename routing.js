const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const path = require('path');
var app = express();
//
// var options = {
//   secretOrKey: 'newAppfss',
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// }

// passport.use(new JwtStrategy(options, function(payload, done) {
//   var username = payload.username;
//   var password = payload.password;
//   var queryString = "SELECT * FROM users WHERE username = ? AND password = ?";
//   pool.query(queryString, [username, password], (err, userRows) =>{
//     if(err){
//       return;
//     }
//   });
// }));

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'b2c93935589f6a',
  password: 'ebeb887c',
  database: 'heroku_98e5473112c5796'
});

// function getConnection(){
//   return pool;
// }

app.post('/posted', (req, res) => {
  var tag = req.body.tag;
  var message = req.body.message;
  var content_img_url = req.body.content_img_url;
  var queryString = "INSERT INTO events (tag, message, content_image) VALUES (?, ?, ?)"
  pool.query(queryString, [tag, message, content_img_url], (err, rows) => {
    if(err){
      console.log("Failed to insert new event:" + err);
      return;
    }
  });
  res.end();
});

app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var queryString = "SELECT * FROM users WHERE username = ? AND password = ?";
  pool.query(queryString, [username, password], (err, userRows) =>{
    if(err){
      console.log("Failed to log in:" + err);
      return;
    }
    if(userRows.length > 0){
      var queryString = "SELECT events.id, message, content_image FROM events, users WHERE username = ? AND users.tag = events.tag";
      pool.query(queryString, [username], (err, rows) => {
        if(err){
          console.log("Failed to get user events: " + err);
          return;
        }
        else{
          var data = [];
          var userInfo = {
            tag: userRows[0]['tag'],
            author: userRows[0]['author'],
            name: userRows[0]['name'],
            profilePic: userRows[0]['profile_pic']
          };
          for(i = 0; i < rows.length; i++){
            var currRow = rows[i];
            data.push({
              id: currRow['id'],
              msg: currRow['message'],
              author: currRow['author'],
              content_img_url: currRow['content_image'],
              url: ''
            });
          }
          res.json({loggedIn: true, userInfo: userInfo, data: data});
        }
      });
    }
    else{
      res.json({loggedIn: false});
    }
  });
});


app.post('/checkErr', (req, res) => {
  var newUsername = req.body.newUsername;
  var newPassword = req.body.newPassword;
  var newTag = req.body.newTag;
  var newName = req.body.newName;
  var newProfilePic = req.body.newProfilePic;
  var checkUnique1 = "SELECT * FROM users WHERE username = ?";
  var checkUnique2 = "SELECT * FROM users WHERE password = ?";
  var checkUnique3 = "SELECT * FROM users WHERE tag = ?";
  var checkUnique4 = "SELECT * FROM users WHERE name = ?";
  var errors = {};

  pool.query(checkUnique1, [newUsername], (checkErr, checkRows) => {
    if(checkErr){
      console.log("Failed to check uniqueness of new user: " + err);
      return;
    }
    if(checkRows.length > 0){
      errors["username"] = "That username is already taken";
    }


    pool.query(checkUnique2, [newPassword], (checkErr, checkRows2) => {
      if(checkErr){
        console.log("Failed to check uniqueness of new user: " + err);
        return;
      }
      if(checkRows2.length > 0){
        errors["password"] = "That password is already taken";
      }


      pool.query(checkUnique3, [newTag], (checkErr, checkRows3) => {
        if(checkErr){
          console.log("Failed to check uniqueness of new user: " + err);
          return;
        }
        if(checkRows3.length > 0){
          errors["tag"] = "That tag is already taken";
        }

        pool.query(checkUnique4, [newName], (checkErr, checkRows4) => {
          if(checkErr){
            console.log("Failed to check uniqueness of new user: " + err);
            return;
          }
          if(checkRows4.length > 0){
            errors["name"] = "That name is already taken";
          }
          console.log(errors);
          res.json({uniqueErrors: errors});
          res.end();
        });
      });
    });
  });
});

app.post('/register', (req, res) => {
  var newUsername = req.body.newUsername;
  var newPassword = req.body.newPassword;
  var newTag = req.body.newTag;
  var newName = req.body.newName;
  var newProfilePic = req.body.newProfilePic
  var queryString = "INSERT INTO users(username, password, tag, name, profile_pic) VALUES(?, ?, ?, ?, ?)";
  pool.query(queryString, [newUsername, newPassword, newTag, newName, newProfilePic], (err, rows) => {
    if(err){
      console.log("Failed to insert new user: Error: " + err);
      return;
    }
  });
});

app.post('/delete', (req, res) => {
  var id = req.body.id;
  var queryString = "DELETE FROM events WHERE id = ?"
  pool.query(queryString, [id], (err, rows) => {
    if(err){
      console.log("Failed to delete: " + err);
    }
  });
});

app.listen(process.env.PORT || 3001);
