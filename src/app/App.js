import React, { Component } from 'react';
import './App.css';
import { Redirect, Route, withRouter, Switch } from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import Dashboard from '../dashboard/Dashboard';

import { Layout, notification } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/login", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'NMS Dashboard',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'NMS Dashboard',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/dashboard");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout style={{height:"100vh"}}>
            <Switch>
              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
              <Route path="/signup" component={Signup}></Route>
              <PrivateRoute path="/dashboard" component={Dashboard} currentUser={this.state.currentUser} onLogout={this.handleLogout} />
              <Route path="/users/:username" render={(props) => <Profile currentUser={this.state.currentUser} {...props} />}>
              </Route>
              <Route component={NotFound}></Route>
            </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);
