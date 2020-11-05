import React, { Component } from 'react';
import { Button, Card, Icon, Grid } from 'semantic-ui-react';
import io from './websocket';
import { uid } from 'uid';
import SeasonCastMemberCardContent from './SeasonCastMemberCardContent';

class EligibleCastMemberCard extends Component {
  state = {hasRose: false, roseButtonLoading: false};

  async updateHasRose() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`);
    if (res.ok) {
      const json = await res.json();
      this.setState({hasRose: json.findIndex(v => v.SeasonCastMemberId === this.props.castMemberId) > -1});
    }
  }

  handleRoseCreate(event) {
    const {episode, seasonCastMember} = event;
    if (
      episode.SeasonId === this.props.seasonId &&
      episode.number === this.props.episodeNumber &&
      seasonCastMember.id === this.props.castMemberId
    ) {
      this.setState({hasRose: true});
    }
  }

  handleRoseDestroy(event) {
    const {episode, seasonCastMember} = event;
    if (
      episode.SeasonId === this.props.seasonId &&
      episode.number === this.props.episodeNumber &&
      seasonCastMember.id === this.props.castMemberId
    ) {
      this.setState({hasRose: false});
    }
  }

  installEventHandler(event, handler) {
    handler.instance = this.instanceId;
    io.on(event, handler);
  }

  uninstallEventHandler(event) {
    io.listeners(event)
      .filter(l => l.instance === this.instanceId)
      .forEach(l => io.off(event, l));
  }

  async componentDidMount() {
    this.instanceId = uid();
    const awardRoseHandler = event => this.handleRoseCreate(event);
    const revokeRoseHandler = event => this.handleRoseDestroy(event);
    this.installEventHandler('Rose.create', awardRoseHandler);
    this.installEventHandler('Rose.destroy', revokeRoseHandler);
    await this.updateHasRose();
  }

  componentWillUnmount() {
    this.uninstallEventHandler('Rose.create');
    this.uninstallEventHandler('Rose.destroy');
  }

  async awardRose() {
    this.setState({roseButtonLoading: true});
    await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId: this.props.castMemberId})
    });
    this.setState({roseButtonLoading: false});
  }

  async revokeRose() {
    this.setState({roseButtonLoading: true});
    await fetch(`/api/seasons/${this.props.seasonId}/episodes/${this.props.episodeNumber}/rose`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({castMemberId: this.props.castMemberId})
    });
    this.setState({roseButtonLoading: false});
  }

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <SeasonCastMemberCardContent
            seasonCastMemberId={this.props.castMemberId}
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            age={this.props.age}
            home={this.props.home}
            occupation={this.props.occupation}
          />
        </Card.Content>
        <Card.Content extra>
          <Button
            basic={!this.state.hasRose}
            circular
            floated='right'
            loading={this.state.roseButtonLoading}
            color='red'
            size='large'
            icon='heart outline'
            onClick={() => this.state.hasRose ? this.revokeRose() : this.awardRose()}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default EligibleCastMemberCard;
