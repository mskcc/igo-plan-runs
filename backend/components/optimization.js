const { Run } = require('./Run');
const { Sample } = require('./Sample');



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

  let sample1 = new Sample('09838_10_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 120, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample2 = new Sample('09838_11_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 300, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample3 = new Sample('09838_9_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 500, 'sWGS', 
  '09838', 82.9, 'nM');
  let arr = [sample1, sample2, sample3]


  

  function planRuns(samples) { //takes in array of samples 
    
    const rangeLanes = {"SP": [350, 400], "S1": [800,900], "S2": [1800, 1900], "S4": [2400, 2600]};
    const rangeRuns = {'SP':[700,800], 'S1': [1600, 1800], 'S2': [3600, 3800], 'S4': [9000, 10000]};
    
    const result = {"Runs": [], "Lanes": [], "Remaining": []} //runs array - array of run objects, lanes array of lane objects, remaining array- array of samples
    let ranges = Object.values(rangeLanes)
    let ranges2 = Object.values(rangeRuns);
    let res = samples;
    for(let sample of sampleCombinations(samples)) {
        let totalReads = 0;
        for(let element of sample) {
            totalReads += element.readsRequested;
          
        }
        if (totalReads >= ranges2[0][0] && totalReads <= ranges2[0][1]) {
          let spRun = {"SP": []};
          for(let el of sample) {
            let idx = arr.indexOf(el);
            spRun["SP"].push(el);
            arr.splice(idx, 1);
          }
          result['Runs'].push(spRun);
          console.log('runs', result['Runs']);
        }
        else if(totalReads >= ranges2[1][0] && totalReads <= ranges2[1][1]) {
          let s1Run = {'S1': []};
          for(let el of sample) {
            let idx = arr.indexOf(el);
            s1Run['S1'].push(el);
            arr.splice(idx, 1);
          }
          result['Runs'].push(s1Run);
        } else if(totalReads >= ranges2[2][0] && totalReads <= ranges2[2][1]) {
          let s2Run = {'S2': []};
          for(let el of sample) {
            let idx = arr.indexOf(el);
            s2Run['S2'].push(el);
            arr.splice(idx, 1);
          }
        } else if (totalReads >= ranges2[3][0] && totalReads <= ranges3[3][1]) {
          let s4Run = {'S4':[]};
          for(let el of sample) {
            let idx = arr.indexOf(el);
            s4Run['S4'].push(el);
            arr.splice(idx, 1);
          }
        }
        console.log('arr', arr);
        if (totalReads < ranges[0][0] || (totalReads > ranges[0][1] && totalReads < ranges[1][0]) || (totalReads > ranges[1][1] && totalReads < ranges[2][0]) ||  
        (totalReads > ranges[2][1] && totalReads < ranges[3][0]) || (totalReads > ranges[3][1])){
        for(let e of arr) {
          console.log("element", e);
          if(!result["Remaining"].includes(e)) {
            result["Remaining"].push(e);  
          } 
        }
        console.log("remaining", result["Remaining"]);
      }
    }
    
        
    
return result;
  }

// console.log("result", planRuns(arr));

module.exports = {
   optimizeUserLibraries,
   planRuns,

}


