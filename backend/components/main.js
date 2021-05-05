const { planRuns } = require('./runPlannerFinal');
const { splitBarcodes }  = require('./barcodeCollisions');
const { poolUserLibraries } = require('./poolUserLibraries');

let result = {"Runs": [], "Lanes": [], "Remaining" : []};

