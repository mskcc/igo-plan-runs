var combinationSum = function(arr, target, range) {
    arr.sort((a,b) => {
        
        return a < b ? 1 : a > b ? -1 : 0;
      })
    let result = [];
    visited = new Array(arr.length).fill(false);
        
    function dfs(current, currentSum, startIndex, visited){
        if(currentSum == target ) {
            result.push(current);
            return;
        }
        if ((target-currentSum) <= range && currentSum <= target) {
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

function planRuns(projectReads) { // takes in array of 
  const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]};
  let sp = combinationSum(projectReads,  runs['SP'][0], runs['SP'][1]);
  let s1 = combinationSum(projectReads,  runs['S1'][0], runs['S1'][1]);
  let s2 = combinationSum(projectReads,  runs['S2'][0], runs['S2'][1]);
  let s4 = combinationSum(projectReads,  runs['S4'][0], runs['S4'][1]);
  let res = [];

  while (sp.length > 0 || s1.length > 0 || s2.length > 0 || s4.length > 0) {
    
      if(s4.length > 0) {
        let sumReads = 0;
        let sumArr = []
        for(let combo of s4) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
            });
          res.push('S4', sumArr[0][1]);
          projectReads = difference(projectReads, sumArr[0][1])
        sp = combinationSum(projectReads,  runs['SP'][0], runs['SP'][1]);
        s1 = combinationSum(projectReads,  runs['S1'][0], runs['S1'][1]);
        s2 = combinationSum(projectReads,  runs['S2'][0], runs['S2'][1]);
        s4 = combinationSum(projectReads,  runs['S4'][0], runs['S4'][1]);
      } else if(s2.length > 0) {
        let sumReads = 0;
        let sumArr = []
        for(let combo of s2) {
          sumReads = sumArrReads(combo);
          sumArr.push([sumReads, combo]);
        }
        sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
          });
        res.push('S2', sumArr[0][1]);
        projectReads = difference(projectReads, sumArr[0][1])
        sp = combinationSum(projectReads,  runs['SP'][0], runs['SP'][1]);
        s1 = combinationSum(projectReads,  runs['S1'][0], runs['S1'][1]);
        s2 = combinationSum(projectReads,  runs['S2'][0], runs['S2'][1]);
        s4 = combinationSum(projectReads,  runs['S4'][0], runs['S4'][1]);
      }else if(s1.length > 0) {
        let sumReads = 0;
        let sumArr = []
        let comboArr = []
        for(let combo of s1) {
          sumReads = sumArrReads(combo);
          sumArr.push([sumReads, combo]);
        }
        sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
          });
        res.push('S1', sumArr[0][1]);
        projectReads = difference(projectReads, sumArr[0][1])
        sp = combinationSum(projectReads,  runs['SP'][0], runs['SP'][1]);
        s1 = combinationSum(projectReads,  runs['S1'][0], runs['S1'][1]);
        s2 = combinationSum(projectReads,  runs['S2'][0], runs['S2'][1]);
        s4 = combinationSum(projectReads,  runs['S4'][0], runs['S4'][1]);
      }
      else if(sp.length > 0) {
        let sumReads = 0;
        let sumArr = []
        for(let combo of sp) {
          sumReads = sumArrReads(combo);
          sumArr.push([sumReads, combo]);
        }
        sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
          });
        // res.push('SP', sumArr[0][1]);
        res.push('SP', sumArr[0][1]);
        projectReads = difference(projectReads, sumArr[0][1])
        sp = combinationSum(projectReads,  runs['SP'][0], runs['SP'][1]);
        s1 = combinationSum(projectReads,  runs['S1'][0], runs['S1'][1]);
        s2 = combinationSum(projectReads,  runs['S2'][0], runs['S2'][1]);
        s4 = combinationSum(projectReads,  runs['S4'][0], runs['S4'][1]);
      }
  }
  if(sp.length == 0 && s1.length == 0 && s2.length ==0 && s4.length ==0) {
    return [res, projectReads]
  } 
  
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


module.exports = {
    planRuns
}