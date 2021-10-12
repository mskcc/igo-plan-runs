import React, { useState, useEffect } from 'react';
import { exportExcel } from './util/excel';
import { makeStyles, TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import LoadingOverlay from 'react-loading-overlay';
import { plan } from './services/services';
import { rePlan } from './util/rePlan';

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
function Plan() {
    const classes = useStyles();
    const hotTableComponent = React.createRef();

    const sorting = true; // const [sorting, setSorting] = React.useState(true);
    const [samplesForPooling, setGroups] = useState({
        samplesForPooling: [],
    });
    const [columns, setColumns] = useState({
        columns: [],
      });
    const [isLoading, setIsLoading] = useState(true);

    const handleExport = () => {
        exportExcel(samplesForPooling, columns);
    };

    const handleRePlan = () =>{
        setGroups(rePlan(samplesForPooling));
    }

    async function processPoolInfo() {
        plan().then((result) => {
            setGroups(result.rows);
            setColumns(result.columns);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        setIsLoading(true);
        processPoolInfo();
    }, []);

    return (
        <div className={classes.container}>
            <LoadingOverlay active={isLoading} spinner text='Loading...'>
                <div className={classes.toolbar}>
                    <Button id='gridExport' onClick={handleExport} color='primary' variant='contained' type='submit'>
                        Export Excel
                    </Button>

                    <Button id='gridExport' onClick={handleRePlan} color='primary' variant='contained' type='submit'>
                        Redo Planning
                    </Button>
                </div>
                <HotTable
                    ref={hotTableComponent}
                    data={samplesForPooling}
                    search='true'
                    colHeaders= {columns ? Object.keys(columns).map((el) => columns[el].columnHeader) : ''}
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

export default Plan;
