import React from 'react';
import { Button } from 'semantic-ui-react';

export default props => <Button
  fluid
  primary
  type='submit'
  content={props.content || 'Submit'}
  icon={props.icon || 'save outline'}
  labelPosition='left'
  disabled={props.disabled}
  onClick={props.onClick}
/>;
