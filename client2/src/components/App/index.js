import React from 'react';
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import ArticlePage from '../Article';
import AdminPage from '../Admin';
import Search from '../Search';

import * as ROUTES from '../../constants/routes';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ARTICLE} component={ArticlePage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.SEARCH} component={Search} />
    </div>
  </Router>
);

export default App;
