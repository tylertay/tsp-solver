const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

class Individual {
  constructor(numPoints) {
    const points = Array.apply(null, { length: numPoints }).map(Number.call, Number);
    shuffleArray(points);
    this.chromosome = points;
    this.fitness = 0.0;
    this.fitness_set = false;
  }
}

class GeneticAlgorithm {
  constructor(timeMatrix, populationSize, mutationRate, crossoverRate,
    elitismCount, tournamentSize) {
    populationSize = parseInt(populationSize, 10) || 0;
    mutationRate = parseFloat(mutationRate, 10) || 0;
    crossoverRate = parseFloat(crossoverRate, 10) || 0;
    elitismCount = parseInt(elitismCount, 10) || 0;
    tournamentSize = parseInt(tournamentSize, 10) || 0;

    this.timeMatrix = timeMatrix;
    this.population = [];
    for (let i = 0; i < Math.max(populationSize, 1); i++) {
      this.population.push(new Individual(timeMatrix.length));
    }
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.elitismCount = elitismCount;
    this.tournamentSize = tournamentSize;

    this.checkInputs();
  }

  individualComparator(a, b) {
    return b.fitness - a.fitness;
  }

  checkInputs() {
    if (this.populationSize < 1) {
      console.warn('Population size must be at least 1. Setting it to 1.');
      this.populationSize = 1;
    }

    if (this.mutationRate < 0 || this.mutationRate > 1) {
      console.warn('Mutation rate should be between 0.0 and 1.0.');
    }

    if (this.crossoverRate < 0 || this.crossoverRate > 1) {
      console.warn('Crossover rate should be between 0.0 and 1.0.');
    }

    if (this.elitismCount > this.populationSize) {
      console.warn('Elitism count is set higher than population count.');
    }
    if (this.elitismCount < 0) {
      console.warn('Elitism count cannot be negative. Setting it to 0.');
      this.elitismCount = 0;
    }

    if (this.tournamentSize < 1) {
      console.warn('Tournament size cannot be less than 1. Setting it to 1.');
      this.tournamentSize = 1;
    }
  }

  // TOOD: Remove this
  printIndividuals() {
    for (const ind of this.population) {
      console.log(ind.chromosome);
      console.log(ind.fitness);
    }
  }

  updateFitness() {
    for (const individual of this.population) {
      if (!individual.fitness_set) {
        let totalTime = 0.0;
        for (let i = 0; i < individual.chromosome.length - 1; i++) {
          totalTime += this.timeMatrix[individual.chromosome[i]][individual.chromosome[i + 1]];
        }
        individual.fitness = 1 / totalTime;
        individual.fitness_set = true;
      }
    }
  }

  selectParent() {
    const tournament = this.population.slice(0, this.tournamentSize);
    tournament.sort(this.individualComparator);
    return tournament[0];
  }

  crossoverPopulation() {
    this.population.sort(this.individualComparator);

    for (let i = this.elitismCount; i < this.population.length; i++) {
      const parent1 = this.population[i];

      if (this.crossoverRate > Math.random()) {
        parent1.fitness_set = false;
        const parent2 = this.selectParent();
        const currentChromosome = [parent1.chromosome[0]];

        let p = parent1.chromosome[0];
        for (let chromosomeIndex = 1; chromosomeIndex < parent1.chromosome.length;
          chromosomeIndex++) {
          // Choose a better route next
          // Lesser refers lesser time
          let pLesser = parent1.chromosome[chromosomeIndex];
          let pGreater = parent2.chromosome[chromosomeIndex];
          if (this.timeMatrix[p][pLesser] > this.timeMatrix[p][pGreater]) {
            const temp = pLesser;
            pLesser = pGreater;
            pGreater = temp;
          }

          // If already in chromosome, choose the non-optimal route
          if (currentChromosome.indexOf(pLesser) !== -1) {
            p = pGreater;
          } else {
            p = pLesser;
          }
        }
      }
    }
  }

  mutatePopulation() {
    this.population.sort(this.individualComparator);

    for (let i = this.elitismCount; i < this.population.length; i++) {
      const individual = this.population[i];
      for (let geneIndex = 0; geneIndex < individual.chromosome.length; geneIndex++) {
        if (this.mutationRate > Math.random()) {
          individual.fitness_set = false;
          const newGeneIndex = Math.floor(Math.random() * individual.chromosome.length);

          // Swap position
          const temp = individual.chromosome[geneIndex];
          individual.chromosome[geneIndex] = individual.chromosome[newGeneIndex];
          individual.chromosome[newGeneIndex] = temp;
        }
      }
    }
  }
}

export default GeneticAlgorithm;
