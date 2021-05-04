const { Project } = require('./Project');

/**
 * find all combinations that sum up to the target within the range
 * @param  {Array} arr  input array of projects' total reads of samples
 * @param  {Number} target  target sum
 * @param  {Number} range  range that sum needs to be within of target
 * @return {Array}  return array of combinations that add up to target within range
 */

var combinationSum = function(arr, target, range) {
    for(let project of arr) {
        project.getProjectReads();
    
      }
      arr.sort((a,b) => {
        let A = a.totalReads;
        let B = b.totalReads;
        return A < B ? 1 : -1;
      })
    let result = [];
    visited = new Array(arr.length).fill(false);
        
    function dfs(current, currentSum, startIndex, visited){
        if(currentSum == target ) {
            result.push(current);
            return;
        }
        if (Math.abs(currentSum - target) <= range && currentSum <= target) {
            result.push(current)
        }
        if (currentSum > target) {
            return;
        }
        for (let i = startIndex; i < arr.length; i++) {
            if(i > 0 && arr[i] == arr[i - 1] && !visited[i - 1]) {
                continue;
            }
            visited[i] = true;
            dfs(current.concat(arr[i]), currentSum + arr[i].totalReads, i + 1, visited);
            visited[i] = false;
        }
    }
    
    dfs([], 0, 0, visited);
    return result;
};


let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 550);
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 400);
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);


  console.log("combo", combinationSum([project3, project4, project5], 800, 100))

  module.exports = {
      combinationSum
  }