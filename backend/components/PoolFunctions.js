// #2 requirement, pooling together samples of same read length
// return map with keys equal to read length, and values are arrays of samples with matching read length

const { Project } = require("./Project");
const { Run } = require("./Run");
const { Sample } = require("./Sample");
const { Lane }  = require('./Lane');
// numbers in Mils
const flowcells = {"SP": [[350,400], [700,800]], "S1": [[800,900], [1600,1800]], "S2": [[1800,1900], [3600,3800]], "S4": [[2400,2600], [9000,10000]]}


function poolSameRunLength(projects) {
    let map = {}
    let runLengths = []
    for (let project of projects) {
      runLengths.push(project.runLength);
    }
    let runLengthSet = new Set(runLengths);
    runLengthSet.forEach(runLength => {
      map[runLength] = []
    })
    for (let project of projects) {
      map[project.runLength].push(project);
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
    let projectObjects = [];
    for (let sample of samples) {
      projects.push(sample.requestId)
    }
    let projectsSet = new Set(projects);
    projectsSet.forEach(project => {
      map[project] = [] //key is requestId, value is array of 
    })
    for (let sample of samples) {
      map[sample.requestId].push(sample);
    }
    console.log("map", map)
    for(let sample of Object.values(map)) {
      let obj = new Project(sample[0].requestId, sample[0].runType, [], sample[0].recipe,
        sample[0].requestName);
        projectObjects.push(obj);
    }
    for (let sample of samples) {
      for(let obj of projectObjects) {
        if (sample.requestId == obj.requestId) {
          obj.samples.push(new Sample(sample.sampleId, sample.pool, sample.barcodeSeq, sample.recipe, sample.runLength,
            sample.readNum, sample.requestName, sample.requestId, sample.altConcentration, sample.concentrationUnits));
        
        }
      }
    }

    for(let project of projectObjects) {
      project.addSampleReads();
    }
    return projectObjects;
  }

  function optimizeUserLibraries(projects) {
    let readCount = 0
    let res = []
    for(let project of projects) {
      project.isUserLibrary();
      let runLength = project.runLength;
      if(project.userLibrary) {
          for(let sample of project.samples) {
            readCount += sample.readsRequested;
          }

      if(readCount < 800) {
        let run = new Run(null, 0,'SP', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run)
        
      }
      else if (readCount < 1800) {
        let run = new Run(null, 0, 'S1', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run)
        
      } else if (readCount < 3800) {
        let run = new Run(null, 0, 'S2', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run);
        
      } else {
        let run = new Run(null, 0, 'S4', runLength);
        run.totalReads += readCount;
        run.projects.push(project);
        res.push(run);
      }
    }

    }
    return res;
  }

  



  module.exports = {
  poolSameRunLength,
  poolSameLibrary,
  poolSameProject,
  optimizeUserLibraries,
}


