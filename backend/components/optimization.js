const { Run } = require('./Run');
const { Sample } = require('./Sample');


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

  let sample1 = new Sample('09838_10_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 120, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample2 = new Sample('09838_11_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 300, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample3 = new Sample('09838_9_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 500, 'sWGS', 
  '09838', 82.9, 'nM');
  let arr = [sample1, sample2, sample3]

  function sampleCombinations(arr) {
    let result = [];
    function recurse(current, index){
        result.push(current);
        for(let i = index; i < arr.length; i++) {
            recurse(current.concat(arr[i]), i + 1);
        }
    }
    recurse([], 0);
    
    return result;
};
  console.log("combinations", sampleCombinations(arr));
  

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

function binPacking(arr) { //takes in 
  let capacities = [800, 1800, 3800, 10000];
  let runs = ['SP', 'S1', 'S2', 'S4'];
  let totalReads = arr.reduce((acc, ele) => {
    return acc + ele;
  }, 0);
  console.log(totalReads);
  function findWeight(totalReads) {
    let weight = 0;
    let run = ''
    for(let i = 0; i< capacities.length; i++) {
      if (totalReads >= capacities[i]) {
        weight = capacities[i]
        run = runs[i]
      }
    }
    return [weight, run];
  }
  let weight = findWeight(totalReads)[0];
  let run = findWeight(totalReads)[1];
  console.log(weight);
  console.log("run", run);
  arr.sort((a,b) => b-a);
  let samples = arr;
  let secondArr = JSON.parse(JSON.stringify(arr));
samples.sort((a,b) => b-a);

  let res =[];
  let i = 0;
  let j = 0;
  while(samples.length > 0) {
    while (i < samples.length) {
      if(weight > 0) {
      weight -= samples[i]
      samples.splice(i, 1)
      j += 1
      console.log('weight', weight);
    }
      else if (weight == 0) {
        res.push(run);
        remReads = samples.reduce((acc, el) => {
          return acc + el;
        }, 0);
        console.log('rem', remReads);
        weight = findWeight(remReads)[0]
        console.log('remWeight', weight);
        run = findWeight(remReads)[1]
      } 
      else if(weight < 0) {
        console.log("neg");
        weight += secondArr[j-1];
        console.log('arr',secondArr, secondArr[j-1]);
        console.log('newWeight', weight);
        i += 1;
      }
    } 
    return res;

}
}

let capacities = [800, 1800, 3800, 10000];
  let runs = ['SP', 'S1', 'S2', 'S4'];
  let totalReads = arr.reduce((acc, ele) => {
    return acc + ele;
  }, 0);
  console.log(totalReads);
  function findWeight(totalReads) {
    let weight = 0;
    let run = ''
    for(let i = 0; i< capacities.length; i++) {
      if (totalReads >= capacities[i]) {
        weight = capacities[i]
        run = runs[i]
      }
    }
    return [weight, run];
  }
  let initialWeight = findWeight(totalReads)[0];
  let initialRun = findWeight(totalReads)[1];

function recurse(samples, weight, run) {
  let arr = JSON.parse(JSON.stringify(samples));
arr.sort((a,b) => b-a);
let secondArr = JSON.parse(JSON.stringify(arr));
  let res = []
  let i =0;
  let j = 0;
  console.log(arr);
  if(arr.length == 0) {
    return res;
  } 
  while(arr.length > 0) {
    weight -= arr[i]
      arr.splice(i, 1);
      j += 1;
      console.log('weight', weight);
      console.log("second", secondArr);
      if(weight <= 0) {
        if (weight == 0) { //add range to statement
          res.push(run);
          console.log('res', res);
              remReads =arr.reduce((acc, el) => {
                return acc + el;
              }, 0);
              console.log('rem', remReads);
              weight = findWeight(remReads)[0]
              console.log('remWeight', weight);
              run = findWeight(remReads)[1];
              console.log("remRUn", run);
              recurse(arr, weight, run);
        } else if (weight < 0) {
          weight += arr[j-1];
          arr.unshift(secondArr[j-1])
          recurse(arr, weight, run)
          console.log('arr', secondArr);
          console.log("neg");
          console.log(samples)
          console.log(weight);
        }
        
  } 
// }// } if (weight < 0){
//   //   console.log(arr[j-1]);
//   //   weight += arr[j-1];
//   //   samples.shift(arr[j-1]);
//   //   recurse(samples, weight, run);
//   // }
  
  }
}
// console.log("bin", binPacking([1000, 400, 800, 450, 300]));
console.log(recurse([1000, 400, 800, 450, 300], 1800, 'S1'))


function plan(samples) {
  let capacities = [800, 1800, 3800, 10000];
  let runs = ['SP', 'S1', 'S2', 'S4'];
  let totalReads = arr.reduce((acc, ele) => {
    return acc + ele;
  }, 0);
  console.log(totalReads);
  function findWeight(totalReads) {
    let weight = 0;
    let run = ''
    for(let i = 0; i< capacities.length; i++) {
      if (totalReads >= capacities[i]) {
        weight = capacities[i]
        run = runs[i]
      }
    }
    return [weight, run];
  }
  let weight = findWeight(totalReads)[0];
  let run = findWeight(totalReads)[1];
  
  function bins(samples, weight, run, res){
    let rem = weight;
    samples.sort((a,b) => b-a);
    for(let i =0; i < samples.length; i++) {
      if (rem >= samples[i]) {
        rem = rem-samples[i];
      } else {
        res.push(run);
        rem = weight - samples[i];
      }
    }
    return res;
  }
  console.log(bins(samples, weight, run, [])); 
}

console.log(plan([1000, 400, 800, 450, 300]))
module.exports = {
   optimizeRuns,
   optimizeUserLibraries,
   planRuns,

}


