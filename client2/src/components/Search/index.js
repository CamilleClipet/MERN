import React, {Component} from 'react';
import axios from 'axios';
import { Button, Col, ControlLabel,FormGroup, FormControl, Table, Modal, Well } from 'react-bootstrap';
var myHashtags = require('../../hashtag.js');
var linkHashtag = myHashtags.linkHashtag;
var htmlDecode = myHashtags.htmlDecode;

class Search extends Component{
	constructor (props) {
		super(props);
		this.state = {
			articles: [],
		};
	}

	componentDidMount() {
		var hash = this.props.location.hash.substring(1);
		axios.get('http://127.0.0.1:8000/message/search/'+hash)
		.then(res => {
			console.log(res);
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
    console.log("this.props ", this.props.location.hash);
	})

}

  render(){
  	return (
  		<div className='container'>
  		<h2>Search results for {this.props.location.hash}</h2>
  		{this.state.articles}
  		</div>
  		)
  }

}




export default Search;
