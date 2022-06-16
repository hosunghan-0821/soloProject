if (typeof window != "undefined" && typeof window.nhn == "undefined") {
    window.nhn = {}
}
if (typeof window != "undefined") {
    if (typeof window.jindo == "undefined") {
        window.jindo = {}
    }
} else {
    if (!jindo) {
        jindo = {}
    }
}
jindo.$Jindo = function () {
    var a = arguments.callee;
    var b = a._cached;
    if (b) {
        return b
    }
    if (!(this instanceof a)) {
        return new a()
    }
    if (!b) {
        a._cached = this
    }
    this.version = "1.5.2"
};
jindo.$ = function (l) {
    var h = [], o = arguments, n = o.length, g = o[n - 1], m = document, c = null;
    var d = /^<([a-z]+|h[1-5])>$/i;
    var e = /^<([a-z]+|h[1-5])(\s+[^>]+)?>/i;
    if (n > 1 && typeof g != "string" && g.body) {
        o = Array.prototype.slice.apply(o, [0, n - 1]);
        m = g
    }
    for (var f = 0; f < n; f++) {
        c = o[f];
        if (typeof c == "string") {
            c = c.replace(/^\s+|\s+$/g, "");
            if (c.indexOf("<") > -1) {
                if (d.test(c)) {
                    c = m.createElement(RegExp.$1)
                } else {
                    if (e.test(c)) {
                        var b = {
                            thead: "table",
                            tbody: "table",
                            tr: "tbody",
                            td: "tr",
                            dt: "dl",
                            dd: "dl",
                            li: "ul",
                            legend: "fieldset",
                            option: "select"
                        };
                        var r = RegExp.$1.toLowerCase();
                        var q = jindo._createEle(b[r], c, m);
                        for (var f = 0, a = q.length; f < a; f++) {
                            h.push(q[f])
                        }
                        c = null
                    }
                }
            } else {
                c = m.getElementById(c)
            }
        }
        if (c) {
            h[h.length] = c
        }
    }
    return h.length > 1 ? h : (h[0] || null)
};
jindo._createEle = function (g, f, a, e) {
    var c = "R" + new Date().getTime() + parseInt(Math.random() * 100000, 10);
    var d = a.createElement("div");
    switch (g) {
        case"select":
        case"table":
        case"dl":
        case"ul":
        case"fieldset":
            d.innerHTML = "<" + g + ' class="' + c + '">' + f + "</" + g + ">";
            break;
        case"thead":
        case"tbody":
        case"col":
            d.innerHTML = "<table><" + g + ' class="' + c + '">' + f + "</" + g + "></table>";
            break;
        case"tr":
            d.innerHTML = '<table><tbody><tr class="' + c + '">' + f + "</tr></tbody></table>";
            break;
        default:
            d.innerHTML = '<div class="' + c + '">' + f + "</div>";
            break
    }
    var b;
    for (b = d.firstChild; b; b = b.firstChild) {
        if (b.className == c) {
            break
        }
    }
    return e ? b : b.childNodes
};
jindo.$Class = function (oDef) {
    function typeClass() {
        var t = this;
        var a = [];
        var superFunc = function (m, superClass, func) {
            if (m != "constructor" && func.toString().indexOf("$super") > -1) {
                var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g, "$1").split(",");
                var funcStr = func.toString().replace(/function[^{]*{/, "").replace(/(\w|\.?)(this\.\$super|this)/g, function (m, m2, m3) {
                    if (!m2) {
                        return m3 + ".$super"
                    }
                    return m
                });
                funcStr = funcStr.substr(0, funcStr.length - 1);
                func = superClass[m] = eval("false||function(" + funcArg.join(",") + "){" + funcStr + "}")
            }
            return function () {
                var f = this.$this[m];
                var t = this.$this;
                var r = (t[m] = func).apply(t, arguments);
                t[m] = f;
                return r
            }
        };
        while (typeof t._$superClass != "undefined") {
            t.$super = new Object;
            t.$super.$this = this;
            for (var x in t._$superClass.prototype) {
                if (t._$superClass.prototype.hasOwnProperty(x)) {
                    if (typeof this[x] == "undefined" && x != "$init") {
                        this[x] = t._$superClass.prototype[x]
                    }
                    if (x != "constructor" && x != "_$superClass" && typeof t._$superClass.prototype[x] == "function") {
                        t.$super[x] = superFunc(x, t._$superClass, t._$superClass.prototype[x])
                    } else {
                        t.$super[x] = t._$superClass.prototype[x]
                    }
                }
            }
            if (typeof t.$super.$init == "function") {
                a[a.length] = t
            }
            t = t.$super
        }
        for (var i = a.length - 1; i > -1; i--) {
            a[i].$super.$init.apply(a[i].$super, arguments)
        }
        if (typeof this.$init == "function") {
            this.$init.apply(this, arguments)
        }
    }

    if (typeof oDef.$static != "undefined") {
        var i = 0, x;
        for (x in oDef) {
            if (oDef.hasOwnProperty(x)) {
                x == "$static" || i++
            }
        }
        for (x in oDef.$static) {
            if (oDef.$static.hasOwnProperty(x)) {
                typeClass[x] = oDef.$static[x]
            }
        }
        if (!i) {
            return oDef.$static
        }
        delete oDef.$static
    }
    typeClass.prototype = oDef;
    typeClass.prototype.constructor = typeClass;
    typeClass.extend = jindo.$Class.extend;
    return typeClass
};
jindo.$Class.extend = function (b) {
    if (typeof b == "undefined" || b === null || !b.extend) {
        throw new Error("extend시 슈퍼 클래스는 Class여야 합니다.")
    }
    this.prototype._$superClass = b;
    for (var a in b) {
        if (b.hasOwnProperty(a)) {
            if (a == "prototype") {
                continue
            }
            this[a] = b[a]
        }
    }
    return this
};
jindo.$$ = jindo.cssquery = (function () {
    var sVersion = "3.0";
    var debugOption = {repeat: 1};
    var UID = 1;
    var cost = 0;
    var validUID = {};
    var bSupportByClassName = document.getElementsByClassName ? true : false;
    var safeHTML = false;
    var getUID4HTML = function (oEl) {
        var nUID = safeHTML ? (oEl._cssquery_UID && oEl._cssquery_UID[0]) : oEl._cssquery_UID;
        if (nUID && validUID[nUID] == oEl) {
            return nUID
        }
        nUID = UID++;
        oEl._cssquery_UID = safeHTML ? [nUID] : nUID;
        validUID[nUID] = oEl;
        return nUID
    };
    var getUID4XML = function (oEl) {
        var oAttr = oEl.getAttribute("_cssquery_UID");
        var nUID = safeHTML ? (oAttr && oAttr[0]) : oAttr;
        if (!nUID) {
            nUID = UID++;
            oEl.setAttribute("_cssquery_UID", safeHTML ? [nUID] : nUID)
        }
        return nUID
    };
    var getUID = getUID4HTML;
    var uniqid = function (sPrefix) {
        return (sPrefix || "") + new Date().getTime() + parseInt(Math.random() * 100000000, 10)
    };

    function getElementsByClass(searchClass, node, tag) {
        var classElements = new Array();
        if (node == null) {
            node = document
        }
        if (tag == null) {
            tag = "*"
        }
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++
            }
        }
        return classElements
    }

    var getChilds_dontShrink = function (oEl, sTagName, sClassName) {
        if (bSupportByClassName && sClassName) {
            if (oEl.getElementsByClassName) {
                return oEl.getElementsByClassName(sClassName)
            }
            if (oEl.querySelectorAll) {
                return oEl.querySelectorAll(sClassName)
            }
            return getElementsByClass(sClassName, oEl, sTagName)
        } else {
            if (sTagName == "*") {
                return oEl.all || oEl.getElementsByTagName(sTagName)
            }
        }
        return oEl.getElementsByTagName(sTagName)
    };
    var clearKeys = function () {
        backupKeys._keys = {}
    };
    var oDocument_dontShrink = document;
    var bXMLDocument = false;
    var backupKeys = function (sQuery) {
        var oKeys = backupKeys._keys;
        sQuery = sQuery.replace(/'(\\'|[^'])*'/g, function (sAll) {
            var uid = uniqid("QUOT");
            oKeys[uid] = sAll;
            return uid
        });
        sQuery = sQuery.replace(/"(\\"|[^"])*"/g, function (sAll) {
            var uid = uniqid("QUOT");
            oKeys[uid] = sAll;
            return uid
        });
        sQuery = sQuery.replace(/\[(.*?)\]/g, function (sAll, sBody) {
            if (sBody.indexOf("ATTR") == 0) {
                return sAll
            }
            var uid = "[" + uniqid("ATTR") + "]";
            oKeys[uid] = sAll;
            return uid
        });
        var bChanged;
        do {
            bChanged = false;
            sQuery = sQuery.replace(/\(((\\\)|[^)|^(])*)\)/g, function (sAll, sBody) {
                if (sBody.indexOf("BRCE") == 0) {
                    return sAll
                }
                var uid = "_" + uniqid("BRCE");
                oKeys[uid] = sAll;
                bChanged = true;
                return uid
            })
        } while (bChanged);
        return sQuery
    };
    var restoreKeys = function (sQuery, bOnlyAttrBrace) {
        var oKeys = backupKeys._keys;
        var bChanged;
        var rRegex = bOnlyAttrBrace ? /(\[ATTR[0-9]+\])/g : /(QUOT[0-9]+|\[ATTR[0-9]+\])/g;
        do {
            bChanged = false;
            sQuery = sQuery.replace(rRegex, function (sKey) {
                if (oKeys[sKey]) {
                    bChanged = true;
                    return oKeys[sKey]
                }
                return sKey
            })
        } while (bChanged);
        sQuery = sQuery.replace(/_BRCE[0-9]+/g, function (sKey) {
            return oKeys[sKey] ? oKeys[sKey] : sKey
        });
        return sQuery
    };
    var restoreString = function (sKey) {
        var oKeys = backupKeys._keys;
        var sOrg = oKeys[sKey];
        if (!sOrg) {
            return sKey
        }
        return eval(sOrg)
    };
    var wrapQuot = function (sStr) {
        return '"' + sStr.replace(/"/g, '\\"') + '"'
    };
    var getStyleKey = function (sKey) {
        if (/^@/.test(sKey)) {
            return sKey.substr(1)
        }
        return null
    };
    var getCSS = function (oEl, sKey) {
        if (oEl.currentStyle) {
            if (sKey == "float") {
                sKey = "styleFloat"
            }
            return oEl.currentStyle[sKey] || oEl.style[sKey]
        } else {
            if (window.getComputedStyle) {
                return oDocument_dontShrink.defaultView.getComputedStyle(oEl, null).getPropertyValue(sKey.replace(/([A-Z])/g, "-$1").toLowerCase()) || oEl.style[sKey]
            }
        }
        if (sKey == "float" && /MSIE/.test(window.navigator.userAgent)) {
            sKey = "styleFloat"
        }
        return oEl.style[sKey]
    };
    var oCamels = {
        accesskey: "accessKey",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        "class": "className",
        colspan: "colSpan",
        "for": "htmlFor",
        maxlength: "maxLength",
        readonly: "readOnly",
        rowspan: "rowSpan",
        tabindex: "tabIndex",
        valign: "vAlign"
    };
    var getDefineCode = function (sKey) {
        var sVal;
        var sStyleKey;
        if (bXMLDocument) {
            sVal = 'oEl.getAttribute("' + sKey + '",2)'
        } else {
            if (sStyleKey = getStyleKey(sKey)) {
                sKey = "$$" + sStyleKey;
                sVal = 'getCSS(oEl, "' + sStyleKey + '")'
            } else {
                switch (sKey) {
                    case"checked":
                        sVal = 'oEl.checked + ""';
                        break;
                    case"disabled":
                        sVal = 'oEl.disabled + ""';
                        break;
                    case"enabled":
                        sVal = '!oEl.disabled + ""';
                        break;
                    case"readonly":
                        sVal = 'oEl.readOnly + ""';
                        break;
                    case"selected":
                        sVal = 'oEl.selected + ""';
                        break;
                    default:
                        if (oCamels[sKey]) {
                            sVal = "oEl." + oCamels[sKey]
                        } else {
                            sVal = 'oEl.getAttribute("' + sKey + '",2)'
                        }
                }
            }
        }
        return "_" + sKey + " = " + sVal
    };
    var getReturnCode = function (oExpr) {
        var sStyleKey = getStyleKey(oExpr.key);
        var sVar = "_" + (sStyleKey ? "$$" + sStyleKey : oExpr.key);
        var sVal = oExpr.val ? wrapQuot(oExpr.val) : "";
        switch (oExpr.op) {
            case"~=":
                return "(" + sVar + ' && (" " + ' + sVar + ' + " ").indexOf(" " + ' + sVal + ' + " ") > -1)';
            case"^=":
                return "(" + sVar + " && " + sVar + ".indexOf(" + sVal + ") == 0)";
            case"$=":
                return "(" + sVar + " && " + sVar + ".substr(" + sVar + ".length - " + oExpr.val.length + ") == " + sVal + ")";
            case"*=":
                return "(" + sVar + " && " + sVar + ".indexOf(" + sVal + ") > -1)";
            case"!=":
                return "(" + sVar + " != " + sVal + ")";
            case"=":
                return "(" + sVar + " == " + sVal + ")"
        }
        return "(" + sVar + ")"
    };
    var getNodeIndex = function (oEl) {
        var nUID = getUID(oEl);
        var nIndex = oNodeIndexes[nUID] || 0;
        if (nIndex == 0) {
            for (var oSib = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oSib; oSib = oSib.nextSibling) {
                if (oSib.nodeType != 1) {
                    continue
                }
                nIndex++;
                setNodeIndex(oSib, nIndex)
            }
            nIndex = oNodeIndexes[nUID]
        }
        return nIndex
    };
    var oNodeIndexes = {};
    var setNodeIndex = function (oEl, nIndex) {
        var nUID = getUID(oEl);
        oNodeIndexes[nUID] = nIndex
    };
    var unsetNodeIndexes = function () {
        setTimeout(function () {
            oNodeIndexes = {}
        }, 0)
    };
    var oPseudoes_dontShrink = {
        contains: function (oEl, sOption) {
            return (oEl.innerText || oEl.textContent || "").indexOf(sOption) > -1
        }, "last-child": function (oEl, sOption) {
            for (oEl = oEl.nextSibling; oEl; oEl = oEl.nextSibling) {
                if (oEl.nodeType == 1) {
                    return false
                }
            }
            return true
        }, "first-child": function (oEl, sOption) {
            for (oEl = oEl.previousSibling; oEl; oEl = oEl.previousSibling) {
                if (oEl.nodeType == 1) {
                    return false
                }
            }
            return true
        }, "only-child": function (oEl, sOption) {
            var nChild = 0;
            for (var oChild = (oEl.parentNode || oEl._IE5_parentNode).firstChild; oChild; oChild = oChild.nextSibling) {
                if (oChild.nodeType == 1) {
                    nChild++
                }
                if (nChild > 1) {
                    return false
                }
            }
            return nChild ? true : false
        }, empty: function (oEl, _) {
            return oEl.firstChild ? false : true
        }, "nth-child": function (oEl, nMul, nAdd) {
            var nIndex = getNodeIndex(oEl);
            return nIndex % nMul == nAdd
        }, "nth-last-child": function (oEl, nMul, nAdd) {
            var oLast = (oEl.parentNode || oEl._IE5_parentNode).lastChild;
            for (; oLast; oLast = oLast.previousSibling) {
                if (oLast.nodeType == 1) {
                    break
                }
            }
            var nTotal = getNodeIndex(oLast);
            var nIndex = getNodeIndex(oEl);
            var nLastIndex = nTotal - nIndex + 1;
            return nLastIndex % nMul == nAdd
        }, checked: function (oEl) {
            return !!oEl.checked
        }, selected: function (oEl) {
            return !!oEl.selected
        }, enabled: function (oEl) {
            return !oEl.disabled
        }, disabled: function (oEl) {
            return !!oEl.disabled
        }
    };
    var getExpression = function (sBody) {
        var oRet = {defines: "", returns: "true"};
        var sBody = restoreKeys(sBody, true);
        var aExprs = [];
        var aDefineCode = [], aReturnCode = [];
        var sId, sTagName;
        var sBody = sBody.replace(/:([\w-]+)(\(([^)]*)\))?/g, function (_1, sType, _2, sOption) {
            switch (sType) {
                case"not":
                    var oInner = getExpression(sOption);
                    var sFuncDefines = oInner.defines;
                    var sFuncReturns = oInner.returnsID + oInner.returnsTAG + oInner.returns;
                    aReturnCode.push("!(function() { " + sFuncDefines + " return " + sFuncReturns + " })()");
                    break;
                case"nth-child":
                case"nth-last-child":
                    sOption = restoreString(sOption);
                    if (sOption == "even") {
                        sOption = "2n"
                    } else {
                        if (sOption == "odd") {
                            sOption = "2n+1"
                        }
                    }
                    var nMul, nAdd;
                    var matchstr = sOption.match(/([0-9]*)n([+-][0-9]+)*/);
                    if (matchstr) {
                        nMul = matchstr[1] || 1;
                        nAdd = matchstr[2] || 0
                    } else {
                        nMul = Infinity;
                        nAdd = parseInt(sOption, 10)
                    }
                    aReturnCode.push("oPseudoes_dontShrink[" + wrapQuot(sType) + "](oEl, " + nMul + ", " + nAdd + ")");
                    break;
                case"first-of-type":
                case"last-of-type":
                    sType = (sType == "first-of-type" ? "nth-of-type" : "nth-last-of-type");
                    sOption = 1;
                case"nth-of-type":
                case"nth-last-of-type":
                    sOption = restoreString(sOption);
                    if (sOption == "even") {
                        sOption = "2n"
                    } else {
                        if (sOption == "odd") {
                            sOption = "2n+1"
                        }
                    }
                    var nMul, nAdd;
                    if (/([0-9]*)n([+-][0-9]+)*/.test(sOption)) {
                        nMul = parseInt(RegExp.$1, 10) || 1;
                        nAdd = parseInt(RegExp.$2, 20) || 0
                    } else {
                        nMul = Infinity;
                        nAdd = parseInt(sOption, 10)
                    }
                    oRet.nth = [nMul, nAdd, sType];
                    break;
                default:
                    sOption = sOption ? restoreString(sOption) : "";
                    aReturnCode.push("oPseudoes_dontShrink[" + wrapQuot(sType) + "](oEl, " + wrapQuot(sOption) + ")");
                    break
            }
            return ""
        });
        var sBody = sBody.replace(/\[(@?[\w-]+)(([!^~$*]?=)([^\]]*))?\]/g, function (_1, sKey, _2, sOp, sVal) {
            sKey = restoreString(sKey);
            sVal = restoreString(sVal);
            if (sKey == "checked" || sKey == "disabled" || sKey == "enabled" || sKey == "readonly" || sKey == "selected") {
                if (!sVal) {
                    sOp = "=";
                    sVal = "true"
                }
            }
            aExprs.push({key: sKey, op: sOp, val: sVal});
            return ""
        });
        var sClassName = null;
        var sBody = sBody.replace(/\.([\w-]+)/g, function (_, sClass) {
            aExprs.push({key: "class", op: "~=", val: sClass});
            if (!sClassName) {
                sClassName = sClass
            }
            return ""
        });
        var sBody = sBody.replace(/#([\w-]+)/g, function (_, sIdValue) {
            if (bXMLDocument) {
                aExprs.push({key: "id", op: "=", val: sIdValue})
            } else {
                sId = sIdValue
            }
            return ""
        });
        sTagName = sBody == "*" ? "" : sBody;
        var oVars = {};
        for (var i = 0, oExpr; oExpr = aExprs[i]; i++) {
            var sKey = oExpr.key;
            if (!oVars[sKey]) {
                aDefineCode.push(getDefineCode(sKey))
            }
            aReturnCode.unshift(getReturnCode(oExpr));
            oVars[sKey] = true
        }
        if (aDefineCode.length) {
            oRet.defines = "var " + aDefineCode.join(",") + ";"
        }
        if (aReturnCode.length) {
            oRet.returns = aReturnCode.join("&&")
        }
        oRet.quotID = sId ? wrapQuot(sId) : "";
        oRet.quotTAG = sTagName ? wrapQuot(bXMLDocument ? sTagName : sTagName.toUpperCase()) : "";
        if (bSupportByClassName) {
            oRet.quotCLASS = sClassName ? wrapQuot(sClassName) : ""
        }
        oRet.returnsID = sId ? "oEl.id == " + oRet.quotID + " && " : "";
        oRet.returnsTAG = sTagName && sTagName != "*" ? "oEl.tagName == " + oRet.quotTAG + " && " : "";
        return oRet
    };
    var splitToParts = function (sQuery) {
        var aParts = [];
        var sRel = " ";
        var sBody = sQuery.replace(/(.*?)\s*(!?[+>~ ]|!)\s*/g, function (_, sBody, sRelative) {
            if (sBody) {
                aParts.push({rel: sRel, body: sBody})
            }
            sRel = sRelative.replace(/\s+$/g, "") || " ";
            return ""
        });
        if (sBody) {
            aParts.push({rel: sRel, body: sBody})
        }
        return aParts
    };
    var isNth_dontShrink = function (oEl, sTagName, nMul, nAdd, sDirection) {
        var nIndex = 0;
        for (var oSib = oEl; oSib; oSib = oSib[sDirection]) {
            if (oSib.nodeType == 1 && (!sTagName || sTagName == oSib.tagName)) {
                nIndex++
            }
        }
        return nIndex % nMul == nAdd
    };
    var compileParts = function (aParts) {
        var aPartExprs = [];
        for (var i = 0, oPart; oPart = aParts[i]; i++) {
            aPartExprs.push(getExpression(oPart.body))
        }
        var sFunc = "";
        var sPushCode = "aRet.push(oEl); if (oOptions.single) { bStop = true; }";
        for (var i = aParts.length - 1, oPart; oPart = aParts[i]; i--) {
            var oExpr = aPartExprs[i];
            var sPush = (debugOption.callback ? "cost++;" : "") + oExpr.defines;
            var sReturn = "if (bStop) {" + (i == 0 ? "return aRet;" : "return;") + "}";
            if (oExpr.returns == "true") {
                sPush += (sFunc ? sFunc + "(oEl);" : sPushCode) + sReturn
            } else {
                sPush += "if (" + oExpr.returns + ") {" + (sFunc ? sFunc + "(oEl);" : sPushCode) + sReturn + "}"
            }
            var sCheckTag = "oEl.nodeType != 1";
            if (oExpr.quotTAG) {
                sCheckTag = "oEl.tagName != " + oExpr.quotTAG
            }
            var sTmpFunc = "(function(oBase" + (i == 0 ? ", oOptions) { var bStop = false; var aRet = [];" : ") {");
            if (oExpr.nth) {
                sPush = "if (isNth_dontShrink(oEl, " + (oExpr.quotTAG ? oExpr.quotTAG : "false") + "," + oExpr.nth[0] + "," + oExpr.nth[1] + ',"' + (oExpr.nth[2] == "nth-of-type" ? "previousSibling" : "nextSibling") + '")) {' + sPush + "}"
            }
            switch (oPart.rel) {
                case" ":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oCandi = oEl;for (; oCandi; oCandi = (oCandi.parentNode || oCandi._IE5_parentNode)) {if (oCandi == oBase) break;}if (!oCandi || " + sCheckTag + ") return aRet;" + sPush
                    } else {
                        sTmpFunc += "var aCandi = getChilds_dontShrink(oBase, " + (oExpr.quotTAG || '"*"') + ", " + (oExpr.quotCLASS || "null") + ");for (var i = 0, oEl; oEl = aCandi[i]; i++) {" + (oExpr.quotCLASS ? "if (" + sCheckTag + ") continue;" : "") + sPush + "}"
                    }
                    break;
                case">":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");if ((oEl.parentNode || oEl._IE5_parentNode) != oBase || " + sCheckTag + ") return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (var oEl = oBase.firstChild; oEl; oEl = oEl.nextSibling) {if (" + sCheckTag + ") { continue; }" + sPush + "}"
                    }
                    break;
                case"+":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oPrev;for (oPrev = oEl.previousSibling; oPrev; oPrev = oPrev.previousSibling) { if (oPrev.nodeType == 1) break; }if (!oPrev || oPrev != oBase || " + sCheckTag + ") return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) { if (oEl.nodeType == 1) break; }if (!oEl || " + sCheckTag + ") { return aRet; }" + sPush
                    }
                    break;
                case"~":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oCandi = oEl;for (; oCandi; oCandi = oCandi.previousSibling) { if (oCandi == oBase) break; }if (!oCandi || " + sCheckTag + ") return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (var oEl = oBase.nextSibling; oEl; oEl = oEl.nextSibling) {if (" + sCheckTag + ") { continue; }if (!markElement_dontShrink(oEl, " + i + ")) { break; }" + sPush + "}"
                    }
                    break;
                case"!":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");for (; oBase; oBase = (oBase.parentNode || oBase._IE5_parentNode)) { if (oBase == oEl) break; }if (!oBase || " + sCheckTag + ") return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (var oEl = (oBase.parentNode || oBase._IE5_parentNode); oEl; oEl = (oEl.parentNode || oEl._IE5_parentNode)) {if (" + sCheckTag + ") { continue; }" + sPush + "}"
                    }
                    break;
                case"!>":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oRel = (oBase.parentNode || oBase._IE5_parentNode);if (!oRel || oEl != oRel || (" + sCheckTag + ")) return aRet;" + sPush
                    } else {
                        sTmpFunc += "var oEl = (oBase.parentNode || oBase._IE5_parentNode);if (!oEl || " + sCheckTag + ") { return aRet; }" + sPush
                    }
                    break;
                case"!+":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oRel;for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType == 1) break; }if (!oRel || oEl != oRel || (" + sCheckTag + ")) return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) { if (oEl.nodeType == 1) break; }if (!oEl || " + sCheckTag + ") { return aRet; }" + sPush
                    }
                    break;
                case"!~":
                    if (oExpr.quotID) {
                        sTmpFunc += "var oEl = oDocument_dontShrink.getElementById(" + oExpr.quotID + ");var oRel;for (oRel = oBase.previousSibling; oRel; oRel = oRel.previousSibling) { if (oRel.nodeType != 1) { continue; }if (oRel == oEl) { break; }}if (!oRel || (" + sCheckTag + ")) return aRet;" + sPush
                    } else {
                        sTmpFunc += "for (oEl = oBase.previousSibling; oEl; oEl = oEl.previousSibling) {if (" + sCheckTag + ") { continue; }if (!markElement_dontShrink(oEl, " + i + ")) { break; }" + sPush + "}"
                    }
                    break
            }
            sTmpFunc += (i == 0 ? "return aRet;" : "") + "})";
            sFunc = sTmpFunc
        }
        eval("var fpCompiled = " + sFunc + ";");
        return fpCompiled
    };
    var parseQuery = function (sQuery) {
        var sCacheKey = sQuery;
        var fpSelf = arguments.callee;
        var fpFunction = fpSelf._cache[sCacheKey];
        if (!fpFunction) {
            sQuery = backupKeys(sQuery);
            var aParts = splitToParts(sQuery);
            fpFunction = fpSelf._cache[sCacheKey] = compileParts(aParts);
            fpFunction.depth = aParts.length
        }
        return fpFunction
    };
    parseQuery._cache = {};
    var parseTestQuery = function (sQuery) {
        var fpSelf = arguments.callee;
        var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
        var aResult = [];
        var nLen = aSplitQuery.length;
        var aFunc = [];
        for (var i = 0; i < nLen; i++) {
            aFunc.push((function (sQuery) {
                var sCacheKey = sQuery;
                var fpFunction = fpSelf._cache[sCacheKey];
                if (!fpFunction) {
                    sQuery = backupKeys(sQuery);
                    var oExpr = getExpression(sQuery);
                    eval("fpFunction = function(oEl) { " + oExpr.defines + "return (" + oExpr.returnsID + oExpr.returnsTAG + oExpr.returns + "); };")
                }
                return fpFunction
            })(restoreKeys(aSplitQuery[i])))
        }
        return aFunc
    };
    parseTestQuery._cache = {};
    var distinct = function (aList) {
        var aDistinct = [];
        var oDummy = {};
        for (var i = 0, oEl; oEl = aList[i]; i++) {
            var nUID = getUID(oEl);
            if (oDummy[nUID]) {
                continue
            }
            aDistinct.push(oEl);
            oDummy[nUID] = true
        }
        return aDistinct
    };
    var markElement_dontShrink = function (oEl, nDepth) {
        var nUID = getUID(oEl);
        if (cssquery._marked[nDepth][nUID]) {
            return false
        }
        cssquery._marked[nDepth][nUID] = true;
        return true
    };
    var oResultCache = null;
    var bUseResultCache = false;
    var bExtremeMode = false;
    var old_cssquery = function (sQuery, oParent, oOptions) {
        if (typeof sQuery == "object") {
            var oResult = {};
            for (var k in sQuery) {
                if (sQuery.hasOwnProperty(k)) {
                    oResult[k] = arguments.callee(sQuery[k], oParent, oOptions)
                }
            }
            return oResult
        }
        cost = 0;
        var executeTime = new Date().getTime();
        var aRet;
        for (var r = 0, rp = debugOption.repeat; r < rp; r++) {
            aRet = (function (sQuery, oParent, oOptions) {
                if (oOptions) {
                    if (!oOptions.oneTimeOffCache) {
                        oOptions.oneTimeOffCache = false
                    }
                } else {
                    oOptions = {oneTimeOffCache: false}
                }
                cssquery.safeHTML(oOptions.oneTimeOffCache);
                if (!oParent) {
                    oParent = document
                }
                oDocument_dontShrink = oParent.ownerDocument || oParent.document || oParent;
                if (/\bMSIE\s([0-9]+(\.[0-9]+)*);/.test(navigator.userAgent) && parseFloat(RegExp.$1) < 6) {
                    try {
                        oDocument_dontShrink.location
                    } catch (e) {
                        oDocument_dontShrink = document
                    }
                    oDocument_dontShrink.firstChild = oDocument_dontShrink.getElementsByTagName("html")[0];
                    oDocument_dontShrink.firstChild._IE5_parentNode = oDocument_dontShrink
                }
                bXMLDocument = (typeof XMLDocument != "undefined") ? (oDocument_dontShrink.constructor === XMLDocument) : (!oDocument_dontShrink.location);
                getUID = bXMLDocument ? getUID4XML : getUID4HTML;
                clearKeys();
                var aSplitQuery = backupKeys(sQuery).split(/\s*,\s*/);
                var aResult = [];
                var nLen = aSplitQuery.length;
                for (var i = 0; i < nLen; i++) {
                    aSplitQuery[i] = restoreKeys(aSplitQuery[i])
                }
                for (var i = 0; i < nLen; i++) {
                    var sSingleQuery = aSplitQuery[i];
                    var aSingleQueryResult = null;
                    var sResultCacheKey = sSingleQuery + (oOptions.single ? "_single" : "");
                    var aCache = bUseResultCache ? oResultCache[sResultCacheKey] : null;
                    if (aCache) {
                        for (var j = 0, oCache; oCache = aCache[j]; j++) {
                            if (oCache.parent == oParent) {
                                aSingleQueryResult = oCache.result;
                                break
                            }
                        }
                    }
                    if (!aSingleQueryResult) {
                        var fpFunction = parseQuery(sSingleQuery);
                        cssquery._marked = [];
                        for (var j = 0, nDepth = fpFunction.depth; j < nDepth; j++) {
                            cssquery._marked.push({})
                        }
                        aSingleQueryResult = distinct(fpFunction(oParent, oOptions));
                        if (bUseResultCache && !oOptions.oneTimeOffCache) {
                            if (!(oResultCache[sResultCacheKey] instanceof Array)) {
                                oResultCache[sResultCacheKey] = []
                            }
                            oResultCache[sResultCacheKey].push({parent: oParent, result: aSingleQueryResult})
                        }
                    }
                    aResult = aResult.concat(aSingleQueryResult)
                }
                unsetNodeIndexes();
                return aResult
            })(sQuery, oParent, oOptions)
        }
        executeTime = new Date().getTime() - executeTime;
        if (debugOption.callback) {
            debugOption.callback(sQuery, cost, executeTime)
        }
        return aRet
    };
    var cssquery;
    if (document.querySelectorAll) {
        function _isNonStandardQueryButNotException(sQuery) {
            return /\[\s*(?:checked|selected|disabled)/.test(sQuery)
        }

        function _commaRevise(sQuery, sChange) {
            return sQuery.replace(/\,/gi, sChange)
        }

        var protoSlice = Array.prototype.slice;
        var _toArray = function (aArray) {
            return protoSlice.apply(aArray)
        };
        try {
            protoSlice.apply(document.documentElement.childNodes)
        } catch (e) {
            _toArray = function (aArray) {
                var returnArray = [];
                var leng = aArray.length;
                for (var i = 0; i < leng; i++) {
                    returnArray.push(aArray[i])
                }
                return returnArray
            }
        }
        cssquery = function (sQuery, oParent, oOptions) {
            oParent = oParent || document;
            try {
                if (_isNonStandardQueryButNotException(sQuery)) {
                    throw Error("None Standard Query")
                } else {
                    var sReviseQuery = sQuery;
                    var oReviseParent = oParent;
                    if (oParent.nodeType != 9) {
                        if (bExtremeMode) {
                            if (!oParent.id) {
                                oParent.id = "p" + new Date().getTime() + parseInt(Math.random() * 100000000, 10)
                            }
                        } else {
                            throw Error("Parent Element has not ID.or It is not document.or None Extreme Mode.")
                        }
                        sReviseQuery = _commaRevise("#" + oParent.id + " " + sQuery, ", #" + oParent.id);
                        oReviseParent = oParent.ownerDocument || oParent.document || document
                    }
                    if (oOptions && oOptions.single) {
                        return [oReviseParent.querySelector(sReviseQuery)]
                    } else {
                        return _toArray(oReviseParent.querySelectorAll(sReviseQuery))
                    }
                }
            } catch (e) {
                return old_cssquery(sQuery, oParent, oOptions)
            }
        }
    } else {
        cssquery = old_cssquery
    }
    cssquery.test = function (oEl, sQuery) {
        clearKeys();
        var aFunc = parseTestQuery(sQuery);
        for (var i = 0, nLen = aFunc.length; i < nLen; i++) {
            if (aFunc[i](oEl)) {
                return true
            }
        }
        return false
    };
    cssquery.useCache = function (bFlag) {
        if (typeof bFlag != "undefined") {
            bUseResultCache = bFlag;
            cssquery.clearCache()
        }
        return bUseResultCache
    };
    cssquery.clearCache = function () {
        oResultCache = {}
    };
    cssquery.getSingle = function (sQuery, oParent, oOptions) {
        return cssquery(sQuery, oParent, {
            single: true,
            oneTimeOffCache: oOptions ? (!!oOptions.oneTimeOffCache) : false
        })[0] || null
    };
    cssquery.xpath = function (sXPath, oParent) {
        var sXPath = sXPath.replace(/\/(\w+)(\[([0-9]+)\])?/g, function (_1, sTag, _2, sTh) {
            sTh = sTh || "1";
            return ">" + sTag + ":nth-of-type(" + sTh + ")"
        });
        return old_cssquery(sXPath, oParent)
    };
    cssquery.debug = function (fpCallback, nRepeat) {
        debugOption.callback = fpCallback;
        debugOption.repeat = nRepeat || 1
    };
    cssquery.safeHTML = function (bFlag) {
        var bIE = /MSIE/.test(window.navigator.userAgent);
        if (arguments.length > 0) {
            safeHTML = bFlag && bIE
        }
        return safeHTML || !bIE
    };
    cssquery.version = sVersion;
    cssquery.release = function () {
        if (/MSIE/.test(window.navigator.userAgent)) {
            delete validUID;
            validUID = {};
            if (bUseResultCache) {
                cssquery.clearCache()
            }
        }
    };
    cssquery._getCacheInfo = function () {
        return {uidCache: validUID, eleCache: oResultCache}
    };
    cssquery._resetUID = function () {
        UID = 0
    };
    cssquery.extreme = function (bExtreme) {
        if (arguments.length == 0) {
            bExtreme = true
        }
        bExtremeMode = bExtreme
    };
    return cssquery
})();
jindo.$Agent = function () {
    var a = arguments.callee;
    var b = a._cached;
    if (b) {
        return b
    }
    if (!(this instanceof a)) {
        return new a
    }
    if (!b) {
        a._cached = this
    }
    this._navigator = navigator;
    this._dm = document.documentMode
};
jindo.$Agent.prototype.navigator = function () {
    var b = {}, h = -1, c = -1, n = this._navigator.userAgent, m = this._navigator.vendor || "", d = this._dm;

    function g(f, e) {
        return ((e || "").indexOf(f) > -1)
    }

    b.getName = function () {
        var e = "";
        for (x in b) {
            if (typeof b[x] == "boolean" && b[x] && b.hasOwnProperty(x)) {
                e = x
            }
        }
        return e
    };
    b.webkit = g("WebKit", n);
    b.opera = (window.opera !== undefined) || g("Opera", n);
    b.ie = !b.opera && (g("MSIE", n) || g("Trident", n));
    b.chrome = b.webkit && g("Chrome", n);
    b.safari = b.webkit && !b.chrome && g("Apple", m);
    b.firefox = g("Firefox", n);
    b.mozilla = g("Gecko", n) && !b.safari && !b.chrome && !b.firefox && !b.ie;
    b.camino = g("Camino", m);
    b.netscape = g("Netscape", n);
    b.omniweb = g("OmniWeb", n);
    b.icab = g("iCab", m);
    b.konqueror = g("KDE", m);
    b.mobile = (g("Mobile", n) || g("Android", n) || g("Nokia", n) || g("webOS", n) || g("Opera Mini", n) || g("BlackBerry", n) || (g("Windows", n) && g("PPC", n)) || g("Smartphone", n) || g("IEMobile", n)) && !g("iPad", n);
    b.msafari = (!g("IEMobile", n) && g("Mobile", n)) || (g("iPad", n) && g("Safari", n));
    b.mopera = g("Opera Mini", n);
    b.mie = g("PPC", n) || g("Smartphone", n) || g("IEMobile", n);
    try {
        if (b.ie) {
            if (d > 0) {
                h = d;
                if (n.match(/(?:Trident)\/([0-9.]+)/)) {
                    var a = parseFloat(RegExp.$1, 10);
                    if (a > 3) {
                        c = a + 4
                    }
                } else {
                    c = h
                }
            } else {
                c = h = n.match(/(?:MSIE) ([0-9.]+)/)[1]
            }
        } else {
            if (b.safari || b.msafari) {
                h = parseFloat(n.match(/Safari\/([0-9.]+)/)[1]);
                if (h == 100) {
                    h = 1.1
                } else {
                    if (n.match(/Version\/([0-9.]+)/)) {
                        h = RegExp.$1
                    } else {
                        h = [1, 1.2, -1, 1.3, 2, 3][Math.floor(h / 100)]
                    }
                }
            } else {
                if (b.mopera) {
                    h = n.match(/(?:Opera\sMini)\/([0-9.]+)/)[1]
                } else {
                    if (b.firefox || b.opera || b.omniweb) {
                        h = n.match(/(?:Firefox|Opera|OmniWeb)\/([0-9.]+)/)[1]
                    } else {
                        if (b.mozilla) {
                            h = n.match(/rv:([0-9.]+)/)[1]
                        } else {
                            if (b.icab) {
                                h = n.match(/iCab[ \/]([0-9.]+)/)[1]
                            } else {
                                if (b.chrome) {
                                    h = n.match(/Chrome[ \/]([0-9.]+)/)[1]
                                }
                            }
                        }
                    }
                }
            }
        }
        b.version = parseFloat(h);
        b.nativeVersion = parseFloat(c);
        if (isNaN(b.version)) {
            b.version = -1
        }
    } catch (l) {
        b.version = -1
    }
    this.navigator = function () {
        return b
    };
    return b
};
jindo.$Agent.prototype.os = function () {
    var d = new Object;
    var a = this._navigator.userAgent;
    var c = this._navigator.platform;
    var b = function (f, e) {
        return (e.indexOf(f) > -1)
    };
    d.getName = function () {
        var e = "";
        for (x in d) {
            if (typeof d[x] == "boolean" && d[x] && d.hasOwnProperty(x)) {
                e = x
            }
        }
        return e
    };
    d.win = b("Win", c);
    d.mac = b("Mac", c);
    d.linux = b("Linux", c);
    d.win2000 = d.win && (b("NT 5.0", a) || b("2000", a));
    d.winxp = d.win && b("NT 5.1", a);
    d.xpsp2 = d.winxp && b("SV1", a);
    d.vista = d.win && b("NT 6.0", a);
    d.win7 = d.win && b("NT 6.1", a);
    d.ipad = b("iPad", a);
    d.iphone = b("iPhone", a) && !d.ipad;
    d.android = b("Android", a);
    d.nokia = b("Nokia", a);
    d.webos = b("webOS", a);
    d.blackberry = b("BlackBerry", a);
    d.mwin = b("PPC", a) || b("Smartphone", a) || b("IEMobile", a);
    this.os = function () {
        return d
    };
    return d
};
jindo.$Agent.prototype.flash = function () {
    var h = new Object;
    var g = this._navigator.plugins;
    var a = this._navigator.mimeTypes;
    var c = null;
    h.installed = false;
    h.version = -1;
    if (typeof g != "undefined" && g.length) {
        c = g["Shockwave Flash"];
        if (c) {
            h.installed = true;
            if (c.description) {
                h.version = parseFloat(c.description.match(/[0-9.]+/)[0])
            }
        }
        if (g["Shockwave Flash 2.0"]) {
            h.installed = true;
            h.version = 2
        }
    } else {
        if (typeof a != "undefined" && a.length) {
            c = a["application/x-shockwave-flash"];
            h.installed = (c && c.enabledPlugin)
        } else {
            for (var b = 10; b > 1; b--) {
                try {
                    c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + b);
                    h.installed = true;
                    h.version = b;
                    break
                } catch (d) {
                }
            }
        }
    }
    this.flash = function () {
        return h
    };
    this.info = this.flash;
    return h
};
jindo.$Agent.prototype.silverlight = function () {
    var d = new Object;
    var c = this._navigator.plugins;
    var a = null;
    d.installed = false;
    d.version = -1;
    if (typeof c != "undefined" && c.length) {
        a = c["Silverlight Plug-In"];
        if (a) {
            d.installed = true;
            d.version = parseInt(a.description.split(".")[0], 10);
            if (a.description == "1.0.30226.2") {
                d.version = 2
            }
        }
    } else {
        try {
            a = new ActiveXObject("AgControl.AgControl");
            d.installed = true;
            if (a.isVersionSupported("3.0")) {
                d.version = 3
            } else {
                if (a.isVersionSupported("2.0")) {
                    d.version = 2
                } else {
                    if (a.isVersionSupported("1.0")) {
                        d.version = 1
                    }
                }
            }
        } catch (b) {
        }
    }
    this.silverlight = function () {
        return d
    };
    return d
};
jindo.$A = function (c) {
    var a = arguments.callee;
    if (typeof c == "undefined" || c == null) {
        c = []
    }
    if (c instanceof a) {
        return c
    }
    if (!(this instanceof a)) {
        return new a(c)
    }
    this._array = [];
    if (c.constructor != String) {
        this._array = [];
        for (var b = 0; b < c.length; b++) {
            this._array[this._array.length] = c[b]
        }
    }
};
jindo.$A.prototype.toString = function () {
    return this._array.toString()
};
jindo.$A.prototype.get = function (a) {
    return this._array[a]
};
jindo.$A.prototype.length = function (d, b) {
    if (typeof d == "number") {
        var a = this._array.length;
        this._array.length = d;
        if (typeof b != "undefined") {
            for (var c = a; c < d; c++) {
                this._array[c] = b
            }
        }
        return this
    } else {
        return this._array.length
    }
};
jindo.$A.prototype.has = function (a) {
    return (this.indexOf(a) > -1)
};
jindo.$A.prototype.indexOf = function (a) {
    if (typeof this._array.indexOf != "undefined") {
        jindo.$A.prototype.indexOf = function (b) {
            return this._array.indexOf(b)
        }
    } else {
        jindo.$A.prototype.indexOf = function (b) {
            for (var c = 0; c < this._array.length; c++) {
                if (this._array[c] == b) {
                    return c
                }
            }
            return -1
        }
    }
    return this.indexOf(a)
};
jindo.$A.prototype.$value = function () {
    return this._array
};
jindo.$A.prototype.push = function (a) {
    return this._array.push.apply(this._array, Array.prototype.slice.apply(arguments))
};
jindo.$A.prototype.pop = function () {
    return this._array.pop()
};
jindo.$A.prototype.shift = function () {
    return this._array.shift()
};
jindo.$A.prototype.unshift = function (a) {
    this._array.unshift.apply(this._array, Array.prototype.slice.apply(arguments));
    return this._array.length
};
jindo.$A.prototype.forEach = function (b, a) {
    if (typeof this._array.forEach == "function") {
        jindo.$A.prototype.forEach = function (m, d) {
            var c = this._array;
            var h = this.constructor.Break;
            var n = this.constructor.Continue;

            function g(o, p, f) {
                try {
                    m.call(d, o, p, f)
                } catch (q) {
                    if (!(q instanceof n)) {
                        throw q
                    }
                }
            }

            try {
                this._array.forEach(g)
            } catch (l) {
                if (!(l instanceof h)) {
                    throw l
                }
            }
            return this
        }
    } else {
        jindo.$A.prototype.forEach = function (n, g) {
            var c = this._array;
            var l = this.constructor.Break;
            var o = this.constructor.Continue;

            function h(p, q, f) {
                try {
                    n.call(g, p, q, f)
                } catch (r) {
                    if (!(r instanceof o)) {
                        throw r
                    }
                }
            }

            for (var d = 0; d < c.length; d++) {
                try {
                    h(c[d], d, c)
                } catch (m) {
                    if (m instanceof l) {
                        break
                    }
                    throw m
                }
            }
            return this
        }
    }
    return this.forEach(b, a)
};
jindo.$A.prototype.slice = function (c, d) {
    var b = this._array.slice.call(this._array, c, d);
    return jindo.$A(b)
};
jindo.$A.prototype.splice = function (b, d) {
    var c = this._array.splice.apply(this._array, Array.prototype.slice.apply(arguments));
    return jindo.$A(c)
};
jindo.$A.prototype.shuffle = function () {
    this._array.sort(function (d, c) {
        return Math.random() > Math.random() ? 1 : -1
    });
    return this
};
jindo.$A.prototype.reverse = function () {
    this._array.reverse();
    return this
};
jindo.$A.prototype.empty = function () {
    return this.length(0)
};
jindo.$A.Break = function () {
    if (!(this instanceof arguments.callee)) {
        throw new arguments.callee
    }
};
jindo.$A.Continue = function () {
    if (!(this instanceof arguments.callee)) {
        throw new arguments.callee
    }
};
jindo.$A.prototype.map = function (b, a) {
    if (typeof this._array.map == "function") {
        jindo.$A.prototype.map = function (m, d) {
            var c = this._array;
            var h = this.constructor.Break;
            var n = this.constructor.Continue;

            function g(o, p, f) {
                try {
                    return m.call(d, o, p, f)
                } catch (q) {
                    if (q instanceof n) {
                        return o
                    } else {
                        throw q
                    }
                }
            }

            try {
                this._array = this._array.map(g)
            } catch (l) {
                if (!(l instanceof h)) {
                    throw l
                }
            }
            return this
        }
    } else {
        jindo.$A.prototype.map = function (p, g) {
            var d = this._array;
            var o = [];
            var m = this.constructor.Break;
            var n = this.constructor.Continue;

            function h(q, r, f) {
                try {
                    return p.call(g, q, r, f)
                } catch (s) {
                    if (s instanceof n) {
                        return q
                    } else {
                        throw s
                    }
                }
            }

            for (var c = 0; c < this._array.length; c++) {
                try {
                    o[c] = h(d[c], c, d)
                } catch (l) {
                    if (l instanceof m) {
                        return this
                    } else {
                        throw l
                    }
                }
            }
            this._array = o;
            return this
        }
    }
    return this.map(b, a)
};
jindo.$A.prototype.filter = function (b, a) {
    if (typeof this._array.filter != "undefined") {
        jindo.$A.prototype.filter = function (d, c) {
            return jindo.$A(this._array.filter(d, c))
        }
    } else {
        jindo.$A.prototype.filter = function (e, d) {
            var c = [];
            this.forEach(function (g, h, f) {
                if (e.call(d, g, h, f) === true) {
                    c[c.length] = g
                }
            });
            return jindo.$A(c)
        }
    }
    return this.filter(b, a)
};
jindo.$A.prototype.every = function (b, a) {
    if (typeof this._array.every != "undefined") {
        jindo.$A.prototype.every = function (d, c) {
            return this._array.every(d, c)
        }
    } else {
        jindo.$A.prototype.every = function (e, d) {
            var c = true;
            this.forEach(function (g, h, f) {
                if (e.call(d, g, h, f) === false) {
                    c = false;
                    jindo.$A.Break()
                }
            });
            return c
        }
    }
    return this.every(b, a)
};
jindo.$A.prototype.some = function (b, a) {
    if (typeof this._array.some != "undefined") {
        jindo.$A.prototype.some = function (d, c) {
            return this._array.some(d, c)
        }
    } else {
        jindo.$A.prototype.some = function (e, d) {
            var c = false;
            this.forEach(function (g, h, f) {
                if (e.call(d, g, h, f) === true) {
                    c = true;
                    jindo.$A.Break()
                }
            });
            return c
        }
    }
    return this.some(b, a)
};
jindo.$A.prototype.refuse = function (c) {
    var b = jindo.$A(Array.prototype.slice.apply(arguments));
    return this.filter(function (a, d) {
        return !b.has(a)
    })
};
jindo.$A.prototype.unique = function () {
    var e = this._array, c = [], d = e.length;
    var g, f;
    for (g = 0; g < d; g++) {
        for (f = 0; f < c.length; f++) {
            if (e[g] == c[f]) {
                break
            }
        }
        if (f >= c.length) {
            c[f] = e[g]
        }
    }
    this._array = c;
    return this
};
jindo.$Ajax = function (c, f) {
    var a = arguments.callee;
    if (!(this instanceof a)) {
        return new a(c, f)
    }

    function b() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest()
        } else {
            if (ActiveXObject) {
                try {
                    return new ActiveXObject("MSXML2.XMLHTTP")
                } catch (m) {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
                return null
            }
        }
    }

    var l = location.toString();
    var g = "";
    try {
        g = l.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[1]
    } catch (h) {
    }
    this._status = 0;
    this._url = c;
    this._options = new Object;
    this._headers = new Object;
    this._options = {
        type: "xhr",
        method: "post",
        proxy: "",
        timeout: 0,
        onload: function (e) {
        },
        onerror: null,
        ontimeout: function (e) {
        },
        jsonp_charset: "utf-8",
        callbackid: "",
        callbackname: "",
        sendheader: true,
        async: true,
        decode: true,
        postBody: false
    };
    this.option(f);
    if (jindo.$Ajax.CONFIG) {
        this.option(jindo.$Ajax.CONFIG)
    }
    var d = this._options;
    d.type = d.type.toLowerCase();
    d.method = d.method.toLowerCase();
    if (typeof window.__jindo2_callback == "undefined") {
        window.__jindo2_callback = new Array()
    }
    switch (d.type) {
        case"put":
        case"delete":
        case"get":
        case"post":
            d.method = d.type;
            d.type = "xhr";
        case"xhr":
            this._request = b();
            break;
        case"flash":
            if (!jindo.$Ajax.SWFRequest) {
                throw Error("Require jindo.$Ajax.SWFRequest")
            }
            this._request = new jindo.$Ajax.SWFRequest(jindo.$Fn(this.option, this).bind());
            break;
        case"jsonp":
            if (!jindo.$Ajax.JSONPRequest) {
                throw Error("Require jindo.$Ajax.JSONPRequest")
            }
            d.method = "get";
            this._request = new jindo.$Ajax.JSONPRequest(jindo.$Fn(this.option, this).bind());
            break;
        case"iframe":
            if (!jindo.$Ajax.FrameRequest) {
                throw Error("Require jindo.$Ajax.FrameRequest")
            }
            this._request = new jindo.$Ajax.FrameRequest(jindo.$Fn(this.option, this).bind());
            break
    }
};
jindo.$Ajax.prototype._onload = (function (a) {
    if (a) {
        return function () {
            var b = this._request.readyState == 4 && this._request.status == 200;
            var c;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == "function") {
                        if (!this._request.status == 0) {
                            this._options.onerror(jindo.$Ajax.Response(this._request))
                        }
                    } else {
                        if (!this._is_abort) {
                            c = this._options.onload(jindo.$Ajax.Response(this._request))
                        }
                    }
                } finally {
                    if (typeof this._oncompleted == "function") {
                        this._oncompleted(b, c)
                    }
                    if (this._options.type == "xhr") {
                        this.abort();
                        try {
                            delete this._request.onload
                        } catch (d) {
                            this._request.onload = undefined
                        }
                    }
                    delete this._request.onreadystatechange
                }
            }
        }
    } else {
        return function () {
            var b = this._request.readyState == 4 && this._request.status == 200;
            var c;
            if (this._request.readyState == 4) {
                try {
                    if (this._request.status != 200 && typeof this._options.onerror == "function") {
                        this._options.onerror(jindo.$Ajax.Response(this._request))
                    } else {
                        c = this._options.onload(jindo.$Ajax.Response(this._request))
                    }
                } finally {
                    this._status--;
                    if (typeof this._oncompleted == "function") {
                        this._oncompleted(b, c)
                    }
                }
            }
        }
    }
})(/MSIE/.test(window.navigator.userAgent));
jindo.$Ajax.prototype.request = function (c) {
    this._status++;
    var q = this;
    var h = this._request;
    var d = this._options;
    var g, p, n = [], g = "";
    var e = null;
    var b = this._url;
    this._is_abort = false;
    if (d.postBody && d.type.toUpperCase() == "XHR" && d.method.toUpperCase() != "GET") {
        if (typeof c == "string") {
            g = c
        } else {
            g = jindo.$Json(c).toString()
        }
    } else {
        if (typeof c == "undefined" || !c) {
            g = null
        } else {
            for (var f in c) {
                if (c.hasOwnProperty(f)) {
                    p = c[f];
                    if (typeof p == "function") {
                        p = p()
                    }
                    if (p instanceof Array || p instanceof jindo.$A) {
                        jindo.$A(p).forEach(function (r, a, s) {
                            n[n.length] = f + "=" + encodeURIComponent(r)
                        })
                    } else {
                        n[n.length] = f + "=" + encodeURIComponent(p)
                    }
                }
            }
            g = n.join("&")
        }
    }
    if (g && d.type.toUpperCase() == "XHR" && d.method.toUpperCase() == "GET") {
        if (b.indexOf("?") == -1) {
            b += "?"
        } else {
            b += "&"
        }
        b += g;
        g = null
    }
    h.open(d.method.toUpperCase(), b, d.async);
    if (d.type.toUpperCase() == "XHR" && d.method.toUpperCase() == "GET" && /MSIE/.test(window.navigator.userAgent)) {
        h.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT")
    }
    if (d.sendheader) {
        if (!this._headers["Content-Type"]) {
            h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
        }
        h.setRequestHeader("charset", "utf-8");
        for (var m in this._headers) {
            if (this._headers.hasOwnProperty(m)) {
                if (typeof this._headers[m] == "function") {
                    continue
                }
                h.setRequestHeader(m, String(this._headers[m]))
            }
        }
    }
    var l = navigator.userAgent;
    if (h.addEventListener && !(l.indexOf("Opera") > -1) && !(l.indexOf("MSIE") > -1)) {
        if (this._loadFunc) {
            h.removeEventListener("load", this._loadFunc, false)
        }
        this._loadFunc = function (a) {
            clearTimeout(e);
            e = undefined;
            q._onload(a)
        };
        h.addEventListener("load", this._loadFunc, false)
    } else {
        if (typeof h.onload != "undefined") {
            h.onload = function (a) {
                if (h.readyState == 4 && !q._is_abort) {
                    clearTimeout(e);
                    e = undefined;
                    q._onload(a)
                }
            }
        } else {
            if (window.navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1] == 6 && d.async) {
                var o = function (a) {
                    if (h.readyState == 4 && !q._is_abort) {
                        if (e) {
                            clearTimeout(e);
                            e = undefined
                        }
                        q._onload(a);
                        clearInterval(q._interval);
                        q._interval = undefined
                    }
                };
                this._interval = setInterval(o, 300)
            } else {
                h.onreadystatechange = function (a) {
                    if (h.readyState == 4) {
                        clearTimeout(e);
                        e = undefined;
                        q._onload(a)
                    }
                }
            }
        }
    }
    if (d.timeout > 0) {
        if (this._timer) {
            clearTimeout(this._timer)
        }
        e = setTimeout(function () {
            q._is_abort = true;
            if (q._interval) {
                clearInterval(q._interval);
                q._interval = undefined
            }
            try {
                h.abort()
            } catch (a) {
            }
            d.ontimeout(h);
            if (typeof q._oncompleted == "function") {
                q._oncompleted(false)
            }
        }, d.timeout * 1000);
        this._timer = e
    }
    this._test_url = b;
    h.send(g);
    return this
};
jindo.$Ajax.prototype.isIdle = function () {
    return this._status == 0
};
jindo.$Ajax.prototype.abort = function () {
    try {
        if (this._interval) {
            clearInterval(this._interval)
        }
        if (this._timer) {
            clearTimeout(this._timer)
        }
        this._interval = undefined;
        this._timer = undefined;
        this._is_abort = true;
        this._request.abort()
    } finally {
        this._status--
    }
    return this
};
jindo.$Ajax.prototype.option = function (b, c) {
    if (typeof b == "undefined") {
        return ""
    }
    if (typeof b == "string") {
        if (typeof c == "undefined") {
            return this._options[b]
        }
        this._options[b] = c;
        return this
    }
    try {
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                this._options[a] = b[a]
            }
        }
    } catch (d) {
    }
    return this
};
jindo.$Ajax.prototype.header = function (b, c) {
    if (typeof b == "undefined") {
        return ""
    }
    if (typeof b == "string") {
        if (typeof c == "undefined") {
            return this._headers[b]
        }
        this._headers[b] = c;
        return this
    }
    try {
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                this._headers[a] = b[a]
            }
        }
    } catch (d) {
    }
    return this
};
jindo.$Ajax.Response = function (a) {
    if (this === jindo.$Ajax) {
        return new jindo.$Ajax.Response(a)
    }
    this._response = a
};
jindo.$Ajax.Response.prototype.xml = function () {
    return this._response.responseXML
};
jindo.$Ajax.Response.prototype.text = function () {
    return this._response.responseText
};
jindo.$Ajax.Response.prototype.status = function () {
    return this._response.status
};
jindo.$Ajax.Response.prototype.readyState = function () {
    return this._response.readyState
};
jindo.$Ajax.Response.prototype.json = function () {
    if (this._response.responseJSON) {
        return this._response.responseJSON
    } else {
        if (this._response.responseText) {
            try {
                return eval("(" + this._response.responseText + ")")
            } catch (e) {
                return {}
            }
        }
    }
    return {}
};
jindo.$Ajax.Response.prototype.header = function (a) {
    if (typeof a == "string") {
        return this._response.getResponseHeader(a)
    }
    return this._response.getAllResponseHeaders()
};
jindo.$Ajax.RequestBase = jindo.$Class({
    _respHeaderString: "",
    callbackid: "",
    callbackname: "",
    responseXML: null,
    responseJSON: null,
    responseText: "",
    status: 404,
    readyState: 0,
    $init: function (a) {
    },
    onload: function () {
    },
    abort: function () {
    },
    open: function () {
    },
    send: function () {
    },
    setRequestHeader: function (a, b) {
        this._headers[a] = b
    },
    getResponseHeader: function (a) {
        return this._respHeaders[a] || ""
    },
    getAllResponseHeaders: function () {
        return this._respHeaderString
    },
    _getCallbackInfo: function () {
        var b = "";
        if (this.option("callbackid") != "") {
            var a = 0;
            do {
                b = "_" + this.option("callbackid") + "_" + a;
                a++
            } while (window.__jindo2_callback[b])
        } else {
            do {
                b = "_" + Math.floor(Math.random() * 10000)
            } while (window.__jindo2_callback[b])
        }
        if (this.option("callbackname") == "") {
            this.option("callbackname", "_callback")
        }
        return {callbackname: this.option("callbackname"), id: b, name: "window.__jindo2_callback." + b}
    }
});
jindo.$Ajax.JSONPRequest = jindo.$Class({
    _headers: {}, _respHeaders: {}, _script: null, _onerror: null, $init: function (a) {
        this.option = a
    }, _callback: function (b) {
        if (this._onerror) {
            clearTimeout(this._onerror);
            this._onerror = null
        }
        var a = this;
        this.responseJSON = b;
        this.onload(this);
        setTimeout(function () {
            a.abort()
        }, 10)
    }, abort: function () {
        if (this._script) {
            try {
                this._script.parentNode.removeChild(this._script)
            } catch (a) {
            }
        }
    }, open: function (b, a) {
        this.responseJSON = null;
        this._url = a
    }, send: function (e) {
        var c = this;
        var f = this._getCallbackInfo();
        var b = document.getElementsByTagName("head")[0];
        this._script = jindo.$("<script>");
        this._script.type = "text/javascript";
        this._script.charset = this.option("jsonp_charset");
        if (b) {
            b.appendChild(this._script)
        } else {
            if (document.body) {
                document.body.appendChild(this._script)
            }
        }
        window.__jindo2_callback[f.id] = function (g) {
            try {
                c.readyState = 4;
                c.status = 200;
                c._callback(g)
            } finally {
                delete window.__jindo2_callback[f.id]
            }
        };
        var d = jindo.$Agent(navigator);
        if (d.navigator().ie || d.navigator().opera) {
            this._script.onreadystatechange = function () {
                if (this.readyState == "loaded") {
                    if (!c.responseJSON) {
                        c.readyState = 4;
                        c.status = 500;
                        c._onerror = setTimeout(function () {
                            c._callback(null)
                        }, 200)
                    }
                    this.onreadystatechange = null
                }
            }
        } else {
            this._script.onload = function () {
                if (!c.responseJSON) {
                    c.readyState = 4;
                    c.status = 500;
                    c._onerror = setTimeout(function () {
                        c._callback(null)
                    }, 200)
                }
                this.onload = null;
                this.onerror = null
            };
            this._script.onerror = function () {
                if (!c.responseJSON) {
                    c.readyState = 4;
                    c.status = 404;
                    c._onerror = setTimeout(function () {
                        c._callback(null)
                    }, 200)
                }
                this.onerror = null;
                this.onload = null
            }
        }
        var a = "&";
        if (this._url.indexOf("?") == -1) {
            a = "?"
        }
        if (e) {
            e = "&" + e
        } else {
            e = ""
        }
        this._test_url = this._url + a + f.callbackname + "=" + f.name + e;
        this._script.src = this._url + a + f.callbackname + "=" + f.name + e
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest = jindo.$Class({
    $init: function (a) {
        this.option = a
    }, _headers: {}, _respHeaders: {}, _getFlashObj: function () {
        var a = jindo.$Agent(window.navigator).navigator();
        var b;
        if (a.ie && a.version == 9) {
            b = document.getElementById(jindo.$Ajax.SWFRequest._tmpId)
        } else {
            b = window.document[jindo.$Ajax.SWFRequest._tmpId]
        }
        return (this._getFlashObj = function () {
            return b
        })()
    }, _callback: function (a, b, d) {
        this.readyState = 4;
        if ((typeof a).toLowerCase() == "number") {
            this.status = a
        } else {
            if (a == true) {
                this.status = 200
            }
        }
        if (this.status == 200) {
            if (typeof b == "string") {
                try {
                    this.responseText = this.option("decode") ? decodeURIComponent(b) : b;
                    if (!this.responseText || this.responseText == "") {
                        this.responseText = b
                    }
                } catch (c) {
                    if (c.name == "URIError") {
                        this.responseText = b;
                        if (!this.responseText || this.responseText == "") {
                            this.responseText = b
                        }
                    }
                }
            }
            if (typeof d == "object") {
                this._respHeaders = d
            }
        }
        this.onload(this)
    }, open: function (c, a) {
        var b = /https?:\/\/([a-z0-9_\-\.]+)/i;
        this._url = a;
        this._method = c
    }, send: function (g) {
        this.responseXML = false;
        this.responseText = "";
        var b = this;
        var e = {};
        var h = this._getCallbackInfo();
        var c = this._getFlashObj();

        function d(n) {
            switch (typeof n) {
                case"string":
                    return '"' + n.replace(/\"/g, '\\"') + '"';
                    break;
                case"number":
                    return n;
                    break;
                case"object":
                    var o = "", m = [];
                    if (n instanceof Array) {
                        for (var p = 0; p < n.length; p++) {
                            m[p] = d(n[p])
                        }
                        o = "[" + m.join(",") + "]"
                    } else {
                        for (var f in n) {
                            if (n.hasOwnProperty(f)) {
                                m[m.length] = d(f) + ":" + d(n[f])
                            }
                        }
                        o = "{" + m.join(",") + "}"
                    }
                    return o;
                default:
                    return '""'
            }
        }

        g = g ? g.split("&") : [];
        for (var a = 0; a < g.length; a++) {
            pos = g[a].indexOf("=");
            key = g[a].substring(0, pos);
            val = g[a].substring(pos + 1);
            e[key] = decodeURIComponent(val)
        }
        this._current_callback_id = h.id;
        window.__jindo2_callback[h.id] = function (m, f) {
            try {
                b._callback(m, f)
            } finally {
                delete window.__jindo2_callback[h.id]
            }
        };
        var l = {
            url: this._url,
            type: this._method,
            data: e,
            charset: "UTF-8",
            callback: h.name,
            header_json: this._headers
        };
        c.requestViaFlash(d(l))
    }, abort: function () {
        if (this._current_callback_id) {
            window.__jindo2_callback[this._current_callback_id] = function () {
                delete window.__jindo2_callback[info.id]
            }
        }
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.SWFRequest.write = function (a) {
    if (typeof a == "undefined") {
        a = "./ajax.swf"
    }
    jindo.$Ajax.SWFRequest._tmpId = "tmpSwf" + (new Date()).getMilliseconds() + Math.floor(Math.random() * 100000);
    var b = "jindo.$Ajax.SWFRequest.loaded";
    jindo.$Ajax._checkFlashLoad();
    document.write('<div style="position:absolute;top:-1000px;left:-1000px"><object tabindex="-1" id="' + jindo.$Ajax.SWFRequest._tmpId + '" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"><param name="movie" value="' + a + '"><param name = "FlashVars" value = "activeCallback=' + b + '" /><param name = "allowScriptAccess" value = "always" /><embed name="' + jindo.$Ajax.SWFRequest._tmpId + '" src="' + a + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true" FlashVars="activeCallback=' + b + '"></embed></object></div>')
};
jindo.$Ajax._checkFlashLoad = function () {
    jindo.$Ajax._checkFlashKey = setTimeout(function () {
    }, 5000);
    jindo.$Ajax._checkFlashLoad = function () {
    }
};
jindo.$Ajax.SWFRequest.activeFlash = false;
jindo.$Ajax.SWFRequest.loaded = function () {
    clearTimeout(jindo.$Ajax._checkFlashKey);
    jindo.$Ajax.SWFRequest.activeFlash = true
};
jindo.$Ajax.FrameRequest = jindo.$Class({
    _headers: {}, _respHeaders: {}, _frame: null, _domain: "", $init: function (a) {
        this.option = a
    }, _callback: function (d, b, c) {
        var a = this;
        this.readyState = 4;
        this.status = 200;
        this.responseText = b;
        this._respHeaderString = c;
        c.replace(/^([\w\-]+)\s*:\s*(.+)$/m, function (f, e, g) {
            a._respHeaders[e] = g
        });
        this.onload(this);
        setTimeout(function () {
            a.abort()
        }, 10)
    }, abort: function () {
        if (this._frame) {
            try {
                this._frame.parentNode.removeChild(this._frame)
            } catch (a) {
            }
        }
    }, open: function (d, a) {
        var b = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var c = document.location.toString().match(b);
        this._method = d;
        this._url = a;
        this._remote = String(a).match(/(https?:\/\/[a-z0-9_\-\.]+)(:[0-9]+)?/i)[0];
        this._frame = null;
        this._domain = (c[1] != document.domain) ? document.domain : ""
    }, send: function (d) {
        this.responseXML = "";
        this.responseText = "";
        var m = this;
        var l = /https?:\/\/([a-z0-9_\-\.]+)/i;
        var c = this._getCallbackInfo();
        var a;
        var b = [];
        b.push(this._remote + "/ajax_remote_callback.html?method=" + this._method);
        var e = new Array;
        window.__jindo2_callback[c.id] = function (p, n, o) {
            try {
                m._callback(p, n, o)
            } finally {
                delete window.__jindo2_callback[c.id]
            }
        };
        for (var h in this._headers) {
            if (this._headers.hasOwnProperty(h)) {
                e[e.length] = "'" + h + "':'" + this._headers[h] + "'"
            }
        }
        e = "{" + e.join(",") + "}";
        b.push("&id=" + c.id);
        b.push("&header=" + encodeURIComponent(e));
        b.push("&proxy=" + encodeURIComponent(this.option("proxy")));
        b.push("&domain=" + this._domain);
        b.push("&url=" + encodeURIComponent(this._url.replace(l, "")));
        b.push("#" + encodeURIComponent(d));
        var g = this._frame = jindo.$("<iframe>");
        g.style.position = "absolute";
        g.style.visibility = "hidden";
        g.style.width = "1px";
        g.style.height = "1px";
        var f = document.body || document.documentElement;
        if (f.firstChild) {
            f.insertBefore(g, f.firstChild)
        } else {
            f.appendChild(g)
        }
        g.src = b.join("")
    }
}).extend(jindo.$Ajax.RequestBase);
jindo.$Ajax.Queue = function (b) {
    var a = arguments.callee;
    if (!(this instanceof a)) {
        return new a(b)
    }
    this._options = {async: false, useResultAsParam: false, stopOnFailure: false};
    this.option(b);
    this._queue = []
};
jindo.$Ajax.Queue.prototype.option = function (b, c) {
    if (typeof b == "undefined") {
        return ""
    }
    if (typeof b == "string") {
        if (typeof c == "undefined") {
            return this._options[b]
        }
        this._options[b] = c;
        return this
    }
    try {
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                this._options[a] = b[a]
            }
        }
    } catch (d) {
    }
    return this
};
jindo.$Ajax.Queue.prototype.add = function (b, a) {
    this._queue.push({obj: b, param: a})
};
jindo.$Ajax.Queue.prototype.request = function () {
    if (this.option("async")) {
        this._requestAsync()
    } else {
        this._requestSync(0)
    }
};
jindo.$Ajax.Queue.prototype._requestSync = function (d, c) {
    var b = this;
    if (this._queue.length > d + 1) {
        this._queue[d].obj._oncompleted = function (e, h) {
            if (!b.option("stopOnFailure") || e) {
                b._requestSync(d + 1, h)
            }
        }
    }
    var g = this._queue[d].param || {};
    if (this.option("useResultAsParam") && c) {
        try {
            for (var a in c) {
                if (typeof g[a] == "undefined" && c.hasOwnProperty(a)) {
                    g[a] = c[a]
                }
            }
        } catch (f) {
        }
    }
    this._queue[d].obj.request(g)
};
jindo.$Ajax.Queue.prototype._requestAsync = function () {
    for (var a = 0; a < this._queue.length; a++) {
        this._queue[a].obj.request(this._queue[a].param)
    }
};
jindo.$H = function (c) {
    var a = arguments.callee;
    if (typeof c == "undefined") {
        c = new Object
    }
    if (c instanceof a) {
        return c
    }
    if (!(this instanceof a)) {
        return new a(c)
    }
    this._table = {};
    for (var b in c) {
        if (c.hasOwnProperty(b)) {
            this._table[b] = c[b]
        }
    }
};
jindo.$H.prototype.$value = function () {
    return this._table
};
jindo.$H.prototype.$ = function (a, b) {
    if (typeof b == "undefined") {
        return this._table[a]
    }
    this._table[a] = b;
    return this
};
jindo.$H.prototype.length = function () {
    var b = 0;
    for (var a in this._table) {
        if (this._table.hasOwnProperty(a)) {
            if (typeof Object.prototype[a] != "undeifned" && Object.prototype[a] === this._table[a]) {
                continue
            }
            b++
        }
    }
    return b
};
jindo.$H.prototype.forEach = function (g, b) {
    var c = this._table;
    var d = this.constructor;
    for (var a in c) {
        if (c.hasOwnProperty(a)) {
            if (!c.propertyIsEnumerable(a)) {
                continue
            }
            try {
                g.call(b, c[a], a, c)
            } catch (f) {
                if (f instanceof d.Break) {
                    break
                }
                if (f instanceof d.Continue) {
                    continue
                }
                throw f
            }
        }
    }
    return this
};
jindo.$H.prototype.filter = function (c, a) {
    var b = jindo.$H();
    this.forEach(function (e, d, f) {
        if (c.call(a, e, d, f) === true) {
            b.add(d, e)
        }
    });
    return b
};
jindo.$H.prototype.map = function (c, a) {
    var b = this._table;
    this.forEach(function (e, d, f) {
        b[d] = c.call(a, e, d, f)
    });
    return this
};
jindo.$H.prototype.add = function (a, b) {
    this._table[a] = b;
    return this
};
jindo.$H.prototype.remove = function (a) {
    if (typeof this._table[a] == "undefined") {
        return null
    }
    var b = this._table[a];
    delete this._table[a];
    return b
};
jindo.$H.prototype.search = function (b) {
    var a = false;
    this.forEach(function (d, c, e) {
        if (d === b) {
            a = c;
            jindo.$H.Break()
        }
    });
    return a
};
jindo.$H.prototype.hasKey = function (b) {
    var a = false;
    return (typeof this._table[b] != "undefined")
};
jindo.$H.prototype.hasValue = function (a) {
    return (this.search(a) !== false)
};
jindo.$H.prototype.sort = function () {
    var e = new Object;
    var b = this.values();
    var c = false;
    b.sort();
    for (var d = 0; d < b.length; d++) {
        c = this.search(b[d]);
        e[c] = b[d];
        delete this._table[c]
    }
    this._table = e;
    return this
};
jindo.$H.prototype.ksort = function () {
    var d = new Object;
    var b = this.keys();
    b.sort();
    for (var c = 0; c < b.length; c++) {
        d[b[c]] = this._table[b[c]]
    }
    this._table = d;
    return this
};
jindo.$H.prototype.keys = function () {
    var b = new Array;
    for (var a in this._table) {
        if (this._table.hasOwnProperty(a)) {
            b.push(a)
        }
    }
    return b
};
jindo.$H.prototype.values = function () {
    var b = [];
    for (var a in this._table) {
        if (this._table.hasOwnProperty(a)) {
            b[b.length] = this._table[a]
        }
    }
    return b
};
jindo.$H.prototype.toQueryString = function () {
    var c = [], d = null, a = 0;
    for (var b in this._table) {
        if (this._table.hasOwnProperty(b)) {
            if (typeof (d = this._table[b]) == "object" && d.constructor == Array) {
                for (i = 0; i < d.length; i++) {
                    c[c.length] = encodeURIComponent(b) + "[]=" + encodeURIComponent(d[i] + "")
                }
            } else {
                c[c.length] = encodeURIComponent(b) + "=" + encodeURIComponent(this._table[b] + "")
            }
        }
    }
    return c.join("&")
};
jindo.$H.prototype.empty = function () {
    var b = this.keys();
    for (var a = 0; a < b.length; a++) {
        delete this._table[b[a]]
    }
    return this
};
jindo.$H.Break = function () {
    if (!(this instanceof arguments.callee)) {
        throw new arguments.callee
    }
};
jindo.$H.Continue = function () {
    if (!(this instanceof arguments.callee)) {
        throw new arguments.callee
    }
};
jindo.$Json = function (b) {
    var a = arguments.callee;
    if (typeof b == "undefined") {
        b = {}
    }
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    if (typeof b == "string") {
        this._object = jindo.$Json._oldMakeJSON(b)
    } else {
        this._object = b
    }
};
jindo.$Json._oldMakeJSON = function (sObject) {
    try {
        if (/^(?:\s*)[\{\[]/.test(sObject)) {
            sObject = eval("(" + sObject + ")")
        } else {
            sObject = sObject
        }
    } catch (e) {
        sObject = {}
    }
    return sObject
};
jindo.$Json.fromXML = function (a) {
    var d = {};
    var m = /\s*<(\/?[\w:\-]+)((?:\s+[\w:\-]+\s*=\s*(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'))*)\s*((?:\/>)|(?:><\/\1>|\s*))|\s*<!\[CDATA\[([\w\W]*?)\]\]>\s*|\s*>?([^<]*)/ig;
    var g = /^[0-9]+(?:\.[0-9]+)?$/;
    var h = {"&amp;": "&", "&nbsp;": " ", "&quot;": '"', "&lt;": "<", "&gt;": ">"};
    var b = {tags: ["/"], stack: [d]};
    var l = function (n) {
        if (typeof n == "undefined") {
            return ""
        }
        return n.replace(/&[a-z]+;/g, function (o) {
            return (typeof h[o] == "string") ? h[o] : o
        })
    };
    var e = function (n, o) {
        n.replace(/([\w\:\-]+)\s*=\s*(?:"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)')/g, function (q, p, s, r) {
            o[p] = l((s ? s.replace(/\\"/g, '"') : undefined) || (r ? r.replace(/\\'/g, "'") : undefined))
        })
    };
    var c = function (p) {
        for (var n in p) {
            if (p.hasOwnProperty(n)) {
                if (Object.prototype[n]) {
                    continue
                }
                return false
            }
        }
        return true
    };
    var f = function (v, u, s, r, q, p) {
        var D, C = "";
        var B = b.stack.length - 1;
        if (typeof u == "string" && u) {
            if (u.substr(0, 1) != "/") {
                var A = (typeof s == "string" && s);
                var y = (typeof r == "string" && r);
                var t = (!A && y) ? "" : {};
                D = b.stack[B];
                if (typeof D[u] == "undefined") {
                    D[u] = t;
                    D = b.stack[B + 1] = D[u]
                } else {
                    if (D[u] instanceof Array) {
                        var w = D[u].length;
                        D[u][w] = t;
                        D = b.stack[B + 1] = D[u][w]
                    } else {
                        D[u] = [D[u], t];
                        D = b.stack[B + 1] = D[u][1]
                    }
                }
                if (A) {
                    e(s, D)
                }
                b.tags[B + 1] = u;
                if (y) {
                    b.tags.length--;
                    b.stack.length--
                }
            } else {
                b.tags.length--;
                b.stack.length--
            }
        } else {
            if (typeof q == "string" && q) {
                C = q
            } else {
                if (typeof p == "string" && p) {
                    C = l(p)
                }
            }
        }
        if (C.replace(/^\s+/g, "").length > 0) {
            var z = b.stack[B - 1];
            var E = b.tags[B];
            if (g.test(C)) {
                C = parseFloat(C)
            } else {
                if (C == "true") {
                    C = true
                } else {
                    if (C == "false") {
                        C = false
                    }
                }
            }
            if (typeof z == "undefined") {
                return
            }
            if (z[E] instanceof Array) {
                var n = z[E];
                if (typeof n[n.length - 1] == "object" && !c(n[n.length - 1])) {
                    n[n.length - 1].$cdata = C;
                    n[n.length - 1].toString = function () {
                        return C
                    }
                } else {
                    n[n.length - 1] = C
                }
            } else {
                if (typeof z[E] == "object" && !c(z[E])) {
                    z[E].$cdata = C;
                    z[E].toString = function () {
                        return C
                    }
                } else {
                    z[E] = C
                }
            }
        }
    };
    a = a.replace(/<(\?|\!-)[^>]*>/g, "");
    a.replace(m, f);
    return jindo.$Json(d)
};
jindo.$Json.prototype.get = function (f) {
    var c = this._object;
    var a = f.split("/");
    var s = /^([\w:\-]+)\[([0-9]+)\]$/;
    var n = [[c]], r = n[0];
    var l = a.length, d, q, b, g, m;
    for (var h = 0; h < l; h++) {
        if (a[h] == "." || a[h] == "") {
            continue
        }
        if (a[h] == "..") {
            n.length--
        } else {
            b = [];
            q = -1;
            d = r.length;
            if (d == 0) {
                return []
            }
            if (s.test(a[h])) {
                q = +RegExp.$2
            }
            for (g = 0; g < d; g++) {
                m = r[g][a[h]];
                if (typeof m == "undefined") {
                    continue
                }
                if (m instanceof Array) {
                    if (q > -1) {
                        if (q < m.length) {
                            b[b.length] = m[q]
                        }
                    } else {
                        b = b.concat(m)
                    }
                } else {
                    if (q == -1) {
                        b[b.length] = m
                    }
                }
            }
            n[n.length] = b
        }
        r = n[n.length - 1]
    }
    return r
};
jindo.$Json.prototype.toString = function () {
    if (window.JSON && window.JSON.stringify) {
        jindo.$Json.prototype.toString = function () {
            try {
                return window.JSON.stringify(this._object)
            } catch (a) {
                return jindo.$Json._oldToString(this._object)
            }
        }
    } else {
        jindo.$Json.prototype.toString = function () {
            return jindo.$Json._oldToString(this._object)
        }
    }
    return this.toString()
};
jindo.$Json._oldToString = function (a) {
    var b = {
        $: function (c) {
            if (typeof c == "object" && c == null) {
                return "null"
            }
            if (typeof c == "undefined") {
                return '""'
            }
            if (typeof c == "boolean") {
                return c ? "true" : "false"
            }
            if (typeof c == "string") {
                return this.s(c)
            }
            if (typeof c == "number") {
                return c
            }
            if (c instanceof Array) {
                return this.a(c)
            }
            if (c instanceof Object) {
                return this.o(c)
            }
        }, s: function (d) {
            var f = {'"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t"};
            var g = function (c) {
                return (typeof f[c] != "undefined") ? f[c] : c
            };
            return '"' + d.replace(/[\\"'\n\r\t]/g, g) + '"'
        }, a: function (d) {
            var f = "[", h = "", g = d.length;
            for (var e = 0; e < g; e++) {
                if (typeof d[e] == "function") {
                    continue
                }
                f += h + this.$(d[e]);
                if (!h) {
                    h = ","
                }
            }
            return f + "]"
        }, o: function (f) {
            f = jindo.$H(f).ksort().$value();
            var e = "{", g = "";
            for (var d in f) {
                if (f.hasOwnProperty(d)) {
                    if (typeof f[d] == "function") {
                        continue
                    }
                    e += g + this.s(d) + ":" + this.$(f[d]);
                    if (!g) {
                        g = ","
                    }
                }
            }
            return e + "}"
        }
    };
    return b.$(a)
};
jindo.$Json.prototype.toXML = function () {
    var a = function (l, e) {
        var h = function (n, m) {
            return "<" + e + (m || "") + ">" + n + "</" + e + ">"
        };
        switch (typeof l) {
            case"undefined":
            case"null":
                return h("");
            case"number":
                return h(l);
            case"string":
                if (l.indexOf("<") < 0) {
                    return h(l.replace(/&/g, "&amp;"))
                } else {
                    return h("<![CDATA[" + l + "]]>")
                }
            case"boolean":
                return h(String(l));
            case"object":
                var f = "";
                if (l instanceof Array) {
                    var d = l.length;
                    for (var g = 0; g < d; g++) {
                        f += a(l[g], e)
                    }
                } else {
                    var c = "";
                    for (var b in l) {
                        if (l.hasOwnProperty(b)) {
                            if (b == "$cdata" || typeof l[b] == "function") {
                                continue
                            }
                            f += a(l[b], b)
                        }
                    }
                    if (e) {
                        f = h(f, c)
                    }
                }
                return f
        }
    };
    return a(this._object, "")
};
jindo.$Json.prototype.toObject = function () {
    return this._object
};
jindo.$Json.prototype.compare = function (a) {
    return jindo.$Json._oldToString(this._object).toString() == jindo.$Json._oldToString(jindo.$Json(a).$value()).toString()
};
jindo.$Json.prototype.$value = jindo.$Json.prototype.toObject;
jindo.$Cookie = function () {
    var a = arguments.callee;
    var b = a._cached;
    if (a._cached) {
        return a._cached
    }
    if (!(this instanceof a)) {
        return new a
    }
    if (typeof a._cached == "undefined") {
        a._cached = this
    }
};
jindo.$Cookie.prototype.keys = function () {
    var c = document.cookie.split(";");
    var e = /^\s+|\s+$/g;
    var b = new Array;
    for (var d = 0; d < c.length; d++) {
        b[b.length] = c[d].substr(0, c[d].indexOf("=")).replace(e, "")
    }
    return b
};
jindo.$Cookie.prototype.get = function (d) {
    var a = document.cookie.split(/\s*;\s*/);
    var c = new RegExp("^(\\s*" + d + "\\s*=)");
    for (var b = 0; b < a.length; b++) {
        if (c.test(a[b])) {
            return unescape(a[b].substr(RegExp.$1.length))
        }
    }
    return null
};
jindo.$Cookie.prototype.set = function (e, f, d, a, b) {
    var c = "";
    if (typeof d == "number") {
        c = ";expires=" + (new Date((new Date()).getTime() + d * 1000 * 60 * 60 * 24)).toGMTString()
    }
    if (typeof a == "undefined") {
        a = ""
    }
    if (typeof b == "undefined") {
        b = "/"
    }
    document.cookie = e + "=" + escape(f) + c + "; path=" + b + (a ? "; domain=" + a : "");
    return this
};
jindo.$Cookie.prototype.remove = function (c, a, b) {
    if (this.get(c) != null) {
        this.set(c, "", -1, a, b)
    }
    return this
};
jindo.$Event = function (b) {
    var a = arguments.callee;
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    if (typeof b == "undefined") {
        b = window.event
    }
    if (b === window.event && document.createEventObject) {
        b = document.createEventObject(b)
    }
    this._event = b;
    this._globalEvent = window.event;
    this.type = b.type.toLowerCase();
    if (this.type == "dommousescroll") {
        this.type = "mousewheel"
    } else {
        if (this.type == "domcontentloaded") {
            this.type = "domready"
        }
    }
    this.canceled = false;
    this.element = b.target || b.srcElement;
    this.currentElement = b.currentTarget;
    this.relatedElement = null;
    if (typeof b.relatedTarget != "undefined") {
        this.relatedElement = b.relatedTarget
    } else {
        if (b.fromElement && b.toElement) {
            this.relatedElement = b[(this.type == "mouseout") ? "toElement" : "fromElement"]
        }
    }
};
jindo.$Event.prototype.mouse = function () {
    var f = this._event;
    var g = 0;
    var d = false, b = false, c = false;
    var d = f.which ? f.button == 0 : !!(f.button & 1);
    var b = f.which ? f.button == 1 : !!(f.button & 4);
    var c = f.which ? f.button == 2 : !!(f.button & 2);
    var a = {};
    if (f.wheelDelta) {
        g = f.wheelDelta / 120
    } else {
        if (f.detail) {
            g = -f.detail / 3
        }
    }
    a = {delta: g, left: d, middle: b, right: c};
    this.mouse = function () {
        return a
    };
    return a
};
jindo.$Event.prototype.key = function () {
    var c = this._event;
    var a = c.keyCode || c.charCode;
    var b = {
        keyCode: a,
        alt: c.altKey,
        ctrl: c.ctrlKey,
        meta: c.metaKey,
        shift: c.shiftKey,
        up: (a == 38),
        down: (a == 40),
        left: (a == 37),
        right: (a == 39),
        enter: (a == 13),
        esc: (a == 27)
    };
    this.key = function () {
        return b
    };
    return b
};
jindo.$Event.prototype.pos = function (l) {
    var d = this._event;
    var a = (this.element.ownerDocument || document).body;
    var h = (this.element.ownerDocument || document).documentElement;
    var g = [a.scrollLeft || h.scrollLeft, a.scrollTop || h.scrollTop];
    var c = {
        clientX: d.clientX,
        clientY: d.clientY,
        pageX: "pageX" in d ? d.pageX : d.clientX + g[0] - a.clientLeft,
        pageY: "pageY" in d ? d.pageY : d.clientY + g[1] - a.clientTop,
        layerX: "offsetX" in d ? d.offsetX : d.layerX - 1,
        layerY: "offsetY" in d ? d.offsetY : d.layerY - 1
    };
    if (l && jindo.$Element) {
        var f = jindo.$Element(this.element).offset();
        c.offsetX = c.pageX - f.left;
        c.offsetY = c.pageY - f.top
    }
    return c
};
jindo.$Event.prototype.stop = function (c) {
    c = c || jindo.$Event.CANCEL_ALL;
    var f = (window.event && window.event == this._globalEvent) ? this._globalEvent : this._event;
    var a = !!(c & jindo.$Event.CANCEL_BUBBLE);
    var g = !!(c & jindo.$Event.CANCEL_DEFAULT);
    this.canceled = true;
    if (typeof f.preventDefault != "undefined" && g) {
        f.preventDefault()
    }
    if (typeof f.stopPropagation != "undefined" && a) {
        f.stopPropagation()
    }
    if (g) {
        f.returnValue = false
    }
    if (a) {
        f.cancelBubble = true
    }
    return this
};
jindo.$Event.prototype.stopDefault = function () {
    return this.stop(jindo.$Event.CANCEL_DEFAULT)
};
jindo.$Event.prototype.stopBubble = function () {
    return this.stop(jindo.$Event.CANCEL_BUBBLE)
};
jindo.$Event.prototype.$value = function () {
    return this._event
};
jindo.$Event.CANCEL_BUBBLE = 1;
jindo.$Event.CANCEL_DEFAULT = 2;
jindo.$Event.CANCEL_ALL = 3;
jindo.$Element = function (c) {
    var b = arguments.callee;
    if (c && c instanceof b) {
        return c
    }
    if (c === null || typeof c == "undefined") {
        return null
    } else {
        c = jindo.$(c);
        if (c === null) {
            return null
        }
    }
    if (!(this instanceof b)) {
        return new b(c)
    }
    this._element = (typeof c == "string") ? jindo.$(c) : c;
    var a = this._element.tagName;
    this.tag = (typeof a != "undefined") ? a.toLowerCase() : ""
};
var _j_ag = navigator.userAgent;
var IS_IE = _j_ag.indexOf("MSIE") > -1;
var IS_FF = _j_ag.indexOf("Firefox") > -1;
var IS_OP = _j_ag.indexOf("Opera") > -1;
var IS_SF = _j_ag.indexOf("Apple") > -1;
var IS_CH = _j_ag.indexOf("Chrome") > -1;
jindo.$Element.prototype.$value = function () {
    return this._element
};
jindo.$Element.prototype.visible = function (a, b) {
    if (typeof a != "undefined") {
        this[a ? "show" : "hide"](b);
        return this
    }
    return (this.css("display") != "none")
};
jindo.$Element.prototype.show = function (g) {
    var f = this._element.style;
    var a = "block";
    var l = {
        p: a,
        div: a,
        form: a,
        h1: a,
        h2: a,
        h3: a,
        h4: a,
        ol: a,
        ul: a,
        fieldset: a,
        td: "table-cell",
        th: "table-cell",
        li: "list-item",
        table: "table",
        thead: "table-header-group",
        tbody: "table-row-group",
        tfoot: "table-footer-group",
        tr: "table-row",
        col: "table-column",
        colgroup: "table-column-group",
        caption: "table-caption",
        dl: a,
        dt: a,
        dd: a
    };
    try {
        if (g) {
            f.display = g
        } else {
            var d = l[this.tag];
            f.display = d || "inline"
        }
    } catch (h) {
        f.display = "block"
    }
    return this
};
jindo.$Element.prototype.hide = function () {
    this._element.style.display = "none";
    return this
};
jindo.$Element.prototype.toggle = function (a) {
    this[this.visible() ? "hide" : "show"](a);
    return this
};
jindo.$Element.prototype.opacity = function (d) {
    var c, f = this._element, a = (this._getCss(f, "display") != "none");
    d = parseFloat(d);
    f.style.zoom = 1;
    if (!isNaN(d)) {
        d = Math.max(Math.min(d, 1), 0);
        if (typeof f.filters != "undefined") {
            d = Math.ceil(d * 100);
            if (typeof f.filters != "unknown" && typeof f.filters.alpha != "undefined") {
                f.filters.alpha.opacity = d
            } else {
                f.style.filter = (f.style.filter + " alpha(opacity=" + d + ")")
            }
        } else {
            f.style.opacity = d
        }
        return d
    }
    if (typeof f.filters != "undefined") {
        c = (typeof f.filters.alpha == "undefined") ? (a ? 100 : 0) : f.filters.alpha.opacity;
        c = c / 100
    } else {
        c = parseFloat(f.style.opacity);
        if (isNaN(c)) {
            c = a ? 1 : 0
        }
    }
    return c
};
jindo.$Element.prototype.css = function (f, u) {
    var n = this._element;
    var m = (typeof u);
    if (f == "opacity") {
        return m == "undefined" ? this.opacity() : this.opacity(u)
    }
    var w = (typeof f);
    if (w == "string") {
        var r;
        if (m == "string" || m == "number") {
            var g = {};
            g[f] = u;
            f = g
        } else {
            var o = this._getCss;
            if ((IS_FF || IS_OP) && (f == "backgroundPositionX" || f == "backgroundPositionY")) {
                var b = o(n, "backgroundPosition").split(/\s+/);
                return (f == "backgroundPositionX") ? b[0] : b[1]
            }
            if (IS_IE && f == "backgroundPosition") {
                return o(n, "backgroundPositionX") + " " + o(n, "backgroundPositionY")
            }
            if ((IS_FF || IS_SF || IS_CH) && (f == "padding" || f == "margin")) {
                var q = o(n, f + "Top");
                var t = o(n, f + "Right");
                var a = o(n, f + "Bottom");
                var c = o(n, f + "Left");
                if ((q == t) && (a == c)) {
                    return q
                } else {
                    if (q == a) {
                        if (t == c) {
                            return q + " " + t
                        } else {
                            return q + " " + t + " " + a + " " + c
                        }
                    } else {
                        return q + " " + t + " " + a + " " + c
                    }
                }
            }
            return o(n, f)
        }
    }
    var l = jindo.$H;
    if (typeof l != "undefined" && f instanceof l) {
        f = f._table
    }
    if (typeof f == "object") {
        var s, p;
        for (var d in f) {
            if (f.hasOwnProperty(d)) {
                s = f[d];
                p = (typeof s);
                if (p != "string" && p != "number") {
                    continue
                }
                if (d == "opacity") {
                    p == "undefined" ? this.opacity() : this.opacity(s);
                    continue
                }
                if (d == "cssFloat" && IS_IE) {
                    d = "styleFloat"
                }
                if ((IS_FF || IS_OP) && (d == "backgroundPositionX" || d == "backgroundPositionY")) {
                    var b = this.css("backgroundPosition").split(/\s+/);
                    s = d == "backgroundPositionX" ? s + " " + b[1] : b[0] + " " + s;
                    this._setCss(n, "backgroundPosition", s)
                } else {
                    this._setCss(n, d, s)
                }
            }
        }
    }
    return this
};
jindo.$Element.prototype._getCss = function (c, b) {
    var a;
    if (c.currentStyle) {
        a = function (l, h) {
            try {
                if (h == "cssFloat") {
                    h = "styleFloat"
                }
                var g = l.style[h];
                if (g) {
                    return g
                } else {
                    var d = l.currentStyle;
                    if (d) {
                        return d[h]
                    }
                }
                return g
            } catch (f) {
                throw new Error((l.tagName || "document") + "는 css를 사용 할수 없습니다.")
            }
        }
    } else {
        if (window.getComputedStyle) {
            a = function (l, h) {
                try {
                    if (h == "cssFloat") {
                        h = "float"
                    }
                    var m = l.ownerDocument || l.document || document;
                    var f = (l.style[h] || m.defaultView.getComputedStyle(l, null).getPropertyValue(h.replace(/([A-Z])/g, "-$1").toLowerCase()));
                    if (h == "textDecoration") {
                        f = f.replace(",", "")
                    }
                    return f
                } catch (g) {
                    throw new Error((l.tagName || "document") + "는 css를 사용 할수 없습니다.")
                }
            }
        } else {
            a = function (g, f) {
                try {
                    if (f == "cssFloat" && IS_IE) {
                        f = "styleFloat"
                    }
                    return g.style[f]
                } catch (d) {
                    throw new Error((g.tagName || "document") + "는 css를 사용 할수 없습니다.")
                }
            }
        }
    }
    jindo.$Element.prototype._getCss = a;
    return a(c, b)
};
jindo.$Element.prototype._setCss = function (c, b, a) {
    if (("#top#left#right#bottom#").indexOf(b + "#") > 0 && (typeof a == "number" || (/\d$/.test(a)))) {
        c.style[b] = parseInt(a, 10) + "px"
    } else {
        c.style[b] = a
    }
};
jindo.$Element.prototype.attr = function (d, f) {
    var c = this._element;
    if (typeof d == "string") {
        if (typeof f != "undefined") {
            var b = {};
            b[d] = f;
            d = b
        } else {
            if (d == "class" || d == "className") {
                return c.className
            } else {
                if (d == "style") {
                    return c.style.cssText
                } else {
                    if (d == "checked" || d == "disabled") {
                        return !!c[d]
                    } else {
                        if (d == "value") {
                            return c.value
                        } else {
                            if (d == "href") {
                                return c.getAttribute(d, 2)
                            }
                        }
                    }
                }
            }
            return c.getAttribute(d)
        }
    }
    if (typeof jindo.$H != "undefined" && d instanceof jindo.$H) {
        d = d.$value()
    }
    if (typeof d == "object") {
        for (var a in d) {
            if (d.hasOwnProperty(a)) {
                if (typeof (f) != "undefined" && f === null) {
                    c.removeAttribute(a)
                } else {
                    if (a == "class" || a == "className") {
                        c.className = d[a]
                    } else {
                        if (a == "style") {
                            c.style.cssText = d[a]
                        } else {
                            if (a == "checked" || a == "disabled") {
                                c[a] = d[a]
                            } else {
                                if (a == "value") {
                                    c.value = d[a]
                                } else {
                                    c.setAttribute(a, d[a])
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return this
};
jindo.$Element.prototype.width = function (b) {
    if (typeof b == "number") {
        var c = this._element;
        c.style.width = b + "px";
        var d = c.offsetWidth;
        if (d != b && d !== 0) {
            var a = (b * 2 - d);
            if (a > 0) {
                c.style.width = a + "px"
            }
        }
        return this
    }
    return this._element.offsetWidth
};
jindo.$Element.prototype.height = function (a) {
    if (typeof a == "number") {
        var b = this._element;
        b.style.height = a + "px";
        var c = b.offsetHeight;
        if (c != a && c !== 0) {
            var a = (a * 2 - c);
            if (a > 0) {
                b.style.height = a + "px"
            }
        }
        return this
    }
    return this._element.offsetHeight
};
jindo.$Element.prototype.className = function (b) {
    var a = this._element;
    if (typeof b == "undefined") {
        return a.className
    }
    a.className = b;
    return this
};
jindo.$Element.prototype.hasClass = function (a) {
    if (this._element.classList) {
        jindo.$Element.prototype.hasClass = function (b) {
            return this._element.classList.contains(b)
        }
    } else {
        jindo.$Element.prototype.hasClass = function (b) {
            return (" " + this._element.className + " ").indexOf(" " + b + " ") > -1
        }
    }
    return this.hasClass(a)
};
jindo.$Element.prototype.addClass = function (a) {
    if (this._element.classList) {
        jindo.$Element.prototype.addClass = function (e) {
            var d = e.split(/\s+/);
            var b = this._element.classList;
            for (var c = d.length; c--;) {
                b.add(d[c])
            }
            return this
        }
    } else {
        jindo.$Element.prototype.addClass = function (g) {
            var d = this._element;
            var c = g.split(/\s+/);
            var f;
            for (var b = c.length - 1; b >= 0; b--) {
                f = c[b];
                if (!this.hasClass(f)) {
                    d.className = (d.className + " " + f).replace(/^\s+/, "")
                }
            }
            return this
        }
    }
    return this.addClass(a)
};
jindo.$Element.prototype.removeClass = function (a) {
    if (this._element.classList) {
        jindo.$Element.prototype.removeClass = function (e) {
            var b = this._element.classList;
            var d = e.split(" ");
            for (var c = d.length; c--;) {
                b.remove(d[c])
            }
            return this
        }
    } else {
        jindo.$Element.prototype.removeClass = function (g) {
            var d = this._element;
            var c = g.split(/\s+/);
            var f;
            for (var b = c.length - 1; b >= 0; b--) {
                f = c[b];
                if (this.hasClass(f)) {
                    d.className = (" " + d.className.replace(/\s+$/, "").replace(/^\s+/, "") + " ").replace(" " + f + " ", " ").replace(/\s+$/, "").replace(/^\s+/, "")
                }
            }
            return this
        }
    }
    return this.removeClass(a)
};
jindo.$Element.prototype.toggleClass = function (b, a) {
    if (this._element.classList) {
        jindo.$Element.prototype.toggleClass = function (d, c) {
            if (typeof c == "undefined") {
                this._element.classList.toggle(d)
            } else {
                if (this.hasClass(d)) {
                    this.removeClass(d);
                    this.addClass(c)
                } else {
                    this.addClass(d);
                    this.removeClass(c)
                }
            }
            return this
        }
    } else {
        jindo.$Element.prototype.toggleClass = function (d, c) {
            c = c || "";
            if (this.hasClass(d)) {
                this.removeClass(d);
                if (c) {
                    this.addClass(c)
                }
            } else {
                this.addClass(d);
                if (c) {
                    this.removeClass(c)
                }
            }
            return this
        }
    }
    return this.toggleClass(b, a)
};
jindo.$Element.prototype.text = function (b) {
    var d = this._element;
    var a = this.tag;
    var g = (typeof d.innerText != "undefined") ? "innerText" : "textContent";
    if (a == "textarea" || a == "input") {
        g = "value"
    }
    var c = (typeof b);
    if (c != "undefined" && (c == "string" || c == "number" || c == "boolean")) {
        b += "";
        try {
            if (g != "value") {
                g = (typeof d.textContent != "undefined") ? "textContent" : "innerText"
            }
            d[g] = b
        } catch (f) {
            return this.html(b.replace(/&/g, "&amp;").replace(/</g, "&lt;"))
        }
        return this
    }
    return d[g]
};
jindo.$Element.prototype.html = function (b) {
    var a = IS_IE;
    var c = IS_FF;
    if (a) {
        jindo.$Element.prototype.html = function (h) {
            if (typeof h != "undefined" && arguments.length) {
                h += "";
                jindo.$$.release();
                var l = this._element;
                while (l.firstChild) {
                    l.removeChild(l.firstChild)
                }
                var g = "R" + new Date().getTime() + parseInt(Math.random() * 100000, 10);
                var o = l.ownerDocument || l.document || document;
                var e;
                var d = l.tagName.toLowerCase();
                switch (d) {
                    case"select":
                    case"table":
                        e = o.createElement("div");
                        e.innerHTML = "<" + d + ' class="' + g + '">' + h + "</" + d + ">";
                        break;
                    case"tr":
                    case"thead":
                    case"tbody":
                    case"colgroup":
                        e = o.createElement("div");
                        e.innerHTML = "<table><" + d + ' class="' + g + '">' + h + "</" + d + "></table>";
                        break;
                    default:
                        l.innerHTML = h;
                        break
                }
                if (e) {
                    var n;
                    for (n = e.firstChild; n; n = n.firstChild) {
                        if (n.className == g) {
                            break
                        }
                    }
                    if (n) {
                        var m = true;
                        for (var p; p = l.firstChild;) {
                            p.removeNode(true)
                        }
                        for (var p = n.firstChild; p; p = n.firstChild) {
                            if (d == "select") {
                                var f = p.cloneNode(true);
                                if (p.selected && m) {
                                    m = false;
                                    f.selected = true
                                }
                                l.appendChild(f);
                                p.removeNode(true)
                            } else {
                                l.appendChild(p)
                            }
                        }
                        e.removeNode && e.removeNode(true)
                    }
                    e = null
                }
                return this
            }
            return this._element.innerHTML
        }
    } else {
        if (c) {
            jindo.$Element.prototype.html = function (n) {
                if (typeof n != "undefined" && arguments.length) {
                    n += "";
                    var h = this._element;
                    if (!h.parentNode) {
                        var g = "R" + new Date().getTime() + parseInt(Math.random() * 100000, 10);
                        var d = h.ownerDocument || h.document || document;
                        var l;
                        var f = h.tagName.toLowerCase();
                        switch (f) {
                            case"select":
                            case"table":
                                l = d.createElement("div");
                                l.innerHTML = "<" + f + ' class="' + g + '">' + n + "</" + f + ">";
                                break;
                            case"tr":
                            case"thead":
                            case"tbody":
                            case"colgroup":
                                l = d.createElement("div");
                                l.innerHTML = "<table><" + f + ' class="' + g + '">' + n + "</" + f + "></table>";
                                break;
                            default:
                                h.innerHTML = n;
                                break
                        }
                        if (l) {
                            var e;
                            for (e = l.firstChild; e; e = e.firstChild) {
                                if (e.className == g) {
                                    break
                                }
                            }
                            if (e) {
                                for (var m; m = h.firstChild;) {
                                    m.removeNode(true)
                                }
                                for (var m = e.firstChild; m; m = e.firstChild) {
                                    h.appendChild(m)
                                }
                                l.removeNode && l.removeNode(true)
                            }
                            l = null
                        }
                    } else {
                        h.innerHTML = n
                    }
                    return this
                }
                return this._element.innerHTML
            }
        } else {
            jindo.$Element.prototype.html = function (e) {
                if (typeof e != "undefined" && arguments.length) {
                    e += "";
                    var d = this._element;
                    d.innerHTML = e;
                    return this
                }
                return this._element.innerHTML
            }
        }
    }
    return this.html(b)
};
jindo.$Element.prototype.outerHTML = function () {
    var d = this._element;
    if (typeof d.outerHTML != "undefined") {
        return d.outerHTML
    }
    var a = d.ownerDocument || d.document || document;
    var f = a.createElement("div");
    var c = d.parentNode;
    if (!c) {
        return d.innerHTML
    }
    c.insertBefore(f, d);
    f.style.display = "none";
    f.appendChild(d);
    var b = f.innerHTML;
    c.insertBefore(d, f);
    c.removeChild(f);
    return b
};
jindo.$Element.prototype.toString = jindo.$Element.prototype.outerHTML;
jindo.$Element._getTransition = function () {
    var a = false, b = "";
    if (typeof document.body.style.trasition != "undefined") {
        a = true;
        b = "trasition"
    } else {
        if (typeof document.body.style.webkitTransition !== "undefined") {
            a = true;
            b = "webkitTransition"
        } else {
            if (typeof document.body.style.OTransition !== "undefined") {
                a = true;
                b = "OTransition"
            }
        }
    }
    return (jindo.$Element._getTransition = function () {
        return {hasTransition: a, name: b}
    })()
};
jindo.$Element.prototype.appear = function (b, c) {
    var a = jindo.$Element._getTransition();
    if (a.hasTransition) {
        jindo.$Element.prototype.appear = function (g, h) {
            g = g || 0.3;
            h = h || function () {
            };
            var f = function () {
                h();
                this.show();
                this.removeEventListener(a.name + "End", arguments.callee, false)
            };
            var e = this._element;
            var d = this;
            if (!this.visible()) {
                e.style.opacity = e.style.opacity || 0;
                d.show()
            }
            e.addEventListener(a.name + "End", f, false);
            e.style[a.name + "Property"] = "opacity";
            e.style[a.name + "Duration"] = g + "s";
            e.style[a.name + "TimingFunction"] = "linear";
            setTimeout(function () {
                e.style.opacity = "1"
            }, 1);
            return this
        }
    } else {
        jindo.$Element.prototype.appear = function (l, n) {
            var d = this;
            var m = this.opacity();
            if (!this.visible()) {
                m = 0
            }
            if (m == 1) {
                return this
            }
            try {
                clearTimeout(this._fade_timer)
            } catch (h) {
            }
            n = n || function () {
            };
            var g = (1 - m) / ((l || 0.3) * 100);
            var f = function () {
                m += g;
                d.opacity(m);
                if (m >= 1) {
                    n(d)
                } else {
                    d._fade_timer = setTimeout(f, 10)
                }
            };
            this.show();
            f();
            return this
        }
    }
    return this.appear(b, c)
};
jindo.$Element.prototype.disappear = function (b, c) {
    var a = jindo.$Element._getTransition();
    if (a.hasTransition) {
        jindo.$Element.prototype.disappear = function (g, h) {
            g = g || 0.3;
            var d = this;
            h = h || function () {
            };
            var f = function () {
                h();
                this.removeEventListener(a.name + "End", arguments.callee, false);
                d.hide()
            };
            var e = this._element;
            e.addEventListener(a.name + "End", f, false);
            e.style[a.name + "Property"] = "opacity";
            e.style[a.name + "Duration"] = g + "s";
            e.style[a.name + "TimingFunction"] = "linear";
            setTimeout(function () {
                e.style.opacity = "0"
            }, 1);
            return this
        }
    } else {
        jindo.$Element.prototype.disappear = function (l, n) {
            var d = this;
            var m = this.opacity();
            if (m == 0) {
                return this
            }
            try {
                clearTimeout(this._fade_timer)
            } catch (h) {
            }
            n = n || function () {
            };
            var g = m / ((l || 0.3) * 100);
            var f = function () {
                m -= g;
                d.opacity(m);
                if (m <= 0) {
                    d.hide();
                    d.opacity(1);
                    n(d)
                } else {
                    d._fade_timer = setTimeout(f, 10)
                }
            };
            f();
            return this
        }
    }
    return this.disappear(b, c)
};
jindo.$Element.prototype.offset = function (b, a) {
    var e = this._element;
    var c = null;
    if (typeof b == "number" && typeof a == "number") {
        if (isNaN(parseInt(this.css("top"), 10))) {
            this.css("top", 0)
        }
        if (isNaN(parseInt(this.css("left"), 10))) {
            this.css("left", 0)
        }
        var h = this.offset();
        var l = {top: b - h.top, left: a - h.left};
        e.style.top = parseInt(this.css("top"), 10) + l.top + "px";
        e.style.left = parseInt(this.css("left"), 10) + l.left + "px";
        return this
    }
    var d = /Safari/.test(navigator.userAgent);
    var n = /MSIE/.test(navigator.userAgent);
    var m = n ? navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1] : 0;
    var f = function (p) {
        var o = {left: 0, top: 0};
        for (var r = p, q = r.offsetParent; r = r.parentNode;) {
            if (r.offsetParent) {
                o.left -= r.scrollLeft;
                o.top -= r.scrollTop
            }
            if (r == q) {
                o.left += p.offsetLeft + r.clientLeft;
                o.top += p.offsetTop + r.clientTop;
                if (!r.offsetParent) {
                    o.left += r.offsetLeft;
                    o.top += r.offsetTop
                }
                q = r.offsetParent;
                p = r
            }
        }
        return o
    };
    var g = function (t) {
        var y = {left: 0, top: 0};
        var z = t.ownerDocument || t.document || document;
        var r = z.documentElement;
        var s = z.body;
        if (t.getBoundingClientRect) {
            if (!c) {
                var w = (window == top);
                if (!w) {
                    try {
                        w = (window.frameElement && window.frameElement.frameBorder == 1)
                    } catch (v) {
                    }
                }
                if ((n && m < 8 && window.external) && w) {
                    c = {left: 2, top: 2};
                    oBase = null
                } else {
                    c = {left: 0, top: 0}
                }
            }
            var u = t.getBoundingClientRect();
            if (t !== r && t !== s) {
                y.left = u.left - c.left;
                y.top = u.top - c.top;
                y.left += r.scrollLeft || s.scrollLeft;
                y.top += r.scrollTop || s.scrollTop
            }
        } else {
            if (z.getBoxObjectFor) {
                var u = z.getBoxObjectFor(t);
                var p = z.getBoxObjectFor(r || s);
                y.left = u.screenX - p.screenX;
                y.top = u.screenY - p.screenY
            } else {
                for (var q = t; q; q = q.offsetParent) {
                    y.left += q.offsetLeft;
                    y.top += q.offsetTop
                }
                for (var q = t.parentNode; q; q = q.parentNode) {
                    if (q.tagName == "BODY") {
                        break
                    }
                    if (q.tagName == "TR") {
                        y.top += 2
                    }
                    y.left -= q.scrollLeft;
                    y.top -= q.scrollTop
                }
            }
        }
        return y
    };
    return (d ? f : g)(e)
};
jindo.$Element.prototype.evalScripts = function (sHTML) {
    var aJS = [];
    sHTML = sHTML.replace(new RegExp("<script(\\s[^>]+)*>(.*?)<\/script>", "gi"), function (_1, _2, sPart) {
        aJS.push(sPart);
        return ""
    });
    eval(aJS.join("\n"));
    return this
};
jindo.$Element._append = function (b, a) {
    if (typeof a == "string") {
        a = jindo.$(a)
    } else {
        if (a instanceof jindo.$Element) {
            a = a.$value()
        }
    }
    b._element.appendChild(a);
    return b
};
jindo.$Element._prepend = function (c, b) {
    if (typeof c == "string") {
        c = jindo.$(c)
    } else {
        if (c instanceof jindo.$Element) {
            c = c.$value()
        }
    }
    var a = c.childNodes;
    if (a.length > 0) {
        c.insertBefore(b._element, a[0])
    } else {
        c.appendChild(b._element)
    }
    return b
};
jindo.$Element.prototype.append = function (a) {
    return jindo.$Element._append(this, a)
};
jindo.$Element.prototype.prepend = function (a) {
    return jindo.$Element._prepend(this._element, jindo.$Element(a))
};
jindo.$Element.prototype.replace = function (b) {
    jindo.$$.release();
    var c = this._element;
    var a = c.parentNode;
    var d = jindo.$Element(b);
    if (a && a.replaceChild) {
        a.replaceChild(d.$value(), c);
        return d
    }
    var d = d.$value();
    a.insertBefore(d, c);
    a.removeChild(c);
    return d
};
jindo.$Element.prototype.appendTo = function (a) {
    var b = jindo.$Element(a);
    jindo.$Element._append(b, this._element);
    return b
};
jindo.$Element.prototype.prependTo = function (a) {
    jindo.$Element._prepend(a, this);
    return jindo.$Element(a)
};
jindo.$Element.prototype.before = function (a) {
    var b = jindo.$Element(a);
    var c = b.$value();
    this._element.parentNode.insertBefore(c, this._element);
    return b
};
jindo.$Element.prototype.after = function (a) {
    var b = this.before(a);
    b.before(this);
    return b
};
jindo.$Element.prototype.parent = function (d, c) {
    var g = this._element;
    var b = [], f = null;
    if (typeof d == "undefined") {
        return jindo.$Element(g.parentNode)
    }
    if (typeof c == "undefined" || c == 0) {
        c = -1
    }
    while (g.parentNode && c-- != 0) {
        f = jindo.$Element(g.parentNode);
        if (g.parentNode == document.documentElement) {
            break
        }
        if (!d || (d && d(f))) {
            b[b.length] = f
        }
        g = g.parentNode
    }
    return b
};
jindo.$Element.prototype.child = function (g, d) {
    var l = this._element;
    var b = [], m = null, h = null;
    if (typeof g == "undefined") {
        return jindo.$A(l.childNodes).filter(function (a) {
            return a.nodeType == 1
        }).map(function (a) {
            return jindo.$Element(a)
        }).$value()
    }
    if (typeof d == "undefined" || d == 0) {
        d = -1
    }
    (h = function (e, n) {
        var c = null, f = null;
        for (var a = 0; a < e.childNodes.length; a++) {
            c = e.childNodes[a];
            if (c.nodeType != 1) {
                continue
            }
            f = jindo.$Element(e.childNodes[a]);
            if (!g || (g && g(f))) {
                b[b.length] = f
            }
            if (n != 0) {
                h(e.childNodes[a], n - 1)
            }
        }
    })(l, d - 1);
    return b
};
jindo.$Element.prototype.prev = function (f) {
    var g = this._element;
    var d = [];
    var c = (typeof f == "undefined");
    if (!g) {
        return c ? jindo.$Element(null) : d
    }
    do {
        g = g.previousSibling;
        if (!g || g.nodeType != 1) {
            continue
        }
        if (c) {
            return jindo.$Element(g)
        }
        if (!f || f(g)) {
            d[d.length] = jindo.$Element(g)
        }
    } while (g);
    return c ? jindo.$Element(g) : d
};
jindo.$Element.prototype.next = function (f) {
    var g = this._element;
    var d = [];
    var c = (typeof f == "undefined");
    if (!g) {
        return c ? jindo.$Element(null) : d
    }
    do {
        g = g.nextSibling;
        if (!g || g.nodeType != 1) {
            continue
        }
        if (c) {
            return jindo.$Element(g)
        }
        if (!f || f(g)) {
            d[d.length] = jindo.$Element(g)
        }
    } while (g);
    return c ? jindo.$Element(g) : d
};
jindo.$Element.prototype.first = function () {
    var a = this._element.firstElementChild || this._element.firstChild;
    if (!a) {
        return null
    }
    while (a && a.nodeType != 1) {
        a = a.nextSibling
    }
    return a ? jindo.$Element(a) : null
};
jindo.$Element.prototype.last = function () {
    var a = this._element.lastElementChild || this._element.lastChild;
    if (!a) {
        return null
    }
    while (a && a.nodeType != 1) {
        a = a.previousSibling
    }
    return a ? jindo.$Element(a) : null
};
jindo.$Element.prototype.isChildOf = function (a) {
    return jindo.$Element._contain(jindo.$Element(a).$value(), this._element)
};
jindo.$Element.prototype.isParentOf = function (a) {
    return jindo.$Element._contain(this._element, jindo.$Element(a).$value())
};
jindo.$Element._contain = function (a, b) {
    if (document.compareDocumentPosition) {
        jindo.$Element._contain = function (c, d) {
            return !!(c.compareDocumentPosition(d) & 16)
        }
    } else {
        if (document.body.contains) {
            jindo.$Element._contain = function (c, d) {
                return (c !== d) && (c.contains ? c.contains(d) : true)
            }
        } else {
            jindo.$Element._contain = function (c, f) {
                var g = c;
                var d = f;
                while (g && g.parentNode) {
                    g = g.parentNode;
                    if (g == d) {
                        return true
                    }
                }
                return false
            }
        }
    }
    return jindo.$Element._contain(a, b)
};
jindo.$Element.prototype.isEqual = function (a) {
    try {
        return (this._element === jindo.$Element(a).$value())
    } catch (b) {
        return false
    }
};
jindo.$Element.prototype.fireEvent = function (c, b) {
    function d(h, e) {
        h = (h + "").toLowerCase();
        var f = document.createEventObject();
        if (e) {
            for (k in e) {
                if (e.hasOwnProperty(k)) {
                    f[k] = e[k]
                }
            }
            f.button = (e.left ? 1 : 0) + (e.middle ? 4 : 0) + (e.right ? 2 : 0);
            f.relatedTarget = e.relatedElement || null
        }
        var g = this._element;
        if (this.tag == "input" && h == "click") {
            if (g.type == "checkbox") {
                g.checked = (!g.checked)
            } else {
                if (g.type == "radio") {
                    g.checked = true
                }
            }
        }
        this._element.fireEvent("on" + h, f);
        return this
    }

    function a(l, g) {
        var m = "HTMLEvents";
        l = (l + "").toLowerCase();
        if (l == "click" || l.indexOf("mouse") == 0) {
            m = "MouseEvent";
            if (l == "mousewheel") {
                l = "dommousescroll"
            }
        } else {
            if (l.indexOf("key") == 0) {
                m = "KeyboardEvent"
            }
        }
        var f;
        if (g) {
            g.button = 0 + (g.middle ? 1 : 0) + (g.right ? 2 : 0);
            g.ctrl = g.ctrl || false;
            g.alt = g.alt || false;
            g.shift = g.shift || false;
            g.meta = g.meta || false;
            switch (m) {
                case"MouseEvent":
                    f = document.createEvent(m);
                    f.initMouseEvent(l, true, true, null, g.detail || 0, g.screenX || 0, g.screenY || 0, g.clientX || 0, g.clientY || 0, g.ctrl, g.alt, g.shift, g.meta, g.button, g.relatedElement || null);
                    break;
                case"KeyboardEvent":
                    if (window.KeyEvent) {
                        f = document.createEvent("KeyEvents");
                        f.initKeyEvent(l, true, true, window, g.ctrl, g.alt, g.shift, g.meta, g.keyCode, g.keyCode)
                    } else {
                        try {
                            f = document.createEvent("Events")
                        } catch (h) {
                            f = document.createEvent("UIEvents")
                        } finally {
                            f.initEvent(l, true, true);
                            f.ctrlKey = g.ctrl;
                            f.altKey = g.alt;
                            f.shiftKey = g.shift;
                            f.metaKey = g.meta;
                            f.keyCode = g.keyCode;
                            f.which = g.keyCode
                        }
                    }
                    break;
                default:
                    f = document.createEvent(m);
                    f.initEvent(l, true, true)
            }
        } else {
            f = document.createEvent(m);
            f.initEvent(l, true, true)
        }
        this._element.dispatchEvent(f);
        return this
    }

    jindo.$Element.prototype.fireEvent = (typeof this._element.dispatchEvent != "undefined") ? a : d;
    return this.fireEvent(c, b)
};
jindo.$Element.prototype.empty = function () {
    jindo.$$.release();
    this.html("");
    return this
};
jindo.$Element.prototype.remove = function (a) {
    jindo.$$.release();
    jindo.$Element(a).leave();
    return this
};
jindo.$Element.prototype.leave = function () {
    var a = this._element;
    if (a.parentNode) {
        jindo.$$.release();
        a.parentNode.removeChild(a)
    }
    jindo.$Fn.freeElement(this._element);
    return this
};
jindo.$Element.prototype.wrap = function (b) {
    var a = this._element;
    b = jindo.$Element(b).$value();
    if (a.parentNode) {
        a.parentNode.insertBefore(b, a)
    }
    b.appendChild(a);
    return this
};
jindo.$Element.prototype.ellipsis = function (g) {
    g = g || "...";
    var b = this.text();
    var a = b.length;
    var f = parseInt(this.css("paddingTop"), 10) + parseInt(this.css("paddingBottom"), 10);
    var d = this.height() - f;
    var c = 0;
    var e = this.text("A").height() - f;
    if (d < e * 1.5) {
        return this.text(b)
    }
    d = e;
    while (d < e * 1.5) {
        c += Math.max(Math.ceil((a - c) / 2), 1);
        d = this.text(b.substring(0, c) + g).height() - f
    }
    while (d > e * 1.5) {
        c--;
        d = this.text(b.substring(0, c) + g).height() - f
    }
};
jindo.$Element.prototype.indexOf = function (d) {
    try {
        var f = jindo.$Element(d).$value();
        var h = this._element.childNodes;
        var g = 0;
        var a = h.length;
        for (var b = 0; b < a; b++) {
            if (h[b].nodeType != 1) {
                continue
            }
            if (h[b] === f) {
                return g
            }
            g++
        }
    } catch (f) {
    }
    return -1
};
jindo.$Element.prototype.queryAll = function (a) {
    return jindo.$$(a, this._element)
};
jindo.$Element.prototype.query = function (a) {
    return jindo.$$.getSingle(a, this._element)
};
jindo.$Element.prototype.test = function (a) {
    return jindo.$$.test(this._element, a)
};
jindo.$Element.prototype.xpathAll = function (a) {
    return jindo.$$.xpath(a, this._element)
};
jindo.$Element.insertAdjacentHTML = function (n, m, t, p, q) {
    var d = n._element;
    if (d.insertAdjacentHTML && !(/^<(option|tr|td|th|col)(?:.*?)>/.test(m.replace(/^(\s|　)+|(\s|　)+$/g, "").toLowerCase()))) {
        d.insertAdjacentHTML(t, m)
    } else {
        var u = d.ownerDocument || d.document || document;
        var o = u.createDocumentFragment();
        var s;
        var b = m.replace(/^(\s|　)+|(\s|　)+$/g, "");
        var r = {
            option: "select",
            tr: "tbody",
            thead: "table",
            tbody: "table",
            col: "table",
            td: "tr",
            th: "tr",
            div: "div"
        };
        var a = /^\<(option|tr|thead|tbody|td|th|col)(?:.*?)\>/i.exec(b);
        var c = a === null ? "div" : a[1].toLowerCase();
        var g = r[c];
        s = jindo._createEle(g, b, u, true);
        var f = s.getElementsByTagName("script");
        for (var h = 0, e = f.length; h < e; h++) {
            f[h].parentNode.removeChild(f[h])
        }
        while (s[p]) {
            o.appendChild(s[p])
        }
        q(o.cloneNode(true))
    }
    return n
};
jindo.$Element.prototype.appendHTML = function (a) {
    return jindo.$Element.insertAdjacentHTML(this, a, "beforeEnd", "firstChild", jindo.$Fn(function (b) {
        this.append(b)
    }, this).bind())
};
jindo.$Element.prototype.prependHTML = function (a) {
    return jindo.$Element.insertAdjacentHTML(this, a, "afterBegin", "lastChild", jindo.$Fn(function (b) {
        this.prepend(b)
    }, this).bind())
};
jindo.$Element.prototype.beforeHTML = function (a) {
    return jindo.$Element.insertAdjacentHTML(this, a, "beforeBegin", "firstChild", jindo.$Fn(function (b) {
        this.before(b)
    }, this).bind())
};
jindo.$Element.prototype.afterHTML = function (a) {
    return jindo.$Element.insertAdjacentHTML(this, a, "afterEnd", "lastChild", jindo.$Fn(function (b) {
        this._element.parentNode.insertBefore(b, this._element.nextSibling)
    }, this).bind())
};
jindo.$Element.prototype.delegate = function (e, b, c) {
    if (!this._element["_delegate_" + e]) {
        this._element["_delegate_" + e] = {};
        var d = jindo.$Fn(function (m, p) {
            p = p || window.event;
            if (typeof p.currentTarget == "undefined") {
                p.currentTarget = this._element
            }
            var h = p.target || p.srcElement;
            var q = this._element["_delegate_" + m];
            var t, n, g, f;
            for (var s in q) {
                t = q[s];
                f = t.checker(h);
                if (f[0]) {
                    n = t.func;
                    g = jindo.$Event(p);
                    g.element = f[1];
                    for (var r = 0, o = n.length; r < o; r++) {
                        n[r](g)
                    }
                }
            }
        }, this).bind(e);
        jindo.$Element._eventBind(this._element, e, d);
        var a = this._element;
        a["_delegate_" + e + "_func"] = d;
        if (this._element._delegate_events) {
            this._element._delegate_events.push(e)
        } else {
            this._element._delegate_events = [e]
        }
        a = null
    }
    this._bind(e, b, c);
    return this
};
jindo.$Element._eventBind = function (a, c, b) {
    if (a.addEventListener) {
        jindo.$Element._eventBind = function (d, f, e) {
            d.addEventListener(f, e, false)
        }
    } else {
        jindo.$Element._eventBind = function (d, f, e) {
            d.attachEvent("on" + f, e)
        }
    }
    jindo.$Element._eventBind(a, c, b)
};
jindo.$Element.prototype.undelegate = function (c, a, b) {
    this._unbind(c, a, b);
    return this
};
jindo.$Element.prototype._bind = function (e, b, c) {
    var a = this._element["_delegate_" + e];
    if (a) {
        var d;
        if (typeof b == "string") {
            d = jindo.$Fn(function (n, f) {
                var h = f;
                var o = jindo.$$.test(f, n);
                if (!o) {
                    var g = this._getParent(f);
                    for (var m = 0, l = g.length; m < l; m++) {
                        h = g[m];
                        if (jindo.$$.test(h, n)) {
                            o = true;
                            break
                        }
                    }
                }
                return [o, h]
            }, this).bind(b)
        } else {
            if (typeof b == "function") {
                d = jindo.$Fn(function (n, f) {
                    var h = f;
                    var o = n(this._element, f);
                    if (!o) {
                        var g = this._getParent(f);
                        for (var m = 0, l = g.length; m < l; m++) {
                            h = g[m];
                            if (n(this._element, h)) {
                                o = true;
                                break
                            }
                        }
                    }
                    return [o, h]
                }, this).bind(b)
            }
        }
        this._element["_delegate_" + e] = jindo.$Element._addBind(a, b, c, d)
    } else {
        alert("check your delegate event.")
    }
};
jindo.$Element.prototype._getParent = function (b) {
    var f = this._element;
    var c = [], d = null;
    while (b.parentNode && d != f) {
        d = b.parentNode;
        if (d == document.documentElement) {
            break
        }
        c[c.length] = d;
        b = d
    }
    return c
};
jindo.$Element._addBind = function (f, b, c, d) {
    var a = f[b];
    if (a) {
        var e = a.func;
        e.push(c);
        a.func = e
    } else {
        a = {checker: d, func: [c]}
    }
    f[b] = a;
    return f
};
jindo.$Element.prototype._unbind = function (b, f, c) {
    var a = this._element;
    if (b && f && c) {
        var e = a["_delegate_" + b];
        if (e && e[f]) {
            var m = e[f].func;
            m = e[f].func = jindo.$A(m).refuse(c).$value();
            if (!m.length) {
                jindo.$Element._deleteFilter(a, b, f)
            }
        }
    } else {
        if (b && f) {
            jindo.$Element._deleteFilter(a, b, f)
        } else {
            if (b) {
                jindo.$Element._deleteEvent(a, b, f)
            } else {
                var n = a._delegate_events;
                var d;
                for (var h = 0, g = n.length; h < g; h++) {
                    d = n[h];
                    jindo.$Element._unEventBind(a, d, a["_delegate_" + d + "_func"]);
                    jindo.$Element._delDelegateInfo(a, "_delegate_" + d);
                    jindo.$Element._delDelegateInfo(a, "_delegate_" + d + "_func")
                }
                jindo.$Element._delDelegateInfo(a, "_delegate_events")
            }
        }
    }
    return this
};
jindo.$Element._delDelegateInfo = function (a, c) {
    try {
        a[c] = null;
        delete a[c]
    } catch (b) {
    }
    return a
};
jindo.$Element._deleteFilter = function (a, d, b) {
    var c = a["_delegate_" + d];
    if (c && c[b]) {
        if (jindo.$H(c).keys().length == 1) {
            jindo.$Element._deleteEvent(a, d, b)
        } else {
            jindo.$Element._delDelegateInfo(c, b)
        }
    }
};
jindo.$Element._deleteEvent = function (a, d, c) {
    var b = a._delegate_events;
    jindo.$Element._unEventBind(a, d, a["_delegate_" + d + "_func"]);
    jindo.$Element._delDelegateInfo(a, "_delegate_" + d);
    jindo.$Element._delDelegateInfo(a, "_delegate_" + d + "_func");
    b = jindo.$A(b).refuse(d).$value();
    if (!b.length) {
        jindo.$Element._delDelegateInfo(a, "_delegate_events")
    } else {
        a._delegate_events = jindo.$A(b).refuse(d).$value()
    }
};
jindo.$Element._unEventBind = function (a, c, b) {
    if (a.removeEventListener) {
        jindo.$Element._unEventBind = function (d, f, e) {
            d.removeEventListener(f, e, false)
        }
    } else {
        jindo.$Element._unEventBind = function (d, f, e) {
            d.detachEvent("on" + f, e)
        }
    }
    jindo.$Element._unEventBind(a, c, b)
};
jindo.$Fn = function (func, thisObject) {
    var cl = arguments.callee;
    if (func instanceof cl) {
        return func
    }
    if (!(this instanceof cl)) {
        return new cl(func, thisObject)
    }
    this._events = [];
    this._tmpElm = null;
    this._key = null;
    if (typeof func == "function") {
        this._func = func;
        this._this = thisObject
    } else {
        if (typeof func == "string" && typeof thisObject == "string") {
            this._func = eval("false||function(" + func + "){" + thisObject + "}")
        }
    }
};
var _ua = navigator.userAgent;
jindo.$Fn.prototype.$value = function () {
    return this._func
};
jindo.$Fn.prototype.bind = function () {
    var d = jindo.$A(arguments).$value();
    var g = this._func;
    var e = this._this;
    var c = function () {
        var a = jindo.$A(arguments).$value();
        if (d.length) {
            a = d.concat(a)
        }
        return g.apply(e, a)
    };
    return c
};
jindo.$Fn.prototype.bindForEvent = function () {
    var e = arguments;
    var h = this._func;
    var g = this._this;
    var d = this._tmpElm || null;
    var c = function (l) {
        var b = Array.prototype.slice.apply(e);
        if (typeof l == "undefined") {
            l = window.event
        }
        if (typeof l.currentTarget == "undefined") {
            l.currentTarget = d
        }
        var a = jindo.$Event(l);
        b.unshift(a);
        var f = h.apply(g, b);
        if (typeof f != "undefined" && a.type == "beforeunload") {
            l.returnValue = f
        }
        return f
    };
    return c
};
jindo.$Fn._resizeEventBugInIE = function (c) {
    var a = document.documentMode >= 9;
    if (!a) {
        jindo.$Fn._resizeEventBugInIE = function () {
            return false
        }
    } else {
        var b = /resize/;
        jindo.$Fn._resizeEventBugInIE = function (d) {
            return b.test(d)
        }
    }
    return jindo.$Fn._resizeEventBugInIE(c)
};
jindo.$Fn.prototype.attach = function (f, d, h) {
    var o = null, g, n = d, e = f, c = _ua;
    if (typeof h == "undefined") {
        h = false
    }
    this._bUseCapture = h;
    if ((e instanceof Array) || (jindo.$A && (e instanceof jindo.$A) && (e = e.$value()))) {
        for (var m = 0; m < e.length; m++) {
            this.attach(e[m], n, h)
        }
        return this
    }
    if (!e || !n) {
        return this
    }
    if (typeof e.$value == "function") {
        e = e.$value()
    }
    e = jindo.$(e);
    n = n.toLowerCase();
    this._tmpElm = e;
    o = this.bindForEvent();
    this._tmpElm = null;
    var b = c.indexOf("MSIE") > -1;
    if (typeof e.addEventListener != "undefined" && !jindo.$Fn._resizeEventBugInIE(d)) {
        if (n == "domready") {
            n = "DOMContentLoaded"
        } else {
            if (n == "mousewheel" && c.indexOf("WebKit") < 0 && !/Opera/.test(c) && !b) {
                n = "DOMMouseScroll"
            } else {
                if (n == "mouseenter" && !b) {
                    n = "mouseover";
                    o = jindo.$Fn._fireWhenElementBoundary(e, o)
                } else {
                    if (n == "mouseleave" && !b) {
                        n = "mouseout";
                        o = jindo.$Fn._fireWhenElementBoundary(e, o)
                    } else {
                        if (n == "transitionend" || n == "transitionstart") {
                            var a, p = n.replace("transition", "");
                            p = p.substr(0, 1).toUpperCase() + p.substr(1);
                            if (typeof document.body.style.WebkitTransition !== "undefined") {
                                a = "webkit"
                            } else {
                                if (typeof document.body.style.OTransition !== "undefined") {
                                    a = "o"
                                } else {
                                    if (typeof document.body.style.MsTransition !== "undefined") {
                                        a = "ms"
                                    }
                                }
                            }
                            n = (a ? a + "Transition" : "transition") + p;
                            this._for_test_attach = n;
                            this._for_test_detach = ""
                        } else {
                            if (n == "animationstart" || n == "animationend" || n == "animationiteration") {
                                var a, p = n.replace("animation", "");
                                p = p.substr(0, 1).toUpperCase() + p.substr(1);
                                if (typeof document.body.style.WebkitAnimationName !== "undefined") {
                                    a = "webkit"
                                } else {
                                    if (typeof document.body.style.OAnimationName !== "undefined") {
                                        a = "o"
                                    } else {
                                        if (typeof document.body.style.MsTransitionName !== "undefined") {
                                            a = "ms"
                                        }
                                    }
                                }
                                n = (a ? a + "Animation" : "animation") + p;
                                this._for_test_attach = n;
                                this._for_test_detach = ""
                            }
                        }
                    }
                }
            }
        }
        e.addEventListener(n, o, h)
    } else {
        if (typeof e.attachEvent != "undefined") {
            if (n == "domready") {
                if (window.top != window) {
                    throw new Error("Domready Event doesn't work in the iframe.")
                }
                jindo.$Fn._domready(e, o);
                return this
            } else {
                e.attachEvent("on" + n, o)
            }
        }
    }
    if (!this._key) {
        this._key = "$" + jindo.$Fn.gc.count++;
        jindo.$Fn.gc.pool[this._key] = this
    }
    this._events[this._events.length] = {element: e, event: d.toLowerCase(), func: o};
    return this
};
jindo.$Fn.prototype.detach = function (f, c) {
    var o = null, g, d = f, n = c, b = _ua;
    if ((d instanceof Array) || (jindo.$A && (d instanceof jindo.$A) && (d = d.$value()))) {
        for (var h = 0; h < d.length; h++) {
            this.detach(d[h], n)
        }
        return this
    }
    if (!d || !n) {
        return this
    }
    if (jindo.$Element && d instanceof jindo.$Element) {
        d = d.$value()
    }
    d = jindo.$(d);
    n = n.toLowerCase();
    var m = this._events;
    for (var h = 0; h < m.length; h++) {
        if (m[h].element !== d || m[h].event !== n) {
            continue
        }
        o = m[h].func;
        this._events = jindo.$A(this._events).refuse(m[h]).$value();
        break
    }
    if (typeof d.removeEventListener != "undefined" && !jindo.$Fn._resizeEventBugInIE(c)) {
        if (n == "domready") {
            n = "DOMContentLoaded"
        } else {
            if (n == "mousewheel" && b.indexOf("WebKit") < 0) {
                n = "DOMMouseScroll"
            } else {
                if (n == "mouseenter") {
                    n = "mouseover"
                } else {
                    if (n == "mouseleave") {
                        n = "mouseout"
                    } else {
                        if (n == "transitionend" || n == "transitionstart") {
                            var a, p = n.replace("transition", "");
                            p = p.substr(0, 1).toUpperCase() + p.substr(1);
                            if (typeof document.body.style.WebkitTransition !== "undefined") {
                                a = "webkit"
                            } else {
                                if (typeof document.body.style.OTransition !== "undefined") {
                                    a = "o"
                                } else {
                                    if (typeof document.body.style.MsTransition !== "undefined") {
                                        a = "ms"
                                    }
                                }
                            }
                            n = (a ? a + "Transition" : "transition") + p;
                            this._for_test_detach = n;
                            this._for_test_attach = ""
                        } else {
                            if (n == "animationstart" || n == "animationend" || n == "animationiteration") {
                                var a, p = n.replace("animation", "");
                                p = p.substr(0, 1).toUpperCase() + p.substr(1);
                                if (typeof document.body.style.WebkitAnimationName !== "undefined") {
                                    a = "webkit"
                                } else {
                                    if (typeof document.body.style.OAnimationName !== "undefined") {
                                        a = "o"
                                    } else {
                                        if (typeof document.body.style.MsTransitionName !== "undefined") {
                                            a = "ms"
                                        }
                                    }
                                }
                                n = (a ? a + "Animation" : "animation") + p;
                                this._for_test_detach = n;
                                this._for_test_attach = ""
                            }
                        }
                    }
                }
            }
        }
        if (o) {
            d.removeEventListener(n, o, false)
        }
    } else {
        if (typeof d.detachEvent != "undefined") {
            if (n == "domready") {
                jindo.$Fn._domready.list = jindo.$Fn._domready.list.refuse(o);
                return this
            } else {
                d.detachEvent("on" + n, o)
            }
        }
    }
    return this
};
jindo.$Fn.prototype.delay = function (a, b) {
    if (typeof b == "undefined") {
        b = []
    }
    this._delayKey = setTimeout(this.bind.apply(this, b), a * 1000);
    return this
};
jindo.$Fn.prototype.setInterval = function (a, b) {
    if (typeof b == "undefined") {
        b = []
    }
    this._repeatKey = setInterval(this.bind.apply(this, b), a * 1000);
    return this._repeatKey
};
jindo.$Fn.prototype.repeat = jindo.$Fn.prototype.setInterval;
jindo.$Fn.prototype.stopDelay = function () {
    if (typeof this._delayKey != "undefined") {
        window.clearTimeout(this._delayKey);
        delete this._delayKey
    }
    return this
};
jindo.$Fn.prototype.stopRepeat = function () {
    if (typeof this._repeatKey != "undefined") {
        window.clearInterval(this._repeatKey);
        delete this._repeatKey
    }
    return this
};
jindo.$Fn.prototype.free = function (c) {
    var a = this._events.length;
    while (a > 0) {
        var f = this._events[--a].element;
        var h = this._events[a].event;
        var d = this._events[a].func;
        if (c && f !== c) {
            continue
        }
        this.detach(f, h);
        var b = !c;
        if (b && window === f && h == "unload" && _ua.indexOf("MSIE") < 1) {
            this._func.call(this._this)
        }
        delete this._events[a]
    }
    if (this._events.length == 0) {
        try {
            delete jindo.$Fn.gc.pool[this._key]
        } catch (g) {
        }
    }
};
jindo.$Fn._domready = function (g, d) {
    if (typeof jindo.$Fn._domready.list == "undefined") {
        var e = null, b = jindo.$Fn._domready.list = jindo.$A([d]);
        var a = false, c = function () {
            if (!a) {
                a = true;
                var f = {type: "domready", target: g, currentTarget: g};
                while (e = b.shift()) {
                    e(f)
                }
            }
        };
        (function () {
            try {
                g.documentElement.doScroll("left")
            } catch (f) {
                setTimeout(arguments.callee, 50);
                return
            }
            c()
        })();
        g.onreadystatechange = function () {
            if (g.readyState == "complete") {
                g.onreadystatechange = null;
                c()
            }
        }
    } else {
        jindo.$Fn._domready.list.push(d)
    }
};
jindo.$Fn._fireWhenElementBoundary = function (b, a) {
    return function (c) {
        var d = jindo.$Event(c);
        var e = jindo.$Element(d.relatedElement);
        if (e && (e.isEqual(this) || e.isChildOf(this))) {
            return
        }
        a.call(this, c)
    }
};
jindo.$Fn.gc = function () {
    var c = jindo.$Fn.gc.pool;
    for (var a in c) {
        if (c.hasOwnProperty(a)) {
            try {
                c[a].free()
            } catch (b) {
            }
        }
    }
    jindo.$Fn.gc.pool = c = {}
};
jindo.$Fn.freeElement = function (b) {
    var d = jindo.$Fn.gc.pool;
    for (var a in d) {
        if (d.hasOwnProperty(a)) {
            try {
                d[a].free(b)
            } catch (c) {
            }
        }
    }
};
jindo.$Fn.gc.count = 0;
jindo.$Fn.gc.pool = {};

function isUnCacheAgent() {
    var c = (_ua.indexOf("iPad") > -1);
    var a = (_ua.indexOf("Android") > -1);
    var b = (!(_ua.indexOf("IEMobile") > -1) && (_ua.indexOf("Mobile") > -1)) || (c && (_ua.indexOf("Safari") > -1));
    return b && !c && !a
}

if (typeof window != "undefined" && !isUnCacheAgent()) {
    jindo.$Fn(jindo.$Fn.gc).attach(window, "unload")
}
jindo.$ElementList = function (b) {
    var a = arguments.callee;
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    if (b instanceof Array) {
        b = jindo.$A(b)
    } else {
        if (jindo.$A && b instanceof jindo.$A) {
            b = jindo.$A(b.$value())
        } else {
            if (typeof b == "string" && jindo.cssquery) {
                b = jindo.$A(jindo.cssquery(b))
            } else {
                b = jindo.$A()
            }
        }
    }
    this._elements = b.map(function (d, e, c) {
        return jindo.$Element(d)
    })
};
jindo.$ElementList.prototype.get = function (a) {
    return this._elements.$value()[a]
};
jindo.$ElementList.prototype.getFirst = function () {
    return this.get(0)
};
jindo.$ElementList.prototype.length = function (b, a) {
    return this._elements.length(b, a)
};
jindo.$ElementList.prototype.getLast = function () {
    return this.get(Math.max(this._elements.length() - 1, 0))
};
jindo.$ElementList.prototype.$value = function () {
    return this._elements.$value()
};
(function (b) {
    var a = ["show", "hide", "toggle", "addClass", "removeClass", "toggleClass", "fireEvent", "leave", "empty", "appear", "disappear", "className", "width", "height", "text", "html", "css", "attr"];
    jindo.$A(a).forEach(function (c) {
        b[c] = function () {
            var d = jindo.$A(arguments).$value();
            this._elements.forEach(function (e) {
                e[c].apply(e, d)
            });
            return this
        }
    });
    jindo.$A(["appear", "disappear"]).forEach(function (c) {
        b[c] = function (f, g) {
            var d = this._elements.length;
            var e = this;
            this._elements.forEach(function (l, h) {
                if (h == d - 1) {
                    l[c](f, function () {
                        g(e)
                    })
                } else {
                    l[c](f)
                }
            });
            return this
        }
    })
})(jindo.$ElementList.prototype);
jindo.$S = function (b) {
    var a = arguments.callee;
    if (typeof b == "undefined") {
        b = ""
    }
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    this._str = b + ""
};
jindo.$S.prototype.$value = function () {
    return this._str
};
jindo.$S.prototype.toString = jindo.$S.prototype.$value;
jindo.$S.prototype.trim = function () {
    if ("".trim) {
        jindo.$S.prototype.trim = function () {
            return jindo.$S(this._str.trim())
        }
    } else {
        jindo.$S.prototype.trim = function () {
            return jindo.$S(this._str.replace(/^(\s|　)+/g, "").replace(/(\s|　)+$/g, ""))
        }
    }
    return jindo.$S(this.trim())
};
jindo.$S.prototype.escapeHTML = function () {
    var b = {'"': "quot", "&": "amp", "<": "lt", ">": "gt", "'": "#39"};
    var a = this._str.replace(/[<>&"']/g, function (c) {
        return b[c] ? "&" + b[c] + ";" : c
    });
    return jindo.$S(a)
};
jindo.$S.prototype.stripTags = function () {
    return jindo.$S(this._str.replace(/<\/?(?:h[1-5]|[a-z]+(?:\:[a-z]+)?)[^>]*>/ig, ""))
};
jindo.$S.prototype.times = function (c) {
    var a = [];
    for (var b = 0; b < c; b++) {
        a[a.length] = this._str
    }
    return jindo.$S(a.join(""))
};
jindo.$S.prototype.unescapeHTML = function () {
    var b = {quot: '"', amp: "&", lt: "<", gt: ">", "#39": "'"};
    var a = this._str.replace(/&([a-z]+|#[0-9]+);/g, function (d, c) {
        return b[c] ? b[c] : d
    });
    return jindo.$S(a)
};
jindo.$S.prototype.escape = function () {
    var a = this._str.replace(/([\u0080-\uFFFF]+)|[\n\r\t"'\\]/g, function (d, c, b) {
        if (c) {
            return escape(c).replace(/%/g, "\\")
        }
        return (b = {"\n": "\\n", "\r": "\\r", "\t": "\\t"})[d] ? b[d] : "\\" + d
    });
    return jindo.$S(a)
};
jindo.$S.prototype.bytes = function (d) {
    var e = 0, b = 0, c = 0, a = this._str.length;
    var h = ((document.charset || document.characterSet || document.defaultCharset) + "");
    var f, g;
    if (typeof d == "undefined") {
        f = false
    } else {
        if (d.constructor == Number) {
            f = true;
            g = d
        } else {
            if (d.constructor == Object) {
                h = d.charset || h;
                g = d.size || false;
                f = !!g
            } else {
                f = false
            }
        }
    }
    if (h.toLowerCase() == "utf-8") {
        for (c = 0; c < a; c++) {
            e = this._str.charCodeAt(c);
            if (e < 128) {
                b += 1
            } else {
                if (e < 2048) {
                    b += 2
                } else {
                    if (e < 65536) {
                        b += 3
                    } else {
                        b += 4
                    }
                }
            }
            if (f && b > g) {
                this._str = this._str.substr(0, c);
                break
            }
        }
    } else {
        for (c = 0; c < a; c++) {
            b += (this._str.charCodeAt(c) > 128) ? 2 : 1;
            if (f && b > g) {
                this._str = this._str.substr(0, c);
                break
            }
        }
    }
    return f ? this : b
};
jindo.$S.prototype.parseString = function () {
    if (this._str == "") {
        return {}
    }
    var h = this._str.split(/&/g), l, c, g, a = {}, d = false;
    for (var b = 0; b < h.length; b++) {
        c = h[b].substring(0, l = h[b].indexOf("=")), d = false;
        try {
            g = decodeURIComponent(h[b].substring(l + 1))
        } catch (f) {
            d = true;
            g = decodeURIComponent(unescape(h[b].substring(l + 1)))
        }
        if (c.substr(c.length - 2, 2) == "[]") {
            c = c.substring(0, c.length - 2);
            if (typeof a[c] == "undefined") {
                a[c] = []
            }
            a[c][a[c].length] = d ? escape(g) : g
        } else {
            a[c] = d ? escape(g) : g
        }
    }
    return a
};
jindo.$S.prototype.escapeRegex = function () {
    var a = this._str;
    var b = /([\?\.\*\+\-\/\(\)\{\}\[\]\:\!\^\$\\\|])/g;
    return jindo.$S(a.replace(b, "\\$1"))
};
jindo.$S.prototype.format = function () {
    var b = arguments;
    var a = 0;
    var c = this._str.replace(/%([ 0])?(-)?([1-9][0-9]*)?([bcdsoxX])/g, function (m, l, g, f, d) {
        var e = b[a++];
        var h = "", n = "";
        f = f ? +f : 0;
        if (d == "s") {
            h = e + ""
        } else {
            if (" bcdoxX".indexOf(d) > 0) {
                if (typeof e != "number") {
                    return ""
                }
                h = (d == "c") ? String.fromCharCode(e) : e.toString(({b: 2, d: 10, o: 8, x: 16, X: 16})[d]);
                if (" X".indexOf(d) > 0) {
                    h = h.toUpperCase()
                }
            }
        }
        if (h.length < f) {
            n = jindo.$S(l || " ").times(f - h.length).toString()
        }
        (g == "-") ? (h += n) : (h = n + h);
        return h
    });
    return jindo.$S(c)
};
jindo.$Document = function (b) {
    var a = arguments.callee;
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    this._doc = b || document;
    this._docKey = this.renderingMode() == "Standards" ? "documentElement" : "body"
};
jindo.$Document.prototype.$value = function () {
    return this._doc
};
jindo.$Document.prototype.scrollSize = function () {
    var a = navigator.userAgent.indexOf("WebKit") > -1;
    var b = this._doc[a ? "body" : this._docKey];
    return {width: Math.max(b.scrollWidth, b.clientWidth), height: Math.max(b.scrollHeight, b.clientHeight)}
};
jindo.$Document.prototype.scrollPosition = function () {
    var a = navigator.userAgent.indexOf("WebKit") > -1;
    var b = this._doc[a ? "body" : this._docKey];
    return {
        left: b.scrollLeft || window.pageXOffset || window.scrollX || 0,
        top: b.scrollTop || window.pageYOffset || window.scrollY || 0
    }
};
jindo.$Document.prototype.clientSize = function () {
    var c = navigator.userAgent;
    var a = this._doc[this._docKey];
    var b = c.indexOf("WebKit") > -1 && c.indexOf("Chrome") == -1;
    return (b) ? {width: window.innerWidth, height: window.innerHeight} : {width: a.clientWidth, height: a.clientHeight}
};
jindo.$Document.prototype.renderingMode = function () {
    var b = navigator.userAgent;
    var d = (typeof window.opera == "undefined" && b.indexOf("MSIE") > -1);
    var a = (b.indexOf("WebKit") > -1 && b.indexOf("Chrome") < 0 && navigator.vendor.indexOf("Apple") > -1);
    var c;
    if ("compatMode" in this._doc) {
        c = this._doc.compatMode == "CSS1Compat" ? "Standards" : (d ? "Quirks" : "Almost")
    } else {
        c = a ? "Standards" : "Quirks"
    }
    return c
};
jindo.$Document.prototype.queryAll = function (a) {
    return jindo.$$(a, this._doc)
};
jindo.$Document.prototype.query = function (a) {
    return jindo.$$.getSingle(a, this._doc)
};
jindo.$Document.prototype.xpathAll = function (a) {
    return jindo.$$.xpath(a, this._doc)
};
jindo.$Form = function (b) {
    var a = arguments.callee;
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    b = jindo.$(b);
    if (!b.tagName || b.tagName.toUpperCase() != "FORM") {
        throw new Error("The element should be a FORM element")
    }
    this._form = b
};
jindo.$Form.prototype.$value = function () {
    return this._form
};
jindo.$Form.prototype.serialize = function () {
    var a = this;
    var d = {};
    var c = arguments.length;
    var e = function (g) {
        var f = a.value(g);
        if (typeof f != "undefined") {
            d[g] = f
        }
    };
    if (c == 0) {
        jindo.$A(this.element()).forEach(function (f) {
            if (f.name) {
                e(f.name)
            }
        })
    } else {
        for (var b = 0; b < c; b++) {
            e(arguments[b])
        }
    }
    return jindo.$H(d).toQueryString()
};
jindo.$Form.prototype.element = function (a) {
    if (arguments.length > 0) {
        return this._form[a]
    }
    return this._form.elements
};
jindo.$Form.prototype.enable = function () {
    var e = arguments[0];
    if (typeof e == "object") {
        var a = this;
        jindo.$H(e).forEach(function (f, g) {
            a.enable(g, f)
        });
        return this
    }
    var c = this.element(e);
    if (!c) {
        return this
    }
    c = c.nodeType == 1 ? [c] : c;
    if (arguments.length < 2) {
        var d = true;
        jindo.$A(c).forEach(function (f) {
            if (f.disabled) {
                d = false;
                jindo.$A.Break()
            }
        });
        return d
    } else {
        var b = arguments[1];
        jindo.$A(c).forEach(function (f) {
            f.disabled = !b
        });
        return this
    }
};
jindo.$Form.prototype.value = function (e) {
    if (typeof e == "object") {
        var b = this;
        jindo.$H(e).forEach(function (f, g) {
            b.value(g, f)
        });
        return this
    }
    var d = this.element(e);
    if (!d) {
        throw new Error("엘리먼트는 존재하지 않습니다.")
    }
    d = d.nodeType == 1 ? [d] : d;
    if (arguments.length > 1) {
        var a = arguments[1];
        jindo.$A(d).forEach(function (l) {
            switch (l.type) {
                case"radio":
                    l.checked = (l.value == a);
                    break;
                case"checkbox":
                    if (a.constructor == Array) {
                        l.checked = jindo.$A(a).has(l.value)
                    } else {
                        l.checked = (l.value == a)
                    }
                    break;
                case"select-one":
                    var g = -1;
                    for (var h = 0, f = l.options.length; h < f; h++) {
                        if (l.options[h].value == a) {
                            g = h
                        }
                    }
                    l.selectedIndex = g;
                    break;
                case"select-multiple":
                    var g = -1;
                    if (a.constructor == Array) {
                        var m = jindo.$A(a);
                        for (var h = 0, f = l.options.length; h < f; h++) {
                            l.options[h].selected = m.has(l.options[h].value)
                        }
                    } else {
                        for (var h = 0, f = l.options.length; h < f; h++) {
                            if (l.options[h].value == a) {
                                g = h
                            }
                        }
                        l.selectedIndex = g
                    }
                    break;
                default:
                    l.value = a;
                    break
            }
        });
        return this
    }
    var c = [];
    jindo.$A(d).forEach(function (h) {
        switch (h.type) {
            case"radio":
            case"checkbox":
                if (h.checked) {
                    c.push(h.value)
                }
                break;
            case"select-one":
                if (h.selectedIndex != -1) {
                    c.push(h.options[h.selectedIndex].value)
                }
                break;
            case"select-multiple":
                if (h.selectedIndex != -1) {
                    for (var g = 0, f = h.options.length; g < f; g++) {
                        if (h.options[g].selected) {
                            c.push(h.options[g].value)
                        }
                    }
                }
                break;
            default:
                c.push(h.value);
                break
        }
    });
    return c.length > 1 ? c : c[0]
};
jindo.$Form.prototype.submit = function (b, a) {
    var c = null;
    if (typeof b == "string") {
        c = this._form.target;
        this._form.target = b
    }
    if (typeof b == "function") {
        a = b
    }
    if (typeof a != "undefined") {
        if (!a(this._form)) {
            return this
        }
    }
    this._form.submit();
    if (c !== null) {
        this._form.target = c
    }
    return this
};
jindo.$Form.prototype.reset = function (a) {
    if (typeof a != "undefined") {
        if (!a(this._form)) {
            return this
        }
    }
    this._form.reset();
    return this
};
jindo.$Template = function (d) {
    var c = null, a = "";
    var b = arguments.callee;
    if (d instanceof b) {
        return d
    }
    if (!(this instanceof b)) {
        return new b(d)
    }
    if (typeof d == "undefined") {
        d = ""
    } else {
        if ((c = document.getElementById(d) || d) && c.tagName && (a = c.tagName.toUpperCase()) && (a == "TEXTAREA" || (a == "SCRIPT" && c.getAttribute("type") == "text/template"))) {
            d = (c.value || c.innerHTML).replace(/^\s+|\s+$/g, "")
        }
    }
    this._str = d + ""
};
jindo.$Template.splitter = /(?!\\)[\{\}]/g;
jindo.$Template.pattern = /^(?:if (.+)|elseif (.+)|for (?:(.+)\:)?(.+) in (.+)|(else)|\/(if|for)|=(.+)|js (.+)|set (.+))$/;
jindo.$Template.prototype.process = function (data) {
    var key = "\x01";
    var leftBrace = "\x02";
    var rightBrace = "\x03";
    var tpl = (" " + this._str + " ").replace(/\\{/g, leftBrace).replace(/\\}/g, rightBrace).replace(/(?!\\)\}\{/g, "}" + key + "{").split(jindo.$Template.splitter),
        i = tpl.length;
    var map = {'"': '\\"', "\\": "\\\\", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\f": "\\f"};
    var reg = [/(["'](?:(?:\\.)+|[^\\["']+)*["']|[a-zA-Z_][\w\.]*)/g, /[\n\r\t\f"\\]/g, /^\s+/, /\s+$/, /#/g];
    var cb = [function (m) {
        return (m.substring(0, 1) == '"' || m.substring(0, 1) == "'" || m == "null") ? m : "d." + m
    }, function (m) {
        return map[m] || m
    }, "", ""];
    var stm = [];
    var lev = 0;
    tpl[0] = tpl[0].substr(1);
    tpl[i - 1] = tpl[i - 1].substr(0, tpl[i - 1].length - 1);
    if (i < 2) {
        return tpl[0]
    }
    tpl = jindo.$A(tpl).reverse().$value();
    var delete_info;
    while (i--) {
        if (i % 2) {
            tpl[i] = tpl[i].replace(jindo.$Template.pattern, function () {
                var m = arguments;
                if (m[10]) {
                    return m[10].replace(/(\w+)(?:\s*)=(?:\s*)(?:([a-zA-Z0-9_]+)|(.+))$/g, function () {
                        var mm = arguments;
                        var str = "d." + mm[1] + "=";
                        if (mm[2]) {
                            str += "d." + mm[2]
                        } else {
                            str += mm[3].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function (m) {
                                return (m.substring(0, 1) == "=") ? "d." + m.replace("=", "") : m
                            })
                        }
                        return str
                    }) + ";"
                }
                if (m[9]) {
                    return "s[i++]=" + m[9].replace(/(=(?:[a-zA-Z_][\w\.]*)+)/g, function (m) {
                        return (m.substring(0, 1) == "=") ? "d." + m.replace("=", "") : m
                    }) + ";"
                }
                if (m[8]) {
                    return "s[i++]= d." + m[8] + ";"
                }
                if (m[1]) {
                    return "if(" + m[1].replace(reg[0], cb[0]).replace(/d\.(typeof) /, "$1 ").replace(/ d\.(instanceof) d\./, " $1 ") + "){"
                }
                if (m[2]) {
                    return "}else if(" + m[2].replace(reg[0], cb[0]).replace(/d\.(typeof) /, "$1 ").replace(/ d\.(instanceof) d\./, " $1 ") + "){"
                }
                if (m[5]) {
                    delete_info = m[4];
                    var _aStr = [];
                    _aStr.push("var t#=d." + m[5] + "||{},p#=isArray(t#),i#=0;");
                    _aStr.push("for(var x# in t#){");
                    _aStr.push("if(!t#.hasOwnProperty(x#)){continue;}");
                    _aStr.push("	if( (p# && isNaN(i#=parseInt(x#,10))) || (!p# && !t#.propertyIsEnumerable(x#)) ) continue;");
                    _aStr.push("	d." + m[4] + "=t#[x#];");
                    _aStr.push(m[3] ? "d." + m[3] + "=p#?i#:x#;" : "");
                    return _aStr.join("").replace(reg[4], lev++)
                }
                if (m[6]) {
                    return "}else{"
                }
                if (m[7]) {
                    if (m[7] == "for") {
                        return "delete d." + delete_info + "; };"
                    } else {
                        return "};"
                    }
                }
                return m[0]
            })
        } else {
            if (tpl[i] == key) {
                tpl[i] = ""
            } else {
                if (tpl[i]) {
                    tpl[i] = 's[i++]="' + tpl[i].replace(reg[1], cb[1]) + '";'
                }
            }
        }
    }
    tpl = jindo.$A(tpl).reverse().$value().join("").replace(new RegExp(leftBrace, "g"), "{").replace(new RegExp(rightBrace, "g"), "}");
    var _aStr = [];
    _aStr.push("var s=[],i=0;");
    _aStr.push('function isArray(o){ return Object.prototype.toString.call(o) == "[object Array]" };');
    _aStr.push(tpl);
    _aStr.push('return s.join("");');
    tpl = eval("false||function(d){" + _aStr.join("") + "}");
    tpl = tpl(data);
    return tpl
};
jindo.$Date = function (h) {
    var c = arguments, f = "";
    var b = arguments.callee;
    if (h && h instanceof b) {
        return h
    }
    if (!(this instanceof b)) {
        return new b(c[0], c[1], c[2], c[3], c[4], c[5], c[6])
    }
    if ((f = typeof h) == "string") {
        if (/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)))/.test(h)) {
            try {
                this._date = new Date(h);
                if (!this._date.toISOString) {
                    this._date = jindo.$Date.makeISO(h)
                } else {
                    if (this._date.toISOString() == "Invalid Date") {
                        this._date = jindo.$Date.makeISO(h)
                    }
                }
            } catch (g) {
                this._date = jindo.$Date.makeISO(h)
            }
        } else {
            this._date = b.parse(h)
        }
    } else {
        if (f == "number") {
            if (typeof c[1] == "undefined") {
                this._date = new Date(h)
            } else {
                for (var d = 0; d < 7; d++) {
                    if (typeof c[d] != "number") {
                        c[d] = 1
                    }
                }
                this._date = new Date(c[0], c[1], c[2], c[3], c[4], c[5], c[6])
            }
        } else {
            if (f == "object" && h.constructor == Date) {
                (this._date = new Date).setTime(h.getTime());
                this._date.setMilliseconds(h.getMilliseconds())
            } else {
                this._date = new Date
            }
        }
    }
    this._names = {};
    for (var d in jindo.$Date.names) {
        if (jindo.$Date.names.hasOwnProperty(d)) {
            this._names[d] = jindo.$Date.names[d]
        }
    }
};
jindo.$Date.makeISO = function (d) {
    var b = d.match(/(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d)(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|(?:([-+])(\d\d)(?::?(\d\d))?)?)?)?)?)?/);
    var a = parseInt(b[4] || 0, 10);
    var c = parseInt(b[5] || 0, 10);
    if (b[8] == "Z") {
        a += jindo.$Date.utc
    } else {
        if (b[9] == "+" || b[9] == "-") {
            a += (jindo.$Date.utc - parseInt(b[9] + b[10], 10));
            c += parseInt(b[9] + b[11], 10)
        }
    }
    return new Date(b[1] || 0, parseInt(b[2] || 0, 10) - 1, b[3] || 0, a, c, b[6] || 0, b[7] || 0)
};
jindo.$Date.names = {
    month: ["January", "Febrary", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"],
    s_month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    s_day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ampm: ["AM", "PM"]
};
jindo.$Date.utc = 9;
jindo.$Date.now = function () {
    return Date.now()
};
jindo.$Date.prototype.name = function (b) {
    if (arguments.length) {
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                this._names[a] = b[a]
            }
        }
    } else {
        return this._names
    }
};
jindo.$Date.parse = function (a) {
    return new Date(Date.parse(a))
};
jindo.$Date.prototype.$value = function () {
    return this._date
};
jindo.$Date.prototype.format = function (c) {
    var f = {};
    var e = this._date;
    var b = this.name();
    var a = this;
    return (c || "").replace(/[a-z]/ig, function g(d) {
        if (typeof f[d] != "undefined") {
            return f[d]
        }
        switch (d) {
            case"d":
            case"j":
                f.j = e.getDate();
                f.d = (f.j > 9 ? "" : "0") + f.j;
                return f[d];
            case"l":
            case"D":
            case"w":
            case"N":
                f.w = e.getDay();
                f.N = f.w ? f.w : 7;
                f.D = b.s_day[f.w];
                f.l = b.day[f.w];
                return f[d];
            case"S":
                return (!!(f.S = ["st", "nd", "rd"][e.getDate()])) ? f.S : (f.S = "th");
            case"z":
                f.z = Math.floor((e.getTime() - (new Date(e.getFullYear(), 0, 1)).getTime()) / (3600 * 24 * 1000));
                return f.z;
            case"m":
            case"n":
                f.n = e.getMonth() + 1;
                f.m = (f.n > 9 ? "" : "0") + f.n;
                return f[d];
            case"L":
                f.L = a.isLeapYear();
                return f.L;
            case"o":
            case"Y":
            case"y":
                f.o = f.Y = e.getFullYear();
                f.y = (f.o + "").substr(2);
                return f[d];
            case"a":
            case"A":
            case"g":
            case"G":
            case"h":
            case"H":
                f.G = e.getHours();
                f.g = (f.g = f.G % 12) ? f.g : 12;
                f.A = f.G < 12 ? b.ampm[0] : b.ampm[1];
                f.a = f.A.toLowerCase();
                f.H = (f.G > 9 ? "" : "0") + f.G;
                f.h = (f.g > 9 ? "" : "0") + f.g;
                return f[d];
            case"i":
                f.i = (((f.i = e.getMinutes()) > 9) ? "" : "0") + f.i;
                return f.i;
            case"s":
                f.s = (((f.s = e.getSeconds()) > 9) ? "" : "0") + f.s;
                return f.s;
            case"u":
                f.u = e.getMilliseconds();
                return f.u;
            case"U":
                f.U = a.time();
                return f.U;
            default:
                return d
        }
    })
};
jindo.$Date.prototype.time = function (a) {
    if (typeof a == "number") {
        this._date.setTime(a);
        return this
    }
    return this._date.getTime()
};
jindo.$Date.prototype.year = function (a) {
    if (typeof a == "number") {
        this._date.setFullYear(a);
        return this
    }
    return this._date.getFullYear()
};
jindo.$Date.prototype.month = function (a) {
    if (typeof a == "number") {
        this._date.setMonth(a);
        return this
    }
    return this._date.getMonth()
};
jindo.$Date.prototype.date = function (a) {
    if (typeof a == "number") {
        this._date.setDate(a);
        return this
    }
    return this._date.getDate()
};
jindo.$Date.prototype.day = function () {
    return this._date.getDay()
};
jindo.$Date.prototype.hours = function (a) {
    if (typeof a == "number") {
        this._date.setHours(a);
        return this
    }
    return this._date.getHours()
};
jindo.$Date.prototype.minutes = function (a) {
    if (typeof a == "number") {
        this._date.setMinutes(a);
        return this
    }
    return this._date.getMinutes()
};
jindo.$Date.prototype.seconds = function (a) {
    if (typeof a == "number") {
        this._date.setSeconds(a);
        return this
    }
    return this._date.getSeconds()
};
jindo.$Date.prototype.isLeapYear = function () {
    var a = this._date.getFullYear();
    return !(a % 4) && !!(a % 100) || !(a % 400)
};
jindo.$Window = function (b) {
    var a = arguments.callee;
    if (b instanceof a) {
        return b
    }
    if (!(this instanceof a)) {
        return new a(b)
    }
    this._win = b || window
};
jindo.$Window.prototype.$value = function () {
    return this._win
};
jindo.$Window.prototype.resizeTo = function (b, a) {
    this._win.resizeTo(b, a);
    return this
};
jindo.$Window.prototype.resizeBy = function (b, a) {
    this._win.resizeBy(b, a);
    return this
};
jindo.$Window.prototype.moveTo = function (b, a) {
    this._win.moveTo(b, a);
    return this
};
jindo.$Window.prototype.moveBy = function (b, a) {
    this._win.moveBy(b, a);
    return this
};
jindo.$Window.prototype.sizeToContent = function (g, h) {
    if (typeof this._win.sizeToContent == "function") {
        this._win.sizeToContent()
    } else {
        if (arguments.length != 2) {
            var f, d;
            var m = this._win;
            var l = this._win.document;
            if (m.innerHeight) {
                f = m.innerWidth;
                d = m.innerHeight
            } else {
                if (l.documentElement && l.documentElement.clientHeight) {
                    f = l.documentElement.clientWidth;
                    d = l.documentElement.clientHeight
                } else {
                    if (l.body) {
                        f = l.body.clientWidth;
                        d = l.body.clientHeight
                    }
                }
            }
            var e, c;
            var b = l.body.scrollHeight;
            var a = l.body.offsetHeight;
            if (b > a) {
                e = l.body.scrollWidth;
                c = l.body.scrollHeight
            } else {
                e = l.body.offsetWidth;
                c = l.body.offsetHeight
            }
            g = e - f;
            h = c - d
        }
        this.resizeBy(g, h)
    }
    return this
};
if (typeof window != "undefined") {
    for (prop in jindo) {
        if (jindo.hasOwnProperty(prop)) {
            window[prop] = jindo[prop]
        }
    }
}
;