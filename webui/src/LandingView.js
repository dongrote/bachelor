import React from 'react';
import { Segment, Divider, Grid } from 'semantic-ui-react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

export default props => (
  <Grid columns={1}>
    <Grid.Row only='mobile'>
      <Grid.Column>
        <SignInForm onSignIn={props.onSignIn} />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row only='tablet computer'>
      <Grid.Column>
       <Segment>
        <Grid columns={2}>
          <Grid.Column>
            <Grid.Row>
              <SignUpForm onSignUp={props.onSignIn}/>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column>
            <Grid.Row>
              <SignInForm onSignIn={props.onSignIn}/>
            </Grid.Row>
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);
