import React, { useState, useEffect } from 'react';
import { getRuns } from './services/services';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';




const useStyles = makeStyles((theme) => ({
  container: {
    height: '90vh',
    width: '95vw',
    margin: '0 auto',
    marginBottom: '3em',
    overflow: 'auto'
  },
  toolbar: {
    margin: theme.spacing(2),
    display: 'flex',
    gap: '2em',
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
  // const [sortedExcelData, setSortedExcelData] = React.useState([]);
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    let searchTerm = event.target.value;
    if (searchTerm == '') return setFilteredRuns(runs);

    var searchResults = [];
    searchResults = runs.filter((el) => {
      return Object.values(el).join().toLowerCase().includes(searchTerm.toLowerCase());
    });
    if (searchResults.length == 0) {
      setSorting(false);
      setFilteredRuns([[]]);
    } else {
      setFilteredRuns(searchResults);
    }
  };

  const handleExport = () => {
    exportExcel(filteredRuns, columns);
  };
  async function handleRuns() {
    getRuns().then((result) => {
     
      let ascendingPools = result.rows.map(row => {
        let res = []
        res.push(row.pool)
        let ascendingRes = res;
        ascendingRes.sort((a,b) => a-b);
        return ascendingRes
      })
      console.log(ascendingPools)
      let ascendingSampleIds = result.rows.map(row => {
        let res = []
        res.push(row.sampleId)
        let ascendingRes = res;
        ascendingRes.sort((a,b) => a-b);
        return ascendingRes
      })
      console.log("sampleId", ascendingSampleIds)
      console.log("pools",ascendingPools)
      result.rows.map(row => {
        row.readTotal = parseInt(row.readTotal/1000000);
        row.remainingReads = parseInt(row.remainingReads/1000000);
        return row;
      })
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
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <div className={classes.toolbar}>
          <TextField id='search' label='Search' variant='outlined' value={searchTerm} onChange={handleChange} />
          <Button id='gridExport' onClick={handleExport} color='primary' variant='contained' type='submit'>
            Export Excel
          </Button>
        </div>
        <HotTable
          ref={hotTableComponent}
          data={filteredRuns}
          search='true'
          colHeaders={columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
          columns={columns}
          filters='true'
          columnSorting={sorting}
          manualColumnResize={true}
          licenseKey='non-commercial-and-evaluation'
          rowHeaders={true}
          stretchH='all'
          height='700'
          
         
        />
      </LoadingOverlay>
    </div>
  );
}

export default HomePage;
