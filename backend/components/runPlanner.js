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
  
  
  function runPlan(arr) { //takes in 
      let capacities = [800, 1800, 3800, 10000];
      let runs = ['SP', 'S1', 'S2', 'S4'];
      let ranges = [100, 200, 200, 1000];
      let runRanges = [[700, 800], [1600, 1800], [3600, 3800], [9000, 10000]]
      let totalReads = arr.reduce((acc, ele) => {
        return acc + ele;
      }, 0);
      console.log(totalReads);
      function findWeight(totalReads) {
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
        return [weight, run, range];
      }
      let weight = findWeight(totalReads)[0];
      let run = findWeight(totalReads)[1];
      let range = findWeight(totalReads)[2];
  
      arr.sort((a,b) => b-a);
      let samples = arr;
      
    samples.sort((a,b) => b-a);
    
      let res =[];
      if(totalReads >= runRanges[0][0] && totalReads <= runRanges[0][1]) {
        res.push('SP');
        return res;
      } else if(totalReads >= runRanges[1][0] && totalReads <= runRanges[1][1]) {
        res.push('S1');
        return res;
      } else if(totalReads >= runRanges[2][0] && totalReads <= runRanges[2][1]){
        res.push('S2');
        return res;
      } else if(totalReads >= runRanges[3][0] && totalReads <= runRanges[3][1]) {
        res.push('S4');
        return res;
      }
  
  
  
      let i = 0;
      
      let remReads = totalReads;
      let remWeight = weight;
      let stack = []
      let remainingSamples = [];
  
  
  
      while(remReads > 0) {
        while (remWeight > 0) {
          if(remWeight > 0) {
          remWeight -= samples[i]
          remReads -= samples[i]
          stack.push(samples[i])
          samples.splice(i, 1)
          
          console.log('weight', remWeight);
          if (remWeight >= 0 && remWeight <= range) {
              res.push(run);
              console.log('rem', remReads);
              remWeight = findWeight(remReads)[0]
              console.log('remWeight', remWeight);
              run = findWeight(remReads)[1];
              range = findWeight(remReads)[2];
              console.log('range', range);
              i = 0;
              
            } 
        } if(remWeight < 0) {
            console.log("neg");
            let last = stack.pop()
            remWeight += last;
            samples.unshift(last);
            remainingSamples.push(last);
            console.log('newWeight', remWeight);
            i += 1;
          }
        } 
        return res;
    
    }
    }
  
    console.log("bin", runPlan([1000, 400, 800, 450, 300]));
  
    module.exports = {
        runPlan
    }