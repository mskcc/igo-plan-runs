function sampleCombinations(arr) { // function to find all sample combinations 
    let result = []; 
    function recurse(current, index){
        result.push(current);
        for(let i = index; i < arr.length; i++) {
            recurse(current.concat(arr[i]), i + 1);
        }
    }
    recurse([], 0);
    
    return result; // returns array of arrays of different sample combinations
  };
  
  function combinationSum(arr, target, range) {
    let res = [];
    function backtrack(rem, range, sub, start) {
      if (rem == 0) {
        res.push(sub);
        return
      } else if (rem  < 0) {
        return;
      } 
      for(let i = start; i < arr.length; i++) {
        sub.push(arr[i]);
        backtrack(rem-arr[i], range, sub, i);
        sub.pop()
      }
    }
    backtrack(target, range, [], 0);
    return res;
  }

  console.log(combinationSum([550, 400, 400], 800, 100));
  
  function runPlan(arr) { //takes in 
      let capacities = [800, 1800, 3800, 10000]; // max capacities of runs
      let runs = ['SP', 'S1', 'S2', 'S4']; // runs
      let ranges = [100, 200, 200, 1000]; // min-max ranges of runs
      let runRanges = [[700, 800], [1600, 1800], [3600, 3800], [9000, 10000]] // ranges of runs
      let totalReads = arr.reduce((acc, ele) => { // sums up reads of projects 
        return acc + ele;
      }, 0);
      console.log(totalReads);
      function findWeight(totalReads) { // finds the capacity of the max run smallest than the total reads, assigns it to "weight"
        let weight = 0;
        let run = ''
        let range = 0;
        for(let i = 0; i< capacities.length; i++) {
          if (totalReads >= capacities[i]) {
            weight = capacities[i]
            run = runs[i]
            range = ranges[i];
          }
        }
        return [weight, run, range]; //returns array of flow cell capacity to be used, run to be pushed to res, and range
      }
      let weight = findWeight(totalReads)[0];
      let run = findWeight(totalReads)[1];
      let range = findWeight(totalReads)[2];
  
      arr.sort((a,b) => b-a); // sorts array
      let samples = arr;

    
      let res =[]; // array of runs 
      if(totalReads >= runRanges[0][0] && totalReads <= runRanges[0][1]) { // if totalReads matches the capacity of a run
        res.push('SP'); //SP
        return res;
      } else if(totalReads >= runRanges[1][0] && totalReads <= runRanges[1][1]) {
        res.push('S1'); //S1
        return res;
      } else if(totalReads >= runRanges[2][0] && totalReads <= runRanges[2][1]){
        res.push('S2'); //S2
        return res;
      } else if(totalReads >= runRanges[3][0] && totalReads <= runRanges[3][1]) {
        res.push('S4'); //S4
        return res;
      }
  
  
  
      let i = 0; 
      
      let remReads = totalReads; 
      let remWeight = weight;
      let stack = [] // puts in samples that are accounted for in the stack
      let remainingSamples = []; // sample that don't belong in a run and are leftover 
      let lanes = []; //tbd
  
  
      while(remReads > 0) {
        while (remWeight > 0) {
          if(remWeight > 0) {
          remWeight -= samples[i]
          remReads -= samples[i]
          stack.push(samples[i])
          samples.splice(i, 1)
          
          console.log('weight', remWeight);
          if (remWeight >= 0 && remWeight <= range) {
              res.push(run); // push run to res array
              console.log('rem', remReads);
              remWeight = findWeight(remReads)[0] // create new remWeight
              console.log('remWeight', remWeight);
              run = findWeight(remReads)[1]; // create new run
              range = findWeight(remReads)[2]; // create new range
              console.log('range', range);
              i = 0; //  set i back to 0, to get first element of samples array
              
            } 
        } if(remWeight < 0) {
            console.log("neg");
            let last = stack.pop() // if negative weight, undo the last step and add the last sample back to the samples array
            remWeight += last;
            samples.unshift(last); // add the sample back to the samples array
            remainingSamples.push(last); // samples that don't fit in a run
            console.log('newWeight', remWeight);
            i += 1; // skip the sample that makes the weight negative 
          }
        } 
        return res;
    
    }
    }
  
    console.log("bin", runPlan([1000, 400, 800, 450, 300]));
  
    module.exports = {
        runPlan
    }