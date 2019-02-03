const Message = require('../../schema/schemaMessage.js');
const User = require('../../schema/schemaUser.js');
const config = require('../../config/config');
const jwt2 = require('jsonwebtoken');
var myHashtags = require('./hashtag.js');
var getHashTags = myHashtags.getHashTags;
var linkHashtag = myHashtags.linkHashtag;


//create a message
function createMessage(req, res) {
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  console.log(decoded);
  hashtag = getHashTags(req.body.content);
  newcontent = linkHashtag(req.body.content);
  var message = new Message({
    //content: newcontent,
    content: req.body.content,
    author_id: decoded._id,
    username: decoded.username,
    hashtag: hashtag
  });

 message.save(function(err) {
   if (err) {
     res.status(400);
     res.send(err);
     return;
   }
   res.send({ "text": "Message Created successfully!", message });
 });
};


//see all messages from the current user
function seeAll(req, res) {
  console.log(req.headers['authorization']);
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  //console.log(decoded);
    Message.find({ author_id: decoded._id}, null, {sort: '-created_at'}, function (err, message) {
       if (err) {
         res.status(400);
         res.send(err);
         return;
       }
       res.send(message);
     });
};


// see feed of the current user (himself + the people he follows)
function seeFeed(req, res) {
  //console.log(req.headers['authorization']);
  var decoded = jwt2.verify(req.headers['authorization'], config.secret);
  User.findOne({
      _id: decoded._id
  })
  .then(user => {
      if(user) {
          if (user.followed !== []) {
            var followed = user.followed;
            //console.log(followed);
            //console.log(user.username);
            followed.push(user.username);
            //console.log(followed);
            return followed;
          } else {
            var followed = [user.username];
            return followed;
          }
      } else {
          res.send("user doesnt exist")
      }
  }).then (followed => {
    console.log("followed ", followed);
    Message.find({ username: { $in: followed }}, null, {sort: '-created_at'}, function (err, message) {
       if (err) {
         res.status(400);
         res.send(err);
         return;
       }
       res.send(message);
     });
  })
  .catch(err => {
      res.send('error: ' + err)
  })
};


//see messages from the user identified in the parameters
function seeOne(req, res) {
 Message.findOne({ author_id: req.params.id}, function(err, message) {
   if (err) {
     res.status(400);
     res.send(err);
     return;
   }
   res.send(message);
 });
};

//duplicate
function seeAllAuthor(req, res) {
  Message.find({ author_id: req.params.id}, function (err, message) {
     if (err) {
       res.status(400);
       res.send(err);
       return;
     }
     res.send(message);
   });
 };


//see all messages thst contain the hashtag identified in the parameters
function seeByHashtag(req, res) {
  Message.find({ hashtag: req.params.hashtag}, function (err, message) {
     if (err) {
       res.status(400);
       res.send(err);
       return;
     }
     res.send(message);
   });
 };


//edit a message
function editMessage(req, res) {
//console.log(req.body.content);
 Message.findByIdAndUpdate(req.params.id, { $set: { content: req.body.content,  hashtag: getHashTags(req.body.content)}}, {new: true} , function(
   err,
   result
 ) {
   if (err) {
     res.status(400);
     res.send(err);
     return;
   }
   res.send({ "text": "Message Udpated successfully!", result });
 });
};


//delete a message
function deleteMessage(req, res)  {
 Message.findByIdAndRemove(req.params.id, function(err, result) {
   if (err) {
     res.status(400);
     res.send(err);
     return;
   }
   res.send({ "text": "Message Deleted successfully!", result });
 });
};



//export functions
exports.createMessage = createMessage;
exports.seeAll = seeAll;
exports.seeOne = seeOne;
exports.editMessage = editMessage;
exports.deleteMessage = deleteMessage;
exports.seeAllAuthor = seeAllAuthor;
exports.seeFeed = seeFeed;
exports.seeByHashtag = seeByHashtag;
