


const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');
const { Sample } = require('./Sample');

function sumArrReads(projects) { // sum up the reads in a project
    // for(let project of projects) {
    //     project.getProjectReads();
    // }
    return projects.reduce((acc, el) => {return acc + el.totalReads}, 0);
  }
  
  function difference(projects, sumArr) { // returns an array of projects that are remaining 
    let i =0;
    let j = 0;
    projects.sort((a,b) => b-a)
    sumArr.sort((a,b) => b-a)
    
    for(let i = 0; i < projects.length; i++) {
      for(let j =0; j < sumArr.length; j++) {
        if(projects[i] == sumArr[j]) {
          projects.splice(i, 1)
        }
      }
    
      
    }
    return projects
  }

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




  function determineFlowCells(projects, runLength) {
    let result = {"Runs": [], "Lanes": [], "Remaining": []}; // result
    const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]}; //first is max capacity, second is range(max-min capacity)
    let sp = combinationSum(projects,  runs['SP'][0], runs['SP'][1]); // find all combinations of projects that fit in a SP
    let s1 = combinationSum(projects,  runs['S1'][0], runs['S1'][1]); // find all combinations of projects that fit in a S1
    let s2 = combinationSum(projects,  runs['S2'][0], runs['S2'][1]); // find all combinations of projects that fit in a S2
    let s4 = combinationSum(projects,  runs['S4'][0], runs['S4'][1]); // find all combinations of projects that fit in a S4
    
    while (sp.length > 0 || s1.length > 0 || s2.length > 0 || s4.length > 0) { // while there are combinations that fit in a flowcell, run this code
        if(s4.length > 0) { // start with biggest flowcell
          let sumReads = 0; 
          let sumArr = [] // array containing total reads of a combination and the combination itself
          for(let combo of s4) {
            sumReads = sumArrReads(combo); // sum up the reads of the various combinations 
            sumArr.push([sumReads, combo]); // push sumreads onto an array with the combination as well
          } // sumArr[0] = combination with greatest reads
          // sumArr[0][0] = total reads of combination
          // sumArr[0][1] = combination with greatest reads
          sumArr.sort((a,b) => { //sort the array of combination sums from largest to smallest 
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
          });

            let runObj = new Run('S4', runLength)
            runObj.projects = sumArr[0][1]; // set projects array equal to the combination of projects 
          
            result['Runs'].push(runObj); // push the run 
          projects = difference(projects, sumArr[0][1]); // remove projects that are accounted for in flow cell

          // find combinations again of remaining projects in projects array
          sp = combinationSum(projects,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(projects,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(projects,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(projects,  runs['S4'][0], runs['S4'][1]);
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
            let runObj = new Run('S2', runLength)
            runObj.projects = sumArr[0][1];
            result['Runs'].push(runObj);
         
          projects = difference(projects, sumArr[0][1]);
          sp = combinationSum(projects,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(projects,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(projects,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(projects,  runs['S4'][0], runs['S4'][1]);
        }else if(s1.length > 0) {
          let sumReads = 0;
          let sumArr = []

          for(let combo of s1) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: a[0] > b[0] ? -1 : 0;
            });
       
          let runObj = new Run('S1', runLength)
            runObj.projects = sumArr[0][1];
            
            result['Runs'].push(runObj);
          
          projects = difference(projects, sumArr[0][1]);
          sp = combinationSum(projects,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(projects,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(projects,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(projects,  runs['S4'][0], runs['S4'][1]);
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
          
          let runObj = new Run('SP', runLength)
          runObj.projects = sumArr[0][1];
          
          result['Runs'].push(runObj);
          projects = difference(projects, sumArr[0][1]);
          sp = combinationSum(projects,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(projects,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(projects,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(projects,  runs['S4'][0], runs['S4'][1]);
        }
    }
    for(let run of result["Runs"]) {
      run.addTotalReads();
      // console.log("runReads", run.totalReads);
      for(let project of run.projects) {
        // project.getProjectReads()
        // console.log("project", project.totalReads);
      }
    }
    //if there are no further combinations left for any flowcell, return remaining projects in array in "remaining" array
    if(sp.length == 0 && s1.length == 0 && s2.length ==0 && s4.length ==0) {
        result['Remaining'] = projects;
      return result;
    } 
    
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