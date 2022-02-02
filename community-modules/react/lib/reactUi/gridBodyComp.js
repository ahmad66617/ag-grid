// @ag-grid-community/react v27.0.0
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ag-grid-community/core");
const react_1 = __importStar(require("react"));
const beansContext_1 = require("./beansContext");
const gridHeaderComp_1 = __importDefault(require("./header/gridHeaderComp"));
const reactComment_1 = __importDefault(require("./reactComment"));
const rowContainerComp_1 = __importDefault(require("./rows/rowContainerComp"));
const utils_1 = require("./utils");
const GridBodyComp = () => {
    const { context, agStackComponentsRegistry, resizeObserverService } = react_1.useContext(beansContext_1.BeansContext);
    const [rowAnimationClass, setRowAnimationClass] = react_1.useState('');
    const [ariaColCount, setAriaColCount] = react_1.useState(0);
    const [ariaRowCount, setAriaRowCount] = react_1.useState(0);
    const [topHeight, setTopHeight] = react_1.useState(0);
    const [bottomHeight, setBottomHeight] = react_1.useState(0);
    const [topDisplay, setTopDisplay] = react_1.useState('');
    const [bottomDisplay, setBottomDisplay] = react_1.useState('');
    const [movingCss, setMovingCss] = react_1.useState(null);
    const [layoutClass, setLayoutClass] = react_1.useState('');
    const [forceVerticalScrollClass, setForceVerticalScrollClass] = react_1.useState(null);
    const [topAndBottomOverflowY, setTopAndBottomOverflowY] = react_1.useState('');
    const [cellSelectableCss, setCellSelectableCss] = react_1.useState(null);
    const eRoot = react_1.useRef(null);
    const eTop = react_1.useRef(null);
    const eBodyViewport = react_1.useRef(null);
    const eBottom = react_1.useRef(null);
    reactComment_1.default(' AG Grid Body ', eRoot);
    reactComment_1.default(' AG Pinned Top ', eTop);
    reactComment_1.default(' AG Middle ', eBodyViewport);
    reactComment_1.default(' AG Pinned Bottom ', eBottom);
    react_1.useEffect(() => {
        const beansToDestroy = [];
        const destroyFuncs = [];
        if (!context) {
            return;
        }
        const newComp = (tag) => {
            const CompClass = agStackComponentsRegistry.getComponentClass(tag);
            const comp = context.createBean(new CompClass());
            beansToDestroy.push(comp);
            return comp;
        };
        eRoot.current.appendChild(document.createComment(' AG Fake Horizontal Scroll '));
        eRoot.current.appendChild(newComp('AG-FAKE-HORIZONTAL-SCROLL').getGui());
        eRoot.current.appendChild(document.createComment(' AG Overlay Wrapper '));
        eRoot.current.appendChild(newComp('AG-OVERLAY-WRAPPER').getGui());
        const compProxy = {
            setRowAnimationCssOnBodyViewport: setRowAnimationClass,
            setColumnCount: setAriaColCount,
            setRowCount: setAriaRowCount,
            setTopHeight: setTopHeight,
            setBottomHeight: setBottomHeight,
            setTopDisplay: setTopDisplay,
            setBottomDisplay: setBottomDisplay,
            setColumnMovingCss: setMovingCss,
            updateLayoutClasses: setLayoutClass,
            setAlwaysVerticalScrollClass: setForceVerticalScrollClass,
            setPinnedTopBottomOverflowY: setTopAndBottomOverflowY,
            setCellSelectableCss: setCellSelectableCss,
            registerBodyViewportResizeListener: listener => {
                const unsubscribeFromResize = resizeObserverService.observeResize(eBodyViewport.current, listener);
                destroyFuncs.push(() => unsubscribeFromResize());
            }
        };
        const ctrl = context.createBean(new core_1.GridBodyCtrl());
        beansToDestroy.push(ctrl);
        ctrl.setComp(compProxy, eRoot.current, eBodyViewport.current, eTop.current, eBottom.current);
        return () => {
            context.destroyBeans(beansToDestroy);
            destroyFuncs.forEach(f => f());
        };
    }, []);
    const rootClasses = react_1.useMemo(() => utils_1.classesList('ag-root', 'ag-unselectable', movingCss, layoutClass), [movingCss, layoutClass]);
    const bodyViewportClasses = react_1.useMemo(() => utils_1.classesList('ag-body-viewport', rowAnimationClass, layoutClass, forceVerticalScrollClass, cellSelectableCss), [rowAnimationClass, layoutClass, forceVerticalScrollClass, cellSelectableCss]);
    const topClasses = react_1.useMemo(() => utils_1.classesList('ag-floating-top', cellSelectableCss), [cellSelectableCss]);
    const bottomClasses = react_1.useMemo(() => utils_1.classesList('ag-floating-bottom', cellSelectableCss), [cellSelectableCss]);
    const topStyle = react_1.useMemo(() => ({
        height: topHeight,
        minHeight: topHeight,
        display: topDisplay,
        overflowY: topAndBottomOverflowY
    }), [topHeight, topDisplay, topAndBottomOverflowY]);
    const bottomStyle = react_1.useMemo(() => ({
        height: bottomHeight,
        minHeight: bottomHeight,
        display: bottomDisplay,
        overflowY: topAndBottomOverflowY
    }), [bottomHeight, bottomDisplay, topAndBottomOverflowY]);
    const createRowContainer = (container) => react_1.default.createElement(rowContainerComp_1.default, { name: container, key: `${container}-container` });
    const createSection = ({ section, children, className, style }) => (react_1.default.createElement("div", { ref: section, className: className, role: "presentation", style: style }, children.map(createRowContainer)));
    return (react_1.default.createElement("div", { ref: eRoot, className: rootClasses, role: "grid", "aria-colcount": ariaColCount, "aria-rowcount": ariaRowCount },
        react_1.default.createElement(gridHeaderComp_1.default, null),
        createSection({ section: eTop, className: topClasses, style: topStyle, children: [
                core_1.RowContainerName.TOP_LEFT,
                core_1.RowContainerName.TOP_CENTER,
                core_1.RowContainerName.TOP_RIGHT,
                core_1.RowContainerName.TOP_FULL_WIDTH,
            ] }),
        createSection({ section: eBodyViewport, className: bodyViewportClasses, children: [
                core_1.RowContainerName.LEFT,
                core_1.RowContainerName.CENTER,
                core_1.RowContainerName.RIGHT,
                core_1.RowContainerName.FULL_WIDTH,
            ] }),
        createSection({ section: eBottom, className: bottomClasses, style: bottomStyle, children: [
                core_1.RowContainerName.BOTTOM_LEFT,
                core_1.RowContainerName.BOTTOM_CENTER,
                core_1.RowContainerName.BOTTOM_RIGHT,
                core_1.RowContainerName.BOTTOM_FULL_WIDTH,
            ] })));
};
exports.default = react_1.memo(GridBodyComp);

//# sourceMappingURL=gridBodyComp.js.map
