const { combinationSum } = require('./comboSum.js');
const { Run } = require('./Run');
const { Project } = require('./Project');

function sumArrReads(samples) {
    for(let project of samples) {
        project.getProjectReads;
    }
    return samples.reduce((acc, el) => {return acc + el.totalReads}, 0);
  }
  
  function planRuns(samples, runLength) {
    let result = {"Runs": [], "Lanes": [], "Remaining": []};
    const runs = {'SP': [800, 100], 'S1' : [1800, 200], 'S2': [3800, 200], 'S4': [10000, 1000]}; //first is max capacity, second is range(max-min capacity)
    let sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
    let s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
    let s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
    let s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
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
            return a[0] < b[0] ? 1: -1;
            });

            let runObj = new Run('S4', runLength)
            runObj.projects = sumArr[0][1];
          res.push(runObj, sumArr[0][1]);
            result['Runs'].push(runObj);
          samples = samples.filter(el => !sumArr[0][1].includes(el));
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        } else if(s2.length > 0) {
          let sumReads = 0;
          let sumArr = []
          for(let combo of s1) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: -1;
            });
            let runObj = new Run('S2', runLength)
            runObj.projects = sumArr[0][1];
          res.push(runObj, sumArr[0][1]);
            result['Runs'].push(runObj);
          res.push('S2', sumArr[0][1]);
         
          samples = samples.filter(el => !sumArr[0][1].includes(el));
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        }else if(s1.length > 0) {
          let sumReads = 0;
          let sumArr = []
          let comboArr = []
          for(let combo of s1) {
            sumReads = sumArrReads(combo);
            sumArr.push([sumReads, combo]);
          }
          sumArr.sort((a,b) => {
            return a[0] < b[0] ? 1: -1;
            });
          res.push('S1', sumArr[0][1]);
          let runObj = new Run('S1', runLength)
            runObj.projects = sumArr[0][1];
          res.push(runObj, sumArr[0][1]);
            result['Runs'].push(runObj);
          samples = samples.filter(el => !sumArr[0][1].includes(el));
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
         
          res.push('SP', sumArr[0][1]);
          let runObj = new Run('SP', runLength)
            runObj.projects = sumArr[0][1];
          res.push(runObj, sumArr[0][1]);
            result['Runs'].push(runObj);
          samples = samples.filter(el => !sumArr[0][1].includes(el));
          sp = combinationSum(samples,  runs['SP'][0], runs['SP'][1]);
          s1 = combinationSum(samples,  runs['S1'][0], runs['S1'][1]);
          s2 = combinationSum(samples,  runs['S2'][0], runs['S2'][1]);
          s4 = combinationSum(samples,  runs['S4'][0], runs['S4'][1]);
        }
    }
    if(sp.length == 0 && s1.length == 0 && s2.length ==0 && s4.length ==0) {
        result['Remaining'] = samples;
      console.log([res, samples])
      return result;
    } 
    
  }


// console.log("plan1", planRuns([1000, 400, 800, 450, 300]));
// console.log("plan2", planRuns([550, 400, 310, 300]));
// console.log("plan3", planRuns([1000, 900, 500, 300]));
// console.log("plan4", planRuns([1000, 500, 250, 50, 25]));
// console.log("plan5", planRuns([500, 100] ));
// console.log("plan6", planRuns([2000, 400, 350] ));
// console.log("plan7", planRuns([1000, 400, 800, 550, 300]));
// console.log("plan8", planRuns([2000, 400, 350] ));

let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS', 1000);
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome', 400);
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let projectArray = [project1, project2, project3, project4, project5];

console.log("bin", planRuns(projectArray, 'PE100'));


module.exports  = {
    planRuns
}