/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const generic_1 = require("../../utils/generic");
const array_1 = require("../../utils/array");
const context_1 = require("../../context/context");
const constants_1 = require("../../constants/constants");
let RowCssClassCalculator = class RowCssClassCalculator {
    getInitialRowClasses(params) {
        const classes = [];
        if (generic_1.exists(params.extraCssClass)) {
            classes.push(params.extraCssClass);
        }
        classes.push('ag-row');
        classes.push(params.rowFocused ? 'ag-row-focus' : 'ag-row-no-focus');
        if (params.fadeRowIn) {
            classes.push('ag-opacity-zero');
        }
        classes.push(params.rowIsEven ? 'ag-row-even' : 'ag-row-odd');
        if (params.rowNode.isRowPinned()) {
            classes.push('ag-row-pinned');
        }
        if (params.rowNode.isSelected()) {
            classes.push('ag-row-selected');
        }
        if (params.rowNode.footer) {
            classes.push('ag-row-footer');
        }
        classes.push('ag-row-level-' + params.rowLevel);
        if (params.rowNode.stub) {
            classes.push('ag-row-loading');
        }
        if (params.fullWidthRow) {
            classes.push('ag-full-width-row');
        }
        if (params.expandable) {
            classes.push('ag-row-group');
            classes.push(params.rowNode.expanded ? 'ag-row-group-expanded' : 'ag-row-group-contracted');
        }
        if (params.rowNode.dragging) {
            classes.push('ag-row-dragging');
        }
        array_1.pushAll(classes, this.processClassesFromGridOptions(params.rowNode, params.scope));
        array_1.pushAll(classes, this.preProcessRowClassRules(params.rowNode, params.scope));
        // we use absolute position unless we are doing print layout
        classes.push(params.printLayout ? 'ag-row-position-relative' : 'ag-row-position-absolute');
        if (params.firstRowOnPage) {
            classes.push('ag-row-first');
        }
        if (params.lastRowOnPage) {
            classes.push('ag-row-last');
        }
        if (params.fullWidthRow) {
            if (params.pinned === constants_1.Constants.PINNED_LEFT) {
                classes.push('ag-cell-last-left-pinned');
            }
            if (params.pinned === constants_1.Constants.PINNED_RIGHT) {
                classes.push('ag-cell-first-right-pinned');
            }
        }
        return classes;
    }
    processClassesFromGridOptions(rowNode, scope) {
        const res = [];
        const process = (rowCls) => {
            if (typeof rowCls === 'string') {
                res.push(rowCls);
            }
            else if (Array.isArray(rowCls)) {
                rowCls.forEach(e => res.push(e));
            }
        };
        // part 1 - rowClass
        const rowClass = this.gridOptionsWrapper.getRowClass();
        if (rowClass) {
            if (typeof rowClass === 'function') {
                console.warn('AG Grid: rowClass should not be a function, please use getRowClass instead');
                return [];
            }
            process(rowClass);
        }
        // part 2 - rowClassFunc
        const rowClassFunc = this.gridOptionsWrapper.getRowClassFunc();
        if (rowClassFunc) {
            const params = {
                data: rowNode.data,
                node: rowNode,
                rowIndex: rowNode.rowIndex,
                $scope: scope,
                api: this.gridOptionsWrapper.getApi(),
                columnApi: this.gridOptionsWrapper.getColumnApi(),
                context: this.gridOptionsWrapper.getContext()
            };
            const rowClassFuncResult = rowClassFunc(params);
            process(rowClassFuncResult);
        }
        return res;
    }
    preProcessRowClassRules(rowNode, scope) {
        const res = [];
        this.processRowClassRules(rowNode, scope, (className) => {
            res.push(className);
        }, (className) => {
            // not catered for, if creating, no need
            // to remove class as it was never there
        });
        return res;
    }
    processRowClassRules(rowNode, scope, onApplicableClass, onNotApplicableClass) {
        const rowClassParams = {
            data: rowNode.data,
            node: rowNode,
            rowIndex: rowNode.rowIndex,
            api: this.gridOptionsWrapper.getApi(),
            columnApi: this.gridOptionsWrapper.getColumnApi(),
            $scope: scope,
            context: this.gridOptionsWrapper.getContext()
        };
        this.stylingService.processClassRules(this.gridOptionsWrapper.rowClassRules(), rowClassParams, onApplicableClass, onNotApplicableClass);
    }
    calculateRowLevel(rowNode) {
        if (rowNode.group) {
            return rowNode.level;
        }
        // if a leaf, and a parent exists, put a level of the parent, else put level of 0 for top level item
        return rowNode.parent ? (rowNode.parent.level + 1) : 0;
    }
};
__decorate([
    context_1.Autowired('stylingService')
], RowCssClassCalculator.prototype, "stylingService", void 0);
__decorate([
    context_1.Autowired('gridOptionsWrapper')
], RowCssClassCalculator.prototype, "gridOptionsWrapper", void 0);
RowCssClassCalculator = __decorate([
    context_1.Bean('rowCssClassCalculator')
], RowCssClassCalculator);
exports.RowCssClassCalculator = RowCssClassCalculator;

//# sourceMappingURL=rowCssClassCalculator.js.map
