import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import AddEpisodeButton from './AddEpisodeButton';
import EpisodeCard from './EpisodeCard';

class SeasonEpisodesView extends Component {
  state = {episodes: []};
  async fetchEpisodes() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes`);
    if (res.ok) {
      const json = await res.json();
      json.episodes.reverse();
      this.setState({episodes: json.episodes});
    }
  }
  async componentDidMount() {
    await this.fetchEpisodes();
  }
  render() {
    return (
      <Grid columns={1}>
        {this.state.episodes.length === 0 && (
          <Grid.Row>
            <Grid.Column>
              No episodes
            </Grid.Column>
          </Grid.Row>
        )}
        {this.state.episodes.map(e => (
          <Grid.Row>
            <Grid.Column>
              <EpisodeCard
                title={e.title}
                episodeNumber={e.number}
                seasonId={this.props.seasonId}
              />
            </Grid.Column>
          </Grid.Row>
        ))}
        {this.props.role === 'owner' && (
          <Grid.Row>
            <Grid.Column>
              <AddEpisodeButton seasonId={this.props.seasonId} onCreate={() => this.fetchEpisodes()} />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    );
  }
}

export default SeasonEpisodesView;
