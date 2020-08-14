const apiResponse = require('../helpers/apiResponse');
const { authenticateRequest } = require('../middlewares/jwt-cookie');
const { getRandomQuote, getRuns } = require('../services/services');
const Cache = require('../helpers/cache');
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new Cache(ttl); // Create a new cache service instance
const { logger } = require('../helpers/winston');

const columns = [
  { columnHeader: 'Pool', data: 'pool' },
  { columnHeader: 'Sample ID', data: 'sampleId' },
  { columnHeader: 'Other Sample ID', data: 'otherSampleId' },
  { columnHeader: 'Recipe', data: 'recipe' },
  { columnHeader: 'Tumor/Normal', data: 'tumor' },
  { columnHeader: 'Barcode Sequence', data: 'barcodeSeq' },
  { columnHeader: 'Barcode ID', data: 'barcodeId' },
  { columnHeader: 'Pool Concentration', data: 'concentration' },
  { columnHeader: 'Request ID', data: 'requestId' },
  { columnHeader: 'Status', data: 'status' },
  { columnHeader: 'Awaiting Samples', data: 'awaitingSamples' },
  { columnHeader: 'Sequencer', data: 'sequencer' },
  { columnHeader: 'Batch Week', data: 'batchWeek' },
  { columnHeader: 'Sample Concentration', data: 'altConcentration' },
  { columnHeader: 'Volume', data: 'volume' },
  { columnHeader: 'Run Length', data: 'runType' },
  { columnHeader: 'Source Plate ID', data: 'plateId' },
  { columnHeader: 'Well Position', data: 'wellPos' },
  {
    columnHeader: 'Sequencing Read Requirements',
    data: 'readNum',
  },
  { columnHeader: 'Micronic Barcode', data: 'micronicBarcode' },
];
/**
 * Returns runs
 *
 * @type {*[]}
 */
exports.getRuns = [
  authenticateRequest,
  function (req, res) {
    logger.log('info', 'Retrieving random quote');
    let key = 'RUNS';
    let retrievalFunction = () => getRuns();

    cache
      .get(key, retrievalFunction)
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
      element.altConcentration = `${element.altConcentration.toFixed(2)}  ${element.concentrationUnits}`;
      element.concentration = concentration.toFixed(3);
    } catch (error) {
      return;
    }
  });
  return data;
};
