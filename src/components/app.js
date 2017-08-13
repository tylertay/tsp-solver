import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import { MyGoogleMap } from './MyGoogleMap';
import { requestOsrm, setLoading } from '../actions';

class App extends Component {
  state = {
    markers: [],
    populationSize: '150',
    mutationRate: '0.01',
    crossoverRate: '0.9',
    elitismCount: '4',
    tournamentSize: '5',
    generations: '4000',
    directions: []
  };

  componentWillReceiveProps(nextProps) {
    const DirectionsService = new google.maps.DirectionsService;
    const { markers } = this.state;
    const { routeSequence } = nextProps;
    const { route } = routeSequence;

    if (route) {
      const waypoints = [];
      for (let i = 1; i < route.length - 1; i++) {
        waypoints.push({
          location: new google.maps.LatLng(markers[route[i]].position.lat,
            markers[route[i]].position.lng),
          stopover: false
        });
      }
      DirectionsService.route({
        origin: new google.maps.LatLng(
          markers[route[0]].position.lat,
          markers[route[0]].position.lng
        ),
        destination: new google.maps.LatLng(
          markers[route[route.length - 1]].position.lat,
          markers[route[route.length - 1]].position.lng
        ),
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }

  getTimeString = () => {
    const { timeTaken } = this.props.routeSequence;
    // Time not set
    if (timeTaken.minutes === '') {
      return '';
    }
    let hourS = 'hour';
    if (timeTaken.hours > 1) {
      hourS = 'hours';
    }
    let minuteS = 'minute';
    if (timeTaken.minutes > 1) {
      minuteS = 'minutes';
    }
    return `${timeTaken.hours} ${hourS} ${timeTaken.minutes} ${minuteS}`;
  }

  mapClick = ({ latLng }) => {
    const { lat, lng } = latLng;
    const markers = this.state.markers;
    // markers.push([lat(), lng()])
    markers.push({
      position: {
        lat: lat(), lng: lng()
      }
    });
    this.setState({ markers });
  };

  solveButtonClick = () => {
    if (this.state.markers.length < 2) {
      // TODO: Display message
      console.warn('Please plot at least 2 points.');
      return;
    }

    this.props.setLoading(true);
    this.props.requestOsrm(this.state);
  };

  renderLoadingOverlay = () => {
    return (
      <Loadable
        active
        spinner
        text='Finding route...'
        style={styles.loadOverlayStyle}
      />
    );
  };

  render() {
    return (
      <div className="row fill_height">
        {this.props.loading ? this.renderLoadingOverlay() : ''}
        <MyGoogleMap
          containerElement={
            <div style={{ height: '75%' }} />
          }
          mapElement={
            <div style={{ height: '100%' }} />
          }
          onMapClick={this.mapClick}
          markers={this.state.markers}
          labels={this.props.routeSequence.route}
          directions={this.state.directions}
        />
        <div className="col-md-12" id="input_container">
          <div className="col-md-4">
            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="populationSize">Population Size</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="populationSize"
                  value={this.state.populationSize}
                  onChange={event => this.setState({ populationSize: event.target.value })}
                />
              </div>
            </div>
            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="mutationRate">Mutation Rate</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="mutationRate"
                  value={this.state.mutationRate}
                  onChange={event => this.setState({ mutationRate: event.target.value })}
                />
              </div>
            </div>
            <text>Route Time: {this.getTimeString()}</text>
          </div>

          <div className="col-md-4">
            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="crossoverRate">Crossover Rate</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="crossoverRate"
                  value={this.state.crossoverRate}
                  onChange={event => this.setState({ crossoverRate: event.target.value })}
                />
              </div>
            </div>
            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="elitismCount">Elitism Count</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="elitismCount"
                  value={this.state.elitismCount}
                  onChange={event => this.setState({ elitismCount: event.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="tournamentSize">Tournament Size</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="tournamentSize"
                  value={this.state.tournamentSize}
                  onChange={event => this.setState({ tournamentSize: event.target.value })}
                />
              </div>
            </div>

            <div className="form-group col-md-12">
              <label className="col-md-5" htmlFor="generations">Generations</label>
              <div className="col-md-7">
                <input
                  type="text"
                  name="generations"
                  value={this.state.generations}
                  onChange={event => this.setState({ generations: event.target.value })}
                />
              </div>
            </div>

            <input
              onClick={this.solveButtonClick}
              type="button"
              className="btn btn-primary"
              id="solve_button"
              value="Solve"
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  loadOverlayStyle: {
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

const mapStateToProps = (state) => {
  const {
    routeSequence,
    loading
  } = state;
  return { routeSequence, loading };
};

export default connect(mapStateToProps, { requestOsrm, setLoading })(App);
