const User = require('../../schema/schemaUser.js');
const Message = require('../../schema/schemaMessage.js');
const passwordHash = require("password-hash");
const config = require('../../config/config');
const jwt = require('jwt-simple');
const jwt2 = require('jsonwebtoken');

//signup
function signup(req, res) {
  if (!req.body.email || !req.body.password || !req.body.repeat_password || !req.body.username) {
    res.status(400).json({
      "text": "Please fill all fields"
    })
  } else if (req.body.password !== req.body.repeat_password) {
    res.status(400).json({
      "text": "Password and password confirmation different"
    })
  } else {
    var user = {
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      username: req.body.username,
      followed: [],
      followers: [],
      blockedUsers: []
    }
    console.log(user);
    var findUser = new Promise(function (resolve, reject) {
      User.findOne({
        email: user.email
      }, function (err, result) {
        if (err) {
          console.log("err");
          reject(500);
        } else {
          if (result) {
            console.log("204");
            reject(204)
          } else {
            console.log("true");
            resolve(true)
          }
        }
      })
    })
    //save user
    findUser.then(function () {
      var _u = new User(user);
      _u.save(function (err, user) {
        if (err) {
          res.status(500).json({
            "text": "Internal Error"
          })
        } else {
          res.status(200).json({
            "text": "User successfully added",
          })
        }
      })
    }, function (error) {
      switch (error) {
        case 500:
        res.status(500).json({
          "text": "Internal Error"
        })
        break;
        case 204:
        res.status(500).json({
          "text": "Email adress already taken"
        })
        break;
        default:
        console.log(err);
        res.status(500).json({
          "text": "Internal Error"
        })
      }
    })
  }
}


//login
function login(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      "text": "Please fill all fields"
    })
  } else {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) {
        res.status(500).json({
          "text": "Internal Error"
        })
      } else if (!user) {
        res.status(401).json({
          "text": "User doesn't exist"
        })
      } else {
        if (user.authenticate(req.body.password)) {
          console.log("user logged in");
          //set token
          let token = user.getToken2();
          res.json({
            "status": 200,
            "text": "Login successful",
            "token": token
          })
          //res.send(token)
        } else {
          res.status(401).json({
            "text": "Incorrect password"
          })
        }
      }
    })
  }
}


//see all users except current
function seeAll(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  User.find({_id: {$ne: decoded._id}}, function(err, users) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(users);
  });
}


//see curent user
function seeMe(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  User.find({_id:decoded._id }, function(err, users) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(users);
  });
}


//delete current user
function deleteCurrent(req, res, next) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  User.findOne({
    _id: decoded._id
  })
  .then(user => {
    User.find({
      followers: decoded.username
    })
    if(user) {
      if (user.followed !== []) {

        var suivi = user.username;
        return suivi;
      }}
    })
    //delete from other users "followers" array
    .then(suivi => {
      User.update( {}, { $pull: {followers: { $in: [decoded.username] } } },{ multi: true }, function(err, users) {
        if (err) {
          res.status(400);
          return;
        }
        return next();
        })
      }
    )
    .then(user => {
      User.find({
        followed: decoded.username
      })
      if(user) {
        var suiveur = user.username;
      }}
    )
    //delete from other users "followed" array
    .then(suiveur => {
        User.update( {}, { $pull: {followed: { $in: [decoded.username] } } },{ multi: true }, function(err, users) {
          if (err) {
            res.status(400);
            return;
          }
          return next();
        })
    })
    //delete messages of the user
    Message.remove({author_id: decoded._id}, function(err, messages) {
      if (err) {
        res.status(400);
        return;
      }
      return next();
    })
    //delete the current user
    User.remove({_id:decoded._id }, function(err, users) {
      if (err) {
        res.status(400);
        return;
      }
      res.status(200).json({
        "text": "User successfully deleted",
      })
    })
}


//see user defined by the parameter
function seeOne(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    res.send(user);
  });
}


//get current user
function getUser(req,res) {
  console.log(req.headers['authorization']);
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  console.log(decoded);
  User.findOne({
    _id: decoded._id
  })
  .then(user => {
    if(user) {
      res.json(user)
    } else {
      res.send("user doesnt exist")
    }
  })
  .catch(err => {
    res.send('error: ' + err)
  })
}


//update current user
function updateUser(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  var followers = decoded.followers;
  var followed = decoded.followed;
  var name = decoded.username;

  //update people followed by the user (the user is in their followers array)
  User.update({followers: name},{$set: {
    "followers.$": req.body.username}}, { multi: true}, function(err, result) {
      if (err) {
        res.status(400);
        res.send(err);
        return;
      }
    })

    //update people that follow the current user (the user is in their followed array)
    User.update({followed: name},{$set: {
    "followed.$": req.body.username}}, { multi: true}, function(err, result) {
      if (err) {
        res.status(400);
        res.send(err);
        return;
      }
    })

  //update messages written by user
    Message.update( {author_id: decoded._id}, {username: req.body.username} ,{ multi: true}, function(err, result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    })

  //finally, update current user
  User.findByIdAndUpdate(decoded._id,{$set:req.body}, {new: true}, function(err, result){
    if(err){
      res.status(400);
      res.send(err);
      return;
    } else {
    //update token
      let token = result.getToken2();
      res.json({
        "status": 200,
        "text": "User and token updated successfully",
        "token": token
      })
    }
  })
}


//follow user defined by the parameter
function follow(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  //update "followed" array of the current user
  User.findByIdAndUpdate(decoded._id, {$push: {"followed": req.params.username}}, {new: true} , function( err, result) {
    //{$push: {"followed": req.params.username}}
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    //res.send({ "text": "Account successfully followed", result });
    console.log("Account successfully followed");
  });
  //update "followers" array of newlyollowed user
  User.findOneAndUpdate({username: req.params.username}, {$push: {"followers": decoded.username}}, {new: true}, function(err,result) {
    //{$push: {"followers": decoded.username}}
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    //res.send({ "text": " New follower", result });
    console.log("New follower");
  });
  res.send({ "text": "Account successfully followed"});
}


//unfollow user defined by the parameter
function unfollow(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  //update "followed" array of the current user
  User.findByIdAndUpdate(decoded._id, {$pull: {"followed": req.params.username}}, {new: true} , function(err,result) {
    if (err) {
      res.status(400);
      res.send(err);
      return;
    }
    //res.send({ "text": "Account successfully unfollowed", result });
    console.log("Account successfully unfollowed");
  }).then(function(){
    //update "followers" array of the previously followed user
    User.findOneAndUpdate({username: req.params.username}, {$pull: {"followers": decoded.username}}, {new: true}, function(err,result) {
      if (err) {
        res.status(400);
        res.send(err);
        return;
      }
      //res.send({ "text": "A follower unsuscribed", result });
      console.log("A follower unsuscribed");
    })
  })
  res.send({ "text": "Account successfully unfollowed"});
}


//export functions
exports.login = login;
exports.signup = signup;
exports.seeAll = seeAll;
exports.seeOne = seeOne;
exports.seeMe = seeMe;
exports.deleteCurrent = deleteCurrent;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.follow = follow;
exports.unfollow = unfollow;
