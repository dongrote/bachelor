import React, { Component } from 'react';
import { Card, Header } from 'semantic-ui-react';
import EpisodeDetails from './EpisodeDetails';

class EpisodeCard extends Component {
  state = {showDetails: false};

  toggleShowDetails() {
    this.setState({showDetails: !this.state.showDetails});
  }

  render() {
    return this.state.showDetails
      ? (
        <EpisodeDetails
          seasonId={this.props.seasonId}
          episodeNumber={this.props.episodeNumber}
          castMemberCount={this.props.castMemberCount}
          onHide={() => this.toggleShowDetails()}
        />
      )
      : (
        <Card fluid onClick={() => this.toggleShowDetails()}>
          <Card.Content>
            <Card.Header>
              <Header content={`Episode ${this.props.episodeNumber}`} />
            </Card.Header>
            {this.props.castMemberCount && <Card.Description>{this.props.castMemberCount} Remaining</Card.Description>}
            {this.props.title && <Card.Description>{this.props.title}</Card.Description>}
            {this.props.airDate && <Card.Description>Air Date: {this.props.airDate}</Card.Description>}
          </Card.Content>
        </Card>
      );
  }
}

export default EpisodeCard;
