import React, {Component} from 'react';
import swal from 'sweetalert2';
import { Button, Col, ControlLabel,FormGroup, FormControl, Table } from 'react-bootstrap';

class Article extends Component{
	constructor (props) {
		super(props);
		this.state = {
			content: '',
		}
	}

	createArticle() {
		//console.log('this.state', this.state);
		var data = {
			"content": this.state.content,
		}
		if (data.content !== '' && data.content.length <= 140) {
			fetch("http://127.0.0.1:8000/message/create", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token')
				},
				body:  JSON.stringify(data)
			})
			.then(function(response){
				return response;
			})
			.then(function(data){
				console.log(data);
				console.log("Message successfully posted");
				swal('Success!', 'Message successfully posted', 'success');

			});
		} else if (data.content.length > 140) {
			swal('Oops!', 'Seems like the content of your post too long!', 'error');
		} else {
			console.log("content field empty");
			swal('Oops!', 'Seems like the content of your post is empty!', 'error');
		}
	}

	render() {
		return (
			<div className='container'>
				<h2> Post a message </h2>
				<div className='form-group'>
					<FormGroup controlId="formControlsTextarea">
      		<ControlLabel>Size limited to 140 characters</ControlLabel>
      		<FormControl
					componentClass="textarea"
					placeholder="textarea"
					onChange={event => this.setState({content:event.target.value})}/>
    			</FormGroup>
					<button
						className='btn btn-primary'
						type='button'
						onClick={() => this.createArticle()}>
						Post
					</button>
				</div>
			</div>
			)
	}

}

export default Article;
