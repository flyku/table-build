if (typeof module !== 'undefined' && module.exports !== 'undefined') {
    module.exports = table;
} else if (typeof define === 'function') { 
    define(function() {
        return table;
    });
}
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function(value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Cell = function() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, Cell);

    this.html = config.html;

    if (config.rowSpan > 1) {
        this.rowSpan = config.rowSpan;
    }

    if (config.colSpan > 1) {
        this.colSpan = config.colSpan;
    }

    if (config.isFixed) {
        this.isFixed = !!config.isFixed;
    }

    if (typeof config === 'string' || typeof config === 'number') {
        this.html = config;
    }

    if (typeof this.html !== 'string') {
        this.html = this.html.toString();
    }
};

var __dataCount = void 0,
    __ruleCount = void 0;
if (typeof __ruleCount === 'undefined') {
    __ruleCount = 0;
    __dataCount = 0;
}

function cell() {
    var configList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var fixedConfigs = arguments[1];

    var lastRuleType = null;
    var bodyRuleEmpty = false;
    var headRuleEmpty = false;
    var list = [];
    list._id = 'cellList';
    list.rowCount = 0;
    list.colCount = 0;

    if (typeof configList === 'function') {
        configList = configList();

        if (!Array.isArray(configList)) {
            throw new Error('configList返回值必须是Array的实例');
        }
    }
    if (configList.length === 0) {
        bodyRuleEmpty = true;
    }

    if (fixedConfigs) {
        if (typeof fixedConfigs === 'function') {
            fixedConfigs = fixedConfigs();

            if (!Array.isArray(fixedConfigs)) {
                throw new Error('fixedConfigs返回值必须是Array的实例');
            }
        }

        fixedConfigs.forEach(function(item, index) {
            if (typeof item === 'function') {
                fixedConfigs[index] = item();
            }

            fixedConfigs[index].isFixed = true;
        });
        if (fixedConfigs.length === 0) {
            headRuleEmpty = true;
        }
        [].unshift.apply(configList, fixedConfigs);
    } else {
        headRuleEmpty = true;
    }
    if (headRuleEmpty) {
        __ruleCount++;
    }
    configList.forEach(function(config) {
        var cell = void 0;
        if (typeof config === 'function') {
            cell = new Cell(config());
        } else {
            cell = new Cell(config);
        }
        if (cell.isFixed !== lastRuleType) {
            __ruleCount++;
            lastRuleType = cell.isFixed;
        }
        if (true) {
            cell.uniqId = __ruleCount + '-' + __dataCount;
        } else {}
        __dataCount++;

        list.rowCount += cell.rowSpan || 1;
        list.colCount += cell.colSpan || 1;
        list.push(cell);
    });
    if (bodyRuleEmpty) {
        __ruleCount++;
    }
    return list;
}


/*table*/
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var SPAN_PLACEHOLDER = '__SPAN_PLACEHOLDER__';

var Table = function() {
    function Table(cellLists) {
        _classCallCheck(this, Table);

        this.rows = cellLists;
        this.rowCount = cellLists.length;
        this.colCount = Math.max.apply(null, cellLists.map(function(cellList) {
            return cellList.colCount;
        }));
        cellLists.forEach(function(cellList, index) {
            for (var i = cellList.length - 1; i > -1; i--) {
                if (cellList[i] === SPAN_PLACEHOLDER) {
                    cellList.splice(i, 1);
                }
            }
        });
        for (var i = cellLists.length - 1; i > -1; i--) {
            if (cellLists[i].length === 0) {
                cellLists.splice(i, 1);
            }
        }
    }

    _createClass(Table, null, [{
        key: 'validateParam',
        value: function validateParam(cellLists) {
            if (Array.isArray(cellLists) && cellLists.every(function(item) {
                    return item._id === 'cellList';
                })) {
                return true;
            } else {
                throw new Error('表格的行或列必须是cellList数组');
            }
        }
    }, {
        key: 'adjustSpan',
        value: function adjustSpan(cellLists) {
            cellLists.forEach(function(cellList, index) {
                for (var i = cellList.length - 1; i > -1; i--) {
                    if (cellList[i] && cellList[i].rowSpan > 1) {
                        var spanSize = cellList[i].rowSpan;
                        var spanPlaceHolder = new Array(spanSize).join(SPAN_PLACEHOLDER + '|').split('|').splice(0, spanSize - 1);

                        if (cellList[i + 1] !== undefined) {
                            [].splice.apply(cellList, [i + 1, 0].concat(spanPlaceHolder));
                        }
                    }
                }
            });
            for (var i = 0, len = cellLists.length; i < len; i++) {
                var cellList = cellLists[i];
                for (var insertPosition = 0; insertPosition < cellList.length; insertPosition++) {
                    var cell = cellList[insertPosition];
                    if (cell && cell.colSpan > 1) {
                        var colSpanSize = cell.colSpan;
                        var rowSpanSize = cell.rowSpan || 1;
                        var placeHolders = new Array(rowSpanSize).fill(SPAN_PLACEHOLDER);

                        while (colSpanSize > 1) {
                            var rightCellList = cellLists[i + colSpanSize - 1];
                            if (rightCellList) {
                                [].splice.apply(rightCellList, [insertPosition, 0].concat(placeHolders));
                            }
                            colSpanSize--;
                        }
                    }
                }
            }
            return cellLists;
        }
    }, {
        key: 'exchangeRowAndCol',
        value: function exchangeRowAndCol(cellLists) {
            var newCellList = [];
            var newRowCount = Math.max.apply(null, cellLists.map(function(cellList) {
                return cellList.rowCount;
            }));

            var _loop = function _loop(i) {
                newCellList[i] = [];
                newCellList[i].colCount = 0;
                newCellList[i]._id = 'cellList';

                cellLists.forEach(function(cellList) {
                    newCellList[i].push(cellList[i] || SPAN_PLACEHOLDER);
                    newCellList[i].colCount++;
                });
            };

            for (var i = 0; i < newRowCount; i++) {
                _loop(i);
            }

            return newCellList;
        }
    }]);

    return Table;
}();

function table(cellLists, isByRows) {
    if (Table.validateParam(cellLists)) {
        cellLists = !!isByRows ? Table.adjustSpan(cellLists) : Table.exchangeRowAndCol(Table.adjustSpan(cellLists));
        return new Table(cellLists);
    }
}