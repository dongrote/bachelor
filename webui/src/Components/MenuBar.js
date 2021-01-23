import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Icon } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

class MenuBar extends Component {
  state = {name: '', logout: false};
  async onSignOut() {
    const res = await fetch('/auth/logout');
    if (res.ok) {
      this.setState({logout: true});
    }
  }
  async fetchProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const json = await res.json();
      this.setState({name: json.displayName});
    }
  }
  async componentDidMount() {
    await this.fetchProfile();
  }
  render() {
    if (this.state.logout) return <Redirect to='/' />;
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Link to='/dashboard'>
              <Button basic icon='home' labelPosition='left' content='Home' />
            </Link>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Button
              basic
              icon='sign-out'
              labelPosition='right'
              content={this.state.name}
              onClick={() => this.onSignOut()}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='mobile' columns={4}>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}`}>
                <Button primary fluid icon='info circle' />
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/episodes`}>
                <Button primary fluid icon='list alternate outline' />
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/picks`}>
                <Button primary fluid icon='tasks' />
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/friends`}>
                <Button disabled primary fluid icon='group' />
              </NavLink>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row only='tablet computer' columns={4}>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}`}>
                <Button fluid primary>
                  <Icon name='info circle' /> Season Details
                </Button>
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/episodes`}>
                <Button fluid primary>
                  <Icon name='list alternate outline' /> Episodes
                </Button>
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/picks`}>
                <Button fluid primary>
                  <Icon name='tasks' /> Picks
                </Button>
              </NavLink>
          </Grid.Column>
          <Grid.Column>
              <NavLink to={`/season/${this.props.SeasonId}/friends`}>
                <Button disabled fluid primary>
                  <Icon name='group' /> Friends
                </Button>
              </NavLink>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default MenuBar;
