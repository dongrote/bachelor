import React, { Component } from 'react';
import { Button, Card, Grid, Header } from 'semantic-ui-react';
import EligibleCastMemberCard from './EligibleCastMemberCard';

class EpisodeDetails extends Component {
  state = {roseCount: 0, bachelorCount: 0, eligibleCast: []};
  async fetchEligibleCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/eligible`);
    if (res.ok) {
      const json = await res.json();
      this.setState({eligibleCast: json});
    }
  }

  async awardRose(castMemberId) {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId})
    });
    if (res.ok) {
      await this.fetchEligibleCastMembers();
    }
  }

  async revokeRose(castMemberId) {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId})
    });
    if (res.ok) {
      await this.fetchEligibleCastMembers();
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
                </Grid.Column>
                <Grid.Column textAlign='right'>
                  <Button basic icon='close' onClick={() => this.props.onHide()} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          {this.state.eligibleCast.map(c => <EligibleCastMemberCard
            firstName={c.firstName}
            hasRose={c.hasRose}
            onClick={() => c.hasRose ? this.revokeRose(c.id) : this.awardRose(c.id)}
          />)}
        </Card.Content>
      </Card>
    );
  }
}

export default EpisodeDetails;
