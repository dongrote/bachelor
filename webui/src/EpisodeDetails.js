import React, { Component } from 'react';
import { Button, Card, Grid, Header } from 'semantic-ui-react';
import EligibleCastMemberCard from './EligibleCastMemberCard';

class EpisodeDetails extends Component {
  state = {roseCount: 0, bachelorCount: 0, eligibleCastIds: [], eligibleCastNames: []};
  async fetchEligibleCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/eligible`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        eligibleCastIds: json.map(j => j.id),
        eligibleCastNames: json.map(j => j.firstName),
      });
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
          {this.state.eligibleCastIds.map((c, i) => <EligibleCastMemberCard
            key={i}
            seasonId={this.props.seasonId}
            episodeNumber={this.props.episodeNumber}
            castMemberId={c}
            firstName={this.state.eligibleCastNames[i]}
          />)}
        </Card.Content>
      </Card>
    );
  }
}

export default EpisodeDetails;
