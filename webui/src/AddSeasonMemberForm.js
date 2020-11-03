import React, { Component } from 'react';
import { Button, Grid, Header, Select } from 'semantic-ui-react';

class AddSeasonMemberForm extends Component {
  state = {
    availableUsers: [],
    availableUserRoles: [
      {key: 'owner', value: 'owner', text: 'Owner'},
      {key: 'member', value: 'member', text: 'Member'},
      {key: 'spectator', value: 'spectator', text: 'Spectator'},
    ],
  };
  async fetchAvailableUsers() {
    const res = await fetch('/api/users');
    if (res.ok) {
      const json = await res.json();
      const availableUsers = json.users
        .filter(u => u.ResourceGroupRoleBindings
          .every(binding => binding.ResourceGroupRole.ResourceGroupId !== this.props.ResourceGroupId));
      this.setState({availableUsers});
    }
  }
  async fetchAvailableUserRoles() {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/roles`);
    if (res.ok) {
      const json = await res.json();
      this.setState({availableUserRoles: json.roles.map(r => ({
        key: `${r.id}`,
        value: `${r.id}`,
        text: `${r.name}`,
      }))})
    }
  }
  async addMember(userId) {
    const res = await fetch(`/api/seasons/${this.props.seasonId}/members`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userId})
    });
    if (res.ok) {
      await this.fetchAvailableUsers();
    }
  }
  async componentDidMount() {
    await this.fetchAvailableUsers();
    await this.fetchAvailableUserRoles();
  }
  render() {
    return (<Grid>
      {this.state.availableUsers.map(u => (
        <Grid.Row>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Header content={u.displayName} />
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Select placeholder='User Role' options={this.state.availableUserRoles} />
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Button color='green' icon='plus' onClick={() => this.addMember(u.id)} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Row>
      ))}
      {this.state.availableUsers.length === 0 && (
        <Grid.Row>
          <p>No Available Users</p>
        </Grid.Row>
      )}
      <Grid.Row>
        <Grid.Column>
          <Button fluid content='Cancel' onClick={() => this.props.onCancel()} />
        </Grid.Column>
      </Grid.Row>
    </Grid>)
  }
}

export default AddSeasonMemberForm;
