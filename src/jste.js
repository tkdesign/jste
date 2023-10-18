/*!
 * 
 * JavaScript Text Editor, https://github.com/tkdesign/jste
 * 
*/

const jste = function (selector, options = {}, context = document) {
    const self = context.querySelector(selector);

    // default titles of buttons
    const varsTitle = [
        {title: "Text Format"},
        {title: "Font Size"},
        {title: "Color"},
        {title: "Bold", hotkey: "B"},
        {title: "Italic", hotkey: "I"},
        {title: "Underline", hotkey: "U"},
        {title: "Ordered List", hotkey: "."},
        {title: "Unordered List", hotkey: ","},
        {title: "Subscript", hotkey: "down arrow"},
        {title: "Superscript", hotkey: "up arrow"},
        {title: "Outdent", hotkey: "left arrow"},
        {title: "Indent", hotkey: "right arrow"},
        {title: "Justify Left"},
        {title: "Justify Center"},
        {title: "Justify Right"},
        {title: "Strike Through", hotkey: "K"},
        {title: "Add Link", hotkey: "L"},
        {title: "Remove Link"},
        {title: "Cleaner Style", hotkey: "Delete"},
        {title: "Horizontal Rule", hotkey: "H"},
        {title: "Source"}
    ];

    // default text formats
    const formats = [["p", "Normal"], ["h1", "Header 1"], ["h2", "Header 2"], ["h3", "Header 3"], ["h4", "Header 4"], ["h5", "Header 5"], ["h6", "Header 6"], ["pre", "Preformatted"]];

    // default font sizes
    const fsizes = ["10", "12", "16", "18", "20", "24", "28"];

    // default rgb values of colors
    const colors = [
        "0,0,0", "68,68,68", "102,102,102", "153,153,153", "204,204,204", "238,238,238", "243,243,243", "255,255,255",
        null,
        "255,0,0", "255,153,0", "255,255,0", "0,255,0", "0,255,255", "0,0,255", "153,0,255", "255,0,255",
        null,
        "244,204,204", "252,229,205", "255,242,204", "217,234,211", "208,224,227", "207,226,243", "217,210,233", "234,209,220",
        "234,153,153", "249,203,156", "255,229,153", "182,215,168", "162,196,201", "159,197,232", "180,167,214", "213,166,189",
        "224,102,102", "246,178,107", "255,217,102", "147,196,125", "118,165,175", "111,168,220", "142,124,195", "194,123,160",
        "204,0,0", "230,145,56", "241,194,50", "106,168,79", "69,129,142", "61,133,198", "103,78,167", "166,77,121",
        "153,0,0", "180,95,6", "191,144,0", "56,118,29", "19,79,92", "11,83,148", "53,28,117", "116,27,71",
        "102,0,0", "120,63,4", "127,96,0", "39,78,19", "12,52,61", "7,55,99", "32,18,77", "76,17,48"
    ];

    // default link-type names
    const defaultLinkTypes = ["Web Address", "E-mail Address", "Picture URL"];

    let vars = Object.assign({
        // options
        'status': true,
        'css': "jste",
        'title': true,
        'titletext': varsTitle,
        'button': "OK",
        'format': true,
        'formats': formats,
        'fsize': true,
        'fsizes': fsizes,
        'funit': "px",
        'color': true,
        'linktypes': defaultLinkTypes,
        'b': true,
        'i': true,
        'u': true,
        'ol': true,
        'ul': true,
        'sub': true,
        'sup': true,
        'outdent': true,
        'indent': true,
        'left': true,
        'center': true,
        'right': true,
        'strike': true,
        'link': true,
        'unlink': true,
        'remove': true,
        'rule': true,
        'source': true,
        'placeholder': false,
        'br': true,
        'p': true,

        // events
        'change': "",
        'focus': "",
        'blur': ""
    }, options);

    // browser information is received
    const thisBrowser = navigator.userAgent.toLowerCase();

    // if browser is ie and its version is 7 or even older, close title property
    if (/msie [1-7]./.test(thisBrowser))
        vars.title = false;

    let buttons = [];

    // insertion function for parameters to toolbar
    function addParams(name, command, key, tag, emphasis) {
        const thisCssNo = buttons.length + 1;
        return buttons.push({name: name, cls: thisCssNo, command: command, key: key, tag: tag, emphasis: emphasis});
    }

    // add parameters for toolbar buttons
    addParams('format', 'formats', '', '', false); // text format button  --> no hotkey
    addParams('fsize', 'fSize', '', '', false); // font size button --> no hotkey
    addParams('color', 'colors', '', '', false); // text color button  --> no hotkey
    addParams('b', 'Bold', 'B', ["b", "strong"], true); // bold --> ctrl + b
    addParams('i', 'Italic', 'I', ["i", "em"], true); // italic --> ctrl + i
    addParams('u', 'Underline', 'U', ["u"], true); // underline --> ctrl + u
    addParams('ol', 'insertorderedlist', '¾', ["ol"], true); // ordered list --> ctrl + .(dot)
    addParams('ul', 'insertunorderedlist', '¼', ["ul"], true); // unordered list --> ctrl + ,(comma)
    addParams('sub', 'subscript', '(', ["sub"], true); // sub script --> ctrl + down arrow
    addParams('sup', 'superscript', '&', ["sup"], true); // super script --> ctrl + up arrow
    addParams('outdent', 'outdent', '%', ["blockquote"], false); // outdent --> ctrl + left arrow
    addParams('indent', 'indent', '\'', ["blockquote"], true); // indent --> ctrl + right arrow
    addParams('left', 'justifyLeft', '', '', false); // justify Left --> no hotkey
    addParams('center', 'justifyCenter', '', '', false); // justify center --> no hotkey
    addParams('right', 'justifyRight', '', '', false); // justify right --> no hotkey
    addParams('strike', 'strikeThrough', 'K', ["strike"], true); // strike through --> ctrl + K
    addParams('link', 'linkcreator', 'L', ["a"], true); // insertion link  --> ctrl + L
    addParams('unlink', 'unlink', '', ["a"], false); // remove link --> ctrl + N
    addParams('remove', 'removeformat', '.', '', false); // remove all styles --> ctrl + delete
    addParams('rule', 'inserthorizontalrule', 'H', ["hr"], false); // insertion horizontal rule --> ctrl + H
    addParams('source', 'displaysource', '', '', false); // feature of displaying source

    // get the selected text as plain format
    function selectionGet() {
        // for webkit, mozilla, opera
        if (window.getSelection)
            return window.getSelection();
        // for ie
        else if (document.selection && document.selection.createRange && document.selection.type !== "None")
            return document.selection.createRange();
    }

    // the function of changing to the selected text with "execCommand" method
    function selectionSet(addCommand, thirdParam) {
        let range,
            sel = selectionGet();

        // for webkit, mozilla, opera
        if (window.getSelection) {
            if (sel.anchorNode && sel.getRangeAt)
                range = sel.getRangeAt(0);

            if (range) {
                sel.removeAllRanges();
                sel.addRange(range);
            }

            if (!thisBrowser.match(/msie/))
                document.execCommand('StyleWithCSS', false, false);

            document.execCommand(addCommand, false, thirdParam);
        }

        // for ie
        else if (document.selection && document.selection.createRange && document.selection.type !== "None") {
            range = document.selection.createRange();
            range.execCommand(addCommand, false, thirdParam);
        }

        // change styles to around tags
        affectStyleAround(false, false);
    }

    // the function of changing to the selected text with tags and tags attributes
    function replaceSelection(tTag, tAttr, tVal) {

        // first, prevent to conflict of different jste editors
        if (editor.matches(':not(:focus)'))
            editor.focus();

        // for webkit, mozilla, opera
        if (window.getSelection) {
            const selObj = selectionGet();
            let selRange, newElement, documentFragment;

            if (selObj.anchorNode && selObj.getRangeAt) {
                selRange = selObj.getRangeAt(0);

                // create to new element
                newElement = document.createElement(tTag);

                // add the attribute to the new element
                newElement.setAttribute(tAttr, tVal);

                // extract to the selected text
                documentFragment = selRange.extractContents();

                // add the contents to the new element
                newElement.appendChild(documentFragment);

                selRange.insertNode(newElement);
                selObj.removeAllRanges();

                // if the attribute is "style", change styles to around tags
                if (tAttr === "style")
                    affectStyleAround(newElement, tVal);
                // for other attributes
                else
                    affectStyleAround(newElement, false);
            }
        }
        // for ie
        else if (document.selection && document.selection.createRange && document.selection.type !== "None") {
            let range = document.selection.createRange();
            let selectedText = range.htmlText;

            let newText = '<' + tTag + ' ' + tAttr + '="' + tVal + '">' + selectedText + '</' + tTag + '>';

            document.selection.createRange().pasteHTML(newText);
        }
    }

    // the function of getting to the parent tag
    let getSelectedNode = function () {
        let node, selection;
        if (window.getSelection) {
            selection = getSelection();
            node = selection.anchorNode;
        }
        if (!node && document.selection && document.selection.createRange && document.selection.type !== "None") {
            selection = document.selection;
            let range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
            node = range.commonAncestorContainer ? range.commonAncestorContainer :
                range.parentElement ? range.parentElement() : range.item(0);
        }
        if (node) {
            return (node.nodeName === "#text" ? node.parentNode : node);
        } else
            return false;
    };

    // the function of replacement styles to the around tags (parent and child)
    function affectStyleAround(element, style) {
        let selectedTag = getSelectedNode(); // the selected node

        selectedTag = selectedTag ? selectedTag : element;

        // (for replacement with execCommand) affect to child tags with parent tag's styles
        if (selectedTag && style === false) {
            // apply to the selected node with parent tag's styles
            if (selectedTag.parentNode.matches("[style]"))
                selectedTag.setAttribute("style", selectedTag.parentNode.getAttribute("style"));

            // apply to child tags with parent tag's styles
            if (selectedTag.matches("[style]"))
                selectedTag.querySelectorAll("*").forEach(function (el) {
                    el.setAttribute("style", selectedTag.getAttribute("style"));
                });
        }
        // (for replacement with html changing method)
        else if (element && style && element.matches("[style]")) {
            let styleKey = style.split(";"); // split the styles

            styleKey = styleKey[0].split(":"); // get the key of first style feature

            // apply to child tags with parent tag's styles
            if (element.matches('[style*="' + styleKey[0] + '"]'))
                element.querySelectorAll("*").forEach(function (el) {
                    el.style[styleKey[0]] = styleKey[1];
                });

            // select to the selected node again
            selectText(element);
        }
    }

    // the function of making selected to an element
    function selectText(element) {
        if (element) {
            //

            if (document.body.createTextRange) {
                let range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                let selection = window.getSelection();
                let range = document.createRange();

                if (element !== "undefined" && element != null) {
                    range.selectNodeContents(element);

                    selection.removeAllRanges();
                    selection.addRange(range);

                    if (element.matches(":empty")) {
                        element.insertAdjacentHTML('beforeend', "&nbsp;");
                        selectText(element);
                    }
                }
            }
        }
    }

    // the function of converting text to link
    function selected2link() {
        if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened === 'false') {
            let selectedTag = getSelectedNode(); // the selected node
            let thisHrefLink = "https://"; // default the input value of the link-form-field

            // display the link-form-field
            linkAreaSwitch(true);

            if (selectedTag) {

                let thisTagName = selectedTag.tagName.toLowerCase();

                // if tag name of the selected node is "a" and the selected node have "href" attribute
                if (thisTagName === "a" && selectedTag.matches('[href]')) {
                    thisHrefLink = selectedTag.getAttribute('href');

                    selectedTag.setAttribute(setdatalink, "");
                }
                // if it doesn't have "a" tag name
                else
                    replaceSelection("a", setdatalink, "");

            } else
                linkinput.value = thisHrefLink;
            linkinput.focus();

            // the method of displaying-hiding to link-types
            _addListener(linktypeselect, 'click', function (e) {
                if (e.target.classList.contains(vars.css + "_linktypetext") || e.target.classList.contains(vars.css + "_linktypearrow"))
                    linktypeSwitch(true);
            });

            // the method of selecting to link-types
            linktypes.querySelectorAll("a").forEach(function (el) {
                _addListener(el, 'click', function () {
                    linktypes.dataset.linktype = this.getAttribute(vars.css + "-linktype")

                    linktypeview.querySelector("." + vars.css + "_linktypetext").innerHTML = linktypes.querySelectorAll('a')[linktypes.dataset.linktype].textContent;

                    linkInputSet(thisHrefLink);

                    linktypeSwitch();
                });
            });

            linkInputSet(thisHrefLink);

            // the methods of link-input
            linkinput
                // auto focus
                .focus();
            // update to value
            linkinput.value = thisHrefLink;
            // the event of key to enter in link-input
            ["keypress", "keyup"].forEach(function (eventType) {
                _addListener(linkinput, eventType, function (e) {
                    if (e.keyCode === 13) {
                        linkRecord(JSTEContainer.querySelector("[" + setdatalink + "]"));
                        return false;
                    }
                });
            });
            // the event of click link-button
            _addListener(linkbutton, 'click', function () {
                linkRecord(JSTEContainer.querySelector("[" + setdatalink + "]"));
                return false;
            });
        } else
            // hide the link-form-field
            linkAreaSwitch(false);
    }

    /**
     * _prev() method.
     * @param {HTMLElement} element - The element to find the previous element for.
     * @param {string} selector - The selector string.
     * @returns {HTMLElement | null} - The previous element or null if nothing.
     */
    function _prev(element, selector) {
        const prevElem = element.previousElementSibling;
        if (!selector) {
            return prevElem;
        }
        if (prevElem && prevElem.matches(selector)) {
            return prevElem;
        }
        return null;
    }

    /**
     * _next() method.
     * @param {HTMLElement} element - The element to find the next element for.
     * @param {string} selector - The selector string.
     * @returns {HTMLElement | null} - The next element or null if nothing.
     */
    function _next(element, selector) {
        const nextElem = element.nextElementSibling;
        if (!selector) {
            return nextElem;
        }
        if (nextElem && nextElem.matches(selector)) {
            return nextElem;
        }
        return null;
    }

    function linkRecord(thisSelection) {
        // focus to link-input
        linkinput.focus();

        // select to the selected node
        selectText(thisSelection);

        // remove pre-link attribute (mark as "link will be added") of the selected node
        if (thisSelection !== undefined && thisSelection) thisSelection.removeAttribute(setdatalink);

        // if not selected to link-type of picture
        if (linktypes.dataset.linktype !== "2")
            selectionSet("createlink", linkinput.value); // insert link url of link-input to the selected node
        // if selected to link-type of picture
        else {
            selectionSet("insertImage", linkinput.value); // insert image url of link-input to the selected node

            // the method of all pictures in the editor
            editor.querySelectorAll("img").forEach(function (el) {
                let emptyPrevLinks = _prev(el, "a");
                let emptyNextLinks = _next(el, "a");

                // if "a" tags of the front and rear of the picture is empty, remove
                if (emptyPrevLinks && emptyPrevLinks.innerHTML === "")
                    emptyPrevLinks.remove();
                else if (emptyNextLinks && emptyNextLinks.innerHTML === "")
                    emptyNextLinks.remove();
            });
        }

        // hide the link-form-field
        linkAreaSwitch();

        // export contents of the text to the sources
        editor.dispatchEvent(new Event('change'));
    }

    // the function of switching link-form-field
    function linkAreaSwitch(status) {
        // remove all pre-link attribute (mark as "link will be added")
        clearSetElement("[" + setdatalink + "]:not([href])");
        JSTEContainer.querySelectorAll("[" + setdatalink + "][href]").forEach(function (el) {
            el.removeAttribute(setdatalink);
        });

        if (status) {
            toolbar.dataset.linkOpened = true;
            linkform.style.display = '';
        } else {
            toolbar.dataset.linkOpened = false;
            linkform.style.display = 'none';
        }

        linktypeSwitch();
    }

    // the function of switching link-type-selector
    function linktypeSwitch(status) {
        if (status)
            linktypes.style.display = '';
        else
            linktypes.style.display = 'none';
    }

    // the function of updating the link-input according to the link-type
    function linkInputSet(thisHrefLink) {
        let currentType = linktypes.dataset.linktype;

        // if selected type of e-mail
        if (currentType === "1" && (linkinput.value === "https://" || linkinput.matches('[value^="https://"]') || !linkinput.matches('[value^="mailto"]')))
            linkinput.value = "mailto:";
        else if (currentType !== "1" && !linkinput.matches('[value^="https://"]'))
            linkinput.value = "https://";
        else
            linkinput.value = thisHrefLink;
    }

    // the function of adding style to selected text
    function selected2style(styleCommand) {
        if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened === 'false') {

            // if selected to changing the font-size value
            if (styleCommand === "fSize") {
                styleField = fsizebar;
            }

            // if selected to changing the text-color value
            else if (styleCommand === "colors") {
                styleField = cpalette;
            }

            // display the style-field
            styleFieldSwitch(styleField, true);

            // the event of click to style button
            styleField.querySelectorAll("a").forEach(function (el) {
                _removeAllListeners(el, 'click');
                _addListener(el, 'click', function () {
                    let styleValue = this.getAttribute(vars.css + "-styleval"); // the property of style value to be added

                    // if selected to changing the font-size value
                    let styleType;
                    if (styleCommand === "fSize") {
                        styleType = "font-size";
                        styleValue = styleValue + vars.funit; // combine the value with size unit
                    }
                    // if selected to changing the text-color value
                    else if (styleCommand === "colors") {
                        styleType = "color";
                        styleValue = "rgb(" + styleValue + ")"; // combine color value with rgb
                    }

                    let prevStyles = refuseStyle(styleType); // affect styles to child tags (and extract to the new style attributes)

                    // change to selected text
                    replaceSelection("span", "style", styleType + ":" + styleValue + ";" + prevStyles);

                    // hide all style-fields
                    styleFieldSwitch("", false);

                    // remove title bubbles
                    document.querySelectorAll('.' + vars.css + '_title').forEach(function (el) {
                        el.remove();
                    });

                    // export contents of the text to the sources
                    editor.dispatchEvent(new Event('change'));
                });
            });
        } else
            // hide the style-field
            styleFieldSwitch(styleField, false);

        // hide the link-form-field
        linkAreaSwitch(false);
    }

    // the function of switching the style-field
    function styleFieldSwitch(styleField, status) {
        let mainData = "", // the style data of the actual wanted
            allData = [{"d": "fsizeOpened", "f": fsizebar}, {"d": "cpallOpened", "f": cpalette}]; // all style datas

        // if the style data of the actual wanted isn't empty
        if (styleField !== "") {
            // return to all datas and find the main data
            for (let si = 0; si < allData.length; si++) {
                if (styleField === allData[si]["f"]) {
                    mainData = allData[si];
                }
            }
        }
        // display the style-field
        if (status) {
            toolbar.dataset[mainData["d"]] = true; // stil seçme alanının açıldığını belirten parametre yaz
            _slideDown(mainData["f"], 100); // stil seçme alanını aç

            // return to all datas and close the fields of external datas
            for (let si = 0; si < allData.length; si++) {
                if (mainData["d"] !== allData[si]["d"]) {
                    toolbar.dataset[allData[si]["d"]] = false;
                    _slideUp(allData[si]["f"], 1000);
                }
            }
        }
        // hide all style-fields
        else {
            // return to all datas and close all style fields
            for (let si = 0; si < allData.length; si++) {
                toolbar.dataset[allData[si]["d"]] = false;
                _slideUp(allData[si]["f"], 100);
            }
        }
    }

    // the function of removing all pre-link attribute (mark as "link will be added")
    function clearSetElement(elem) {
        JSTEContainer.querySelectorAll(elem).forEach(function (el) {
            el.insertAdjacentHTML('beforebegin', el.innerHTML);
            el.remove();
        });
    }

    // the function of refusing some styles
    function refuseStyle(refStyle) {
        let selectedTag = getSelectedNode(); // the selected node

        // if the selected node have attribute of "style" and it has unwanted style
        if (selectedTag && selectedTag.matches("[style]") && selectedTag.style[refStyle] !== "") {
            let refValue = selectedTag.style[refStyle]; // first get key of unwanted style

            selectedTag.style[refStyle] = ""; // clear unwanted style

            let cleanStyle = selectedTag.getAttribute("style"); // cleaned style

            selectedTag.style[refStyle] = refValue; // add unwanted style to the selected node again

            return cleanStyle; // print cleaned style
        } else
            return "";
    }

    // the function of adding style to selected text
    function selected2format() {
        formatFieldSwitch(true);

        formatbar.querySelectorAll("a").forEach(function (el) {
            _addListener(el, 'click', function () {
                this.querySelectorAll("*").forEach(function (el) {
                    _addListener(el, 'click', function (e) {
                        e.preventDefault();
                        return false;
                    });
                });

                formatLabelView(this.textContent);

                let formatValue = this.getAttribute(vars.css + "-formatval"); // the type of format value

                // convert to selected format
                selectionSet("formatBlock", '<' + formatValue + '>');

                formatFieldSwitch(false);
            });
        });
    }

    // the function of switching the style-field
    function formatFieldSwitch(status) {
        let thisStatus;

        thisStatus = status && (formatbar.dataset.status !== undefined && formatbar.dataset.status.toLowerCase() === 'true');

        if (thisStatus || !status) {
            formatbar.dataset.status = 'false';
            _slideUp(formatbar, 200);
        } else {
            formatbar.dataset.status = 'true';
            _slideDown(formatbar, 200);
        }
    }

    // change format label
    function formatLabelView(str) {
        let formatLabel = formatbar.closest("." + vars.css + "_tool").querySelector("." + vars.css + "_tool_label").querySelector("." + vars.css + "_tool_text");

        if (str.length > 10)
            str = str.substr(0, 7) + "...";

        // change format label of button
        formatLabel.innerHTML = str;
    }

    // the function of insertion a specific form to texts
    function extractToText(strings) {
        let htmlContent, htmlPattern, htmlReplace;

        // first remove to unnecessary gaps
        htmlContent = strings.replace(/\n/gim, '').replace(/\r/gim, '').replace(/\t/gim, '').replace(/&nbsp;/gim, ' ');

        htmlPattern = [
            /\<span(|\s+.*?)><span(|\s+.*?)>(.*?)<\/span><\/span>/gim, // trim nested spans
            /<(\w*[^p])\s*[^\/>]*>\s*<\/\1>/gim, // remove empty or white-spaces tags (ignore paragraphs (<p>) and breaks (<br>))
            /\<div(|\s+.*?)>(.*?)\<\/div>/gim, // convert div to p
            /\<strong(|\s+.*?)>(.*?)\<\/strong>/gim, // convert strong to b
            /\<em(|\s+.*?)>(.*?)\<\/em>/gim // convert em to i
        ];

        htmlReplace = [
            '<span$2>$3</span>',
            '',
            '<p$1>$2</p>',
            '<b$1>$2</b>',
            '<i$1>$2</i>'
        ];

        // repeat the cleaning process 5 times
        for (let c = 0; c < 5; c++) {
            // create loop as the number of pattern
            for (let i = 0; i < htmlPattern.length; i++) {
                htmlContent = htmlContent.replace(htmlPattern[i], htmlReplace[i]);
            }
        }

        // if paragraph is false (<p>), convert <p> to <br>
        if (!vars.p)
            htmlContent = htmlContent.replace(/\<p(|\s+.*?)>(.*?)\<\/p>/ig, '<br/>$2');

        // if break is false (<br>), convert <br> to <p>
        if (!vars.br) {
            htmlPattern = [
                /\<br>(.*?)/ig,
                /\<br\/>(.*?)/ig
            ];

            htmlReplace = [
                '<p>$1</p>',
                '<p>$1</p>'
            ];

            // create loop as the number of pattern (for breaks)
            for (let i = 0; i < htmlPattern.length; i++) {
                htmlContent = htmlContent.replace(htmlPattern[i], htmlReplace[i]);
            }
        }

        // if paragraph and break is false (<p> && <br>), convert <p> to <div>
        if (!vars.p && !vars.br)
            htmlContent = htmlContent.replace(/\<p>(.*?)\<\/p>/ig, '<div>$1</div>');

        return htmlContent;
    }

    // the function of exporting contents of the text field to the source field (to be the standard in all browsers)
    function postToSource() {
        // clear unnecessary tags when editor view empty
        let sourceStrings = editor.textContent === "" && editor.innerHTML.length < 12 ? "" : editor.innerHTML;

        thisElement.value = extractToText(sourceStrings);
    }

    // the function of exporting contents of the source field to the text field (to be the standard in all browsers)
    function postToEditor() {
        editor.innerHTML = extractToText(thisElement.value);
    }

    /**
    * Gets the parent elements of the specified element up to a given parent element.
    * @param {HTMLElement} el - The element for which parent elements need to be found.
    * @param {HTMLElement} [parentSelector=document] - The element that serves as the boundary for searching parent elements.
    * If not specified, document is used by default.
    * @returns {Array.<HTMLElement>} - An array of parent elements, including the specified parentSelector.
    */
    function parents(el, parentSelector) {
        if (parentSelector === undefined) {
            parentSelector = document.querySelector('html');
        }
        var parents = [];
        var p = el.parentNode;
        while (p !== parentSelector) {
            var o = p;
            parents.push(o);
            p = o.parentNode;
        }
        parents.push(parentSelector);
        return parents;
    }
      

    // the function of getting parent (or super parent) tag name of the selected node
    function detectElement(tags) {

        let resultdetect = false, node = getSelectedNode(), parentsTag;

        if (node) {
            tags.forEach(function (i, val) {
                parentsTag = node.tagName.toLowerCase();

                if (parentsTag === val)
                    resultdetect = true;
                else {
                    // node.parents().forEach(function (el) {
                    parents(node).forEach(function (el) {
                        parentsTag = el.tagName.toLowerCase();
                        if (parentsTag === val)
                            resultdetect = true;
                    });
                }
            });

            return resultdetect;
        } else
            return false;
    }

    // the function of highlighting the toolbar buttons according to the cursor position in jste editor
    function buttonEmphasize() {
        for (let n = 0; n < buttons.length; n++) {
            if (vars[buttons[n].name] && buttons[n].emphasis && buttons[n].tag !== '')
                detectElement(buttons[n].tag) ? toolbar.querySelectorAll('.' + vars.css + '_tool_' + buttons[n].cls).forEach(function (el) {
                    el.classList.add(emphasize);
                }) : document.querySelector('.' + vars.css + '_tool_' + buttons[n].cls).classList.remove(emphasize);
        }
        // showing text format
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

            if (!isFoundFormat)
                formatLabelView(vars.formats[0][1]);
        }

        // hide all style-fields
        styleFieldSwitch("", false);
        formatFieldSwitch(false);
    }

    let oListeners = {};

    /**
     * It loops through the array of elements that have the event listener attached to them, and if the
     * element that triggered the event is found, it loops through the array of functions that are
     * attached to that element and calls them.
     * @param {Event} oEvent - Event object.
     */
    // function _runListeners(element, oEvent) {
    function _runListeners(oEvent) {
        if (!oEvent) {
            return;
        }

        const element = oEvent.currentTarget;

        for (let iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === element) {
                for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(element, oEvent); }
                break;
            }
        }
    }

    /**
     * Custom addEventListener method.
     * @param {HTMLElement} element - An element for add listener.
     * @param {string} sEventType - An event type name (string).
     * @param {function} fListener - A handler (function).
     */
    function _addListener(element, sEventType, fListener) {
        if (oListeners.hasOwnProperty(sEventType)) {
            let oEvtListeners = oListeners[sEventType];
            let nElIdx = -1;
            for (let iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
                if (oEvtListeners.aEls[iElId] === element) { nElIdx = iElId; break; }
            }
            if (nElIdx === -1) {
                oEvtListeners.aEls.push(element);
                oEvtListeners.aEvts.push([fListener]);
                element["on" + sEventType] = _runListeners;
            } else {
                let aElListeners = oEvtListeners.aEvts[nElIdx];
                if (element["on" + sEventType] !== _runListeners) {
                    aElListeners.splice(0);
                    element["on" + sEventType] = _runListeners;
                }
                for (let iLstId = 0; iLstId < aElListeners.length; iLstId++) {
                    if (aElListeners[iLstId] === fListener) { return; }
                }
                aElListeners.push(fListener);
            }
        } else {
            oListeners[sEventType] = { aEls: [element], aEvts: [[fListener]] };
            element["on" + sEventType] = _runListeners;
        }
    }

    /**
     * Custom removeEventListener method.
     * @param {HTMLElement} element - An element for remove listener.
     * @param {string} sEventType - An event type name (string).
     * @param {function} fListener - A handler (function).
     */
    function _removeListener(element, sEventType, fListener) {
        if (!oListeners.hasOwnProperty(sEventType)) { return; }
        let oEvtListeners = oListeners[sEventType];
        let nElIdx = -1;
        for (let iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === element) { nElIdx = iElId; break; }
        }
        if (nElIdx === -1) { return; }
        for (let iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
        }
    }

    /**
     * Removing all listeners from the element.
     * @param {HTMLElement} element - An element for remove all listeners.
     * @param {string} sEventType - An event type name (string).
     */
    function _removeAllListeners(element, sEventType) {
        if (!oListeners.hasOwnProperty(sEventType)) { return; }
        let oEvtListeners = oListeners[sEventType];
        let nElIdx = -1;
        for (let iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === element) { nElIdx = iElId; break; }
        }
        if (nElIdx === -1) { return; }
        for (let iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            while (aElListeners.length) {
                // Remove elements from array
                aElListeners.pop();
            }
        }
    }



    /**
     * _fadeIn method.
     * @param {HTMLElement} element - The element to fade in.
     * @param {number} ms - The duration of fade in animation effect (in milliseconds).
     */
    function _fadeIn(element, ms) {
        if (!element) {
            return;
        }
        let opacity = 0,
            interval = 50,
            duration = ms,
            gap = interval / duration;
        function func() {
            opacity = opacity + gap;
            element.style.opacity = opacity;
            if (opacity <= 0) element.style.display = 'none'
            if (opacity <= 0 || opacity >= 1) clearInterval(fading);
        }
        let fading = window.setInterval(func, interval);
    }

    /**
     * _slideUp method.
     * @param {HTMLElement} element - The element to slide up.
     * @param {number} duration - The duration of the slide up animation effect (in milliseconds).
     */
    function _slideUp(element, duration) {
        element.style.transitionProperty = 'height, margin, padding';
        element.style.transitionDuration = `${duration}ms`;
        element.style.boxSizing = 'border-box';
        element.style.height = `${element.offsetHeight}px`;
        element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.paddingTop = '0px';
        element.style.paddingBottom = '0px';
        element.style.marginTop = '0px';
        element.style.marginBottom = '0px';
        setTimeout(() => {
            element.style.display = 'none';
            element.style.removeProperty('height');
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
        }, duration);
    }

    /**
     * _slideDown method.
     * @param {HTMLElement} element - The element to slide up.
     * @param {number} duration - The duration of the slide up animation effect (in milliseconds).
     */
    function _slideDown(element, duration) {
        element.style.removeProperty('display');
        let display = window.getComputedStyle(element).display;
        if (display === 'none') {
            display = 'block';
        }
        element.style.display = display;
        let height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.paddingTop = '0px';
        element.style.paddingBottom = '0px';
        element.style.marginTop = '0px';
        element.style.marginBottom = '0px';
        element.offsetHeight;
        element.style.boxSizing = 'border-box';
        element.style.transitionProperty = "height, margin, padding";
        element.style.transitionDuration = `${duration}ms`;
        element.style.height = `${height}px`;
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        setTimeout(() => {
            element.style.removeProperty('height');
            element.style.removeProperty('overflow');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-property');
        }, duration);
    }

    const jste = () => {
        if (!self) {
            return;
        }
        if (!self.dataset.jste || self.dataset.jste === "undefined")
            self.dataset.jste = 'true';
        else
            self.dataset.jste = 'false';

        // is the status false of the editor
        if (!vars.status || (self.dataset.jste.toLowerCase() === "false")) {
            // if wanting the false status later
            if (self.closest("." + vars.css).length > 0) {
                let editorValue = self.closest("." + vars.css).querySelector("." + vars.css + "_editor").innerHTML;

                // add all attributes of element
                let thisElementAttrs = "";

                Array.prototype.forEach.call(self.attributes, function () {
                    if (this.nodeName !== "style")
                        thisElementAttrs = thisElementAttrs + " " + this.nodeName + '="' + this.nodeValue + '"';
                });

                let thisElementTag = self.matches("[data-origin]") && self.getAttribute("data-origin") !== "" ? self.getAttribute("data-origin") : "textarea";

                // the contents of this element
                let createValue = '>' + editorValue;

                // if this element is input or option
                if (thisElementTag === "input" || thisElementTag === "option") {
                    // encode special html characters
                    editorValue = editorValue.replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

                    // the value of this element
                    createValue = 'value="' + editorValue + '">';
                }

                let thisClone = self.cloneNode();

                self.dataset.jste = 'false';
                self.closest("." + vars.css).insertAdjacentHTML('beforeend', thisClone).remove();
                thisClone.outerHTML = '<' + thisElementTag + thisElementAttrs + createValue + '</' + thisElementTag + '>';
            }
            return;
        }

        // element will convert to the jste editor
        this.thisElement = self;

        // tag name of the element
        let thisElementTag = self.tagName.toLowerCase();

        // tag name of origin
        self.setAttribute("data-origin", thisElementTag);

        // contents of the element
        let thisElementVal = self.matches("[value]") || thisElementTag === "textarea" ? self.value : self.innerHTML;

        // decode special html characters
        thisElementVal = thisElementVal.replace(/&#34;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

        // start jste editor to after the element
        self.insertAdjacentHTML('afterend', '<div class="' + vars.css + '"></div>');

        // jste
        this.JSTEContainer = _next(self, '.' + vars.css);

        // insert toolbar in jste editor
        JSTEContainer.innerHTML = '<div class="' + vars.css + "_toolbar" + '" role="toolbar" unselectable></div><div class="' + vars.css + '_linkform" style="display:none" role="dialog"></div><div class="' + vars.css + "_editor" + '"></div>';

        this.toolbar = JSTEContainer.querySelector('.' + vars.css + "_toolbar"); // the toolbar variable
        this.linkform = JSTEContainer.querySelector('.' + vars.css + "_linkform"); // the link-form-area in the toolbar variable
        this.editor = JSTEContainer.querySelector('.' + vars.css + "_editor"); // the text-field of jste editor
        this.emphasize = vars.css + "_tool_depressed"; // highlight style of the toolbar buttons

        // add to some tools in link form area
        linkform.insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_linktypeselect" unselectable></div><input class="' + vars.css + '_linkinput" type="text" value=""><div class="' + vars.css + '_linkbutton" unselectable>' + vars.button + '</div> <div style="height:1px;float:none;clear:both"></div>');

        this.linktypeselect = linkform.querySelector("." + vars.css + "_linktypeselect"); // the tool of link-type-selector
        // let linkinput = linkform.querySelector("." + vars.css + "_linkinput"); // the input of insertion link
        this.linkinput = linkform.querySelector("." + vars.css + "_linkinput"); // the input of insertion link
        // let linkbutton = linkform.querySelector("." + vars.css + "_linkbutton"); // the button of insertion link
        this.linkbutton = linkform.querySelector("." + vars.css + "_linkbutton"); // the button of insertion link

        // add to the link-type-selector sub tool parts
        linktypeselect.insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_linktypeview" unselectable></div><div class="' + vars.css + '_linktypes" role="menu" unselectable></div>');

        this.linktypes = linktypeselect.querySelector("." + vars.css + "_linktypes"); // the select box of link types
        this.linktypeview = linktypeselect.querySelector("." + vars.css + "_linktypeview"); // the link type preview
        this.setdatalink = vars.css + "-setlink"; // the selected text add to mark as "link will be added"

        // create to the source-area
        editor.insertAdjacentHTML('afterend', '<div class="' + vars.css + '_source ' + vars.css + '_hiddenField"></div>');

        let sourceField = JSTEContainer.querySelector("." + vars.css + "_source"); // the source-area variable

        // move the element to the source-area
        sourceField.appendChild(thisElement);

        // if the element isn't a textarea, convert this to textarea
        if (thisElementTag !== "textarea") {
            // add all attributes of element to new textarea (type and value except)
            let thisElementAttrs = "";

            Array.prototype.forEach.call(thisElement.attributes, function () {
                if (this.nodeName !== "type" && this.nodeName !== "value")
                    thisElementAttrs = thisElementAttrs + " " + this.nodeName + '="' + this.nodeValue + '"';
            });

            // convert the element to textarea
            thisElement.outerHTML = '<textarea ' + thisElementAttrs + '>' + thisElementVal + '</textarea>';

            // update to variable of thisElement
            thisElement = sourceField.querySelector("textarea");
        }

        // add feature editable to the text-field ve copy from the element's value to text-field
        editor.setAttribute("contenteditable", "true");
        editor.innerHTML = thisElementVal;

        // insertion the toolbar button
        for (let n = 0; n < buttons.length; n++) {
            // if setting of this button is activated (is it true?)
            if (vars[buttons[n].name]) {
                // if it has a title, add to this button
                let buttonHotkey = buttons[n].key.length > 0 ? vars.titletext[n].hotkey != null && vars.titletext[n].hotkey !== "undefined" && vars.titletext[n].hotkey !== "" ? ' (Ctrl+' + vars.titletext[n].hotkey + ')' : '' : '';
                let buttonTitle = vars.titletext[n].title != null && vars.titletext[n].title !== "undefined" && vars.titletext[n].title !== "" ? vars.titletext[n].title + buttonHotkey : '';

                // add this button to the toolbar
                toolbar.insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_tool ' + vars.css + '_tool_' + buttons[n].cls + '" role="button" data-tool="' + n + '" unselectable><a class="' + vars.css + '_tool_icon" unselectable></a></div>');

                // add the parameters to this button
                const btnTool = toolbar.querySelector('.' + vars.css + '_tool[data-tool="' + n + '"]');
                btnTool.dataset.tag = buttons[n].tag;
                btnTool.dataset.command = buttons[n].command;
                btnTool.dataset.emphasis = buttons[n].emphasis;
                btnTool.dataset.title = buttonTitle;

                // format-selector field
                if (buttons[n].name === "format" && Array.isArray(vars.formats)) {
                    // selected text format
                    let toolLabel = vars.formats[0][1].length > 0 && vars.formats[0][1] !== "undefined" ? vars.formats[0][1] : "";

                    toolbar.querySelector("." + vars.css + '_tool_' + buttons[n].cls).querySelector("." + vars.css + "_tool_icon").outerHTML = '<a class="' + vars.css + '_tool_label" unselectable><span class="' + vars.css + '_tool_text" unselectable>' + toolLabel + '</span><span class="' + vars.css + '_tool_icon" unselectable></span></a>';

                    toolbar.querySelector("." + vars.css + '_tool_' + buttons[n].cls)
                        .insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_formats" unselectable></div>');

                    // add font-sizes to font-size-selector
                    for (let f = 0; f < vars.formats.length; f++) {
                        toolbar.querySelector("." + vars.css + "_formats").insertAdjacentHTML('beforeend', '<a ' + vars.css + '-formatval="' + vars.formats[f][0] + '" class="' + vars.css + '_format' + ' ' + vars.css + '_format_' + f + '" role="menuitem" unselectable>' + vars.formats[f][1] + '</a>');
                    }

                    toolbar.querySelectorAll("." + vars.css + "_formats").forEach(function (el) {
                        el.dataset.status = 'false';
                    });
                }

                // font-size-selector field
                else if (buttons[n].name === "fsize" && Array.isArray(vars.fsizes)) {
                    toolbar.querySelector("." + vars.css + '_tool_' + buttons[n].cls)
                        .insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_fontsizes" unselectable></div>');

                    // add font-sizes to font-size-selector
                    for (let f = 0; f < vars.fsizes.length; f++) {
                        toolbar.querySelector("." + vars.css + "_fontsizes").insertAdjacentHTML('beforeend', '<a ' + vars.css + '-styleval="' + vars.fsizes[f] + '" class="' + vars.css + '_fontsize' + '" style="font-size:' + vars.fsizes[f] + vars.funit + '" role="menuitem" unselectable>Abcdefgh...</a>');
                    }
                }

                // color-selector field
                else if (buttons[n].name === "color" && Array.isArray(colors)) {
                    toolbar.querySelector("." + vars.css + '_tool_' + buttons[n].cls)
                        .insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_cpalette" unselectable></div>');

                    // create color palette to color-selector field
                    for (let c = 0; c < colors.length; c++) {
                        if (colors[c] != null)
                            toolbar.querySelector("." + vars.css + "_cpalette").insertAdjacentHTML('beforeend', '<a ' + vars.css + '-styleval="' + colors[c] + '" class="' + vars.css + '_color' + '" style="background-color: rgb(' + colors[c] + ')" role="gridcell" unselectable></a>');
                        else
                            toolbar.querySelector("." + vars.css + "_cpalette").insertAdjacentHTML('beforeend', '<div class="' + vars.css + "_colorSeperator" + '"></div>');
                    }
                }
            }
        }

        // the default value of the link-type
        linktypes.dataset.linktype = "0";

        // add link types to link-type-selector
        for (let n = 0; n < 3; n++) {
            linktypes.insertAdjacentHTML('beforeend', '<a ' + vars.css + '-linktype="' + n + '" unselectable>' + vars.linktypes[n] + '</a>');

            linktypeview.innerHTML = '<div class="' + vars.css + '_linktypearrow" unselectable></div><div class="' + vars.css + '_linktypetext">' + linktypes.querySelectorAll('a')[linktypes.dataset.linktype].textContent + '</div>';
        }

        // add the prefix of css according to browser
        let prefixCss = "";

        if (/msie/.test(thisBrowser)) // ie
            prefixCss = '-ms-';
        else if (/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) // webkit group (safari, chrome, yandex)
            prefixCss = '-webkit-';
        else if (/mozilla/.test(thisBrowser)) // firefox
            prefixCss = '-moz-';
        else if (/opera/.test(thisBrowser)) // opera
            prefixCss = '-o-';
        else if (/konqueror/.test(thisBrowser)) // konqueror
            prefixCss = '-khtml-';
        else
            prefixCss = '';

        let placeHolder;
        // the feature of placeholder
        if (vars.placeholder && vars.placeholder !== "") {
            JSTEContainer.prepend('<div class="' + vars.css + '_placeholder" unselectable><div class="' + vars.css + '_placeholder_text">' + vars.placeholder + '</div></div>');

            placeHolder = JSTEContainer.querySelector("." + vars.css + "_placeholder");

            _addListener(placeHolder, 'click', function () {
                editor.focus();
            });
        }

        // make unselectable to unselectable attribute ones
        JSTEContainer.querySelectorAll("[unselectable]").forEach(function (el) {
            el.style[prefixCss + "user-select"] = "none";
            el.classList.add("unselectable");
            el.setAttribute("unselectable", "on");
            ["selectstart", "mousedown"].forEach(function (e) {
                _removeListener(el, e);
            });
        });

        // each button of the toolbar
        const toolbutton = toolbar.querySelectorAll("." + vars.css + "_tool");

        // format menu
        this.formatbar = toolbar.querySelector("." + vars.css + "_formats");

        // font-size filed
        this.fsizebar = toolbar.querySelector("." + vars.css + "_fontsizes");

        // color palette
        this.cpalette = toolbar.querySelector("." + vars.css + "_cpalette");

        // the event of click to the toolbar buttons
        toolbutton.forEach(function (el) {
            _removeAllListeners(el, 'click');
            _addListener(el, 'click', function (e) {
                // if source button is clicked
                if (this.dataset.command === 'displaysource' && (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened === 'false')) {
                    // hide all the toolbar buttons (except the source button)
                    toolbar.querySelector("." + vars.css + "_tool").classList.add(vars.css + "_hiddenField");
                    this.classList.remove(vars.css + "_hiddenField");

                    // update to data of source displaying
                    toolbar.dataset.sourceOpened = 'true';

                    // equalize height of the text field with height of the source field
                    thisElement.style.height = editor.outerHeight;

                    sourceField.classList.remove(vars.css + "_hiddenField");
                    editor.classList.add(vars.css + "_hiddenField");
                    thisElement.focus();

                    // hide the link-form-field
                    linkAreaSwitch(false);

                    // hide all style-fields
                    styleFieldSwitch("", false);

                    // hide format field
                    formatFieldSwitch(false);

                    // hide placeholder
                    if (vars.placeholder && vars.placeholder !== "")
                        placeHolder.style.display = 'none';
                }
                // if other buttons is clicked
                else {
                    // if source field is closed
                    if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened === 'false') {
                        // if insert-link-button is clicked
                        if (this.dataset.command === 'linkcreator') {
                            if (toolbar.dataset.linkOpened === undefined || toolbar.dataset.linkOpened === 'false')
                                selected2link();
                            else {
                                // hide the link-form-field
                                linkAreaSwitch(false);

                                // hide format field
                                formatFieldSwitch(false);
                            }
                        }

                        // if the format button is clicked
                        else if (this.dataset.command === 'formats') {
                            if (this.dataset.command === 'formats' && !e.target.classList.contains(vars.css + "_format"))
                                selected2format();

                            // hide all style-fields
                            styleFieldSwitch("", false);

                            if (editor.matches(':not(:focus)'))
                                editor.focus();
                        }

                        // if the style buttons are clicked
                        else if (this.dataset.command === 'fSize' || this.dataset.command === 'colors') {
                            if (
                                (this.dataset.command === 'fSize' && !e.target.classList.contains(vars.css + "_fontsize")) || // the font-size button
                                (this.dataset.command === 'colors' && !e.target.classList.contains(vars.css + "_color")) // the color button
                            )
                                selected2style(this.dataset.command);

                            // hide format field
                            formatFieldSwitch(false);

                            if (editor.matches(':not(:focus)'))
                                editor.focus();
                        }

                        // if other buttons is clicked
                        else {
                            // first, prevent to conflict of different jste editors
                            if (editor.matches(':not(:focus)'))
                                editor.focus();

                            // apply command of clicked button to the selected text
                            selectionSet(this.dataset.command, null);

                            // hide all menu-fields
                            styleFieldSwitch("", false);
                            formatFieldSwitch(false);
                            linktypeSwitch();

                            // to highlight the toolbar buttons according to the cursor position in jste editor
                            (this.dataset.emphasis !== undefined && this.dataset.emphasis.toLowerCase() === "true") && !this.classList.contains(emphasize) ? this.classList.add(emphasize) : this.classList.remove(emphasize);

                            sourceField.classList.add(vars.css + "_hiddenField");
                            editor.classList.remove(vars.css + "_hiddenField");
                        }

                    }
                    // hide the source field and display the text field
                    else {
                        // update to data of source hiding
                        toolbar.dataset.sourceOpened = 'false';

                        // display all the toolbar buttons
                        toolbar.querySelectorAll("." + vars.css + "_tool").forEach(function (el) {
                            el.classList.remove(vars.css + "_hiddenField");
                        });

                        sourceField.classList.add(vars.css + "_hiddenField");
                        editor.classList.remove(vars.css + "_hiddenField");
                    }

                    if (vars.placeholder && vars.placeholder !== "")
                        editor.innerHTML !== "" ? placeHolder.style.display = 'none' : placeHolder.style.display = '';
                }

                // export contents of the text to the sources
                editor.dispatchEvent(new Event('change'));
            });
            // the event of showing to the title bubble when mouse over of the toolbar buttons
            _addListener(el, 'mouseover', function (e) {
                if (vars.title && this.dataset.title !== "" && (e.target.classList.contains(vars.css + "_tool") || e.target.classList.contains(vars.css + "_tool_icon"))) {
                    document.querySelectorAll('.' + vars.css + '_title').forEach(function (el) {
                        el.remove();
                    });

                    // create the title bubble
                    JSTEContainer.insertAdjacentHTML('beforeend', '<div class="' + vars.css + '_title"><div class="' + vars.css + '_titleArrow"><div class="' + vars.css + '_titleArrowIcon"></div></div><div class="' + vars.css + '_titleText">' + this.dataset.title + '</div></div>');

                    let thisTitle = document.querySelector('.' + vars.css + '_title');
                    // let thisArrow = thisTitle.find('.' + vars.css + '_titleArrowIcon');
                    let thisPosition = {top: this.offsetTop, left: this.offsetLeft,};
                    let thisAlignX = thisPosition.left + this.outerWidth - (thisTitle.outerWidth / 2) - (this.outerWidth) / 2;
                    let thisAlignY = (thisPosition.top + this.outerHeight + 5);

                    // show the title bubble and set to its position
                    setTimeout(function () {
                        thisTitle.style.top = thisAlignY;
                        thisTitle.style.left = thisAlignX;
                        _fadeIn(thisTitle, 200);
                    }, 400);
                }
            });
            _addListener(el, 'mouseleave', function () {
                document.querySelectorAll('.' + vars.css + '_title').forEach(function (el) {
                    el.remove();
                });
            });
        });

        // prevent multiple calling postToSource()
        let editorChangeTimer = null;

        // the methods of the text fields
        // trigger change method of the text field when the text field modified
        ['keypress', 'keyup', 'keydown', 'drop', 'cut', 'copy', 'paste', 'DOMCharacterDataModified', 'DOMSubtreeModified'].forEach(function (eventType) {
            _addListener(editor, eventType, function () {
                // export contents of the text to the sources
                if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened.toLowerCase() === 'false')
                    this.dispatchEvent(new Event('change'));

                // hide the link-type-field
                linktypeSwitch();
                // if the change method is added run the change method
                if (typeof vars.change === "function" && typeof vars.change.nodeType !== "number")
                    vars.change();
                // the feature of placeholder
                if (vars.placeholder && vars.placeholder !== "")
                    this.textContent !== "" ? placeHolder.style.display = 'none' : placeHolder.style.display = '';
            });
        });
        _addListener(editor, 'change', function () {
            if (toolbar.dataset.sourceOpened === undefined || toolbar.dataset.sourceOpened.toLowerCase() === 'false') {
                clearTimeout(editorChangeTimer);
                editorChangeTimer = setTimeout(postToSource, 10);
            }
        });

        // run to keyboard shortcuts
        _addListener(editor, 'keydown', function (e) {
            // if ctrl key is clicked
            if (e.ctrlKey) {
                // check all toolbar buttons
                for (let n = 0; n < buttons.length; n++) {
                    // if these settings of this button is activated (is it true)
                    // if the keyed button with ctrl is same of hotkey of this button
                    if (vars[buttons[n].name] && e.keyCode === buttons[n].key.charCodeAt(0)) {
                        if (buttons[n].command !== '' && buttons[n].command !== 'linkcreator')
                            selectionSet(buttons[n].command, null);
                        else if (buttons[n].command === 'linkcreator')
                            selected2link();
                        return false;
                    }
                }
            }
        });

        // method of triggering to the highlight button
        ['mouseup', 'keyup'].forEach(function (event) {
            _addListener(editor, event, buttonEmphasize);
        });

        // the event of focus to the text field
        _addListener(editor, 'focus', function () {
            // if the focus method is added run the focus method
            if (typeof vars.focus === "function" && typeof vars.focus.nodeType !== "number")
                vars.focus();

            // add onfocus class
            JSTEContainer.classList.add(vars.css + "_focused");

            // prevent focus problem on opera
            if (/opera/.test(thisBrowser)) {
                let range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(false);
                let selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        // the event of focus out from the text field
        _addListener(editor, 'focusout', function () {
            // remove to highlights of all toolbar buttons
            toolbutton.forEach(function (el) {
                el.classList.remove(emphasize);
            });

            // hide all menu-fields
            styleFieldSwitch("", false);
            formatFieldSwitch(false);
            linktypeSwitch();

            // if the blur method is added run the blur method
            if (typeof vars.blur === "function" && typeof vars.blur.nodeType !== "number")
                vars.blur();

            // remove onfocus class
            JSTEContainer.classList.remove(vars.css + "_focused");

            // show default text format
            if (Array.isArray(vars.formats))
                formatLabelView(vars.formats[0][1]);
        });

        // the event of key in the source field
        ['keydown', 'keyup'].forEach(function (event) {
            _addListener(thisElement, event, function () {
                // export contents of the source to the text field
                setTimeout(postToEditor, 0);

                // auto extension for the source field
                this.style.height = this.scrollHeight;

                // if the source field is empty, shorten to the source field
                if (this.value == "")
                    this.style.height = 0;
            });
        });
        _addListener(thisElement, 'focus', function () {
            // add onfocus class
            JSTEContainer.classList.add(vars.css + "_focused");
        });
        _addListener(thisElement, 'focusout', function () {
            // remove onfocus class
            JSTEContainer.classList.remove(vars.css + "_focused");
        });
        this.container = JSTEContainer;
        return this;
    };

    jste();

    return {
        vars
    }
};

if (typeof module !== 'undefined') {
    module.exports = jste;
}