
const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const { Sample } = require('../components/Sample');
const { Lane } = require('../components/Lane');
const { planRuns } = require('../components/optimization');
// describe('Sample index collisions work as expected', () => {
//     const obj = new Sample('09931_10_1_1_1_1', 97.73, '3I', 'GAGCCCAT', 'Normal','PE100', 10)
//     const lane = new Lane(0, 0, [], 'S4', false);
//     lane.noIndexCollision(obj);
//     it('should return new lane', () => {
//         expect([obj]).to.eql(lane.samples);
//         // assert.equal([obj], lane.samples);
//     })

// });



describe('result of plan Runs function', () => {
    let sample1 = new Sample('09838_10_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 120, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample2 = new Sample('09838_11_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 300, 'sWGS', 
  '09838', 82.9, 'nM');
  let sample3 = new Sample('09838_9_1_1_1_1', 'ACGACATC', 'ShallowWGS', 'PE100', 500, 'sWGS', 
  '09838', 82.9, 'nM');
  let arr = [sample1, sample2, sample3]
    it('should return object with leftover array of sample 1', () => {
        expect(planRuns([sample1])).to.be.an('object');
        expect(planRuns([sample1])).to.eql({"Runs": [], "Lanes": [], "Remaining": [sample1]})
    }) 
    it('should return object with leftover array of both samples with total reads less than lanes', () => {
        expect(planRuns([sample1, sample2])).to.be.an('object');
        expect(planRuns([sample1, sample2])).to.eql({"Runs": [], "Lanes": [], "Remaining": [sample1, sample2]})
    })
    // needs test case that returns sample 2 and sample3 in lane of S1 or run of SP. find all combinations of samples
    it('should return object with sp run filled', () => {
        expect(planRuns(arr)).to.be.an('object');
        expect(planRuns(arr)["Runs"]).to.eql([ { 'SP': [ sample2, sample3] } ])
    
    })

    it('should return object with sample 1 in remaining object', () => {
        expect(planRuns(arr)).to.be.an('object');
        expect(planRuns(arr)["Remaining"]).to.eql([sample1])
    
    })

})




