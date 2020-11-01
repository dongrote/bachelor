import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class SeasonView extends Component {
  state = {season: null};
  async fetchSeason() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({season: json});
    }
  }
  async componentDidMount() {
    await this.fetchSeason();
  }
  render() {
    return this.state.season
      ? (<Grid>Loading ...</Grid>)
      : (<Grid>SeasonId: {this.state.season.id}</Grid>);
  }  
}

export default SeasonView;
