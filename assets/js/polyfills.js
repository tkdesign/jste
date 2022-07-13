/*!
 * 
 * JavaScript Text Editor, https://github.com/tkdesign/jste
 * 
*/

if (!Element.prototype.matches) {
	/* A polyfill for the matches() method. */
	Element.prototype.matches =
		Element.prototype.matchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector;
}

if (!Element.prototype.next) {
	/**
	 * A polyfill for the next() method.
	 * @param {*} selector - The selector string.
	 * @returns - The next element or null if nothing.
	 */
	Element.prototype.next = function (selector) {
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
	/**
	 * A polyfill for the prev() method.
	 * @param {*} selector - The selector string.
	 * @returns - The previously element or null if nothing.
	 */
	Element.prototype.prev = function (selector) {
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
	/**
	 * A polyfill for the closest() method.
	 * @param {*} s - The selector string.
	 * @returns - The closest element or null if nothing.
	 */
	Element.prototype.closest = function (s) {
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
	/**
	 * It loops through the array of elements that have the event listener attached to them, and if the
	 * element that triggered the event is found, it loops through the array of functions that are
	 * attached to that element and calls them.
	 * @param oEvent - The event object.
	 */
	function runListeners(oEvent) {
		if (!oEvent) { oEvent = window.event; }
		for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) {
				for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
				break;
			}
		}
	}
	/**
	 * A polyfill for the addEventListener method.
	 * @param {*} sEventType - An event type name (string).
	 * @param {*} fListener - A handler (function).
	 */
	Element.prototype.addEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
		if (oListeners.hasOwnProperty(sEventType)) {
			var oEvtListeners = oListeners[sEventType];
			for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
				if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
			}
			if (nElIdx === -1) {
				oEvtListeners.aEls.push(this);
				oEvtListeners.aEvts.push([fListener]);
				this["on" + sEventType] = runListeners;
			} else {
				var aElListeners = oEvtListeners.aEvts[nElIdx];
				if (this["on" + sEventType] !== runListeners) {
					aElListeners.splice(0);
					this["on" + sEventType] = runListeners;
				}
				for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
					if (aElListeners[iLstId] === fListener) { return; }
				}
				aElListeners.push(fListener);
			}
		} else {
			oListeners[sEventType] = { aEls: [this], aEvts: [[fListener]] };
			this["on" + sEventType] = runListeners;
		}
	};
	/**
	 * A polyfill for the removeEventListener method.
	 * @param {*} sEventType - An event type name (string).
	 * @param {*} fListener - A handler (function).
	 */
	Element.prototype.removeEventListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
		if (!oListeners.hasOwnProperty(sEventType)) { return; }
		var oEvtListeners = oListeners[sEventType];
		for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
		}
		if (nElIdx === -1) { return; }
		for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
			if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
		}
	};
}

if (!Element.prototype.addListener) {
	var oListeners = {};
	/**
	 * It loops through the array of elements that have the event listener attached to them, and if the
	 * element that triggered the event is found, it loops through the array of functions that are
	 * attached to that element and calls them.
	 * @param oEvent - The event object.
	 */
	function runListeners(oEvent) {
		if (!oEvent) { oEvent = window.event; }
		for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) {
				for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
				break;
			}
		}
	}
	/**
	 * A custom polyfill for the addEventListener method.
	 * @param {*} sEventType - An event type name (string).
	 * @param {*} fListener - A handler (function).
	 */
	Element.prototype.addListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
		if (oListeners.hasOwnProperty(sEventType)) {
			var oEvtListeners = oListeners[sEventType];
			for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
				if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
			}
			if (nElIdx === -1) {
				oEvtListeners.aEls.push(this);
				oEvtListeners.aEvts.push([fListener]);
				this["on" + sEventType] = runListeners;
			} else {
				var aElListeners = oEvtListeners.aEvts[nElIdx];
				if (this["on" + sEventType] !== runListeners) {
					aElListeners.splice(0);
					this["on" + sEventType] = runListeners;
				}
				for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
					if (aElListeners[iLstId] === fListener) { return; }
				}
				aElListeners.push(fListener);
			}
		} else {
			oListeners[sEventType] = { aEls: [this], aEvts: [[fListener]] };
			this["on" + sEventType] = runListeners;
		}
	};
	/**
	 * A custom polyfill for the removeEventListener method.
	 * @param {*} sEventType - An event type name (string).
	 * @param {*} fListener - A handler (function).
	 */
	Element.prototype.removeListener = function (sEventType, fListener /*, useCapture (will be ignored!) */) {
		if (!oListeners.hasOwnProperty(sEventType)) { return; }
		var oEvtListeners = oListeners[sEventType];
		for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
		}
		if (nElIdx === -1) { return; }
		for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
			if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
		}
	};
	/**
	 * Removing all listeners from the element.
	 * @param {*} sEventType - An event type name (string).
	 */
	Element.prototype.removeAllListeners = function (sEventType) {
		if (!oListeners.hasOwnProperty(sEventType)) { return; }
		var oEvtListeners = oListeners[sEventType];
		for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
			if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
		}
		if (nElIdx === -1) { return; }
		for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
			//   if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
			while (aElListeners.length) {
				// Remove elements from array
				aElListeners.pop();
			}
		}
	};
}

if (!Element.prototype.fadeIn) {
	/**
	 * A polyfill for the fadeIn method.
	 * @param {*} ms - The duration of fade in animation effect (integer).
	 */
	Element.prototype.fadeIn = function (ms) {
		var opacity = 0,
			interval = 50,
			duration = ms,
			gap = interval / duration,
			self = this;
		function func() {
			opacity = opacity + gap;
			self.style.opacity = opacity;
			if (opacity <= 0) self.style.display = 'none'
			if (opacity <= 0 || opacity >= 1) clearInterval(fading);
		}
		var fading = window.setInterval(func, interval);
	}
	/**
	 * A polyfill for the fadeOut method.
	 * @param {*} ms - The duration of fade out animation effect (integer).
	 */
	Element.prototype.fadeOut = function (ms) {
		var opacity = 1,
			interval = 50,
			duration = ms,
			gap = interval / duration,
			self = this;
		self.el.style.display = 'inline';
		self.el.style.opacity = opacity;
		function func() {
			opacity = opacity - gap;
			self.style.opacity = opacity;
			if (opacity <= 0) self.style.display = 'none'
			if (opacity <= 0 || opacity >= 1) clearInterval(fading);
		}
		var fading = window.setInterval(func, interval);
	}
}

if (!Element.prototype.parents) {
	/**
	 * A polyfill for the parents() method.
	 * @returns - The array of parent nodes or void array if nothing.
	 */
	Element.prototype.parents = function () {
		var matched = [], self = this;
		while ((self = self['parentNode']) && self.nodeType !== 9) {
			if (self.nodeType === 1) {
				matched.push(self);
			}
		}
		return matched;
	}
}

/*!
 * Create an immutable clone of data (an array, object, map, set, etc.)
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
// if (!Element.prototype.clone) {
// 	Element.prototype.clone = function () {
// 		let self = this;

// 		/**
// 		 * Copy properties from the original object to the clone
// 		 * @param {Object|Function} clone The cloned object
// 		 */
// 		function copyProps(clone) {
// 			for (let key in self) {
// 				if (Object.prototype.hasOwnProperty.call(self, key)) {
// 					clone[key] = copy(self[key]);
// 				}
// 			}
// 		}

// 		/**
// 		 * Create an immutable copy of an object
// 		 * @return {Object}
// 		 */
// 		function cloneObj() {
// 			let clone = {};
// 			copyProps(clone);
// 			return clone;
// 		}

// 		/**
// 		 * Create an immutable copy of an array
// 		 * @return {Array}
// 		 */
// 		function cloneArr() {
// 			return self.map(function (item) {
// 				return copy(item);
// 			});
// 		}

// 		/**
// 		 * Create an immutable copy of a Map
// 		 * @return {Map}
// 		 */
// 		function cloneMap() {
// 			let clone = new Map();
// 			for (let [key, val] of self) {
// 				clone.set(key, copy(val));
// 			}
// 			return clone;
// 		}

// 		/**
// 		 * Create an immutable clone of a Set
// 		 * @return {Set}
// 		 */
// 		function cloneSet() {
// 			let clone = new Set();
// 			for (let item of set) {
// 				clone.add(copy(item));
// 			}
// 			return clone;
// 		}

// 		/**
// 		 * Create an immutable copy of a function
// 		 * @return {Function}
// 		 */
// 		function cloneFunction() {
// 			let clone = self.bind(this);
// 			copyProps(clone);
// 			return clone;
// 		}


// 		//
// 		// Inits
// 		//

// 		// Get object type
// 		let type = Object.prototype.toString.call(self).slice(8, -1).toLowerCase();

// 		// Return a clone based on the object type
// 		if (type === 'object') return cloneObj();
// 		if (type === 'array') return cloneArr();
// 		if (type === 'map') return cloneMap();
// 		if (type === 'set') return cloneSet();
// 		if (type === 'function') return cloneFunction();
// 		return self;
// 	}
// }
// if (!Element.prototype.not) {
// 	Element.prototype.not=function (selector) {
// 		var excludeByClassName = function(className) {
// 			return function (element) {
// 				return element.matches(':not(:focus)');
// 				// return element.className != className;
// 			};
// 		};
// 		return filter.call(this, excludeByClassName(selector));
// 	}
// }
if (!Element.prototype.slideUp) {
	Element.prototype.slideUp = function (duration) {
		var el = this;
		el.style.transitionProperty = 'height, margin, padding';
		el.style.transitionDuration = `${duration}ms`;
		el.style.boxSizing = 'border-box';
		el.style.height = `${el.offsetHeight}px`;
		el.offsetHeight;
		el.style.overflow = 'hidden';
		el.style.height = 0;
		el.style.paddingTop = 0;
		el.style.paddingBottom = 0;
		el.style.marginTop = 0;
		el.style.marginBottom = 0;
		setTimeout(() => {
			el.style.display = 'none';
			el.style.removeProperty('height');
			el.style.removeProperty('padding-top');
			el.style.removeProperty('padding-bottom');
			el.style.removeProperty('margin-top');
			el.style.removeProperty('margin-bottom');
			el.style.removeProperty('overflow');
			el.style.removeProperty('transition-duration');
			el.style.removeProperty('transition-property');
		}, duration);
	}
	Element.prototype.slideDown = function (duration) {
		const el = this;
		el.style.removeProperty('display');
		let display = window.getComputedStyle(el).display;

		if (display === 'none')
			display = 'block';

		el.style.display = display;
		let height = el.offsetHeight;
		el.style.overflow = 'hidden';
		el.style.height = 0;
		el.style.paddingTop = 0;
		el.style.paddingBottom = 0;
		el.style.marginTop = 0;
		el.style.marginBottom = 0;
		el.offsetHeight;
		el.style.boxSizing = 'border-box';
		el.style.transitionProperty = "height, margin, padding";
		el.style.transitionDuration = `${duration}ms`;
		el.style.height = `${height}px`;
		el.style.removeProperty('padding-top');
		el.style.removeProperty('padding-bottom');
		el.style.removeProperty('margin-top');
		el.style.removeProperty('margin-bottom');
		setTimeout(() => {
			el.style.removeProperty('height');
			el.style.removeProperty('overflow');
			el.style.removeProperty('transition-duration');
			el.style.removeProperty('transition-property');
		}, duration);

	}
	Element.prototype.slideToggle = function (duration) {
		const el = this;
		if (getComputedStyle(el).display === 'none') {
			return Element.prototype.slideUp.call(el, duration);
		} else {
			return Element.prototype.slideDown.call(el, duration);
		}
	}
}
