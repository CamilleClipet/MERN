# Microblogging

The goal of this project was to learn the MERN stack by making a Twitter-like microblogging web app.

## Functionalities

Users can register, login, edit and delete their account. They can post short messages with hashtags that get converted into links allowing to search other related messages.
They can follow and unfollow other users. Once a user follows someone, he will see on his feed his own messages and the ones of the people he follows (ordered by most recent)

## Database

The database (MongoDB) is composed of a table users and a table messages. The info of who follows and is followed by a user lives in the user table even though a joins table with follower_id and followed_id would surely be better. A joins table for article_id and hashtags could have been created too.

## REST API

The server side is a RESTful API.


## Built With

* [React](https://reactjs.org/) 
* [MongoDB](https://www.mongodb.com/fr) 
* [NodeJS](https://nodejs.org/en/)

