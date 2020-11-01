import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import io from './websocket';
import LandingView from './LandingView';
import UserView from './UserView';

class App extends Component {
  state = {
    view: 'landing',
    user: null,
  };

  async fetchUserProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const json = await res.json();
      this.setState({view: 'user', user: json});
    }
  }

  async componentDidMount() {
    // register io handlers
    await this.fetchUserProfile();
  }

  componentWillUnmount() {
    // unregister io handlers
  }

  async onSignIn() {
    await this.fetchUserProfile();
  }

  render() {
    return (
      <Container text>
        {this.state.view === 'landing'
          ? <LandingView onSignIn={() => this.onSignIn()}/>
          : <UserView
              username={this.state.user.username}
              role={this.state.user.systemRole}
              displayName={this.state.user.displayName}
              groups={this.state.user.groups}
            />}
      </Container>
    );
  }
}

export default App;
