import React, {Component} from 'react';
import swal from 'sweetalert2';

class SignUp extends Component{
	constructor (props) {
		super(props);
		this.state = {
			username:'',
			email: '',
			password: '',
			repeat_password: '',
			alert: '',
		}
	}

	signUp() {
		//console.log('this.state', this.state);
		var data = {
			"username": this.state.username,
			"email": this.state.email,
			"password": this.state.password,
			"repeat_password": this.state.repeat_password
		}
		if (data.password === data.repeat_password) {
			fetch("http://127.0.0.1:8000/user/signup", {
				//mode: 'no-cors',
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body:  JSON.stringify(data)
			})
			.then(function(response){
				return response;
			})
			.then(function(data){
				console.log(data);
				console.log("user successfully created");
				swal('Success!', 'User successfully added', 'success');

			});
		} else {
			console.log("password and password confirmation didn't match");
			swal('Oops!', 'Password and password confirmation didn\'t match', 'error');
		}

	}

	render() {
		return (
			<div className='container'>
				<h2> Sign up</h2>
				<div className='form-group'>
					<input
					className='form-control'
					type='text'
					placeholder='username'
					onChange={event => this.setState({username:event.target.value})}
					/><br />
					<input
					className='form-control'
					type='text'
					placeholder='email'
					onChange={event => this.setState({email:event.target.value})}
					/><br />
					<input
					className='form-control'
					type='password'
					placeholder='password'
					onChange={event => this.setState({password:event.target.value})}
					/><br />
					<input
					className='form-control'
					type='password'
					placeholder='repeat password'
					onChange={event => this.setState({repeat_password:event.target.value})}
					/><br />
					<button
					className='btn btn-primary'
					type='button'
					onClick={() => this.signUp()}>
					Sign Up
					</button>
				</div>
			</div>
			)
	}

}

export default SignUp;
