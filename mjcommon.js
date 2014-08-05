
// n未満の乱数生成
var rand = (function () {
    if (MersenneTwister) {
        var _mtRand = new MersenneTwister();
        var _seed = new Array(
            (new Date()).getSeconds(), 
            Math.floor(0x7000 * Math.random()), 
            Math.floor(0x7000 * Math.random()), 
            Math.floor(0x7000 * Math.random()), 
            Math.floor(0x7000 * Math.random()));
        _mtRand.init_by_array(_seed, _seed.length);
        return function (n) {
            return _mtRand.genrand_int32() % n;
        };
    } else {
        return function (n) {
            return Math.floor(n * Math.random());
        };
    }
})();


// 牌ID(0～135)から牌画像のURLの取得
function getPaiImageSrc(id) {
    var p = id >> 2;
    var x = p % 9;
    var y = (p - x) / 9;
    if ((y < 3) && (x == 4) && (id % 4 == 0)) { // 赤ドラ
        x = 9;
    }
    return "img/slice_" + y + "_" + x + ".png";
}

// 牌種番号(0～33)から牌の名前取得
function paiName34(p, a) {
    var x = (p % 9);
    var y = (p - x) / 9;
    if (a) {
        if ((y < 3) && (x == 4)) {
            x = 0;
        }
    }
    return (x + 1) + ['m', 'p', 's', 'z'][y];
}

// 牌ID(0～135)から牌の名前取得
function paiName136(id) {
    var p = i >> 2;
    var x = p % 9;
    var y = (p - x) / 9;
    if ((y < 3) && (x == 4) && (i % 4 == 0)) { // 赤ドラ
        x = -1;
    }
    return (x + 1) + ['m', 'p', 's', 'z'][y];
}

var MITYPE_TANKI = 110;
var MITYPE_TOITZ = 210;
var MITYPE_RTARZ = 220;
var MITYPE_PTARZ = 221;
var MITYPE_KTARZ = 230;
var MITYPE_ANKO  = 310;
var MITYPE_PON1  = 311;
var MITYPE_PON2  = 312;
var MITYPE_PON3  = 313;
var MITYPE_SHUNZ = 320;
var MITYPE_CHIIS = 321;
var MITYPE_CHIIM = 322;
var MITYPE_CHIIL = 323;
var MITYPE_AKAN  = 410;
var MITYPE_KKAN1 = 411;
var MITYPE_KKAN2 = 412;
var MITYPE_KKAN3 = 413;
var MITYPE_MKAN1 = 421;
var MITYPE_MKAN2 = 422;
var MITYPE_MKAN3 = 423;

function MentzInfoToString(mi) {
    var str = "";
    var p = mi.pai;
    var a = mi.aka;
    var f = function (p0) {
        return paiName34(p0, a);
    };
    var fp = f(p);
    switch (mi.type) {
    case MITYPE_TANKI: str = fp; break;
    case MITYPE_TOITZ: str = fp + fp; break;
    case MITYPE_RTARZ: 
    case MITYPE_PTARZ: str = fp + f(p + 1); break;
    case MITYPE_KTARZ: str = fp + f(p + 2); break;
    case MITYPE_ANKO:  str = fp + fp + fp; break;
    case MITYPE_PON1:  str = fp + fp + '(' + fp + ')'; break;
    case MITYPE_PON2:  str = fp + '(' + fp + ')' + fp; break;
    case MITYPE_PON3:  str = '(' + fp + ')' + fp + fp; break;
    case MITYPE_SHUNZ: str = fp + f(p + 1) + f(p + 2); break;
    case MITYPE_CHIIS: str = '(' + fp + ')' + f(p + 1) + f(p + 2); break;
    case MITYPE_CHIIM: str = '(' + f(p + 1) + ')' + fp + f(p + 2); break;
    case MITYPE_CHIIL: str = '(' + f(p + 2) + ')' + fp + f(p + 1); break;
    case MITYPE_AKAN:  str = fp + fp + fp + fp; break;
    case MITYPE_KKAN1: str = fp + fp + '(' + fp + fp + ')'; break;
    case MITYPE_KKAN2: str = fp + '(' + fp + fp + ')' + fp; break;
    case MITYPE_KKAN3: str = '(' + fp + fp + ')' + fp + fp; break;
    case MITYPE_MKAN1: str = fp + fp + fp + '(' + fp + ')'; break;
    case MITYPE_MKAN2: str = fp + '(' + fp + ')' + fp + fp; break;
    case MITYPE_MKAN3: str = '(' + fp + ')' + fp + fp + fp; break;
    default: str = "Err"; break;
    }
    return "[" + str + "]";
}

function MentzInfo(p, t) {
    this.pai = p;
    this.type = t;
    this.aka = false;
}

function MIList(mi) {
    this.info = mi;
    this.next = null;
}


function Tehai() {
    var _pais = new Array(14);
    var _count = 0;
    this.append = function (id) {
        if (_count < 14) {
            _pais[_count++] = id;
            return true;
        } else {
            return false;
        }
    };
    this.replace = function (oid, iid) {
        var i;
        for (i = 0; i < _count; ++i) {
            if (_pais[i] == oid) {
                _pais[i] = iid;
                return true;
            }
        }
        return false;
    };
    this.remove = function (id) {
        var i, j;
        for (i = 0; i < _count; ++i) {
            if (_pais[i] == id) {
                --_count;
                for (j = i; j < _count; ++j) {
                    _pais[j] = _pais[j + 1];
                }
                return true;
            }
        }
        return false;
    };
    this.getHist = function () {
        var hist = new Array(34);
        var i;
        for (i = 0; i < 34; ++i) {
            hist[i] = 0;
        }
        for (i = 0; i < _count; ++i) {
            ++hist[_pais[i] >> 2];
        }
        return hist;
    };
    this.iterator = (function (pais, count) {
        var idx = 0;
        return new function () {
            this.hasNext = function () {
                return idx < count;
            };
            this.next = function () {
                if (idx < count) {
                    return pais[idx++];
                } else {
                    return null;
                }
            };
            this.index = function () {
                return idx;
            };
        };
    })(_pais, _count);
}
