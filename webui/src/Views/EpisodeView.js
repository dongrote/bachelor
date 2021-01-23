import React, { Component } from 'react';
import { Card, Grid, Header } from 'semantic-ui-react';
import MenuBar from '../Components/MenuBar';
import EligibleCastMemberCard from '../Components/EligibleCastMemberCard';

class EpisodeView extends Component {
  state = {castmembers: []};
  async fetchEligibleCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/episodes/${this.props.EpisodeNumber}/eligible`);
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
      this.setState({castmembers: json});
    }
  }
  async componentDidMount() {
    await this.fetchEligibleCastMembers();
  }
  render() {
    return (
      <Grid divided='vertically' columns={1}>
        <Grid.Row>
          <Grid.Column>
            <MenuBar SeasonId={this.props.SeasonId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header content={`${this.state.castmembers.length} Remaining`} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card.Group doubling>
              {this.state.castmembers.map((castmember, i) => (
                <EligibleCastMemberCard
                  key={i}
                  seasonId={this.props.SeasonId}
                  episodeNumber={this.props.EpisodeNumber}
                  castMemberId={castmember.id}
                  firstName={castmember.firstName}
                  lastName={castmember.lastName}
                  age={castmember.age}
                  home={castmember.homeLocation}
                  occupation={castmember.occupation}
                />
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EpisodeView;
