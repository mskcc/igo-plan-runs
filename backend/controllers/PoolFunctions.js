// #2 requirement, pooling together samples of same read length
// return map with keys equal to read length, and values are arrays of samples with matching read length

const { Project } = require("../components/Project");
const { Run } = require("../components/Run");
const { Sample } = require("../components/Sample");
const { Lane }  = require('../components/Lane');
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
    
    for(let sample of Object.values(map)) {
      console.log(sample);
      let obj = new Project(sample[0].requestId, sample[0].runType, [], sample[0].recipe,
        sample[0].requestName);
        projectObjects.push(obj);
    }
    for (let sample of samples) {
      for(let obj of projectObjects) {
        if (sample.requestId == obj.requestId) {
          obj.samples.push(new Sample(sample.sampleId, sample.barcodeSeq, sample.recipe, sample.runLength,
            sample.readsRequested, sample.requestName, sample.requestId, sample.altConcentration, sample.concentrationUnits));
        
        }
      }
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


  function planRuns(samples) { //takes in array of samples 
    const rangeLanes = {"SP": [350, 400], "S1": [800,900], "S2": [1800, 1900], "S4": [2400, 2600]};
    const result = {"Runs": [], "Lanes": [], "Remaining": []} //runs array - array of run objects, lanes array of lane objects, remaining array- array of samples
   let totalReads = 0
    for(let sample of samples) {
      let ranges = Object.values(rangeLanes)
      totalReads += sample.readsRequested;
      // case where samples don't fit on a lane of any flow cell, so leftover
      if (totalReads < ranges[0][0] || (totalReads > ranges[0][1] && totalReads < ranges[1][0]) || (totalReads > ranges[1][1] && totalReads < ranges[2][0]) ||  
      ( totalReads > ranges[2][1] && totalReads < ranges[3][0]) || (totalReads > ranges[3][1])){
          result["Remaining"].push(sample);
      }
    }
return result;
  }

  var sampleCombinations = function(samples) {
    let result = [];
    dfs([], 0);
    
    function dfs(current, index){
        result.push(current);
        for(let i = index; i < nums.length; i++) {
            dfs(current.concat(nums[i]), i + 1);
        }
    }
    
    return result;
};

  module.exports = {
  poolSameRunLength,
  poolSameLibrary,
  poolSameProject,
  optimizeUserLibraries,
  planRuns
}


