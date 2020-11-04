import React from 'react';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';

const menuItems = [
  {value: 'seasons', text: 'Seasons', icon: 'calendar alternate outline'},
  {value: 'profile', text: 'My Profile', icon: 'user'},
];

export default props => (
  <Sidebar
    as={Menu}
    animation='uncover'
    direction='left'
    width='thin'
    visible={props.visible}
    vertical
  >
    <Menu.Item active primary as='a'>
      <Icon name='user circle' color={props.role === 'admin' ? 'red' : undefined} />
      {props.displayName}
    </Menu.Item>
    {menuItems.map((mi, i) => (
      <Menu.Item key={i} active={props.selected === mi.value} as='a' onClick={() => props.onClick(mi.value)}>
        {mi.icon && <Icon name={mi.icon} />}
        {mi.text}
      </Menu.Item>
    ))}
    <Menu.Item as='a' onClick={async () => {
      const res = await fetch('/auth/logout');
      if (res.ok) {
        window.location.reload();
      }
    }}>
      <Icon name='sign out' />
      Sign Out
    </Menu.Item>
  </Sidebar>
);
