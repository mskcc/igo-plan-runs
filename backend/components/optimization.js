const { Run } = require('./Run');



const optimizeLanes = (samples) => {

}

const optimizeRemaining = (samples) => {

}



const optimizeRuns = (samples) => {
    const costs = {'SP': 1, 'S1': 2, 'S2': 3, 'S4': 4}
    let numRuns = 4;
    const capacity = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]}
    let res = [];

    function backtrack(remaining, subarray, start, targetRange) {
        if (remaining == 0) {
            res.push(subarray);
            return;
        } else if(remaining < 0) {
            return;
        }
        for(let i = start; i < samples.length; i++) {
            subarray.push(samples[i]);
            backtrack(remaining-samples[i].readsRequested, subarray, i, targetRange);
            subarray.pop()
        }
    }
    backtrack(7000, [], 0,[9000, 10000] );
    return res;
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
   optimizeRuns,
   optimizeUserLibraries,
   planRuns,
   
}


