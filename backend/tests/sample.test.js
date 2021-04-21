
const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const { Sample } = require('../components/Sample');
const { Lane } = require('../components/Lane');


describe('Sample index collisions work as expected', () => {
    const obj = new Sample('09931_10_1_1_1_1', 97.73, '3I', 'GAGCCCAT', 'Normal','PE100', 10)
    const lane = new Lane(0, 0, [], 'S4', false);
    lane.noIndexCollision(obj);
    it('should return new lane', () => {
        expect([obj]).to.eql(lane.samples);
        // assert.equal([obj], lane.samples);
    });

});

