import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import SeasonCard from '../Components/SeasonCard';

class SeasonsList extends Component {
  state = {seasons: []};
  async fetchSeasons() {
    const res = await fetch('/api/seasons');
    if (res.ok) {
      const json = await res.json();
      const seasons = json.seasons.map(s => ({
        id: s.id,
        ResourceGroupId: s.ResourceGroupId,
        type: s.type,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        role: s.role,
      }));
      seasons.reverse();
      this.setState({seasons});
    }
  }
  async componentDidMount() { await this.fetchSeasons(); }
  render() {
    return (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Header as='h2' content='Seasons' />
          </Grid.Column>
        </Grid.Row>
        {this.state.seasons.map((season, i) => (
          <Grid.Row key={i}>
            <Link to={`/season/${season.id}`}>
              <SeasonCard
                name={season.name}
                type={season.type}
              />
            </Link>
          </Grid.Row>
        ))}
      </Grid>
    );
  }
}

export default SeasonsList;
