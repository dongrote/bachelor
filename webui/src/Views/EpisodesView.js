import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid } from 'semantic-ui-react';
import MenuBar from '../Components/MenuBar';
import EpisodeCard from '../Components/EpisodeCard';

class EpisodesView extends Component {
  state = {episodes: []};
  async fetchEpisodes() {
    const res = await fetch(`/api/seasons/${this.props.SeasonId}/episodes`);
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
      <Grid divided='vertically' columns={1}>
        <Grid.Row>
          <Grid.Column>
            <MenuBar SeasonId={this.props.SeasonId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card.Group centered>
              {this.state.episodes.map((episode, i) => (
                <Link key={i} to={`/season/${this.props.SeasonId}/episodes/${episode.number}`}>
                  <EpisodeCard num={episode.number} name={episode.title} />
                </Link>
              ))}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EpisodesView;
