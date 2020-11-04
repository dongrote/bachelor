import React, { Component } from 'react';
import { Segment, Header, Button, Grid, Placeholder, Tab } from 'semantic-ui-react';
import SeasonDetailsView from './SeasonDetailsView';
import SeasonEpisodesView from './SeasonEpisodesView';
import SeasonCastMembersView from './SeasonCastMembersView';
import SeasonCastMemberPickSelector from './SeasonCastMemberPickSelector';
import SeasonFriendsView from './SeasonFriendsView';

class SeasonView extends Component {
  state = {ready: false, season: null, castMembers: [], groupMembers: []};

  async fetchSeason() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({season: json});
    }
  }

  async fetchGroupMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/members`);
    if (res.ok) {
      const json = await res.json();
      console.log('season group members', json);
      this.setState({groupMembers: json.members});
    }
  }

  async componentDidMount() {
    await this.fetchSeason();
    await this.fetchGroupMembers();
    this.setState({ready: true});
  }

  render() {
    return this.state.ready
      ? (
        <Segment>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header>{this.props.seasonName}</Header>
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Button basic icon='close' onClick={() => this.props.onHide()} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Tab panes={[
            {menuItem: {key: 'details', icon: 'file alternate outline'}, render: () => <SeasonDetailsView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'episodes', icon: 'tv'}, render: () => <SeasonEpisodesView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'cast', icon: 'address card outline'}, render: () => <SeasonCastMembersView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'picks', icon: 'tasks'}, render: () => <SeasonCastMemberPickSelector seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'friends', icon: 'users'}, render: () => <SeasonFriendsView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
          ]} />
        </Segment>
      )
      : (<Placeholder><Placeholder.Paragraph /></Placeholder>);
  }  
}

export default SeasonView;
