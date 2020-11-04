import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import io from './websocket';
import LandingView from './LandingView';
import UserView from './UserView';

class App extends Component {
  state = {
    view: 'landing',
    user: null,
    seasons: [],
  };

  async fetchUserProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const json = await res.json();
      this.setState({view: 'user', user: json});
    }
  }

  async fetchAllSeasons() {
    const res = await fetch('/api/seasons');
    if (res.ok) {
      const json = await res.json();
      const seasons = json.seasons.map(s => ({
        id: s.id,
        ResourceGroupId: s.ResourceGroupId,
        type: s.type,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        role: this.state.user.groups.find(g => g.id === s.ResourceGroupId).role,
      }));
      this.setState({seasons});
    }
  }

  async componentDidMount() {
    // register io handlers
    await this.fetchUserProfile();
    await this.fetchAllSeasons();
  }

  componentWillUnmount() {
    // unregister io handlers
  }

  async onSignIn() {
    await this.fetchUserProfile();
  }

  async onSignOut() {
    this.setState({user: null, view: 'landing'});
  }

  async onSeasonCreate() {
    await this.fetchAllSeasons();
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
              seasons={this.state.seasons}
              onSeasonCreate={() => this.onSeasonCreate()}
              onSignOut={() => this.onSignOut()}
            />}
      </Container>
    );
  }
}

export default App;
