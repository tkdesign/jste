if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector;
}

if (!Element.prototype.next) {
    Element.prototype.next = function(selector) {
        var nextElem = this.nextElementSibling;
        if (!selector) {
            return nextElem;
        }
        if (nextElem && Element.prototype.matches.call(nextElem, selector)) {
            return nextElem;
        }
        return null;
    };
}

if (!Element.prototype.prev) {
    Element.prototype.prev = function(selector) {
        var prevElem = this.previousElementSibling;
        if (!selector) {
            return prevElem;
        }
        if (prevElem && Element.prototype.matches.call(prevElem, selector)) {
            return prevElem;
        }
        return null;
    };
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

if (!Element.prototype.addEventListener) {
    var oListeners = {};
    function runListeners(oEvent) {
        if (!oEvent) {
            oEvent = window.event;
        }
        for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) {
                    oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent);
                }
                break;
            }
        }
    }
    Element.prototype.addEventListener = function(sEventType, fListener) {
        if (oListeners.hasOwnProperty(sEventType)) {
            var oEvtListeners = oListeners[sEventType];
            for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
                if (oEvtListeners.aEls[iElId] === this) {
                    nElIdx = iElId;
                    break;
                }
            }
            if (nElIdx === -1) {
                oEvtListeners.aEls.push(this);
                oEvtListeners.aEvts.push([ fListener ]);
                this["on" + sEventType] = runListeners;
            } else {
                var aElListeners = oEvtListeners.aEvts[nElIdx];
                if (this["on" + sEventType] !== runListeners) {
                    aElListeners.splice(0);
                    this["on" + sEventType] = runListeners;
                }
                for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
                    if (aElListeners[iLstId] === fListener) {
                        return;
                    }
                }
                aElListeners.push(fListener);
            }
        } else {
            oListeners[sEventType] = {
                aEls: [ this ],
                aEvts: [ [ fListener ] ]
            };
            this["on" + sEventType] = runListeners;
        }
    };
    Element.prototype.removeEventListener = function(sEventType, fListener) {
        if (!oListeners.hasOwnProperty(sEventType)) {
            return;
        }
        var oEvtListeners = oListeners[sEventType];
        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                nElIdx = iElId;
                break;
            }
        }
        if (nElIdx === -1) {
            return;
        }
        for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            if (aElListeners[iLstId] === fListener) {
                aElListeners.splice(iLstId, 1);
            }
        }
    };
}

if (!Element.prototype.addListener) {
    var oListeners = {};
    function runListeners(oEvent) {
        if (!oEvent) {
            oEvent = window.event;
        }
        for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) {
                    oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent);
                }
                break;
            }
        }
    }
    Element.prototype.addListener = function(sEventType, fListener) {
        if (oListeners.hasOwnProperty(sEventType)) {
            var oEvtListeners = oListeners[sEventType];
            for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
                if (oEvtListeners.aEls[iElId] === this) {
                    nElIdx = iElId;
                    break;
                }
            }
            if (nElIdx === -1) {
                oEvtListeners.aEls.push(this);
                oEvtListeners.aEvts.push([ fListener ]);
                this["on" + sEventType] = runListeners;
            } else {
                var aElListeners = oEvtListeners.aEvts[nElIdx];
                if (this["on" + sEventType] !== runListeners) {
                    aElListeners.splice(0);
                    this["on" + sEventType] = runListeners;
                }
                for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
                    if (aElListeners[iLstId] === fListener) {
                        return;
                    }
                }
                aElListeners.push(fListener);
            }
        } else {
            oListeners[sEventType] = {
                aEls: [ this ],
                aEvts: [ [ fListener ] ]
            };
            this["on" + sEventType] = runListeners;
        }
    };
    Element.prototype.removeListener = function(sEventType, fListener) {
        if (!oListeners.hasOwnProperty(sEventType)) {
            return;
        }
        var oEvtListeners = oListeners[sEventType];
        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                nElIdx = iElId;
                break;
            }
        }
        if (nElIdx === -1) {
            return;
        }
        for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            if (aElListeners[iLstId] === fListener) {
                aElListeners.splice(iLstId, 1);
            }
        }
    };
    Element.prototype.removeAllListeners = function(sEventType) {
        if (!oListeners.hasOwnProperty(sEventType)) {
            return;
        }
        var oEvtListeners = oListeners[sEventType];
        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                nElIdx = iElId;
                break;
            }
        }
        if (nElIdx === -1) {
            return;
        }
        for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            while (aElListeners.length) {
                aElListeners.pop();
            }
        }
    };
}

if (!Element.prototype.fadeIn) {
    Element.prototype.fadeIn = function(ms) {
        var opacity = 0, interval = 50, duration = ms, gap = interval / duration, self = this;
        function func() {
            opacity = opacity + gap;
            self.style.opacity = opacity;
            if (opacity <= 0) self.style.display = "none";
            if (opacity <= 0 || opacity >= 1) clearInterval(fading);
        }
        var fading = window.setInterval(func, interval);
    };
    Element.prototype.fadeOut = function(ms) {
        var opacity = 1, interval = 50, duration = ms, gap = interval / duration, self = this;
        self.el.style.display = "inline";
        self.el.style.opacity = opacity;
        function func() {
            opacity = opacity - gap;
            self.style.opacity = opacity;
            if (opacity <= 0) self.style.display = "none";
            if (opacity <= 0 || opacity >= 1) clearInterval(fading);
        }
        var fading = window.setInterval(func, interval);
    };
}

if (!Element.prototype.parents) {
    Element.prototype.parents = function() {
        var matched = [], self = this;
        while ((self = self["parentNode"]) && self.nodeType !== 9) {
            if (self.nodeType === 1) {
                matched.push(self);
            }
        }
        return matched;
    };
}

if (!Element.prototype.slideUp) {
    Element.prototype.slideUp = function(duration) {
        var el = this;
        el.style.transitionProperty = "height, margin, padding";
        el.style.transitionDuration = `${duration}ms`;
        el.style.boxSizing = "border-box";
        el.style.height = `${el.offsetHeight}px`;
        el.offsetHeight;
        el.style.overflow = "hidden";
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
        el.style.marginTop = 0;
        el.style.marginBottom = 0;
        setTimeout(() => {
            el.style.display = "none";
            el.style.removeProperty("height");
            el.style.removeProperty("padding-top");
            el.style.removeProperty("padding-bottom");
            el.style.removeProperty("margin-top");
            el.style.removeProperty("margin-bottom");
            el.style.removeProperty("overflow");
            el.style.removeProperty("transition-duration");
            el.style.removeProperty("transition-property");
        }, duration);
    };
    Element.prototype.slideDown = function(duration) {
        const el = this;
        el.style.removeProperty("display");
        let display = window.getComputedStyle(el).display;
        if (display === "none") display = "block";
        el.style.display = display;
        let height = el.offsetHeight;
        el.style.overflow = "hidden";
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
        el.style.marginTop = 0;
        el.style.marginBottom = 0;
        el.offsetHeight;
        el.style.boxSizing = "border-box";
        el.style.transitionProperty = "height, margin, padding";
        el.style.transitionDuration = `${duration}ms`;
        el.style.height = `${height}px`;
        el.style.removeProperty("padding-top");
        el.style.removeProperty("padding-bottom");
        el.style.removeProperty("margin-top");
        el.style.removeProperty("margin-bottom");
        setTimeout(() => {
            el.style.removeProperty("height");
            el.style.removeProperty("overflow");
            el.style.removeProperty("transition-duration");
            el.style.removeProperty("transition-property");
        }, duration);
    };
    Element.prototype.slideToggle = function(duration) {
        const el = this;
        if (getComputedStyle(el).display === "none") {
            return Element.prototype.slideUp.call(el, duration);
        } else {
            return Element.prototype.slideDown.call(el, duration);
        }
    };
}

const jste = function(selector, options = {}, context = document) {
    let self = context.querySelector(selector);
    let varsTitle = [ {
        title: "Text Format"
    }, {
        title: "Font Size"
    }, {
        title: "Color"
    }, {
        title: "Bold",
        hotkey: "B"
    }, {
        title: "Italic",
        hotkey: "I"
    }, {
        title: "Underline",
        hotkey: "U"
    }, {
        title: "Ordered List",
        hotkey: "."
    }, {
        title: "Unordered List",
        hotkey: ","
    }, {
        title: "Subscript",
        hotkey: "down arrow"
    }, {
        title: "Superscript",
        hotkey: "up arrow"
    }, {
        title: "Outdent",
        hotkey: "left arrow"
    }, {
        title: "Indent",
        hotkey: "right arrow"
    }, {
        title: "Justify Left"
    }, {
        title: "Justify Center"
    }, {
        title: "Justify Right"
    }, {
        title: "Strike Through",
        hotkey: "K"
    }, {
        title: "Add Link",
        hotkey: "L"
    }, {
        title: "Remove Link"
    }, {
        title: "Cleaner Style",
        hotkey: "Delete"
    }, {
        title: "Horizontal Rule",
        hotkey: "H"
    }, {
        title: "Source"
    } ];
    let formats = [ [ "p", "Normal" ], [ "h1", "Header 1" ], [ "h2", "Header 2" ], [ "h3", "Header 3" ], [ "h4", "Header 4" ], [ "h5", "Header 5" ], [ "h6", "Header 6" ], [ "pre", "Preformatted" ] ];
    let fsizes = [ "10", "12", "16", "18", "20", "24", "28" ];
    let colors = [ "0,0,0", "68,68,68", "102,102,102", "153,153,153", "204,204,204", "238,238,238", "243,243,243", "255,255,255", null, "255,0,0", "255,153,0", "255,255,0", "0,255,0", "0,255,255", "0,0,255", "153,0,255", "255,0,255", null, "244,204,204", "252,229,205", "255,242,204", "217,234,211", "208,224,227", "207,226,243", "217,210,233", "234,209,220", "234,153,153", "249,203,156", "255,229,153", "182,215,168", "162,196,201", "159,197,232", "180,167,214", "213,166,189", "224,102,102", "246,178,107", "255,217,102", "147,196,125", "118,165,175", "111,168,220", "142,124,195", "194,123,160", "204,0,0", "230,145,56", "241,194,50", "106,168,79", "69,129,142", "61,133,198", "103,78,167", "166,77,121", "153,0,0", "180,95,6", "191,144,0", "56,118,29", "19,79,92", "11,83,148", "53,28,117", "116,27,71", "102,0,0", "120,63,4", "127,96,0", "39,78,19", "12,52,61", "7,55,99", "32,18,77", "76,17,48" ];
    let linktypes = [ "Web Address", "E-mail Address", "Picture URL" ];
    let vars = Object.assign({
        status: true,
        css: "jste",
        title: true,
        titletext: varsTitle,
        button: "OK",
        format: true,
        formats: formats,
        fsize: true,
        fsizes: fsizes,
        funit: "px",
        color: true,
        linktypes: linktypes,
        b: true,
        i: true,
        u: true,
        ol: true,
        ul: true,
        sub: true,
        sup: true,
        outdent: true,
        indent: true,
        left: true,
        center: true,
        right: true,
        strike: true,
        link: true,
        unlink: true,
        remove: true,
        rule: true,
        source: true,
        placeholder: false,
        br: true,
        p: true,
        change: "",
        focus: "",
        blur: ""
    }, options);
    let thisBrowser = navigator.userAgent.toLowerCase();
    if (/msie [1-7]./.test(thisBrowser)) vars.title = false;
    let buttons = [];
    function addParams(name, command, key, tag, emphasis) {
        let thisCssNo = buttons.length + 1;
        return buttons.push({
            name: name,
            cls: thisCssNo,
            command: command,
            key: key,
            tag: tag,
            emphasis: emphasis
        });
    }
    addParams("format", "formats", "", "", false);
    addParams("fsize", "fSize", "", "", false);
    addParams("color", "colors", "", "", false);
    addParams("b", "Bold", "B", [ "b", "strong" ], true);
    addParams("i", "Italic", "I", [ "i", "em" ], true);
    addParams("u", "Underline", "U", [ "u" ], true);
    addParams("ol", "insertorderedlist", "¾", [ "ol" ], true);
    addParams("ul", "insertunorderedlist", "¼", [ "ul" ], true);
    addParams("sub", "subscript", "(", [ "sub" ], true);
    addParams("sup", "superscript", "&", [ "sup" ], true);
    addParams("outdent", "outdent", "%", [ "blockquote" ], false);
    addParams("indent", "indent", "'", [ "blockquote" ], true);
    addParams("left", "justifyLeft", "", "", false);
    addParams("center", "justifyCenter", "", "", false);
    addParams("right", "justifyRight", "", "", false);
    addParams("strike", "strikeThrough", "K", [ "strike" ], true);
    addParams("link", "linkcreator", "L", [ "a" ], true);
    addParams("unlink", "unlink", "", [ "a" ], false);
    addParams("remove", "removeformat", ".", "", false);
    addParams("rule", "inserthorizontalrule", "H", [ "hr" ], false);
    addParams("source", "displaysource", "", "", false);
    return {
        init() {
            if (!self.dataset.jste || self.dataset.jste == null || self.dataset.jste == "undefined") self.dataset.jste = true; else self.dataset.jste = false;
            if (!vars.status || self.dataset.jste.toLowerCase() == "false") {
                if (self.closest("." + vars.css).length > 0) {
                    let editorValue = self.closest("." + vars.css).querySelector("." + vars.css + "_editor").innerHTML;
                    let thisElementAttrs = "";
                    Array.prototype.forEach.call(self.attributes, function() {
                        if (this.nodeName != "style") thisElementAttrs = thisElementAttrs + " " + this.nodeName + '="' + this.nodeValue + '"';
                    });
                    let thisElementTag = self.matches("[data-origin]") && self.getAttribute("data-origin") != "" ? self.getAttribute("data-origin") : "textarea";
                    let createValue = ">" + editorValue;
                    if (thisElementTag == "input" || thisElementTag == "option") {
                        editorValue = editorValue.replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        createValue = 'value="' + editorValue + '">';
                    }
                    let thisClone = self.cloneNode();
                    self.dataset.jste = false;
                    self.closest("." + vars.css).insertAdjacentHTML("beforeend", thisClone).remove();
                    thisClone.outerHTML = "<" + thisElementTag + thisElementAttrs + createValue + "</" + thisElementTag + ">";
                }
                return;
            }
            let thisElement = self;
            let thisElementTag = self.tagName.toLowerCase();
            self.setAttribute("data-origin", thisElementTag);
            let thisElementVal = self.matches("[value]") || thisElementTag == "textarea" ? self.value : self.innerHTML;
            thisElementVal = thisElementVal.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
            self.insertAdjacentHTML("afterend", '<div class="' + vars.css + '"></div>');
            let JSTEContainer = self.next("." + vars.css);
            JSTEContainer.innerHTML = '<div class="' + vars.css + "_toolbar" + '" role="toolbar" unselectable></div><div class="' + vars.css + '_linkform" style="display:none" role="dialog"></div><div class="' + vars.css + "_editor" + '"></div>';
            let toolbar = JSTEContainer.querySelector("." + vars.css + "_toolbar");
            let linkform = JSTEContainer.querySelector("." + vars.css + "_linkform");
            let editor = JSTEContainer.querySelector("." + vars.css + "_editor");
            let emphasize = vars.css + "_tool_depressed";
            linkform.insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_linktypeselect" unselectable></div><input class="' + vars.css + '_linkinput" type="text/css" value=""><div class="' + vars.css + '_linkbutton" unselectable>' + vars.button + '</div> <div style="height:1px;float:none;clear:both"></div>');
            let linktypeselect = linkform.querySelector("." + vars.css + "_linktypeselect");
            let linkinput = linkform.querySelector("." + vars.css + "_linkinput");
            let linkbutton = linkform.querySelector("." + vars.css + "_linkbutton");
            linktypeselect.insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_linktypeview" unselectable></div><div class="' + vars.css + '_linktypes" role="menu" unselectable></div>');
            let linktypes = linktypeselect.querySelector("." + vars.css + "_linktypes");
            let linktypeview = linktypeselect.querySelector("." + vars.css + "_linktypeview");
            let setdatalink = vars.css + "-setlink";
            editor.insertAdjacentHTML("afterend", '<div class="' + vars.css + "_source " + vars.css + '_hiddenField"></div>');
            let sourceField = JSTEContainer.querySelector("." + vars.css + "_source");
            sourceField.appendChild(thisElement);
            if (thisElementTag != "textarea") {
                let thisElementAttrs = "";
                Array.prototype.forEach.call(thisElement.attributes, function() {
                    if (this.nodeName != "type" && this.nodeName != "value") thisElementAttrs = thisElementAttrs + " " + this.nodeName + '="' + this.nodeValue + '"';
                });
                thisElement.outerHTML = "<textarea " + thisElementAttrs + ">" + thisElementVal + "</textarea>";
                thisElement = sourceField.querySelector("textarea");
            }
            editor.setAttribute("contenteditable", "true");
            editor.innerHTML = thisElementVal;
            for (let n = 0; n < buttons.length; n++) {
                if (vars[buttons[n].name]) {
                    let buttonHotkey = buttons[n].key.length > 0 ? vars.titletext[n].hotkey != null && vars.titletext[n].hotkey != "undefined" && vars.titletext[n].hotkey != "" ? " (Ctrl+" + vars.titletext[n].hotkey + ")" : "" : "";
                    let buttonTitle = vars.titletext[n].title != null && vars.titletext[n].title != "undefined" && vars.titletext[n].title != "" ? vars.titletext[n].title + buttonHotkey : "";
                    toolbar.insertAdjacentHTML("beforeend", '<div class="' + vars.css + "_tool " + vars.css + "_tool_" + buttons[n].cls + '" role="button" data-tool="' + n + '" unselectable><a class="' + vars.css + '_tool_icon" unselectable></a></div>');
                    let btnTool = toolbar.querySelector("." + vars.css + '_tool[data-tool="' + n + '"]');
                    btnTool.dataset.tag = buttons[n].tag;
                    btnTool.dataset.command = buttons[n].command;
                    btnTool.dataset.emphasis = buttons[n].emphasis;
                    btnTool.dataset.title = buttonTitle;
                    if (buttons[n].name == "format" && Array.isArray(vars.formats)) {
                        let toolLabel = vars.formats[0][1].length > 0 && vars.formats[0][1] != "undefined" ? vars.formats[0][1] : "";
                        toolbar.querySelector("." + vars.css + "_tool_" + buttons[n].cls).querySelector("." + vars.css + "_tool_icon").outerHTML = '<a class="' + vars.css + '_tool_label" unselectable><span class="' + vars.css + '_tool_text" unselectable>' + toolLabel + '</span><span class="' + vars.css + '_tool_icon" unselectable></span></a>';
                        toolbar.querySelector("." + vars.css + "_tool_" + buttons[n].cls).insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_formats" unselectable></div>');
                        for (let f = 0; f < vars.formats.length; f++) {
                            toolbar.querySelector("." + vars.css + "_formats").insertAdjacentHTML("beforeend", "<a " + vars.css + '-formatval="' + vars.formats[f][0] + '" class="' + vars.css + "_format" + " " + vars.css + "_format_" + f + '" role="menuitem" unselectable>' + vars.formats[f][1] + "</a>");
                        }
                        toolbar.querySelectorAll("." + vars.css + "_formats").forEach(function(el) {
                            el.dataset.status = false;
                        });
                    } else if (buttons[n].name == "fsize" && Array.isArray(vars.fsizes)) {
                        toolbar.querySelector("." + vars.css + "_tool_" + buttons[n].cls).insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_fontsizes" unselectable></div>');
                        for (let f = 0; f < vars.fsizes.length; f++) {
                            toolbar.querySelector("." + vars.css + "_fontsizes").insertAdjacentHTML("beforeend", "<a " + vars.css + '-styleval="' + vars.fsizes[f] + '" class="' + vars.css + "_fontsize" + '" style="font-size:' + vars.fsizes[f] + vars.funit + '" role="menuitem" unselectable>Abcdefgh...</a>');
                        }
                    } else if (buttons[n].name == "color" && Array.isArray(colors)) {
                        toolbar.querySelector("." + vars.css + "_tool_" + buttons[n].cls).insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_cpalette" unselectable></div>');
                        for (let c = 0; c < colors.length; c++) {
                            if (colors[c] != null) toolbar.querySelector("." + vars.css + "_cpalette").insertAdjacentHTML("beforeend", "<a " + vars.css + '-styleval="' + colors[c] + '" class="' + vars.css + "_color" + '" style="background-color: rgb(' + colors[c] + ')" role="gridcell" unselectable></a>'); else toolbar.querySelector("." + vars.css + "_cpalette").insertAdjacentHTML("beforeend", '<div class="' + vars.css + "_colorSeperator" + '"></div>');
                        }
                    }
                }
            }
            linktypes.dataset.linktype = "0";
            for (let n = 0; n < 3; n++) {
                linktypes.insertAdjacentHTML("beforeend", "<a " + vars.css + '-linktype="' + n + '" unselectable>' + vars.linktypes[n] + "</a>");
                linktypeview.innerHTML = '<div class="' + vars.css + '_linktypearrow" unselectable></div><div class="' + vars.css + '_linktypetext">' + linktypes.querySelectorAll("a")[linktypes.dataset.linktype].textContent + "</div>";
            }
            let prefixCss = "";
            if (/msie/.test(thisBrowser)) prefixCss = "-ms-"; else if (/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) prefixCss = "-webkit-"; else if (/mozilla/.test(thisBrowser)) prefixCss = "-moz-"; else if (/opera/.test(thisBrowser)) prefixCss = "-o-"; else if (/konqueror/.test(thisBrowser)) prefixCss = "-khtml-"; else prefixCss = "";
            if (vars.placeholder && vars.placeholder != "") {
                JSTEContainer.prepend('<div class="' + vars.css + '_placeholder" unselectable><div class="' + vars.css + '_placeholder_text">' + vars.placeholder + "</div></div>");
                let placeHolder = JSTEContainer.querySelector("." + vars.css + "_placeholder");
                placeHolder.addListener("click", function() {
                    editor.focus();
                });
            }
            JSTEContainer.querySelectorAll("[unselectable]").forEach(function(el) {
                el.style[prefixCss + "user-select"] = "none";
                el.classList.add("unselectable");
                el.setAttribute("unselectable", "on");
                [ "selectstart", "mousedown" ].forEach(function(e) {
                    el.removeListener(e);
                });
            });
            let toolbutton = toolbar.querySelectorAll("." + vars.css + "_tool");
            let formatbar = toolbar.querySelector("." + vars.css + "_formats");
            let fsizebar = toolbar.querySelector("." + vars.css + "_fontsizes");
            let cpalette = toolbar.querySelector("." + vars.css + "_cpalette");
            function selectionGet() {
                if (window.getSelection) return window.getSelection(); else if (document.selection && document.selection.createRange && document.selection.type != "None") return document.selection.createRange();
            }
            function selectionSet(addCommand, thirdParam) {
                let range, sel = selectionGet();
                if (window.getSelection) {
                    if (sel.anchorNode && sel.getRangeAt) range = sel.getRangeAt(0);
                    if (range) {
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    if (!thisBrowser.match(/msie/)) document.execCommand("StyleWithCSS", false, false);
                    document.execCommand(addCommand, false, thirdParam);
                } else if (document.selection && document.selection.createRange && document.selection.type != "None") {
                    range = document.selection.createRange();
                    range.execCommand(addCommand, false, thirdParam);
                }
                affectStyleAround(false, false);
            }
            function replaceSelection(tTag, tAttr, tVal) {
                if (editor.matches(":not(:focus)")) editor.focus();
                if (window.getSelection) {
                    let selObj = selectionGet(), selRange, newElement, documentFragment;
                    if (selObj.anchorNode && selObj.getRangeAt) {
                        selRange = selObj.getRangeAt(0);
                        newElement = document.createElement(tTag);
                        newElement.setAttribute(tAttr, tVal);
                        documentFragment = selRange.extractContents();
                        newElement.appendChild(documentFragment);
                        selRange.insertNode(newElement);
                        selObj.removeAllRanges();
                        if (tAttr == "style") affectStyleAround(newElement, tVal); else affectStyleAround(newElement, false);
                    }
                } else if (document.selection && document.selection.createRange && document.selection.type != "None") {
                    let range = document.selection.createRange();
                    let selectedText = range.htmlText;
                    let newText = "<" + tTag + " " + tAttr + '="' + tVal + '">' + selectedText + "</" + tTag + ">";
                    document.selection.createRange().pasteHTML(newText);
                }
            }
            let getSelectedNode = function() {
                let node, selection;
                if (window.getSelection) {
                    selection = getSelection();
                    node = selection.anchorNode;
                }
                if (!node && document.selection && document.selection.createRange && document.selection.type != "None") {
                    selection = document.selection;
                    let range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
                    node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0);
                }
                if (node) {
                    return node.nodeName == "#text" ? node.parentNode : node;
                } else return false;
            };
            function affectStyleAround(element, style) {
                let selectedTag = getSelectedNode();
                selectedTag = selectedTag ? selectedTag : element;
                if (selectedTag && style == false) {
                    if (selectedTag.parentNode.matches("[style]")) selectedTag.setAttribute("style", selectedTag.parentNode.getAttribute("style"));
                    if (selectedTag.matches("[style]")) selectedTag.querySelectorAll("*").forEach(function(el) {
                        el.setAttribute("style", selectedTag.getAttribute("style"));
                    });
                } else if (element && style && element.matches("[style]")) {
                    let styleKey = style.split(";");
                    styleKey = styleKey[0].split(":");
                    if (element.matches('[style*="' + styleKey[0] + '"]')) element.querySelectorAll("*").forEach(function(el) {
                        el.style[styleKey[0]] = styleKey[1];
                    });
                    selectText(element);
                }
            }
            function selectText(element) {
                if (element) {
                    if (document.body.createTextRange) {
                        let range = document.body.createTextRange();
                        range.moveToElementText(element);
                        range.select();
                    } else if (window.getSelection) {
                        let selection = window.getSelection();
                        let range = document.createRange();
                        if (element != "undefined" && element != null) {
                            range.selectNodeContents(element);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            if (element.matches(":empty")) {
                                element.insertAdjacentHTML("beforeend", "&nbsp;");
                                selectText(element);
                            }
                        }
                    }
                }
            }
            function selected2link() {
                if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened == "false") {
                    let selectedTag = getSelectedNode();
                    let thisHrefLink = "http://";
                    linkAreaSwitch(true);
                    if (selectedTag) {
                        let thisTagName = selectedTag.tagName.toLowerCase();
                        if (thisTagName == "a" && selectedTag.matches("[href]")) {
                            thisHrefLink = selectedTag.getAttribute("href");
                            selectedTag.setAttribute(setdatalink, "");
                        } else replaceSelection("a", setdatalink, "");
                    } else linkinput.value = thisHrefLink;
                    linkinput.focus();
                    linktypeselect.addListener("click", function(e) {
                        if (e.target.classList.contains(vars.css + "_linktypetext") || e.target.classList.contains(vars.css + "_linktypearrow")) linktypeSwitch(true);
                    });
                    linktypes.querySelectorAll("a").forEach(function(el) {
                        el.addListener("click", function() {
                            let thisLinkType = this.getAttribute(vars.css + "-linktype");
                            linktypes.dataset.linktype = thisLinkType;
                            linktypeview.querySelector("." + vars.css + "_linktypetext").innerHTML = linktypes.querySelectorAll("a")[linktypes.dataset.linktype].textContent;
                            linkInputSet(thisHrefLink);
                            linktypeSwitch();
                        });
                    });
                    linkInputSet(thisHrefLink);
                    linkinput.focus();
                    linkinput.value = thisHrefLink;
                    [ "keypress", "keyup" ].forEach(function(eventType) {
                        linkinput.addListener(eventType, function(e) {
                            if (e.keyCode == 13) {
                                linkRecord(JSTEContainer.querySelector("[" + setdatalink + "]"));
                                return false;
                            }
                        });
                    });
                    linkbutton.addListener("click", function() {
                        linkRecord(JSTEContainer.querySelector("[" + setdatalink + "]"));
                        return false;
                    });
                } else linkAreaSwitch(false);
            }
            function linkRecord(thisSelection) {
                linkinput.focus();
                selectText(thisSelection);
                if (thisSelection !== undefined && thisSelection) thisSelection.removeAttribute(setdatalink);
                if (linktypes.dataset.linktype != "2") selectionSet("createlink", linkinput.value); else {
                    selectionSet("insertImage", linkinput.value);
                    editor.querySelectorAll("img").forEach(function(el) {
                        let emptyPrevLinks = el.prev("a");
                        let emptyNextLinks = el.next("a");
                        if (emptyPrevLinks && emptyPrevLinks.innerHTML == "") emptyPrevLinks.remove(); else if (emptyNextLinks && emptyNextLinks.innerHTML == "") emptyNextLinks.remove();
                    });
                }
                linkAreaSwitch();
                editor.dispatchEvent(new Event("change"));
            }
            function linkAreaSwitch(status) {
                clearSetElement("[" + setdatalink + "]:not([href])");
                JSTEContainer.querySelectorAll("[" + setdatalink + "][href]").forEach(function(el) {
                    el.removeAttribute(setdatalink);
                });
                if (status) {
                    toolbar.dataset.linkOpened = true;
                    linkform.style.display = "";
                } else {
                    toolbar.dataset.linkOpened = false;
                    linkform.style.display = "none";
                }
                linktypeSwitch();
            }
            function linktypeSwitch(status) {
                if (status) linktypes.style.display = ""; else linktypes.style.display = "none";
            }
            function linkInputSet(thisHrefLink) {
                let currentType = linktypes.dataset.linktype;
                if (currentType == "1" && (linkinput.value == "http://" || linkinput.matches('[value^="http://"]') || !linkinput.matches('[value^="mailto"]'))) linkinput.value = "mailto:"; else if (currentType != "1" && !linkinput.matches('[value^="http://"]')) linkinput.value = "http://"; else linkinput.value = thisHrefLink;
            }
            function selected2style(styleCommand) {
                if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened == "false") {
                    if (styleCommand == "fSize") styleField = fsizebar; else if (styleCommand == "colors") styleField = cpalette;
                    styleFieldSwitch(styleField, true);
                    styleField.querySelectorAll("a").forEach(function(el) {
                        el.removeAllListeners("click");
                        el.addListener("click", function() {
                            let styleValue = this.getAttribute(vars.css + "-styleval");
                            if (styleCommand == "fSize") {
                                styleType = "font-size";
                                styleValue = styleValue + vars.funit;
                            } else if (styleCommand == "colors") {
                                styleType = "color";
                                styleValue = "rgb(" + styleValue + ")";
                            }
                            let prevStyles = refuseStyle(styleType);
                            replaceSelection("span", "style", styleType + ":" + styleValue + ";" + prevStyles);
                            styleFieldSwitch("", false);
                            document.querySelectorAll("." + vars.css + "_title").forEach(function(el) {
                                el.remove();
                            });
                            editor.dispatchEvent(new Event("change"));
                        });
                    });
                } else styleFieldSwitch(styleField, false);
                linkAreaSwitch(false);
            }
            function styleFieldSwitch(styleField, status) {
                let mainData = "", allData = [ {
                    d: "fsizeOpened",
                    f: fsizebar
                }, {
                    d: "cpallOpened",
                    f: cpalette
                } ];
                if (styleField != "") {
                    for (let si = 0; si < allData.length; si++) {
                        if (styleField == allData[si]["f"]) mainData = allData[si];
                    }
                }
                if (status) {
                    toolbar.dataset[mainData["d"]] = true;
                    mainData["f"].slideDown(100);
                    for (let si = 0; si < allData.length; si++) {
                        if (mainData["d"] != allData[si]["d"]) {
                            toolbar.dataset[allData[si]["d"]] = false;
                            allData[si]["f"].slideUp(100);
                        }
                    }
                } else {
                    for (let si = 0; si < allData.length; si++) {
                        toolbar.dataset[allData[si]["d"]] = false;
                        allData[si]["f"].slideUp(100);
                    }
                }
            }
            function clearSetElement(elem) {
                JSTEContainer.querySelectorAll(elem).forEach(function(el) {
                    el.insertAdjacentHTML("beforebegin", el.innerHTML);
                    el.remove();
                });
            }
            function refuseStyle(refStyle) {
                let selectedTag = getSelectedNode();
                if (selectedTag && selectedTag.matches("[style]") && selectedTag.style[refStyle] != "") {
                    let refValue = selectedTag.style[refStyle];
                    selectedTag.style[refStyle] = "";
                    let cleanStyle = selectedTag.getAttribute("style");
                    selectedTag.style[refStyle] = refValue;
                    return cleanStyle;
                } else return "";
            }
            function selected2format() {
                formatFieldSwitch(true);
                formatbar.querySelectorAll("a").forEach(function(el) {
                    el.addListener("click", function() {
                        this.querySelectorAll("*").forEach(function(el) {
                            el.addListener("click", function(e) {
                                e.preventDefault();
                                return false;
                            });
                        });
                        formatLabelView(this.textContent);
                        let formatValue = this.getAttribute(vars.css + "-formatval");
                        selectionSet("formatBlock", "<" + formatValue + ">");
                        formatFieldSwitch(false);
                    });
                });
            }
            function formatFieldSwitch(status) {
                let thisStatus = status ? true : false;
                thisStatus = status && (formatbar.dataset.status !== undefined && formatbar.dataset.status.toLowerCase() == "true") ? true : false;
                if (thisStatus || !status) {
                    formatbar.dataset.status = false;
                    formatbar.slideUp(200);
                } else {
                    formatbar.dataset.status = true;
                    formatbar.slideDown(200);
                }
            }
            function formatLabelView(str) {
                let formatLabel = formatbar.closest("." + vars.css + "_tool").querySelector("." + vars.css + "_tool_label").querySelector("." + vars.css + "_tool_text");
                if (str.length > 10) str = str.substr(0, 7) + "...";
                formatLabel.innerHTML = str;
            }
            function extractToText(strings) {
                let htmlContent, htmlPattern, htmlReplace;
                htmlContent = strings.replace(/\n/gim, "").replace(/\r/gim, "").replace(/\t/gim, "").replace(/&nbsp;/gim, " ");
                htmlPattern = [ /\<span(|\s+.*?)><span(|\s+.*?)>(.*?)<\/span><\/span>/gim, /<(\w*[^p])\s*[^\/>]*>\s*<\/\1>/gim, /\<div(|\s+.*?)>(.*?)\<\/div>/gim, /\<strong(|\s+.*?)>(.*?)\<\/strong>/gim, /\<em(|\s+.*?)>(.*?)\<\/em>/gim ];
                htmlReplace = [ "<span$2>$3</span>", "", "<p$1>$2</p>", "<b$1>$2</b>", "<i$1>$2</i>" ];
                for (c = 0; c < 5; c++) {
                    for (let i = 0; i < htmlPattern.length; i++) {
                        htmlContent = htmlContent.replace(htmlPattern[i], htmlReplace[i]);
                    }
                }
                if (!vars.p) htmlContent = htmlContent.replace(/\<p(|\s+.*?)>(.*?)\<\/p>/gi, "<br/>$2");
                if (!vars.br) {
                    htmlPattern = [ /\<br>(.*?)/gi, /\<br\/>(.*?)/gi ];
                    htmlReplace = [ "<p>$1</p>", "<p>$1</p>" ];
                    for (let i = 0; i < htmlPattern.length; i++) {
                        htmlContent = htmlContent.replace($htmlPattern[i], htmlReplace[i]);
                    }
                }
                if (!vars.p && !vars.br) htmlContent = htmlContent.replace(/\<p>(.*?)\<\/p>/gi, "<div>$1</div>");
                return htmlContent;
            }
            function postToSource() {
                let sourceStrings = editor.textContent == "" && editor.innerHTML.length < 12 ? "" : editor.innerHTML;
                thisElement.value = extractToText(sourceStrings);
            }
            function postToEditor() {
                editor.innerHTML = extractToText(thisElement.value);
            }
            function detectElement(tags) {
                let resultdetect = false, node = getSelectedNode(), parentsTag;
                if (node) {
                    tags.forEach(function(i, val) {
                        parentsTag = node.tagName.toLowerCase();
                        if (parentsTag == val) resultdetect = true; else {
                            node.parents().forEach(function(el) {
                                parentsTag = el.tagName.toLowerCase();
                                if (parentsTag == val) resultdetect = true;
                            });
                        }
                    });
                    return resultdetect;
                } else return false;
            }
            function buttonEmphasize(e) {
                for (let n = 0; n < buttons.length; n++) {
                    if (vars[buttons[n].name] && buttons[n].emphasis && buttons[n].tag != "") detectElement(buttons[n].tag) ? toolbar.querySelectorAll("." + vars.css + "_tool_" + buttons[n].cls).forEach(function(el) {
                        el.classList.add(emphasize);
                    }) : document.querySelector("." + vars.css + "_tool_" + buttons[n].cls).classList.remove(emphasize);
                }
                if (vars.format && Array.isArray(vars.formats)) {
                    let isFoundFormat = false;
                    for (let f = 0; f < vars.formats.length; f++) {
                        let thisFormat = [];
                        thisFormat[0] = vars.formats[f][0];
                        if (vars.formats[f][0].length > 0 && detectElement(thisFormat)) {
                            formatLabelView(vars.formats[f][1]);
                            isFoundFormat = true;
                            break;
                        }
                    }
                    if (!isFoundFormat) formatLabelView(vars.formats[0][1]);
                }
                styleFieldSwitch("", false);
                formatFieldSwitch(false);
            }
            toolbutton.forEach(function(el) {
                el.removeAllListeners("click");
                el.addListener("click", function(e) {
                    if (this.dataset.command == "displaysource" && (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened == "false")) {
                        toolbar.querySelector("." + vars.css + "_tool").classList.add(vars.css + "_hiddenField");
                        this.classList.remove(vars.css + "_hiddenField");
                        toolbar.dataset.sourceOpened = true;
                        thisElement.style.height = editor.outerHeight;
                        sourceField.classList.remove(vars.css + "_hiddenField");
                        editor.classList.add(vars.css + "_hiddenField");
                        thisElement.focus();
                        linkAreaSwitch(false);
                        styleFieldSwitch("", false);
                        formatFieldSwitch();
                        if (vars.placeholder && vars.placeholder != "") placeHolder.style.display = "none";
                    } else {
                        if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened == "false") {
                            if (this.dataset.command == "linkcreator") {
                                if (toolbar.dataset.linkOpened === undefined || toolbar.dataset.linkOpened == "false") selected2link(); else {
                                    linkAreaSwitch(false);
                                    formatFieldSwitch(false);
                                }
                            } else if (this.dataset.command == "formats") {
                                if (this.dataset.command == "formats" && !e.target.classList.contains(vars.css + "_format")) selected2format();
                                styleFieldSwitch("", false);
                                if (editor.matches(":not(:focus)")) editor.focus();
                            } else if (this.dataset.command == "fSize" || this.dataset.command == "colors") {
                                if (this.dataset.command == "fSize" && !e.target.classList.contains(vars.css + "_fontsize") || this.dataset.command == "colors" && !e.target.classList.contains(vars.css + "_color")) selected2style(this.dataset.command);
                                formatFieldSwitch(false);
                                if (editor.matches(":not(:focus)")) editor.focus();
                            } else {
                                if (editor.matches(":not(:focus)")) editor.focus();
                                selectionSet(this.dataset.command, null);
                                styleFieldSwitch("", false);
                                formatFieldSwitch(false);
                                linktypeSwitch();
                                this.dataset.emphasis !== undefined && this.dataset.emphasis.toLowerCase() == "true" && !this.classList.contains(emphasize) ? this.classList.add(emphasize) : this.classList.remove(emphasize);
                                sourceField.classList.add(vars.css + "_hiddenField");
                                editor.classList.remove(vars.css + "_hiddenField");
                            }
                        } else {
                            toolbar.dataset.sourceOpened = false;
                            toolbar.querySelectorAll("." + vars.css + "_tool").forEach(function(el) {
                                el.classList.remove(vars.css + "_hiddenField");
                            });
                            sourceField.classList.add(vars.css + "_hiddenField");
                            editor.classList.remove(vars.css + "_hiddenField");
                        }
                        if (vars.placeholder && vars.placeholder != "") editor.innerHTML != "" ? placeHolder.style.display = "none" : placeHolder.style.display = "";
                    }
                    editor.dispatchEvent(new Event("change"));
                });
                el.addListener("mouseover", function(e) {
                    if (vars.title && this.dataset.title != "" && (e.target.classList.contains(vars.css + "_tool") || e.target.classList.contains(vars.css + "_tool_icon"))) {
                        document.querySelectorAll("." + vars.css + "_title").forEach(function(el) {
                            el.remove();
                        });
                        JSTEContainer.insertAdjacentHTML("beforeend", '<div class="' + vars.css + '_title"><div class="' + vars.css + '_titleArrow"><div class="' + vars.css + '_titleArrowIcon"></div></div><div class="' + vars.css + '_titleText">' + this.dataset.title + "</div></div>");
                        let thisTitle = document.querySelector("." + vars.css + "_title");
                        let thisPosition = {
                            top: this.offsetTop,
                            left: this.offsetLeft
                        };
                        let thisAlignX = thisPosition.left + this.outerWidth - thisTitle.outerWidth / 2 - this.outerWidth / 2;
                        let thisAlignY = thisPosition.top + this.outerHeight + 5;
                        setTimeout(function() {
                            thisTitle.style.top = thisAlignY;
                            thisTitle.style.left = thisAlignX;
                            thisTitle.fadeIn(200);
                        }, 400);
                    }
                });
                el.addListener("mouseleave", function(e) {
                    document.querySelectorAll("." + vars.css + "_title").forEach(function(el) {
                        el.remove();
                    });
                });
            });
            let editorChangeTimer = null;
            [ "keypress", "keyup", "keydown", "drop", "cut", "copy", "paste", "DOMCharacterDataModified", "DOMSubtreeModified" ].forEach(function(eventType) {
                editor.addListener(eventType, function() {
                    if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened.toLowerCase() == "false") this.dispatchEvent(new Event("change"));
                    linktypeSwitch();
                    if (typeof vars.change === "function" && typeof vars.change.nodeType !== "number") vars.change();
                    if (vars.placeholder && vars.placeholder != "") this.textContent != "" ? placeHolder.style.display = "none" : placeHolder.style.display = "";
                });
            });
            editor.addListener("change", function() {
                if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened.toLowerCase() == "false") {
                    clearTimeout(editorChangeTimer);
                    editorChangeTimer = setTimeout(postToSource, 10);
                }
            });
            editor.addListener("keydown", function(e) {
                if (e.ctrlKey) {
                    for (let n = 0; n < buttons.length; n++) {
                        if (vars[buttons[n].name] && e.keyCode == buttons[n].key.charCodeAt(0)) {
                            if (buttons[n].command != "" && buttons[n].command != "linkcreator") selectionSet(buttons[n].command, null); else if (buttons[n].command == "linkcreator") selected2link();
                            return false;
                        }
                    }
                }
            });
            [ "mouseup", "keyup" ].forEach(function(event) {
                editor.addListener(event, buttonEmphasize);
            });
            editor.addListener("focus", function() {
                if (typeof vars.focus === "function" && typeof vars.focus.nodeType !== "number") vars.focus();
                JSTEContainer.classList.add(vars.css + "_focused");
                if (/opera/.test(thisBrowser)) {
                    let range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    let selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            });
            editor.addListener("focusout", function() {
                toolbutton.forEach(function(el) {
                    el.classList.remove(emphasize);
                });
                styleFieldSwitch("", false);
                formatFieldSwitch(false);
                linktypeSwitch();
                if (typeof vars.blur === "function" && typeof vars.blur.nodeType !== "number") vars.blur();
                JSTEContainer.classList.remove(vars.css + "_focused");
                if (Array.isArray(vars.formats)) formatLabelView(vars.formats[0][1]);
            });
            [ "keydown", "keyup" ].forEach(function(event) {
                thisElement.addListener(event, function() {
                    setTimeout(postToEditor, 0);
                    this.style.height = this.scrollHeight;
                    if (this.value == "") this.style.height = 0;
                });
            });
            thisElement.addListener("focus", function() {
                JSTEContainer.classList.add(vars.css + "_focused");
            });
            thisElement.addListener("focusout", function() {
                JSTEContainer.classList.remove(vars.css + "_focused");
            });
            this.container = JSTEContainer;
            return this;
        }
    };
};
//# sourceMappingURL=jste.all.js.map