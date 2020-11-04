import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import io from './websocket';
import { uid } from 'uid';
import AddCastMemberButton from './AddCastMemberButton';
import SeasonCastMemberCard from './SeasonCastMemberCard';

class SeasonCastMembersView extends Component {
  state = {cast: []};
  async fetchCastMembers() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/cast`);
    if (res.ok) {
      const json = await res.json();
      this.setState({cast: json.seasonCastMembers});
    }
  }
  async handleSeasonCastMemberCreateEvent(event) {
    if (event.SeasonId === this.props.seasonId) {
      await this.fetchCastMembers();
    }
  }
  async componentDidMount() {
    this.instanceId = uid();
    const eventHandler = event => this.handleSeasonCastMemberCreateEvent(event);
    eventHandler.instance = this.instanceId;
    io.on('SeasonCastMember.create', eventHandler);
    await this.fetchCastMembers();
  }
  removeEventHandler(event) {
    io.listeners(event)
      .filter(l => l.instance === this.instanceId)
      .forEach(l => io.off(event, l));
  }
  componentWillUnmount() {
    this.removeEventHandler('SeasonCastMember.create');
  }
  render() {
    return (
      <Grid columns={1}>
        {this.state.cast.length === 0 && (
          <Grid.Row>
            <Grid.Column>
              No cast members!
            </Grid.Column>
          </Grid.Row>
        )}
        {this.state.cast.map(c => (
          <Grid.Row>
            <Grid.Column>
              <SeasonCastMemberCard
                role={this.props.role}
                seasonCastMemberId={c.id}
                firstName={c.firstName}
                lastName={c.lastName}
                age={c.age}
                occupation={c.occupation}
                home={c.homeLocation}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
        {this.props.role === 'owner' && (
          <Grid.Row>
            <Grid.Column>
              <AddCastMemberButton seasonId={this.props.seasonId} onCreate={() => console.log('noop')} />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

export default SeasonCastMembersView;
