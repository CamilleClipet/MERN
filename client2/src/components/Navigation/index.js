import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
require("react-bootstrap/lib/NavbarHeader");

class Navigation extends Component{

	//const Navigation = () => (

	//);

	signOut() {
		fetch("http://127.0.0.1:8000/user/logout", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})

		.then(res => res.json()).then(res => {
			console.log("passage");
			localStorage.removeItem('token');
			return res;
		});
	}

	disconnect = event => {
		console.log("coucou");
		localStorage.clear('token');
		window.location = "/signin";
	}

	render() {
		return (
			<div >
			<Navbar>
					<Nav>
					<NavItem>
					<Link to={ROUTES.SIGN_IN}>Sign In </Link>
					</NavItem>
					<NavItem>
					<Link to={ROUTES.SIGN_UP}>Sign Up </Link>
					</NavItem>
					<NavItem>
					<Link to={ROUTES.LANDING}>Feed </Link>
					</NavItem>
					<NavItem>
					<Link to={ROUTES.HOME}>Home </Link>
					</NavItem>
					<NavItem>
					<Link to={ROUTES.ARTICLE}>Post </Link>
					</NavItem>
					<NavItem>
					<Link to={ROUTES.ADMIN}>Users</Link>
					</NavItem>
					<NavItem>
					<Button
					className="pull-right"
					bsSize="small"
					onClick={this.disconnect}
					type="submit"
					>
					Log out
					</Button>
					</NavItem>
				</Nav>
			</Navbar>
			</div>
		)
	}
}


export default Navigation;
