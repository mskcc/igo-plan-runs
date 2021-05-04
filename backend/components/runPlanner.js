const { combinationSum } = require('./comboSum');
const { Run } = require('./Run');
const { Project } = require('./Project');
const {  poolSameRunLength } = require('./PoolFunctions');
const { splitBarcodes } = require('./barcodeCollisions');
/**
 * find all flowcells that the projects can fit in, and return runs, lanes, and samples that don't fit
 * @param  {Array} arr  input array of projects' total reads of samples, takes arr of Samples with same run length
 * @return {Array}  return array of runs, lanes, and remaining samples
 */
 
  
 function runPlan(arr, runLength) { //takes in 
  let capacities = [800, 1800, 3800, 10000]; //max capacities of flow cells
  let runs = ['SP', 'S1', 'S2', 'S4'];  //runs 
  let ranges = [100, 200, 200, 1000]; // ranges
  let runRanges = [[700, 800], [1600, 1800], [3600, 3800], [9000, 10000]]
  let totalReads = arr.reduce((acc, ele) => { // sums up total reads 
    return acc + ele.totalReads;
  }, 0);
  console.log('totalReads', totalReads);
  function findWeight(totalReads) { // calculates capacity, run, and range from totalReads
    let weight = 0;
    let run = ''
    let range = 0;
    for(let i = 0; i< capacities.length; i++) {
      if ((capacities[i] - totalReads <= ranges[i])){ // if totalReads is in range of max run capacity that is less than totalReads
        weight = capacities[i]
        run = runs[i]
        range = ranges[i];
      } 
    }
    return [weight, run, range];
  }
  let weight = findWeight(totalReads)[0]; //initial capacity
  let run = findWeight(totalReads)[1]; // initial run
  let range = findWeight(totalReads)[2]; //initial range

  for(let project of arr) {
    project.getProjectReads();

  }
  arr.sort((a,b) => {
    let A = a.totalReads;
    let B = b.totalReads;
    return A < B ? 1 : -1;
  })

console.log("arr", arr); 
  let samples = arr; // create shallow copy
  

  let res =[]; // result returned from function
  let result = {"Runs": [], "Lanes": [], "Remaining": []};

  // if total Reads is in range of flow cells 
  if(totalReads >= runRanges[0][0] && totalReads <= runRanges[0][1]) {
    res.push('SP');
    return res;
  } else if(totalReads >= runRanges[1][0] && totalReads <= runRanges[1][1]) {
    res.push('S1');
    return res;
  } else if(totalReads >= runRanges[2][0] && totalReads <= runRanges[2][1]){
    res.push('S2');
    return res;
  } else if(totalReads >= runRanges[3][0] && totalReads <= runRanges[3][1]) {
    res.push('S4');
    return res;
  }

  // main algo

  let i = 0; // keep track of the position of element in arr
  
  let remReads = totalReads; // reads of elements 
  let remWeight = weight; // optimal flow cell capacity 
  let stack = []; // push accounted for elements in stack, pop it later
  let leftSamples; // samples left over that don't fit in flowcell
  let remaining = []

  while(remReads > 0) { 
    while (remWeight > 0) {
      
      if(remWeight > 0) {
      remWeight -= samples[i].totalReads // subtract reads from 
      remReads -= samples[i].totalReads
      stack.push(samples[i])
      samples.splice(i, 1)
      leftSamples = samples.filter((el) => !stack.includes(el));
      
      console.log('left', leftSamples);
      if (remWeight >= 0 && remWeight <= range) {
        let runObj = new Run(run, runLength, []);
        
          res.push(run); //push run to res array
          remWeight = findWeight(remReads)[0] // new capacity
          run = findWeight(remReads)[1]; // new run
          range = findWeight(remReads)[2]; // new range
          i = 0; // reset i to 0
          combinationSum(samples, remWeight, range); 
          runObj.projects = stack;
          result['Runs'].push(runObj);
        } 
    } if(remWeight < 0) {
        let last = stack.pop()
        remWeight += last.totalReads;
        samples.unshift(last);
        leftSamples = samples.filter((el) => !stack.includes(el));
        remWeight = findWeight(remReads)[0]
        run = findWeight(remReads)[1];
        range = findWeight(remReads)[2];
        i += 1;
      }
      
      
    } 
    
    // return [res, leftSamples];
    result['Remaining'] = leftSamples;
    return result;

}
}

let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'sWGS', 1000);
let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'WholeGenome', 400);
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let projectArray = [project1, project2, project3, project4];
  
    console.log("bin", runPlan(projectArray, 'PE100'));
  
    module.exports = {
        runPlan
    }