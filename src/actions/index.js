import axios from 'axios';
import GeneticAlgorithm from '../genetic_algorithm';
import { SET_ROUTE_SEQUENCE, SET_LOADING } from './types';

export const requestOsrm = inputs => {
  return async dispatch => {
    const points = [];
    inputs.markers.forEach(input => {
      points.push([input.position.lng, input.position.lat]);
    });

    const durations = Array(points.length).fill().map(() => Array(points.length).fill(0));
    for (let row = 0; row < points.length - 1; row++) {
      for (let col = row + 1; col < points.length; col++) {
        await axios.get(`http://router.project-osrm.org/route/v1/driving/${points[row][0]},${points[row][1]};${points[col][0]},${points[col][1]}`)
          .then(response => {
            durations[row][col] = response.data.routes[0].duration;
            durations[col][row] = durations[row][col];
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    const ga = new GeneticAlgorithm(
      durations,
      inputs.populationSize,
      inputs.mutationRate,
      inputs.crossoverRate,
      inputs.elitismCount,
      inputs.tournamentSize
    );
    ga.updateFitness();

    for (let i = 0; i < inputs.generations; i++) {
      ga.crossoverPopulation();
      ga.mutatePopulation();
      ga.updateFitness();
    }
    ga.population.sort(ga.individualComparator);
    //ga.printIndividuals();
    //console.log('Time Taken:');
    // Because OSRM returns time taken for walking speed, I have to convert to driving speed
    //console.log(Math.ceil((1 / ga.population[0].fitness) / 7.5));

    const totalMinutes = Math.ceil((1 / ga.population[0].fitness) / 7.5);
    const hours = parseInt(totalMinutes / 60, 10);
    const minutes = parseInt(totalMinutes % 60, 10);

    dispatch({
      type: SET_ROUTE_SEQUENCE,
      payload: {
        route: ga.population[0].chromosome,
        timeTaken: {
          hours,
          minutes
        }
      }
    });

    /*
    dispatch({
      type: SET_LOADING,
      payload: false
    });
    */
  };
};

export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    payload: loading
  };
};
