
const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const { Sample } = require('../components/Sample');
const { Project } = require('../components/Project');
const { Lane } = require('../components/Lane');
const { Run }  = require('../components/Run');
const { splitBarcodes} = require('../components/barcodeCollisions');
const { planRuns } = require('../components/testRuns');
const { determineFlowCells} = require('../components/runPlanner');
// const { groupUserLibraries } = require('../components/groupUserLibraries');

describe('result of run planning algorithm', () => {
    it('should return SP and S1', () => {
        expect(planRuns([1000, 400, 800, 450, 300])).to.eql([['S1', 'SP'], [400]])
    })
 
    
    it('should return SP', () => {
        expect(planRuns([2000, 400, 350])).to.eql([['SP'], [2000]])
    })
    it('should return S1 and SP', () => {
        expect(planRuns([1000, 400, 800, 550, 300])).to.eql([['S1', 'SP'], [550]]);
    })

    it('should return SP', () => {
        expect(planRuns([550, 400, 310, 300])).to.eql([['SP'], [300,550]]);
    })
    it('should return S1', () => {
        expect(planRuns([1000, 900, 500, 300])).to.eql([['S1'], [900]]);
    })
    it('should return remaining array of 500, 100', ()=> {
        expect(planRuns([500, 100])).to.eql([[], [100, 500]]);
    })
    it('should return SP', () => {
        expect(planRuns([2000, 400, 350])).to.eql([['SP'], [2000]]);
    })
    it('should return S1', () => {
        expect(planRuns([400, 400, 400, 400, 400])).to.eql([['S1'], [400]]);
    })
    it('should return S1', () => {
        expect(planRuns([800,800])).to.eql([['S1'], []])
    })
})



describe('result of split barcodes function', () => {
    let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 150, "ABC", "ABC", 120, "nM")
let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
let sample5 = new Sample(5, "Pool", "ACTAGG", "123", "PE150", 75, "ABC", "ABC", 120, "nM")
let sample6 = new Sample(6, "Pool", "ACTAGG", "123", "PE150", 200, "ABC", "ABC", 120, "nM");

let project1 = new Project('09838', 'PE100', [sample1, sample2, sample3], 'ShallowWGS', 'sWGS', 1000);
let project2 = new Project('09931', 'PE100', [sample4, sample5, sample6], 'WholeGenomeSequencing', 'WholeGenome', 400);
let project3 = new Project('09259_H', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'DNAExtraction', 800);
let project4 = new Project('06302_AK', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 450);
let project5 = new Project('06302', 'PE100', [], 'IDT_Exome_v1_FP_Viral_Probes', 'WholeExome-KAPALib', 300);
let projectArray = [project1, project2, project3, project4, project5];


let run1 = new Run("SP", "PE150", projectArray);
    
    it('should return 2 lanes in run result', () => {
        expect(splitBarcodes(run1)['Runs'][0].lanes.length).to.eql(2);
    })
    it('should return sample 1, sample3 in lane 1 of run result', () => {
        expect(splitBarcodes(run1)['Runs'][0].lanes[0].samples).to.eql([
            sample1, sample3
          ])
    })
    it('should return sample 2, 4 in lane 2 of run result', () => { 
        
        expect(splitBarcodes(run1)['Runs'][0].lanes[1].samples).to.eql([
            sample2, sample4
          ])
    })
    it('should return samples 5 and 6 in remaining array in object result', () => {
        expect(splitBarcodes(run1)['Remaining'].length).to.eql(2);
        expect(splitBarcodes(run1)['Remaining']).to.eql([sample5, sample6]);
    })
})

describe('result of run planning algorithm', () => {
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
    console.log("total", project1.totalReads);
    console.log("total", project2.totalReads);
    project1.getProjectReads()
    project2.getProjectReads()


let run = new Run('S1', 'PE100');
run.addProject(project1);
run.addProject(project2);
run.addTotalReads();
console.log('test run', run);
it('returns sp1 run', () => {
    expect(determineFlowCells([project1, project2], 'PE100')['Runs']).to.eql([run]);
})

})

// describe('result of grouping user libraries together', ()=> {
//     let sample1 = new Sample(1, "", "ACTAGC", "123", "PE100", 800, "ABC", "ABC", 120, "nM");
//     let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE100", 800, "ABC", "ABC", 120, "nM")
//     let sample3 = new Sample(3, "", "ACTAGT", "123", "PE100", 50, "ABC", "ABC", 120, "nM")
//     let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE100",  800, "ABC", "ABC", 120, "nM")
//     let sample5 = new Sample(5, "Pool", "ACTAGG", "123", "PE100",  800, "ABC", "ABC", 120, "nM")
//     let sample6 = new Sample(6, "Pool", "ACTAGG", "123", "PE100", 50, "ABC", "ABC", 120, "nM");
//     let project1 = new Project('09838', 'PE100', [], 'ShallowWGS', 'Investigator ');
//     let project2 = new Project('09931', 'PE100', [], 'WholeGenomeSequencing', 'Investigator');
//     let project3 = new Project('00921', 'PE100', [], 'WholeGenome', 'WholeGenome');
//     project1.samples = [sample1, sample2];
//     project2.samples = [sample4, sample5];
//     project3.samples = [sample3, sample6];
//     project1.getProjectReads()
//     project2.getProjectReads()
//     project3.getProjectReads()
//     it('returns S1 with user libraries', ()=> {
//         expect(groupUserLibraries([project1, project2, project3]))['Runs'].to.eql('')
//     })

// })