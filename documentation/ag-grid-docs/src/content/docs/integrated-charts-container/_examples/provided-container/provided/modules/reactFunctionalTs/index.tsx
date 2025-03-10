'use strict';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ChartRef, ColDef, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { GridChartsModule } from '@ag-grid-enterprise/charts-enterprise';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import React, { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

ModuleRegistry.registerModules([ClientSideRowModelModule, GridChartsModule, MenuModule, RowGroupingModule]);

const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);
    const themeName =
        /** DARK MODE START **/ document.documentElement?.dataset.defaultTheme ||
        'ag-theme-quartz'; /** DARK MODE END **/
    const [rowData, setRowData] = useState<any[]>();
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        { field: 'athlete', width: 150, chartDataType: 'category' },
        { field: 'gold', chartDataType: 'series' },
        { field: 'silver', chartDataType: 'series' },
        { field: 'bronze', chartDataType: 'series' },
        { field: 'total', chartDataType: 'series' },
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
        return { flex: 1 };
    }, []);
    const popupParent = useMemo<HTMLElement | null>(() => {
        return document.body;
    }, []);

    const chartPlaceholderRef = useRef<HTMLDivElement | null>(null);
    const [chartRef, setChartRef] = useState<ChartRef | undefined>();

    const onGridReady = useCallback((params: GridReadyEvent) => {
        fetch('https://www.ag-grid.com/example-assets/wide-spread-of-sports.json')
            .then((resp) => resp.json())
            .then((data: any[]) => {
                setRowData(data);
            });
        /** PROVIDED EXAMPLE DARK INTEGRATED **/
    }, []);

    const updateChartParams = (chartRef: ChartRef | undefined) => {
        setChartRef((prev) => {
            if (prev != chartRef) {
                // destroy the prev chart if it exists
                prev?.destroyChart();
            }
            return chartRef;
        });
    };

    useEffect(() => {
        if (chartRef) {
            // Append the chart element to the placeholder div
            chartPlaceholderRef.current?.appendChild(chartRef.chartElement);
        }
    }, [chartRef]);

    return (
        <div style={containerStyle}>
            <div id="container">
                <div style={gridStyle} className={themeName}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        enableRangeSelection={true}
                        enableCharts={true}
                        popupParent={popupParent}
                        createChartContainer={updateChartParams}
                        onGridReady={onGridReady}
                    />
                    <div ref={chartPlaceholderRef} className={'chart-wrapper ' + themeName}>
                        {chartRef ? (
                            <div key={chartRef.chartId}>
                                <div className="chart-wrapper-top">
                                    <h2 className="chart-wrapper-title">
                                        Chart created at {new Date().toLocaleString()}
                                    </h2>
                                    <button onClick={() => updateChartParams(undefined)}>Destroy Chart</button>
                                </div>
                            </div>
                        ) : (
                            <div className="chart-placeholder">Chart will be displayed here.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(
    <StrictMode>
        <GridExample />
    </StrictMode>
);
