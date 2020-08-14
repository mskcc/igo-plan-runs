import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const styles = (theme) => ({
  container: {
    marginLeft: theme.spacing(2),
    width: '95vw',
    overflow: 'hidden',
    marginBottom: '5em',
  },
});
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.data = [
      ['2019', 10, 11, 12, 13],
      ['2020', 20, 11, 14, 13],
      ['2021', 30, 15, 12, 13],
    ];
  }

  render() {
    return (
      <HotTable
        data={this.data}
        colHeaders={[
          'Item Name',
          'Item SKU/Barcode',
          'Quantity Available',
          'Quantity Ordered',
          'Order Status',
        ]}
        manualColumnResize={true}
        licenseKey="non-commercial-and-evaluation"
        rowHeaders={true}
        width="100%"
        height="300"
      />
    );
  }
}
export default withStyles(styles)(Table);
