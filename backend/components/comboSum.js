
/**
 * find all combinations that sum up to the target within the range
 * @param  {Array} arr  input array of projects' total reads of samples
 * @param  {Number} target  target sum
 * @param  {Number} range  range that sum needs to be within of target
 * @return {Array}  return array of combinations that add up to target within range
 */

var combinationSum = function(arr, target, range) {
    arr.sort((a, b) => (a - b));
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
            dfs(current.concat(arr[i]), currentSum + arr[i], i + 1, visited);
            visited[i] = false;
        }
    }
    
    dfs([], 0, 0, visited);
    return result;
};

  console.log(combinationSum([550, 400, 300], 800, 100))

  module.exports = {
      combinationSum
  }