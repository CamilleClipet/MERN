import React, {Component} from 'react';
import swal from 'sweetalert2';

class SignIn extends Component{
	constructor (props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		}
	}

	signIn() {
		var data = {
			"email": this.state.email,
			"password": this.state.password,
		}
		fetch("http://127.0.0.1:8000/user/login", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body:  JSON.stringify(data)
		})
		// .then(function(res{
		// 	console.log(res.data);
		// 	return res;
		// })
		.then(res => res.json()).then(res => {
    let token = res.token;

		localStorage.setItem('token', token);
		return res;
		})
		.then(function(data){
			//console.log(data);
			if (data.status === 200) {
				swal('Welcome!', 'You are logged in', 'success')
				.then(function(){
				window.location = "/home";
				});
			} else {
				swal('Oops!', 'Are you sure you entered the right email and password?', 'error')
				.then(function(){
				window.location = "/signin";
				});
			}
		});
	}

	render() {
		return (
			<div className='container'>
				<h2> Sign in</h2>
				<div className='form-group'>
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
					<button
						className='btn btn-primary'
						type='button'
						onClick={() => this.signIn()}>
						Go
					</button>
				</div>
			</div>
			)
	}

}

export default SignIn;
