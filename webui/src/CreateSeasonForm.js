import React from 'react';
import { Form, Grid, Button } from 'semantic-ui-react';

export default props => (
  <Form>
    <Form.Field required>
      <label>Season Name</label>
      <input placeholder='Bachelor(ette) Season N' />
    </Form.Field>
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <Button primary fluid type='submit' content='Create' onClick={() => alert('lol')} />
        </Grid.Column>
        <Grid.Column>
          <Button fluid content='Cancel' onClick={props.onCancel} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Form>
);