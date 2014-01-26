// require: mjcommon.js

function calc(pai, len) {
    var j;
    var pais = new Array(34);
    for (j = 0; j < 34; ++j) {
        pais[j] = 0;
    }
    for (j = 0; j < len; ++j) {
        p = pai[j] >> 2;
        ++pais[p];
    }
    function mentzName(pai, type) {
        switch (type) {
        case 101:
            return paiName34(pai);
        case 201:
            return paiName34(pai) + paiName34(pai);
        case 202:
            return paiName34(pai) + paiName34(pai + 1);
        case 203:
            return paiName34(pai) + paiName34(pai + 2);
        case 301:
            return paiName34(pai) + paiName34(pai) + paiName34(pai);
        case 302:
            return paiName34(pai) + paiName34(pai + 1) + paiName34(pai + 2);
        }
        return "Er";
    }
    function TInfo() {
        var self = this;
        this.mentz = 0;
        this.toitz = 0;
        this.tartz = 0;
        this.tanki = 0;
        this.error = 0;
        this.getShanten = function () {
            if (self.error > 0) {
                return -1;
            }
            var m = (self.mentz * 3) + ((self.toitz + self.tartz) * 2) + self.tanki;
            var mc = (m - (m % 3)) / 3;
            var t = self.tartz + (self.toitz > 1 ? self.toitz - 1 : 0);
            m -= self.mentz * 3;
            if ((m % 3) == 0) {
                if (self.toitz > 0) {
                    ++t;
                }
            } else {
                if (self.toitz > 0) {
                    m -= 2;
                } else {
                    m -= 1;
                }
            }
            if (self.mentz < mc) {
                if (t > (mc - self.mentz)) {
                    m -= (mc - self.mentz) * 2;
                } else {
                    m -= t * 2 + ((mc - self.mentz) - t);
                }
            }
            return m;
        };
    }
    function MyList (p,t) {
        var self = this;
        this.pai = p;
        this.type = t;
        this.list = null;
        this.name = mentzName(p, t);
        this.next = null;
        this.clone = function () { return new MyList(self.pai, self.type); };
        this.conString = function () {
            if (self.next == null) {
                return "[" + self.name + "]";
            } else {
                return "[" + self.name + "]" + self.next.conString();
            }
        };
        this.conClone = function () {
            var c = new MyList(self.pai, self.type);
            if (self.next != null) {
                c.next = self.next.conClone();
            }
            return c;
        };
        this.append = function (a) {
            if (self.next == null) {
                self.next = a;
            } else {
                self.next.append(a);
            }
            return self;
        };
        this.getTInfo = function () {
            var info;
            if (self.next == null) {
                info = new TInfo();
            } else {
                info = self.next.getTInfo();
            }
            if (self.type > 300) {
                ++info.mentz;
            } else if (self.type == 201) {
                ++info.toitz;
            } else if (self.type > 200) {
                ++info.tartz;
            } else if (self.type > 100) {
                ++info.tanki;
            } else {
                ++info.error;
            }
            return info;
        };
    }

    function check3(pais, n, o) {
        var j, i = 0, p, ml;
        var list = new Array();
        for (j = o; j < 9; ++j) {
            p = j + n;
            if (pais[p] == 0) {
                continue;
            }
            if (pais[p] > 1) {
                list = new Array();
                list[0] = ml = new MyList(p, -1);
                ml.list = new Array();
                return list;
            }
            //--pais[p];
            list[0] = ml = new MyList(p, 101);
            ml.list = check3(pais, n, j + 1);
            //++pais[p];
            return list;
        }
        return list;
    }                

    function check2(pais, n, o) {
        var j, i = 0, p, ml, k = -1;
        var list = new Array();
        for (j = o; j < 9; ++j) {
            if ((k >= 0) && (j > k)) {
                break;
            }
            p = j + n;
            if (pais[p] == 0) {
                continue;
            }
            if ((j < 7) && (pais[p + 2] > 0)) {
                if (pais[p + 1] > 0) {
                    list = new Array();
                    list[0] = ml = new MyList(p, -302);
                    ml.list = new Array();
                    return list;
                }
                --pais[p]; --pais[p + 2];
                list[i++] = ml = new MyList(p, 203);
                ml.list = check2(pais, n, j);
                ++pais[p]; ++pais[p + 2];
                if (k < 0) {
                    k = j + 2;
                }
            }
            if ((j < 8) && (pais[p + 1] > 0)) {
                --pais[p]; --pais[p + 1];
                list[i++] = ml = new MyList(p, 202);
                ml.list = check2(pais, n, j);
                ++pais[p]; ++pais[p + 1];
                if (k < 0) {
                    k = j + 1;
                }
            }
            if (pais[p] == 2) {
                pais[p] -= 2;
                list[i++] = ml = new MyList(p, 201);
                ml.list = check2(pais, n, j + 1);
                pais[p] += 2;
                break;
            }
        }
        if (i == 0) {
            return check3(pais, n, 0);
        }
        return list;
    }
                    
    function check1(pais, n, o) {
        var j, i = 0, p, ml, k = -1;
        var list = new Array();
        for (j = o; j < 9; ++j) {
            if ((k >= 0) && (j - k > 2)) {
                break;
            }
            p = j + n;
            if (pais[p] == 0) {
                continue;
            }
            if ((j < 7) && (pais[p + 1] > 0) && (pais[p + 2] > 0)) {
                --pais[p]; --pais[p + 1]; --pais[p + 2];
                list[i++] = ml = new MyList(p, 302);
                ml.list = check1(pais, n, j);
                ++pais[p]; ++pais[p + 1]; ++pais[p + 2];
                if (k < 0) {
                    k = j;
                }
            }
            if (pais[p] > 2) {
                pais[p] -= 3;
                list[i++] = ml = new MyList(p, 301);
                ml.list = check1(pais, n, j);
                pais[p] += 3;
                break;
            }
        }
        if (i == 0) {
            return check2(pais, n, 0);
        }
        return list;
    }
    
    function check4(pais) {
        var j, i = 0, ml;
        var list = new Array();
        for (j = 27; j < 34; ++j) {
            if (pais[j] == 0) {
                continue;
            }
            switch (pais[j]) {
            case 2:
                pais[j] -= 2;
                list[i++] = ml = new MyList(j, 201);
                ml.list = check4(pais);
                pais[j] += 2;
            case 1:
                --pais[j];
                list[i++] = ml = new MyList(j, 101);
                ml.list = check4(pais);
                ++pais[j];
                break;
            case 3:
                pais[j] -= 2;
                list[i++] = ml = new MyList(j, 201);
                ml.list = check4(pais);
                pais[j] += 2;
            case 4:
                pais[j] -= 3;
                list[i++] = ml = new MyList(j, 301);
                ml.list = check4(pais);
                pais[j] += 3;
                break;
            }
            break;
        }
        return list;
    }
    
    function str1(kk) {
        var list = new Array();
        var j, i = 0, k, ls;
        for (j = 0; j < kk.length; ++j) {
            ls = str1(kk[j].list);
            if (ls.length == 0) {
                list[i++] = "[" +kk[j].name + "]";
            } else {
                for (k = 0; k < ls.length; ++k) {
                    list[i++] = "[" + kk[j].name + "]" + ls[k];
                }
            }
        }
        return list;
    }
    function con1(kk) {
        var list = new Array();
        var j, i = 0, k, ls;
        for (j = 0; j < kk.length; ++j) {
            ls = con1(kk[j].list);
            if (ls.length == 0) {
                list[i++] = kk[j].clone();
            } else {
                for (k = 0; k < ls.length; ++k) {
                    list[i] = kk[j].clone();
                    list[i++].next = ls[k];
                }
            }
        }
        return list;
    }
    
    var ss = "---- MANZ ----";
    
    var ls = con1(check1(pais, 0 ,0));
    var rs = new Array();
    var rsi = 0, mn = 99, sh = 0;
    for (j = 0; j < ls.length; ++j) {
        sh = ls[j].getTInfo().getShanten();
        ss += ls[j].conString() + "(" + sh + ")----   ----";
        if (sh < 0) {
            continue;
        }
        if (sh < mn) {
            mn = sh;
        }
    }
    if (mn == 99) {
        rs = ls;
    } else {
        for (j = 0; j < ls.length; ++j) {
            sh = ls[j].getTInfo().getShanten();
            if (sh < 0) {
                continue;
            }
            if (sh == mn) {
                rs[rsi++] = ls[j];
            }
        }
    }
    
    ss += " " + rs.length + " ----";
    
    ss += " PINZ ----";
    
    var tp = new Array();
    var tpi = 0, k;
    ls = con1(check1(pais, 9, 0));
    mn = 99;
    for (j = 0; j < ls.length; ++j) {
        sh = ls[j].getTInfo().getShanten();
        ss += ls[j].conString() + "(" + sh + ")----   ----";
        if (sh < 0) {
            continue;
        }
        if (sh < mn) {
            mn = sh;
        }
    }
    if (ls.length == 0) {
        tp = rs;
    } else if (rs.length == 0) {
        tp = ls;
    } else if (mn == 99) {
        for (j = 0; j < ls.length; ++j) {
            for (k = 0; k < rs.length; ++k) {
                tp[tpi++] = rs[k].conClone().append(ls[j]);
            }
        }
    } else {
        for (j = 0; j < ls.length; ++j) {
            sh = ls[j].getTInfo().getShanten();
            if (sh < 0) {
                continue;
            }
            if (sh == mn) {
                for (k = 0; k < rs.length; ++k) {
                    tp[tpi++] = rs[k].conClone().append(ls[j]);
                }
            }
        }
    }
    
    ss += " " + tp.length + " ----";
    ss += " SOUZ ----";
    
    rs = new Array();
    rsi = 0;
    mn = 99;
    ls = con1(check1(pais, 18, 0));
    for (j = 0; j < ls.length; ++j) {
        sh = ls[j].getTInfo().getShanten();
        ss += ls[j].conString() + "(" + sh + ")----   ----";
        if (sh < 0) {
            continue;
        }
        if (sh < mn) {
            mn = sh;
        }
    }
    if (ls.length == 0) {
        rs = tp;
    } else if (tp.length == 0) {
        rs = ls;
    } else if (mn == 99) {
        for (j = 0; j < ls.length; ++j) {
            for (k = 0; k < tp.length; ++k) {
                rs[rsi++] = tp[k].conClone().append(ls[j]);
            }
        }
    } else {
        for (j = 0; j < ls.length; ++j) {
            sh = ls[j].getTInfo().getShanten();
            if (sh < 0) {
                continue;
            }
            if (sh == mn) {
                for (k = 0; k < tp.length; ++k) {
                    rs[rsi++] = tp[k].conClone().append(ls[j]);
                }
            }
        }
    }
    
    ss += " " + rs.length + " ----";
    ss += " JIHAI ----";
    
    tp = new Array();
    tpi = 0;
    ls = con1(check4(pais));
    mn = 99;
    for (j = 0; j < ls.length; ++j) {
        sh = ls[j].getTInfo().getShanten();
        ss += ls[j].conString() + "(" + sh + ")----   ----";
        if (sh < 0) {
            continue;
        }
        if (sh < mn) {
            mn = sh;
        }
    }
    if (ls.length == 0) {
        tp = rs;
    } else if (rs.length == 0) {
        tp = ls;
    } else if (mn == 99) {
        for (j = 0; j < ls.length; ++j) {
            for (k = 0; k < rs.length; ++k) {
                tp[tpi++] = rs[k].conClone().append(ls[j]);
            }
        }
    } else {
        for (j = 0; j < ls.length; ++j) {
            sh = ls[j].getTInfo().getShanten();
            if (sh < 0) {
                continue;
            }
            if (sh == mn) {
                for (k = 0; k < rs.length; ++k) {
                    tp[tpi++] = rs[k].conClone().append(ls[j]);
                }
            }
        }
    }
    
    ss += " " + tp.length + " ----";
    ss += " ALL RESULT ----";

    mn = 99;
    for (j = 0; j < tp.length; ++j) {
        sh = tp[j].getTInfo().getShanten();
        if (sh < 0) {
            continue;
        }
        if (sh < mn) {
            mn = sh;
        }
    }
                    
    for (j = 0; j < tp.length; ++j) {
        sh = tp[j].getTInfo().getShanten();
        if (sh < 0) {
            continue;
        }
        if (sh == mn) {
            ss += tp[j].conString() + "(" + tp[j].getTInfo().getShanten() + ")----   ----";
        }
    }
    
    return ss;
}


