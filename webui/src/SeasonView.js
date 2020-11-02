import React, { Component } from 'react';
import { Button, Card, Placeholder } from 'semantic-ui-react';

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
      ? (
        <Card fluid>
          <Card.Content>
            <Card.Header>{this.state.season.name}</Card.Header>
            <Card.Description>SeasonID {this.state.season.id}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button fluid icon='arrow alternate circle left' labelPosition='left' content='Back' onClick={() => this.props.onHide()}/>
          </Card.Content>
        </Card>
      )
      : (<Placeholder>
        <Placeholder.Paragraph />
      </Placeholder>);
  }  
}

export default SeasonView;
