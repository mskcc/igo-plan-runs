// #2 requirement, pooling together samples of same read length
// return map with keys equal to read length, and values are arrays of samples with matching read length

// numbers in Mils
const flowcells = {"SP": [[350,400], [700,800]], "S1": [[800,900], [1600,1800]], "S2": [[1800,1900], [3600,3800]], "S4": [[2400,2600], [9000,10000]]}


function poolSameRunLength(samples) {
    let map = {}
    let runLengths = []
    for (let sample of samples) {
      runLengths.push(sample.runType);
    }
    let runLengthSet = new Set(runLengths);
    runLengthSet.forEach(run => {
      map[run] = []
    })
    for (let sample of samples) {
      map[sample.runType].push(sample);
    }
    return map;
  }

// #3 Pool samples in user library in its own lane, no mix of user library 
// project with IGO or other user library is allowed
// 
function poolSameLibrary(samples) {
    let map = {}
    let libraries = []
    for (let sample of samples) {
      libraries.push(sample.requestName);
    }
    let librariesSet = new Set(libraries);
    librariesSet.forEach(run => {
      map[run] = []
    })
    for (let sample of samples) {
      map[sample.requestName].push(sample);
    }
    return map;
  }

  // #4 Pool samples from same project(request ID) in same run or make minimum pools for a project
  // all of same project should be on the same run

  function poolSameProject(samples) {
    let map = {}
    let projects = []
    for (let sample of samples) {
      projects.push(sample.requestId);
    }
    let projectsSet = new Set(projects);
    projectsSet.forEach(run => {
      map[run] = []
    })
    for (let sample of samples) {
      map[sample.requestId].push(sample);
    }
    return map;
  }




  module.exports = {
  poolSameRunLength,
  poolSameLibrary,
  poolSameProject
}


