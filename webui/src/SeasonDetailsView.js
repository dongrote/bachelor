import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';

class SeasonDetailsView extends Component {
  state = {name: null, type: null, startDate: null, endDate: null, episodeCount: 0, loading: true};
  async fetchEpisodeCount() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/episodes?limit=0`);
    if (res.ok) {
      const json = await res.json();
      this.setState({episodeCount: json.count});
    }
  }

  async fetchSeasonDetails() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        loading: false,
        name: json.name,
        type: json.type,
        startDate: json.startDate,
        endDate: json.endDate,
      });
    }
    await this.fetchEpisodeCount();
  }
  async componentDidMount() {
    await this.fetchSeasonDetails();
  }
  render() {
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Header content='Season Name' />
          </Grid.Column>
          <Grid.Column>
            {this.state.name}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header content='Season Type' />
          </Grid.Column>
          <Grid.Column>
            {this.state.type}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header content='Episodes' />
          </Grid.Column>
          <Grid.Column>{this.state.episodeCount}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SeasonDetailsView;
