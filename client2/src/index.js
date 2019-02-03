import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import './index.css';

import App from './components/App';
//import SignIn from './components/SignIn';
//import SignUp from './components/SignUp';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<App />, document.getElementById('root')
	);


serviceWorker.unregister();
