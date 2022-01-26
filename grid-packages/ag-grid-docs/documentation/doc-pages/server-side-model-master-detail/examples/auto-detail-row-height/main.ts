import { Grid, GridOptions, IDetailCellRendererParams, IServerSideDatasource } from '@ag-grid-community/core'
declare var FakeServer: any;
const gridOptions: GridOptions = {
  columnDefs: [
    // group cell renderer needed for expand / collapse icons
    { field: 'accountId', maxWidth: 200, cellRendererComp: 'agGroupCellRenderer' },
    { field: 'name' },
    { field: 'country' },
    { field: 'calls' },
    { field: 'totalDuration' },
  ],
  defaultColDef: {
    flex: 1,
  },
  animateRows: true,

  // use the server-side row model
  rowModelType: 'serverSide',
  serverSideStoreType: 'partial',

  // enable master detail
  masterDetail: true,
  detailRowAutoHeight: true,

  detailRowCellCompParams: {
    detailGridOptions: {
      columnDefs: [
        { field: 'callId' },
        { field: 'direction' },
        { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
        { field: 'switchCode' },
        { field: 'number' },
      ],
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: function (params) {
      // supply details records to detail cell renderer (i.e. detail grid)
      params.successCallback(params.data.callRecords)
    },
  } as IDetailCellRendererParams,

  onGridReady: function (params) {
    setTimeout(function () {
      // expand some master row
      var someRow = params.api.getRowNode('1')
      if (someRow) {
        someRow.setExpanded(true)
      }
    }, 1000)
  },
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: function (params) {
      console.log('[Datasource] - rows requested by grid: ', params.request)

      var response = server.getData(params.request)

      // adding delay to simulate real server call
      setTimeout(function () {
        if (response.success) {
          // call the success callback
          params.success({ rowData: response.rows, rowCount: response.lastRow })
        } else {
          // inform the grid request failed
          params.fail()
        }
      }, 200)
    },
  }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/call-data.json')
    .then(response => response.json())
    .then(function (data) {
      // setup the fake server with entire dataset
      var fakeServer = new FakeServer(data)

      // create datasource with a reference to the fake server
      var datasource = getServerSideDatasource(fakeServer)

      // register the datasource with the grid
      gridOptions.api!.setServerSideDatasource(datasource)
    })
})
