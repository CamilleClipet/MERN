import React, {Component} from 'react';
import axios from 'axios';
import { Button, Col, ControlLabel,FormGroup, FormControl, Table, Modal, Well } from 'react-bootstrap';
var myHashtags = require('../../hashtag.js');
var linkHashtag = myHashtags.linkHashtag;
var htmlDecode = myHashtags.htmlDecode;


class Landing extends Component{
	constructor (props) {
		super(props);
		this.state = {
			articles: [],
		};
	}

	componentDidMount() {
		axios.get('http://127.0.0.1:8000/message/feed', { 'headers': { 'Authorization': localStorage.getItem("token")}})
		.then(res => {
			console.log("res ", res);
			return res;
		}).then(res => {
			let articles = res.data.map((article) => {
				return(
					<div>
						<Well> <b>{article.username}</b> {article.created_at}<br/>
						<div dangerouslySetInnerHTML={{ __html: htmlDecode(linkHashtag(article.content)) }} />
						</Well>
					</div>
				)
			})
		this.setState({articles:articles});
		console.log("this.state ", this.state.articles);
	})


}

render(){
	return (
		<div className='container'>
		<h2>Your feed</h2>
		{this.state.articles}
		</div>
		)

}

}


export default Landing;
