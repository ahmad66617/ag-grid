import type { ColumnModel } from '../../columns/columnModel';
import type { UserCompDetails, UserComponentFactory } from '../../components/framework/userComponentFactory';
import type { NamedBean } from '../../context/bean';
import { BeanStub } from '../../context/beanStub';
import type { BeanCollection } from '../../context/context';
import type { CtrlsService } from '../../ctrlsService';
import type { GridOptions } from '../../entities/gridOptions';
import { _isClientSideRowModel } from '../../gridOptionsUtils';
import type { IRowModel } from '../../interfaces/iRowModel';
import { _warnOnce } from '../../utils/function';
import type { OverlayWrapperComponent } from './overlayWrapperComponent';

const enum OverlayServiceState {
    Hidden = 0,
    Loading = 1,
    NoRows = 2,
}

export class OverlayService extends BeanStub implements NamedBean {
    beanName = 'overlayService' as const;

    private userComponentFactory: UserComponentFactory;
    private rowModel: IRowModel;
    private ctrlsService: CtrlsService;
    private isClientSide: boolean;
    private columnModel: ColumnModel;

    private state: OverlayServiceState = OverlayServiceState.Hidden;
    private showInitialOverlay: boolean = true;
    private exclusive?: boolean;
    private wrapperPadding: number = 0;

    public wireBeans(beans: BeanCollection): void {
        this.userComponentFactory = beans.userComponentFactory;
        this.rowModel = beans.rowModel;
        this.columnModel = beans.columnModel;
        this.ctrlsService = beans.ctrlsService;
    }

    private overlayWrapperComp: OverlayWrapperComponent;

    public postConstruct(): void {
        this.isClientSide = _isClientSideRowModel(this.gos);
        const updateOverlayVisibility = () => this.updateOverlayVisibility();

        this.addManagedEventListeners({
            newColumnsLoaded: updateOverlayVisibility,
            rowDataUpdated: updateOverlayVisibility,
            gridSizeChanged: this.onGridSizeChanged.bind(this),
            rowCountReady: () => {
                // Support hiding the initial overlay when data is set via transactions.
                this.showInitialOverlay = false;
                this.updateOverlayVisibility();
            },
        });

        this.addManagedPropertyListener('loading', updateOverlayVisibility);
    }

    public registerOverlayWrapperComp(overlayWrapperComp: OverlayWrapperComponent): void {
        this.overlayWrapperComp = overlayWrapperComp;
        this.updateOverlayVisibility();
    }

    /** Returns true if the overlay is visible. */
    public isVisible(): boolean {
        return this.state !== OverlayServiceState.Hidden;
    }

    /** Returns true if the overlay is visible and is exclusive (popup over the grid) */
    public isExclusive(): boolean {
        return this.state === OverlayServiceState.Loading;
    }

    /** Gets the overlay wrapper component */
    public getOverlayWrapper(): OverlayWrapperComponent {
        return this.overlayWrapperComp;
    }

    public showLoadingOverlay(): void {
        this.showInitialOverlay = false;

        const loading = this.gos.get('loading');
        if (!loading && (loading !== undefined || this.gos.get('suppressLoadingOverlay'))) {
            return;
        }

        this.doShowLoadingOverlay();
    }

    public showNoRowsOverlay(): void {
        this.showInitialOverlay = false;

        if (this.gos.get('loading') || this.gos.get('suppressNoRowsOverlay')) {
            return;
        }

        this.doShowNoRowsOverlay();
    }

    public hideOverlay(): void {
        this.showInitialOverlay = false;

        if (this.gos.get('loading')) {
            _warnOnce(
                'Since v32, `api.hideOverlay()` does not hide the loading overlay when `loading=true`. Set `loading=false` instead.'
            );
            return;
        }

        this.doHideOverlay();
    }

    private updateOverlayVisibility(): void {
        let loading = this.gos.get('loading');

        if (this.showInitialOverlay && loading === undefined && !this.gos.get('suppressLoadingOverlay')) {
            loading =
                !this.gos.get('columnDefs') ||
                !this.columnModel.isReady() ||
                (!this.gos.get('rowData') && this.isClientSide);
        }

        if (loading) {
            if (this.state !== OverlayServiceState.Loading) {
                this.doShowLoadingOverlay();
            }
        } else {
            this.showInitialOverlay = false;
            if (this.rowModel.isEmpty() && !this.gos.get('suppressNoRowsOverlay') && this.isClientSide) {
                if (this.state !== OverlayServiceState.NoRows) {
                    this.doShowNoRowsOverlay();
                }
            } else if (this.state !== OverlayServiceState.Hidden) {
                this.doHideOverlay();
            }
        }
    }

    private doShowLoadingOverlay(): void {
        this.state = OverlayServiceState.Loading;
        this.showOverlay(
            this.userComponentFactory.getLoadingOverlayCompDetails({}),
            'ag-overlay-loading-wrapper',
            'loadingOverlayComponentParams'
        );
        this.updateExclusive();
    }

    private doShowNoRowsOverlay(): void {
        this.state = OverlayServiceState.NoRows;
        this.showOverlay(
            this.userComponentFactory.getNoRowsOverlayCompDetails({}),
            'ag-overlay-no-rows-wrapper',
            'noRowsOverlayComponentParams'
        );
        this.updateExclusive();
    }

    private doHideOverlay(): void {
        this.state = OverlayServiceState.Hidden;
        this.overlayWrapperComp.hideOverlay();
        this.updateExclusive();
    }

    private showOverlay(compDetails: UserCompDetails, wrapperCssClass: string, gridOption: keyof GridOptions): void {
        const promise = compDetails.newAgStackInstance();
        this.overlayWrapperComp.showOverlay(promise, wrapperCssClass, this.isExclusive(), gridOption);
        this.refreshWrapperPadding();
    }

    private updateExclusive(): void {
        const wasExclusive = this.exclusive;
        this.exclusive = this.isExclusive();
        if (this.exclusive !== wasExclusive) {
            this.eventService.dispatchEvent({
                type: 'overlayExclusiveChanged',
            });
        }
    }

    private onGridSizeChanged(): void {
        this.refreshWrapperPadding();
    }

    private refreshWrapperPadding(): void {
        let newPadding: number = 0;

        if (this.state === OverlayServiceState.NoRows) {
            const headerCtrl = this.ctrlsService.get('gridHeaderCtrl');
            const headerHeight = headerCtrl?.getHeaderHeight() || 0;

            newPadding = headerHeight;
        } else if (this.wrapperPadding !== 0) {
            newPadding = 0;
        }

        if (this.wrapperPadding === newPadding) {
            return;
        }

        this.wrapperPadding = newPadding;
        this.overlayWrapperComp.updateOverlayWrapperPaddingTop(newPadding);
    }
}
