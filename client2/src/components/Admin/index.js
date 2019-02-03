import React, {Component} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { Button, ButtonToolbar, Col, ControlLabel,FormGroup, FormControl, Table, Modal, Well } from 'react-bootstrap';
//import * as jwt_decode from 'jwt_decode';

class Admin extends Component{
	constructor (props) {
		super(props);
		this.state = {
			users: [],
			currentUser: [],
			userFormModal: false,
		};
		//
		// const token = localStorage.getItem('token');
		// if(token) {
		// 	 const token = localStorage.getItem('token');
		// 	 const decoded = jwt_decode(token);
		// 	 this.setState({ username: decoded.username });
		//  }
	}

	follow(user) {
		//console.log('this.state', this.state);
			fetch("http://127.0.0.1:8000/user/follow/"+user, {
				method: "PUT",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token')
				}
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data.text);
				console.log("user successfully followed");
				swal('Success!', 'Followed!', 'success').then(function(){
					window.location = "";
				});
			});

	}

	unfollow(user) {
		//console.log('this.state', this.state);
			fetch("http://127.0.0.1:8000/user/unfollow/"+user, {
				method: "PUT",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token')
				}
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data.text);
				console.log("user successfully unfollowed");
				swal('Success!', 'Unfollowed!', 'success').then(function(){
					window.location = "";
				});
			});
			window.location = "";
	}

	delete() {
			fetch("http://127.0.0.1:8000/user/delete", {
				method: "PUT",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token')
				}
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data.text);
				console.log("user successfully deleted");
				swal('Success!', 'Deleted!', 'success');
				window.location = "/signin";
			});
	}

	getUsers() {
		axios.get('http://127.0.0.1:8000/user/users', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(res => {
			//console.log(res);
			//return res.data;
			this.setState({users:res.data});
		});
		return "done";
	}

	getCurrent() {
		axios.get('http://127.0.0.1:8000/user/me', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(res => {
			//console.log(res);
			//return res.data;
			this.setState({currentUser:res.data});
		});
		return "done";
	}

	edit() {
			//console.log('this.state', this.state);
		var data = {
			"username": this.state.username,
			"email": this.state.email,
		}
		if (data.editedcontent !== '' ) {
			fetch("http://127.0.0.1:8000/user/edit", {
				method: "PUT",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token'),
				},
				body:  JSON.stringify(data)
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data);
				console.log("User successfully edited");
				swal('Success!', 'User successfully edited', 'success').then(function(){
					window.location = "/admin";
				});
			});
		} else {
			console.log("content field empty");
			swal('Oops!', 'Seems like the content of your post is empty!', 'error');
		}
	}


	componentDidMount() {
		this.getUsers();
		this.getCurrent();
	}

	render(){
		var users = this.state.users;
		var current = this.state.currentUser;
		console.log("state: ", this.state);

		return (
			<div className = "container">
			<h2>My profile</h2>
			{
				current.map((user) => {
					return(
						<div>
							<Well>
								<b>{user.username} </b><br/>
								{user.email}<br/>
								Tweets: <br/>
								Followers:
								<ButtonToolbar>
								<button
								className='btn pull-right btn-danger'
								type='button'
								onClick={() => this.delete()}>
								Delete
								</button>
								<button
								className='btn btn-primary pull-right'
								type='button'
								onClick={() => this.setState({ userFormModal: true })}>
								Edit
								</button>
								</ButtonToolbar>

							</Well>
						</div>
					)
				})
			}
			<h2>All Users</h2>
			{
				users.map((user) => {
					var current = this.state.currentUser;
					//console.log("current: ", current.length);
					if (current.length !== 0) {
						var arr = current[0].followed;
						var userDisplayed = user.username.toString();
						console.log("arr ", arr);
						console.log("username ",user.username);
						console.log(arr.includes(userDisplayed));
						var result = true;

						return(
							<div>
								<Well>
									<b>{user.username} </b><br/>
									{user.email}<br/>
									Tweets: <br/>
									Followers:
									<button
									className='btn pull-right'
									type='button'
									onClick={() => this.unfollow(user.username)}
									style={{
											 display: arr.includes(userDisplayed) ? "" : "none"
									 }}>

									Unfollow
									</button>
									<button
									className='btn btn-primary pull-right'
									type='button'
									onClick={() => this.follow(user.username)}
									style={{
											 display: arr.includes(userDisplayed) ? "none" : ""
									 }}>

									Follow
									</button>
								</Well>
							</div>
						)
					}
				})
			}

			{
			current.map((user) => {
				var current = this.state.currentUser;
				//console.log("current: ", current[0]);
				return(
					<div>
						<Modal show={this.state.userFormModal}>
							<br />
							<Modal.Body>
							<h2> Edit my profile </h2>
								<div className='form-group'>
									Username
									<input
									className='form-control'
									type='text'
									placeholder= {user.username}
									onChange={event => this.setState({username:event.target.value})}/>

									Email
									<input
									type='text'
									className='form-control'
									placeholder= {user.email}
									onChange={event => this.setState({email:event.target.value})}/>

									Password
									<input
									type='password'
									className='form-control'
									placeholder= "password"
									onChange={event => this.setState({password:event.target.value})}/>
									<br/>
									<button
										className='btn btn-primary pull-right'
										type='button'
										onClick={() => this.edit()}>
										Post
									</button>
									<br/>

								</div>
								</Modal.Body>
								<Modal.Footer>
								<Button
								id="closeform"
								onClick={() => this.setState({ userFormModal: false })}
								>
								Close
								</Button>
								</Modal.Footer>
						</Modal>
						</div>
						)
					})
				}

			</div>
			)
	}

}

export default Admin;
