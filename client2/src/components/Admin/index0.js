import React, {Component} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { Button, Col, ControlLabel,FormGroup, FormControl, Table, Modal, Well, ButtonToolbar } from 'react-bootstrap';
import jwt_decode from 'jwt_decode';

class Admin extends Component{
	constructor (props) {
		super(props);
		this.state = {
			users: [],
		};
		const token = localStorage.getItem('token');
		if(token) {
	     // const token = localStorage.getItem('token');
	     const decoded = jwt_decode(token);
	     this.setState({ username: decoded.username });
	   }
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
				swal('Success!', 'Followed!', 'success');
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
				swal('Success!', 'Unfollowed!', 'success');
			});
	}

	/* MODIF */
	updateUser() {
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


	componentDidMount() {
		axios.get('http://127.0.0.1:8000/user/users', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(results => {
			console.log(results.data);
			return results;
		}).then(results => {
			let users = results.data.map((user) => {
				return(
					<div>
						<Well>
							<b>{user.username} </b><br/>
							{user.email}<br/>
							Tweets: <br/>
							Followers:
							<ButtonToolbar>
							<button
							className='btn pull-right'
							type='button'
							onClick={() => this.unfollow(user.username)}>
							Unfollow
							</button>
							<button
							className='btn btn-primary pull-right'
							type='button'
							onClick={() => this.follow(user.username)}>
							Follow
							</button>
							</ButtonToolbar>
						</Well>
					</div>
				)
			})
		this.setState({users:users});
		console.log("this.state ", this.state.users);
	})
	axios.get('http://127.0.0.1:8000/user/me', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(results => {
			console.log(results.data);
			return results;
		}).then(results => {
			let myprofile = results.data.map((user) => {
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
		this.setState({currentUser:myprofile});
	})
}

	render(){
		return (
			<div className = "container">
			<h2>My profile</h2>
			{this.state.currentUser}
			<h2>All Users</h2>
			{this.state.users}

			<Modal show={this.state.userFormModal}>
								<br />
								<Modal.Body>
								<h2> Edit my profile </h2>
									<div className='form-group'>
										Username
										<input
										className='form-control'
										type='text'
										placeholder= {this.stat}
										onChange={event => this.setState({username:event.target.value})}/>

										Email
										<input
										type='text'
										className='form-control'
										placeholder= "email"
										onChange={event => this.setState({email:event.target.value})}/>

										Password
										<input
										type='text'
										className='form-control'
										placeholder= "password"
										onChange={event => this.setState({password:event.target.value})}/>
										<br/>
										<button
											className='btn btn-primary pull-right'
											type='button'
											onClick={() => this.updateUser()}>
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
	}

}

export default Admin;
