import React, {Component} from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import { Button, ButtonToolbar, Col, ControlLabel,FormGroup, FormControl, Table, Modal, Well } from 'react-bootstrap';
var myHashtags = require('../../hashtag.js');
var linkHashtag = myHashtags.linkHashtag;
var htmlDecode = myHashtags.htmlDecode;


class Home extends Component{
	constructor (props) {
		super(props);
		this.state = {
			articles: [],
			messageFormModal: false,
			editFormModal: false,
			content: '',
			editedcontent: '',
		};
	}

	createArticle() {
		//console.log('this.state', this.state);
		var data = {
			"content": this.state.content,
		}
		if (data.content !== '' ) {
			fetch("http://127.0.0.1:8000/message/create", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token')
				},
				body:  JSON.stringify(data)
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data);
				console.log("Message successfully posted");
			//	swal('Success!', 'Message successfully posted', 'success');
				setTimeout(() => window.location.reload(), 500);
			});
		} else {
			console.log("content field empty");
			swal('Oops!', 'Seems like the content of your post is empty!', 'error');
		}
	}

	edit(message) {
		//console.log('this.state', this.state);
		var data = {
			"editedcontent": this.state.editedcontent,
		}
		if (data.editedcontent !== '' ) {
			fetch("http://127.0.0.1:8000/message/"+message+"/edit", {
				method: "PUT",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body:  JSON.stringify(data)
			})
			.then(function(res){
				return res;
			})
			.then(function(data){
				console.log(data);
				console.log("Message successfully edited");
				swal('Success!', 'Message successfully edited', 'success').then(function(){
					window.location = "/home";
				});
				//setTimeout(() => window.location.reload(), 500);
			});
		} else {
			console.log("content field empty");
			swal('Oops!', 'Seems like the content of your post is empty!', 'error');
		}
	}

	delete(message) {
		//console.log('this.state', this.state);
			fetch("http://127.0.0.1:8000/message/"+message+"/delete", {
				method: "DELETE",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			})
			.then(function(res){
				return res;
			});
	}


	componentDidMount() {
		axios.get('http://127.0.0.1:8000/message/messages', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(res => {
			console.log(res);
			return res;
		}).then(res => {
			let articles = res.data.map((article) => {
				return(
					<div>
						<Well> <b>{article.username}</b> {article.created_at}<br/>
						<div dangerouslySetInnerHTML={{ __html: htmlDecode(linkHashtag(article.content)) }} />
						<ButtonToolbar>
							<button
								className='btn btn-danger pull-right'
								type='button'
								onClick={() =>
								swal({
							  title: 'Are you sure?',
							  text: "You won't be able to revert this!",
							  type: 'warning',
							  showCancelButton: true,
							  confirmButtonColor: '#3085d6',
							  cancelButtonColor: '#d33',
							  confirmButtonText: 'Yes, delete it!'
								}).then((result) => {
								  if (result.value) {
										this.delete(article._id);
										swal(
								      'Deleted!',
								      'Your post has been deleted.',
								      'success'
								    ).then(function(){
										window.location = "/home";
										});
									}
								})}> Delete
							</button>
							</ButtonToolbar>
							<div className='form-group'>
							 <FormGroup controlId="formControlsTextarea">
							 <ControlLabel>Size limited to 140 characters</ControlLabel>
							 <FormControl
							 componentClass="textarea"
							 placeholder={article.content}
							 onChange={event => this.setState({editedcontent:event.target.value})}/>
							 </FormGroup>
							 <button
								 className='btn btn-primary'
								 type='button'
								 onClick={() => this.edit(article._id)}>
								 Edit
							 </button>
						 </div>
						</Well>
					</div>
				)
			})
			this.setState({articles:articles});
			console.log("this.state ", this.state);
			//console.log("this.state.isHidden ", this.state.isHidden);
		})
	}

	render(){
		return (
			<div className='container'>
			<Button
				className="btn btn-primary"
				onClick={() => this.setState({ messageFormModal: true })}
				>
				New post
			</Button>
			<br/>
			<Modal show={this.state.messageFormModal}>
			<br />
			<Modal.Body>
			<h2> New post </h2>
				<div className='form-group'>
					<FormGroup controlId="formControlsTextarea">
					<ControlLabel>Size limited to 140 characters</ControlLabel>
					<FormControl
					componentClass="textarea"
					placeholder="Your text"
					onChange={event => this.setState({content:event.target.value})}/>
					</FormGroup>
					<button
						className='btn btn-primary'
						type='button'
						onClick={() => this.createArticle()}>
						Post
					</button>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
				id="closeform"
				onClick={() => this.setState({ messageFormModal: false })}
				>
				Close
				</Button>
			</Modal.Footer>
			</Modal>
			<h2>Your posts</h2>
			{this.state.articles}
			</div>
		)

	}

}

export default Home;
