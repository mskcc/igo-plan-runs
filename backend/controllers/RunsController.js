const apiResponse = require('../helpers/apiResponse');
// const { authenticateRequest } = require('../middlewares/jwt-cookie');
const { getRuns } = require('../services/services');
const Cache = require('../helpers/cache');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance
const { logger } = require('../helpers/winston');

const columns = [
  { columnHeader: 'Pool', data: 'pool', editor: false },
  { columnHeader: 'Sample ID', data: 'sampleId', editor: false },
  { columnHeader: 'Other Sample ID', data: 'otherSampleId', editor: false },
  { columnHeader: 'Recipe', data: 'recipe', editor: false },
  { columnHeader: 'Tumor/Normal', data: 'tumor', editor: false },
  { columnHeader: 'Pool Conc.', data: 'concentration', editor: false, type: 'numeric' },
  { columnHeader: 'Request ID', data: 'requestId', editor: false },
  // { columnHeader: 'Status', data: 'status', editor:false },
  // { columnHeader: 'Awaiting Samples', data: 'awaitingSamples', editor:false },
  // { columnHeader: 'Sequencer', data: 'sequencer', editor:false },
  // { columnHeader: 'Batch Week', data: 'batchWeek', editor:false },
  { columnHeader: 'Sample Conc.', data: 'altConcentration', editor: false, type: 'numeric' },
  { columnHeader: 'Units', data: 'concentrationUnits', editor: false },
  { columnHeader: 'Volume', data: 'volume', editor: false, type: 'numeric' },
  { columnHeader: 'Source Plate ID', data: 'plateId', editor: false },
  { columnHeader: 'Well Position', data: 'wellPos', editor: false },
  { columnHeader: 'Barcode Sequence', data: 'barcodeSeq', editor: false },
  { columnHeader: 'Barcode ID', data: 'barcodeId', editor: false },
  { columnHeader: 'Run Length', data: 'runType', editor: false },
  {
    columnHeader: 'Reads Requested.',
    data: 'readNum',
    editor: false,
    type: 'numeric',
  }, {
    columnHeader: 'Reads Remaining.',
    data: 'remainingReads',
    editor: false,
    type: 'numeric',
  },
  {
    columnHeader: 'Reads Achieved',
    data: 'readTotal',
    editor: false,
    type: 'numeric',
  },
  // { columnHeader: 'Micronic Barcode', data: 'micronicBarcode', editor:false },
];
/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getRuns = [
  // authenticateRequest,
  function (req, res) {
    logger.log('info', 'Retrieving random quote');
    let key = 'RUNS';
    let retrievalFunction = () => getRuns();

    
    getRuns()
      .then((result) => {
        let grid = generateGrid(result.data);
        return apiResponse.successResponseWithData(res, 'success', {
          rows: grid,
          columns: columns,
        });
      })
      .catch((err) => {
        return apiResponse.ErrorResponse(res, err.message);
      });
  },
];

// UTIL
generateGrid = (data) => {
  data.forEach((element) => {
    try {
      element.altConcentration = element.altConcentration.toFixed(2);
      element.concentration = concentration.toFixed(3);
    } catch (error) {
      return;
    }
  });
  return data;
};
