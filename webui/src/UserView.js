import React, { Component } from 'react';
import { Button, Segment, Sidebar } from 'semantic-ui-react';
import NavigationSidebar from './NavigationSidebar';
import UserProfile from './UserProfile';
import SeasonsView from './SeasonsView';

class UserView extends Component {
  state = {menuVisible: false, selectedMenuItem: 'seasons'};
  toggleMenu() {
    this.setState({menuVisible: !this.state.menuVisible});
  }
  render() {
    return (
      <Sidebar.Pushable>
        <NavigationSidebar
          visible={this.state.menuVisible}
          selected={this.state.selectedMenuItem}
          displayName={this.props.displayName}
          role={this.props.role}
          onClick={selectedMenuItem => {
            this.setState({selectedMenuItem});
            this.toggleMenu();
          }}
        />
        <Sidebar.Pusher>
          <Segment.Group>
            <Segment textAlign='left'>
              <Button basic icon='list' onClick={() => this.toggleMenu()} />
            </Segment>
            {this.state.selectedMenuItem === 'seasons' && (
              <Segment>
                <SeasonsView />
              </Segment>
            )}
            {this.state.selectedMenuItem === 'profile' && (
              <Segment>
                <UserProfile />
              </Segment>
            )}
          </Segment.Group>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default UserView;
