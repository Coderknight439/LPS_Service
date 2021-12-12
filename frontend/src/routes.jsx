import React from 'react';
import { Route, Router } from 'react-router';
import About from './containers/Home/Home';
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';

export default(
    <Router>
        <Route path="/" component={Login} />
        <Route exact path="/home" component={ Home } />
        <Route exact path="/about" component={ About } />
    </ Router>
);