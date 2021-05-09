const { Project } = require('./Project');

/**
 * find all combinations that sum up to the target within the range (max - min read capacity)
 * @param  {Array} arr  input array of projects' total reads of samples
 * @param  {Number} target  target sum
 * @param  {Number} range  range that sum needs to be within of target
 * @return {Array}  return array of combinations that add up to target within range
 */

// var combinationSum = function(arr, target, range) {
//     // for(let project of arr) {
//     //     project.getProjectReads();
    
//     //   }
    //   arr.sort((a,b) => {
    //     let A = a.totalReads;
    //     let B = b.totalReads;
    //     return A < B ? 1 : A > B ? -1 : 0;
    //   })
//     let result = [];
//     visited = new Array(arr.length).fill(false);
        
//     function dfs(current, currentSum, startIndex, visited){
//         if (target-currentSum <= range && currentSum <= target) {
//             result.push(current)
//         }
//         if (currentSum > target) {
//             return;
//         }
//         for (let i = startIndex; i < arr.length; i++) {
//             if(i > 0 && arr[i].totalReads == arr[i - 1].totalReads && !visited[i - 1]) {
//                 continue;
//             }
//             visited[i] = true;
//             dfs(current.concat(arr[i]), currentSum + arr[i].totalReads, i + 1, visited);
//             visited[i] = false;
//         }
//     }
    
//     dfs([], 0, 0, visited);
//     return result;
// };


function sumArrReads(projects) { // sum up the reads in a project
    // for(let project of projects) {
    //     project.getProjectReads();
    // }
    return projects.reduce((acc, el) => {return acc + el.totalReads}, 0);
  }

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
        let b = rec(arr, index + 1, remainingCapacity - arr[index].totalReads); // do select the element
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
          current -= arr[index].totalReads;
        }
      }
      // console.log(result);
      return result;
    }
// var combinationSum = function(arr, target, range) {
    
//     if (!arr || !arr.length) { return []; }
    
//     // for(let project of arr) {
//     //     project.getProjectReads();
    
//     //   }
//       arr.sort((a,b) => {
//         let A = a.totalReads;
//         let B = b.totalReads;
//         return A < B ? 1 : A > B ? -1 : 0;
//       })

//     // arr.sort((a,b) => a-b);
//     const solutions = [];
    
//     const findCombos = function(idx, subtotal, solution) {
//         for (let i = idx; i < arr.length; i++) {
//             if (subtotal + arr[i].totalReads <= target && (target - (subtotal+arr[i].totalReads)) <= range) { 
//                 solutions.push(solution.concat(arr[i])); 
//             } else if (subtotal + arr[i].totalReads < (target-range) && i + 1 < arr.length) { 
//                 findCombos(i + 1, subtotal + arr[i].totalReads, solution.concat(arr[i])); 
//             }
//             while (arr[i + 1] === arr[i]) { i++; }
//         };
//     };

//     findCombos(0, 0, []);
//     return solutions;
    
// };



  module.exports = {
      combinationSum
  }

  