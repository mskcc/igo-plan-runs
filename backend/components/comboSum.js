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
//       arr.sort((a,b) => {
//         let A = a.totalReads;
//         let B = b.totalReads;
//         return A < B ? 1 : A > B ? -1 : 0;
//       })
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

var combinationSum = function(arr, target, range) {
    
    if (!arr || !arr.length) { return []; }
    
    // for(let project of arr) {
    //     project.getProjectReads();
    
    //   }
      arr.sort((a,b) => {
        let A = a.totalReads;
        let B = b.totalReads;
        return A < B ? 1 : A > B ? -1 : 0;
      })

    // arr.sort((a,b) => a-b);
    const solutions = [];
    
    const findCombos = function(idx, subtotal, solution) {
        for (let i = idx; i < arr.length; i++) {
            if (subtotal + arr[i].totalReads <= target && (target - (subtotal+arr[i].totalReads)) <= range) { 
                solutions.push(solution.concat(arr[i])); 
            } else if (subtotal + arr[i].totalReads < (target-range) && i + 1 < arr.length) { 
                findCombos(i + 1, subtotal + arr[i].totalReads, solution.concat(arr[i])); 
            }
            while (arr[i + 1] === arr[i]) { i++; }
        };
    };

    findCombos(0, 0, []);
    return solutions;
    
};



  module.exports = {
      combinationSum
  }

  