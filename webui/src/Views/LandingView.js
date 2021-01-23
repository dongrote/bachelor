import React from 'react';
import { Grid } from 'semantic-ui-react';
import SignInForm from '../Components/SignInForm';

const LandingView = () => (
  <Grid columns={1}>
    <Grid.Row>
      <Grid.Column>
        <SignInForm />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default LandingView;
