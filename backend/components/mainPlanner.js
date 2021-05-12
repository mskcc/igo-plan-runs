const { determineFlowCells } = require('./runPlanner');
const { splitBarcodes } = require('./barcodeCollisions');
const { groupUserLibraries } = require('./groupUserLibraries');
const { poolSameProject, poolSameRunLength, poolSameLibrary } = require('./PoolFunctions');

const fs = require('fs');

let raw = fs.readFileSync('./samples.json');
let data = JSON.parse(raw);

function mainRunPlanner(samples) {
  let result = { Runs: [], Lanes: [], Remaining: [] };
  let allProjects = poolSameProject(samples);
  let nonUserProjects = [];
  let userProjects = [];
  for (let project of allProjects) {
    if (!project.isUserLibrary()) {
      nonUserProjects.push(project);
    } else {
      userProjects.push(project);
    }
  }
  let userLibraries = groupUserLibraries(userProjects);
  // console.log('user libraries', userLibraries);
  let runLengthMap = poolSameRunLength(nonUserProjects);
  let flowcells;
  let processedRunsByBarcodes = [];
  for (let [runLength, projects] of Object.entries(runLengthMap)) {
    let data = determineFlowCells(projects, runLength);
    flowcells = data['Runs'];
    let remainingProjects = data['Remaining'];
    for (let project of remainingProjects) {
      for (let sample of project.samples) {
        result['Remaining'].push(sample);
      }
    }
    // result['Remaining'].push(remainingProjects); // don't fit in run
    for (let run of flowcells) {
      processedRunsByBarcodes.push(splitBarcodes(run));
    }
  }
  for (let run of userLibraries['Runs']) {
    result['Runs'].push(run);
  }

  for (let pool of processedRunsByBarcodes) {
    for (let run of pool['Runs']) {
      result['Runs'].push(run);
    }
    for (let rem of pool['Remaining']) {
      result['Remaining'].push(rem);
    }
  }
  return result;
}

console.log('main', mainRunPlanner(data));

module.exports = {
  mainRunPlanner,
};
