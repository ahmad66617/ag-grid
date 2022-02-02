import { BeanStub, IRowModel, IViewportDatasource, RowBounds, RowNode } from "@ag-grid-community/core";
export declare class ViewportRowModel extends BeanStub implements IRowModel {
    private gridApi;
    private columnApi;
    private rowRenderer;
    private beans;
    private firstRow;
    private lastRow;
    private rowCount;
    private rowNodesByIndex;
    private rowHeight;
    private viewportDatasource;
    ensureRowHeightsValid(startPixel: number, endPixel: number, startLimitIndex: number, endLimitIndex: number): boolean;
    private init;
    start(): void;
    isLastRowIndexKnown(): boolean;
    private destroyDatasource;
    private calculateFirstRow;
    private calculateLastRow;
    private onViewportChanged;
    purgeRowsNotInViewport(): void;
    setViewportDatasource(viewportDatasource: IViewportDatasource): void;
    getType(): string;
    getRow(rowIndex: number): RowNode;
    getRowNode(id: string): RowNode | undefined;
    getRowCount(): number;
    getRowIndexAtPixel(pixel: number): number;
    getRowBounds(index: number): RowBounds;
    getTopLevelRowCount(): number;
    getTopLevelRowDisplayedIndex(topLevelIndex: number): number;
    isEmpty(): boolean;
    isRowsToRender(): boolean;
    getNodesInRangeForSelection(firstInRange: RowNode, lastInRange: RowNode): RowNode[];
    forEachNode(callback: (rowNode: RowNode, index: number) => void): void;
    private setRowData;
    private createBlankRowNode;
    setRowCount(rowCount: number, keepRenderedRows?: boolean): void;
    isRowPresent(rowNode: RowNode): boolean;
}
