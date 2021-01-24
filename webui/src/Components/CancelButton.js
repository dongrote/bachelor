import React from 'react';
import { Button } from 'semantic-ui-react';

export default props => <Button
  fluid
  content={props.content || 'Cancel'}
  icon={props.icon || 'close'}
  labelPosition='left'
  disabled={props.disabled}
  onClick={props.onClick}
/>;
