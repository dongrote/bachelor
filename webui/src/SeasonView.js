import React, { Component } from 'react';
import { Button, Card, Grid, Header, Placeholder } from 'semantic-ui-react';
import SeasonMemberCard from './SeasonMemberCard';

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
      this.setState({groupMembers: json.members});
    }
  }
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      this.setState({castMembers: json.seasonCastMembers});
    }
  }
  async componentDidMount() {
    await this.fetchSeason();
    await this.fetchGroupMembers();
    await this.fetchCastMembers();
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
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header content='Cast Members'>
                {this.state.castMembers.map(m => (<p>{m.firstName}</p>))}
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header content='Group Members'>
                {this.state.groupMembers.map(m => (
                  <SeasonMemberCard
                    userId={m.id}
                    displayName={m.displayName}
                    role={m.role}
                  />
                ))}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
      : (<Placeholder><Placeholder.Paragraph /></Placeholder>);
  }  
}

export default SeasonView;
