import React, { useState, useEffect } from 'react';
import { getQOD, getQuote, getRuns } from './services/quote';
import { makeStyles, TextField } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';
const emptyRow = [
  {
    pool: '',
    sampleId: '',
    otherSampleId: '',
    recipe: '',
    tumor: '',
    barcodeSeq: '',
    barcodeId: '',
    concentration: '',
    requestId: '',
    status: '',
    awaitingSamples: '',
    sequencer: '',
    batchWeek: '',
    altConcentration: '',
    volume: '',
    runType: '',
    plateId: '',
    wellPos: '',
  },
];
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    margin: '0 auto',
    overflow: 'hidden',
  },
  toolbar: {
    margin: theme.spacing(2),
  },
}));
function HomePage() {
  const classes = useStyles();
  const hotTableComponent = React.createRef();
  const [runs, setRuns] = useState({
    runs: [],
  });
  const [filteredRuns, setFilteredRuns] = useState({
    filteredRuns: [],
  });
  const [columns, setColumns] = useState({
    columns: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sorting, setSorting] = React.useState(true);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredRuns(runs);

    var results = [];
    results = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (results.length == 0) {
      setSorting(false);
      setFilteredRuns(emptyRow);
    } else {
      setFilteredRuns(results);
    }
  };
  async function handleRuns() {
    getRuns().then((result) => {
      setRuns(result.rows);
      setFilteredRuns(result.rows);
      setColumns(result.columns);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    handleRuns();
  }, []);

  return (
    <div className={classes.container}>
      <LoadingOverlay active={isLoading} spinner text="Loading...">
        <div className={classes.toolbar}>
          <TextField id="search" label="Search" defaultValue="Search" variant="outlined" value={searchTerm} onChange={handleChange} />
        </div>
        <HotTable
          ref={hotTableComponent}
          data={filteredRuns}
          search="true"
          colHeaders={Object.keys(columns).map((el) => columns[el].columnHeader)}
          columns={columns}
          filters="true"
          columnSorting={sorting}
          manualColumnResize={true}
          licenseKey="non-commercial-and-evaluation"
          rowHeaders={true}
          stretchH="all"
        />
        )
      </LoadingOverlay>
    </div>
  );
}

export default HomePage;
