// 
// itemfw.js
// 
// LastUpdate: 2014/01/13
// Autoher: 

function TextItem(str) {
    var element = document.createTextNode(str);
    this.getElement = function () { return element; };
    this.getText = function () { return element.nodeValue; };
    this.setText = function (t) { element.nodeValue = t; };
}

function ImageItem(src) {
    var element = document.createElement("img");
    var visible = true;
    element.src = src;
    this.getElement = function () { return element; };
    this.getSrc = function () { return src; };
    this.setSrc = function (s) { element.src = s; };
    this.getVisible = function () { return visible; };
    this.setVisible = function (v) {
        if (v) { visible = true; } else { visible = false; }
        element.style.display = visible ? "" : "none";
    };
    this.getBorderSize = function () { return element.border; };
    this.setBorderSize = function (v) { if (!isNaN(v)) { element.border = v; } };
}

function AnchorItem(url) {
    var element = document.createElement("a");
    element.href = url;
    this.getElement = function () { return element; };
    this.getUrl = function () { return element.href; };
    this.setUrl = function (u) { element.href = u; };
    this.append = function (item) {
        element.appendChild(item.getElement());
    };
}

function TableItem(w, h) {

    function TableCell(x, y) {
        var element = document.createElement("td");
        var visible = true;
        this.append = function (item) { element.appendChild(item.getElement()); };
        this.getData = function () { return element.innerHTML; };
        this.getElement = function () { return element; };
        this.setData = function (data) { element.innerHTML = data; };
        this.x = function () { return x; };
        this.y = function () { return y; };
        this.getVisible = function () { return visible; };
        this.setVisible = function (v) {
            if (v) { visible = true; } else { visible = false; }
            element.style.display = visible ? "" : "none";
        };
    }
    function TableRow(y) {
        var element = document.createElement("tr");
        var cells = new Array();
        var cellCount = 0;
        this.appendCell = function () {
            var x = cellCount;
            var cell = new TableCell(x, y);
            cells[x] = cell;
            element.appendChild(cell.getElement());
            ++cellCount;
        };
        this.getCell = function (x) {
            return cells[x];
        };
        this.getElement = function () { return element; }
        this.y = function () { return y; }
        this.count = function () { return cellCount; }
        this.iterator = function () {
            return new function () {
                var j = 0;
                this.hasNext = function () { return j < cellCount; };
                this.next = function () {
                    if (j == cellCount) {
                        return null;
                    }
                    var cell = cells[j];
                    ++j;
                    return cell;
                };
            };
        };
    }
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    var colSize = w;
    var rowSize = h;
    var rows = new Array();
    
    var i, j;
    for (i = 0; i < h; ++i) {
        var row = new TableRow(i);
        rows[i] = row;
        for (j = 0; j < w; ++j) {
            row.appendCell();
        }
        tbody.appendChild(row.getElement());
    }
    table.appendChild(tbody);
    
    this.getCell = function (x, y) { return rows[y].getCell(x); };
    this.getRow = function (y) { return rows[y]; };
    this.getElement = function () { return table; };
    this.row = function () { return rowSize; };
    this.col = function () { return colSize; };
    this.setBorderSize = function (size) { table.border = size; };
    this.iterator = function () {
        return  new function () {
            var i = 0, j = 0;
            this.hasNext = function () {
                return (i != rowSize);
            };
            this.next = function () {
                if (i == rowSize) {
                    return null;
                }
                var cell = rows[i].getCell(j);
                ++j;
                if (j == rows[i].count()) {
                    j = 0;
                    ++i;
                }
                return cell;
            };
        };
    };
    this.rowIterator = function () {
        return new function () {
            var i = 0;
            this.hasNext = function () {
                return (i != rowSize);
            };
            this.next = function () {
                if (i == rowSize) {
                    return null;
                }
                var row = rows[i];
                ++i;
                return row;
            };
        };
    };
}
