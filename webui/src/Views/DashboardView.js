import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import DashboardHeader from '../Components/DashboardHeader';
import SeasonsList from '../Components/SeasonsList';

class DashboardView extends Component {
  state = {displayName: null};
  async fetchUserProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const {displayName} = await res.json();
      this.setState({displayName});
    }
  }
  async componentDidMount() {
    await this.fetchUserProfile();
  }
  render() {
    return (
      <Grid divided='vertically' columns={1}>
        <Grid.Row>
          <Grid.Column>
            <DashboardHeader displayName={this.state.displayName} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <SeasonsList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DashboardView;
