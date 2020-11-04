import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import EditProfileButton from './EditProfileButton';

class UserProfile extends Component {
  state = {
    displayName: null,
    role: null,
    username: null,
  };
  async fetchUserProfile() {
    const res = await fetch('/api/users/profile');
    if (res.ok) {
      const json = await res.json();
      this.setState({
        displayName: json.displayName,
        role: json.systemRole,
        username: json.username,
        firstName: json.firstName,
        lastName: json.lastName,
      });
    }
  }
  async componentDidMount() {
    await this.fetchUserProfile();
  }
  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>{this.state.displayName}</Card.Header>
          <Card.Meta>System Role: {this.state.role}</Card.Meta>
          <Card.Description>{this.state.username}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <EditProfileButton />
        </Card.Content>
      </Card>
    );
  }
}

export default UserProfile;
