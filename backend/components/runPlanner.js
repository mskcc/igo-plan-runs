/**
 * determineFlowCells function
 * find all flowcells that the projects can fit in, and return runs and projects that don't fit 
 * @param  {Array} samples  input array of projects
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
// 6. Return result with runs in runs array and remaining samples go in leftover array. 





const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');

function sumArrReads(samples) { // sum up the reads in a project
    for(let project of samples) {
        project.getProjectReads;
    }
    return samples.reduce((acc, el) => {return acc + el.totalReads}, 0);
  }
  
  function difference(samples, sumArr) { // returns an array of projects that are remaining 
    let i =0;
    let j = 0;
    samples.sort((a,b) => b-a)
    sumArr.sort((a,b) => b-a)
    
    for(let i = 0; i < samples.length; i++) {
      for(let j =0; j < sumArr.length; j++) {
        if(samples[i] == sumArr[j]) {
          samples.splice(i, 1)
        }
      }
    
      
    }
    return samples
  }

  function determineFlowCells(samples, runLength) {
    let result = {"Runs": [], "Lanes": [], "Remaining": []}; // result
    const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]}; //first is max capacity, second is range(max-min capacity)
    let sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]); // find all combinations of samples that fit in a SP
    let s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]); // find all combinations of samples that fit in a S1
    let s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]); // find all combinations of samples that fit in a S2
    let s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]); // find all combinations of samples that fit in a S4
    let res = [];
    while (sp.length > 0 || s1.length > 0 || s2.length > 0 || s4.length > 0) { // while there are combinations that fit in a flowcell, run this code
        if(s4.length > 0) { // start with biggest flowcell
          let sumReads = 0; 
          let sumArr = []
          for(let combo of s4) {
            sumReads = sumArrReads(combo); // sum up the reads of the various combinations 
            sumArr.push([sumReads, combo]); // push sumreads onto an array with the combination as well
          }
          sumArr.sort((a,b) => { //sort the array of combination sums from largest to smallest 
            return a[0] < b[0] ? 1: -1;
            });

            let runObj = new Run('S4', runLength)
            runObj.projects = sumArr[0][1]; // set projects array equal to the combination of projects 
          
            result['Runs'].push(runObj); // push the run 
          samples = difference(samples, sumArr[0][1]); // remove projects that are accounted for in flow cell

          // find combinations again of remaining projects in samples array
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        } else if(s2.length > 0) {
          let sumReads = 0;
          let sumArr = []
          for(let combo of s2) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: -1;
            });
            let runObj = new Run('S2', runLength)
            runObj.projects = sumArr[0][1];
            result['Runs'].push(runObj);
         
          samples = difference(samples, sumArr[0][1]);
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        }else if(s1.length > 0) {
          let sumReads = 0;
          let sumArr = []

          for(let combo of s1) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: -1;
            });
       
          let runObj = new Run('S1', runLength)
            runObj.projects = sumArr[0][1];
          
            result['Runs'].push(runObj);
          
          samples = difference(samples, sumArr[0][1]);
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        }
        else if(sp.length > 0) {
          let sumReads = 0;
          let sumArr = []
          for(let combo of sp) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: -1;
            });
         
          
          let runObj = new Run('SP', runLength)
          runObj.projects = sumArr[0][1];
          
          result['Runs'].push(runObj);
          samples = difference(samples, sumArr[0][1]);
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        }
    }

    //if there are no further combinations left for any flowcell, return remaining samples in array in "remaining" array
    if(sp.length == 0 && s1.length == 0 && s2.length ==0 && s4.length ==0) {
        result['Remaining'] = samples;
      return result;
    } 
    
  }


let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS', 1000);
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome', 400);
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project6 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project7 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project8 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project9 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project10 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let project11 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);


let projectArray = [project1, project2, project3, project4, project5, project6, project7, project8, project9, project10, project11]

console.log("bin", determineFlowCells(projectArray, 'PE100'))


module.exports  = {
    determineFlowCells
}