import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import CreateSeasonButton from './CreateSeasonButton';
import SeasonCard from './SeasonCard';

class SeasonsView extends Component {
  state = {seasons: []};

  async fetchAllSeasons() {
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
      this.setState({seasons});
    }
  }

  async componentDidMount() {
    await this.fetchAllSeasons();
  }

  render() {
    return (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <CreateSeasonButton onCreate={() => this.fetchAllSeasons()} />
          </Grid.Column>
        </Grid.Row>
        {this.state.seasons.map((s, i) => (
          <Grid.Row key={i}>
            <Grid.Column>
              <SeasonCard
                seasonId={s.id}
                ResourceGroupId={s.ResourceGroupId}
                name={s.name}
                role={s.role}
                type={s.type}
                description={s.description}
              />
            </Grid.Column>
          </Grid.Row>))}
      </Grid>
    );
  }
}

export default SeasonsView;
