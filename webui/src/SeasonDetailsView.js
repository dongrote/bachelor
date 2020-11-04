import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

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
      <Form>
        <Form.Field>
          <label>Season Name</label>
          <input readOnly value={this.state.name} />
        </Form.Field>
        <Form.Field>
          <label>Season Type</label>
          <input readOnly value={this.state.type} />
        </Form.Field>
        <Form.Field>
          <label>Episodes</label>
          <input readOnly value={this.state.episodeCount} />
        </Form.Field>
      </Form>
    );
  }
}

export default SeasonDetailsView;
