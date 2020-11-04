import React, { Component } from 'react';
import { Segment, Header, Button, Card, Grid, Placeholder, Tab } from 'semantic-ui-react';
import SeasonDetailsView from './SeasonDetailsView';
import SeasonEpisodesView from './SeasonEpisodesView';
import SeasonCastMembersView from './SeasonCastMembersView';
import SeasonFriendsView from './SeasonFriendsView';
import SeasonCastGridRow from './SeasonCastGridRow';
import SeasonMembersGridRow from './SeasonMembersGridRow';

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
            {menuItem: {key: 'episodes', icon: 'tasks'}, render: () => <SeasonEpisodesView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'cast', icon: 'address card outline'}, render: () => <SeasonCastMembersView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
            {menuItem: {key: 'friends', icon: 'users'}, render: () => <SeasonFriendsView seasonId={this.props.seasonId} role={this.props.role} ResourceGroupId={this.props.ResourceGroupId} />},
          ]} />
        </Segment>
        /*
        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{this.state.season.name}</Card.Header>
                  <Card.Description>{this.state.season.type}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    fluid
                    icon='arrow alternate circle left'
                    labelPosition='left'
                    content='Back'
                    onClick={() => this.props.onHide()}
                  />
                </Card.Content>
                <Card.Content extra>
                  <SeasonCastGridRow seasonId={this.props.seasonId} role={this.props.role} />
                </Card.Content>
                <Card.Content extra>
                  <SeasonMembersGridRow
                    seasonId={this.props.seasonId}
                    ResourceGroupId={this.props.ResourceGroupId}
                    groupMembers={this.state.groupMembers}
                    role={this.props.role}
                  />
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        */
      )
      : (<Placeholder><Placeholder.Paragraph /></Placeholder>);
  }  
}

export default SeasonView;
