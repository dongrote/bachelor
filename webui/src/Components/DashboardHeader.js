import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

const DashboardHeader = props => (
  <Header as='h1'>
    <Icon name='user outline' circular />
    Welcome, {props.displayName}.
  </Header>
);

export default DashboardHeader;
