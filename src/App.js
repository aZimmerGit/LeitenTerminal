import React from 'react';
import firebase from './firebase/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import places from './memStore'
import db from './firebase/firebasedb';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false, // Local signed-in state.
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleSubmit(event) {
    event.preventDefault()
    if (event.target.name.value) {
    console.log('event', event.target.name.value)
    }
    console.log('places', places)
  }

  handleClick(event) {
    event.preventDefault();
    places.forEach(elem => {
      db.collection('places').add({
        id: elem.id,
        name: elem.name,
        latlng: {
          latitude: elem.latlng.latitude,
          longitude: elem.latlng.longitude,
        },
        description: elem.description,
        streetAddress: elem.streetAddress,
        useage: elem.useage,
        filtOpts: elem.filtOpts,
        phone: elem.phone,
        website: elem.website,
      }).then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
      })
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div className="App">
          <header className="App-header">
        <Container>
          <Card className="App-card">
            <Card.Body>
              <h1>Leiten</h1>
              <p>Please sign-in:</p>
            </Card.Body>
            <Card.Body>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </Card.Body>
          </Card>
        </Container>
        </header>
        </div>
      );
    }
    if (this.state.isSignedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <p>Add New Places Here</p>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter name"
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formId">
                  <Form.Label>id</Form.Label>
                  <Form.Control
                    name="id"
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="formLat">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control name="latitude" type="text" placeholder="lat" />
                </Form.Group>
                <Form.Group as={Col} controlId="formLng">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    name="longitude"
                    type="text"
                    placeholder="lng"
                  />
                </Form.Group>
              </Form.Row>

              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" placeholder="1234 Main St" />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" placeholder="1234 Main St" />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" placeholder="5555555555" />
              </Form.Group>

              <Form.Group controlId="formDesc">
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" as="textarea" rows="3" />
              </Form.Group>

              <Button type="button" onClick={this.handleSubmit}>Submit</Button>
            </Form>
            <Card className="App-card">
              <Card.Body>
                <Button type="button" variant="info" onClick={this.handleClick}>
                  push data
                </Button>
              </Card.Body>
            </Card>
          </header>
        </div>
      );
    }
  }
}

export default App;
