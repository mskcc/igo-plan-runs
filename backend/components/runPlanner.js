


const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');
const { Sample } = require('./Sample');

/**
 * find all flowcells that the projects can fit in, and return runs and projects that don't fit 
 * @param  {Array} projects  input array of projects
 * @param  {String} runLength input run length of projects  
 * @return {Object}  return object with runs array in runs, remaining array in remaining
 */



// pseudocode:
// 1. create combinations of all projects that add up to max capacity or is within the range (max - min capactity)
// call combination function on each type of run
// 2. for non empty results (if there are combinations that fit), sum up the reads of each combination and sort them from
// largest to smallest. Return the one with the greatest sum. Create a run object and push it to the result
// 3. Remove projects that have already been accounted for from the original array.
// 4. Repeat steps 1-3 for the remaining array of projects
// 5. If there are no combinations left, end. 
// 6. Return result with runs in runs array and remaining projects go in leftover array. 


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

  function determineFlowCells(projects, runLength) {
    let result = {"Runs": [], "Lanes": [], "Remaining": []}; // result
    const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]}; //max capacity, range (max- min capacity of flow cell)
  let priority = ['S4', 'S2', 'S1', 'SP']
  priority.forEach(p => {
    let target = runs[p][0];
    let range = runs[p][1];
    let allocations = combinationSum(projects, target, range);
    // returns the indices and not the value
    while (allocations.length > 0) {
      let runObj = new Run(p, runLength)
      runObj.projects = allocations.map((index) => projects[index]);
      result['Runs'].push(runObj); // push the run
      projects = removeItems(projects, allocations);    
      allocations = combinationSum(projects, target, range);
    }
  });
  result['Remaining'] = projects;
    for(let run of result["Runs"]) {
      run.addTotalReads();
  }
    //if there are no further combinations left for any flowcell, return remaining projects in array in "remaining" array
    
        result['Remaining'] = projects;
      return result;
    
    
  }



// console.log("bin", determineFlowCells(projectArray, 'PE100'))

let sample1 = new Sample(1, "", "ACTAGC", "123", "PE100", 200, "ABC", "ABC", 120, "nM");
let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE100", 400, "ABC", "ABC", 120, "nM")
let sample3 = new Sample(3, "", "ACTAGT", "123", "PE100", 200, "ABC", "ABC", 120, "nM")
let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE100",  200, "ABC", "ABC", 120, "nM")
let sample5 = new Sample(5, "Pool", "ACTAGG", "123", "PE100",  400, "ABC", "ABC", 120, "nM")
let sample6 = new Sample(6, "Pool", "ACTAGG", "123", "PE100", 200, "ABC", "ABC", 120, "nM");

let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS');
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome');
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction');
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib');

project1.samples = [sample1, sample2, sample3];
project2.samples = [sample4, sample5, sample6];
project1.getProjectReads();
// console.log("pro1", project1.totalReads);
project2.getProjectReads();
// console.log("pro2", project2.totalReads);

let run = new Run('S1', 'PE100');
run.addProject(project1);
run.addProject(project2);
run.addTotalReads();
// console.log('consoled run', run.totalReads);

// console.log(determineFlowCells([project1, project2], 'PE100'));
module.exports  = {
    determineFlowCells
}