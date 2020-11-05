import React, { Component } from 'react';
import { Button, Card, Grid, Header } from 'semantic-ui-react';
import EligibleCastMemberCard from './EligibleCastMemberCard';

class EpisodeDetails extends Component {
  state = {roseCount: 0, castMemberCount: 0, castMembers: []};
  async fetchEligibleCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/eligible`);
    if (res.ok) {
      const json = await res.json();
      json.sort((left, right) => {
        if (left.firstName < right.firstName) return -1;
        if (left.firstName === right.firstName) {
          if (left.lastName < right.lastName) return -1;
          return left.lastName === right.lastName ? 0 : 1;
        }
        return 1;
      });
      this.setState({castMembers: json, castMemberCount: json.length});
    }
  }

  async componentDidMount() {
    await this.fetchEligibleCastMembers();
  }

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header content={`Episode ${this.props.episodeNumber}`} />
                  {this.state.castMemberCount} Remaining
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Button basic icon='close' onClick={() => this.props.onHide()} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          {this.state.castMembers.map((cm, i) => <EligibleCastMemberCard
            key={i}
            seasonId={this.props.seasonId}
            episodeNumber={this.props.episodeNumber}
            castMemberId={cm.id}
            firstName={cm.firstName}
            lastName={cm.lastName}
            age={cm.age}
            home={cm.homeLocation}
            occupation={cm.occupation}
          />)}
        </Card.Content>
      </Card>
    );
  }
}

export default EpisodeDetails;
