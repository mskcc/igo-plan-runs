
const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const { Sample } = require('../components/Sample');
const { Lane } = require('../components/Lane');
const { Run }  = require('../components/Run');
// const { determineFlowCells } = require('../components/runPlanner.js');
const { splitBarcodes} = require('../components/barcodeCollisions');
const { planRuns } = require('../components/testRuns');



describe('result of run planning algorithm', () => {
    it('should return SP and S1', () => {
        expect(planRuns([1000, 400, 800, 450, 300])).to.eql([['S1', 'SP'], [400]])
    })
    it('should return S1', () => {
        expect(planRuns([1700])).to.eql(['S1'])
    })
    it('should return SP bc in range', () => {
        expect(planRuns([750])).to.eql(['SP'])
    })
    it('should return S2 only', () => {
        expect(planRuns([1800, 1900])).to.eql(['S2'])
    })
    it('should return S4 only', () => {
        expect(planRuns([4500, 5000])).to.eql(['S4']);
    })
    it('should return SP', () => {
        expect(planRuns([2000, 400, 350])).to.eql([['SP'], [2000]])
    })
    it('should return S1 and SP', () => {
        expect(planRuns([1000, 400, 800, 550, 300])).to.eql([['S1', 'SP'], [550]]);
    })
})


describe('result of split barcodes function', () => {
    let sample1 = new Sample(1, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
    let sample2 = new Sample(2, "", "ACTAGC-GCTACD", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
    let sample3 = new Sample(3, "", "ACTAGT", "123", "PE150", 150, "ABC", "ABC", 120, "nM")
    let sample4 = new Sample(4, "", "ACTAGT-ACTTCA", "123", "PE150", 200, "ABC", "ABC", 120, "nM")
    let sample5 = new Sample(5, "", "ACTAGA", "123", "PE150", 75, "ABC", "ABC", 120, "nM")
    let sample6 = new Sample(6, "", "ACTAGC", "123", "PE150", 200, "ABC", "ABC", 120, "nM");
    let run1 = new Run("SP", "PE150", [sample1, sample2, sample3, sample4, sample5, sample6])
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
        expect(splitBarcodes(run1)['Remaining']).to.eql([sample6, sample5]);
    })
})