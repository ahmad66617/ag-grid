import { ModuleNames, _ColumnFilterModule, _defineModule } from '@ag-grid-community/core';
import { EnterpriseCoreModule } from '@ag-grid-enterprise/core';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';

import { FiltersToolPanel } from './filterToolPanel/filtersToolPanel';
import { VERSION } from './version';

export const FiltersToolPanelModule = _defineModule({
    version: VERSION,
    moduleName: ModuleNames.FiltersToolPanelModule,
    beans: [],
    userComponents: [{ name: 'agFiltersToolPanel', classImp: FiltersToolPanel }],
    dependantModules: [SideBarModule, EnterpriseCoreModule, _ColumnFilterModule],
});
