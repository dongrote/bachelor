import React, { Component } from 'react';
import { Button, Card, Grid, Placeholder } from 'semantic-ui-react';
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
      )
      : (<Placeholder><Placeholder.Paragraph /></Placeholder>);
  }  
}

export default SeasonView;
