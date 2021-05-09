// var combinationSum = function(arr, target, range) {
//     arr.sort((a,b) => {
        
//         return a < b ? 1 : a > b ? -1 : 0;
//       })
//     let result = [];
//     visited = new Array(arr.length).fill(false);
        
//     function dfs(current, currentSum, startIndex, visited){
//         if(currentSum == target ) {
//             result.push(current);
//             return;
//         }
//         if ((target-currentSum) <= range && currentSum <= target) {
//             result.push(current)
//         }
//         if (currentSum > target) {
//             return;
//         }
//         for (let i = startIndex; i < arr.length; i++) {
//             if(i > 0 && arr[i] == arr[i - 1] && !visited[i - 1]) {
//                 continue;
//             }
//             visited[i] = true;
//             dfs(current.concat(arr[i]), currentSum + arr[i], i + 1, visited);
//             visited[i] = false;
//         }
//     }
    
//     dfs([], 0, 0, visited);
//     return result;
// };




let INF = 1000000000;
let MAX_ARR_LENGTH = 100;
let MAX_TARGET = 10000;




var combinationSum = function(arr, target, range) {
    let minCapacity = target - range;
    if (sumArrReads(arr) < minCapacity) {
      return [];
    }
    let sel = new Array(arr.length);
    let dp = new Array(arr.length);
    for (let i = 0; i <= target; i++) {
      sel[i] = new Array(target + 1).fill(0);
      dp[i] = new Array(target + 1).fill(-1);
    }
   
    // O(maxCapacity * len(arr)) = 10^4 * 100 = 10^6
    // O(maxCapacity * len(arr))
    // 10^7 ops / sec
    function rec(arr, index, remainingCapacity) {
      if (remainingCapacity < 0) {
        return INF;
      } else if (index >= arr.length) {
        var usedCapacity = target - remainingCapacity
        return (usedCapacity < minCapacity) ? INF : remainingCapacity;
      } else if (dp[index][remainingCapacity] != -1) {
        return dp[index][remainingCapacity];
      }
      let a = rec(arr, index + 1, remainingCapacity); // do not select the element
      let b = rec(arr, index + 1, remainingCapacity - arr[index]); // do select the element
      let minValue = INF;
      if (a < b) {
        sel[index][remainingCapacity] = false;
        // console.log("False", index, remainingCapacity);
        minValue = a;
      } else {
        sel[index][remainingCapacity] = true;
        // console.log("True", index, remainingCapacity);
        minValue = b;
      }
      dp[index][remainingCapacity] = minValue;
      return minValue;
    }
 
 
    let selectedCapacity = target - rec(arr, 0, target);
    // console.log("selected", selectedCapacity);
    if (selectedCapacity < minCapacity || selectedCapacity > target) {
      return [];
    }

    // console.log(sel);

   
    let result = [];
    let current = target;
    for (let index = 0; index < arr.length; index++) {
      // console.log(index, current, sel[index][current], dp[index][current]);
      if (sel[index][current]) {
        result.push(index);
        current -= arr[index];
      }
    }
    // console.log(result);
    return result;
}
    function difference(projectReads, sumArr) {
        let i =0;
        let j = 0;
        projectReads.sort((a,b) => b-a)
        sumArr.sort((a,b) => b-a)
        
        for(let i = 0; i < projectReads.length; i++) {
          for(let j =0; j < sumArr.length; j++) {
            if(projectReads[i] == sumArr[j]) {
              projectReads.splice(i, 1)
            }
          }
        
          
        }
        return projectReads
      }

function sumArrReads(arr) {
  return arr.reduce((acc, el) => {return acc + el}, 0);
}
let removeItems = function(arr, indexes) {
    let j = 0;
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (j < indexes.length && i == indexes[j]) {
        j++;
      } else {
        result.push(arr[i]);
      }
    }
    return result;
  }
  
  function planRuns(samples) {
    const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]}; //max capacity, range (max- min capacity of flow cell)
    let res = []; // returns the "run" type and the most optimal max combination
    let priority = ['S4', 'S2', 'S1', 'SP']
    priority.forEach(p => {
      let target = runs[p][0];
      let range = runs[p][1];
      let allocations = combinationSum(samples, target, range);
      // returns the indices and not the value
      while (allocations.length > 0) {
        res.push(p, allocations.map((index, _) => samples[index]));
        samples = removeItems(samples, allocations);    
        allocations = combinationSum(samples, target, range);
      }
    });
   
    return [res, samples];
  }

console.log("plan1", planRuns([1000, 400, 800, 450, 300]));
console.log("plan2", planRuns([550, 400, 310, 300]));
console.log("plan3", planRuns([1000, 900, 500, 300]));
console.log("plan4", planRuns([1000, 500, 250, 50, 25]));
console.log("plan5", planRuns([500, 100] ));
console.log("plan6", planRuns([2000, 400, 350] ));
console.log("plan7", planRuns([1000, 400, 800, 550, 300]));
console.log("plan8", planRuns([2000, 400, 350] ));
console.log("plan9", planRuns([9000] ));
console.log('plan11', planRuns([400, 400, 400, 400, 400]))

const { poolSameProject, poolSameRunLength, poolSameLibrary } = require('./PoolFunctions')

const fs = require('fs');

let raw = fs.readFileSync('./samples.json');
let data  = JSON.parse(raw);
let runLengthMap = poolSameRunLength(poolSameProject(data));
let results = []
for(let [runLength, projects] of Object.entries(runLengthMap)) {
for(let project of projects) {
    results.push(project.totalReads);
}
}
console.log(results);
console.log(combinationSum(results, 1800, 200));
module.exports = {
    planRuns
}