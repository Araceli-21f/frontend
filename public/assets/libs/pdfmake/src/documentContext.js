'use strict';

var TraversalTracker = require('./traversalTracker');
var isString = require('./helpers').isString;

/**
 * Creates an instance of DocumentContext - a store for current x, y positions and available width/height.
 * It facilitates column divisions and vertical sync
 */
function DocumentContext(pageSize, pageMargins) {
	this.pages = [];

	this.pageMargins = pageMargins;

	this.x = pageMargins.left;
	this.availableWidth = pageSize.width - pageMargins.left - pageMargins.right;
	this.availableHeight = 0;
	this.page = -1;

	this.snapshots = [];

	this.tracker = new TraversalTracker();

	this.backgroundLength = [];

	this.addPage(pageSize);
}

DocumentContext.prototype.beginColumnGroup = function (marginXTopParent, bottomByPage = {}) {
	this.snapshots.push({
		x: this.x,
		y: this.y,
		availableHeight: this.availableHeight,
		availableWidth: this.availableWidth,
		page: this.page,
		bottomByPage: bottomByPage ? bottomByPage : {},
		bottomMost: {
			x: this.x,
			y: this.y,
			availableHeight: this.availableHeight,
			availableWidth: this.availableWidth,
			page: this.page
		},
		lastColumnWidth: this.lastColumnWidth
	});

	this.lastColumnWidth = 0;
	if (marginXTopParent) {
		this.marginXTopParent = marginXTopParent;
	}
};

DocumentContext.prototype.updateBottomByPage = function () {
	const lastSnapshot = this.snapshots[this.snapshots.length - 1];
	const lastPage = this.page;
	let previousBottom = -Number.MIN_VALUE;
	if (lastSnapshot.bottomByPage[lastPage]) {
		previousBottom = lastSnapshot.bottomByPage[lastPage];
	}
	lastSnapshot.bottomByPage[lastPage] = Math.max(previousBottom, this.y);
};

DocumentContext.prototype.resetMarginXTopParent = function () {
	this.marginXTopParent = null;
};

DocumentContext.prototype.beginColumn = function (width, offset, endingCell) {
	var saved = this.snapshots[this.snapshots.length - 1];

	this.calculateBottomMost(saved, endingCell);

	this.page = saved.page;
	this.x = this.x + this.lastColumnWidth + (offset || 0);
	this.y = saved.y;
	this.availableWidth = width;	//saved.availableWidth - offset;
	this.availableHeight = saved.availableHeight;

	this.lastColumnWidth = width;
};

DocumentContext.prototype.calculateBottomMost = function (destContext, endingCell) {
	if (endingCell) {
		this.saveContextInEndingCell(endingCell);
	} else {
		destContext.bottomMost = bottomMostContext(this, destContext.bottomMost);
	}
};

DocumentContext.prototype.markEnding = function (endingCell, originalXOffset, discountY) {
	this.page = endingCell._columnEndingContext.page;
	this.x = endingCell._columnEndingContext.x + originalXOffset;
	this.y = endingCell._columnEndingContext.y - discountY;
	this.availableWidth = endingCell._columnEndingContext.availableWidth;
	this.availableHeight = endingCell._columnEndingContext.availableHeight;
	this.lastColumnWidth = endingCell._columnEndingContext.lastColumnWidth;
};

DocumentContext.prototype.saveContextInEndingCell = function (endingCell) {
	endingCell._columnEndingContext = {
		page: this.page,
		x: this.x,
		y: this.y,
		availableHeight: this.availableHeight,
		availableWidth: this.availableWidth,
		lastColumnWidth: this.lastColumnWidth
	};
};

DocumentContext.prototype.completeColumnGroup = function (height, endingCell) {
	var saved = this.snapshots.pop();

	this.calculateBottomMost(saved, endingCell);

	this.x = saved.x;

	var y = saved.bottomMost.y;
	if (height) {
		if (saved.page === saved.bottomMost.page) {
			if ((saved.y + height) > y) {
				y = saved.y + height;
			}
		} else {
			y += height;
		}
	}

	this.y = y;
	this.page = saved.bottomMost.page;
	this.availableWidth = saved.availableWidth;
	this.availableHeight = saved.bottomMost.availableHeight;
	if (height) {
		this.availableHeight -= (y - saved.bottomMost.y);
	}
	this.lastColumnWidth = saved.lastColumnWidth;
	return saved.bottomByPage;
};

DocumentContext.prototype.addMargin = function (left, right) {
	this.x += left;
	this.availableWidth -= left + (right || 0);
};

DocumentContext.prototype.moveDown = function (offset) {
	this.y += offset;
	this.availableHeight -= offset;

	return this.availableHeight > 0;
};

DocumentContext.prototype.initializePage = function () {
	this.y = this.pageMargins.top;
	this.availableHeight = this.getCurrentPage().pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
	const { pageCtx, isSnapshot } = this.pageSnapshot();
	pageCtx.availableWidth = this.getCurrentPage().pageSize.width - this.pageMargins.left - this.pageMargins.right;
	if (isSnapshot && this.marginXTopParent) {
		pageCtx.availableWidth -= this.marginXTopParent[0];
		pageCtx.availableWidth -= this.marginXTopParent[1];
	}
};

DocumentContext.prototype.pageSnapshot = function () {
	if (this.snapshots[0]) {
		return { pageCtx: this.snapshots[0], isSnapshot: true };
	} else {
		return { pageCtx: this, isSnapshot: false };
	}
};

DocumentContext.prototype.moveTo = function (x, y) {
	if (x !== undefined && x !== null) {
		this.x = x;
		this.availableWidth = this.getCurrentPage().pageSize.width - this.x - this.pageMargins.right;
	}
	if (y !== undefined && y !== null) {
		this.y = y;
		this.availableHeight = this.getCurrentPage().pageSize.height - this.y - this.pageMargins.bottom;
	}
};

DocumentContext.prototype.moveToRelative = function (x, y) {
	if (x !== undefined && x !== null) {
		this.x = this.x + x;
	}
	if (y !== undefined && y !== null) {
		this.y = this.y + y;
	}
};

DocumentContext.prototype.beginDetachedBlock = function () {
	this.snapshots.push({
		x: this.x,
		y: this.y,
		availableHeight: this.availableHeight,
		availableWidth: this.availableWidth,
		page: this.page,
		lastColumnWidth: this.lastColumnWidth
	});
};

DocumentContext.prototype.endDetachedBlock = function () {
	var saved = this.snapshots.pop();

	this.x = saved.x;
	this.y = saved.y;
	this.availableWidth = saved.availableWidth;
	this.availableHeight = saved.availableHeight;
	this.page = saved.page;
	this.lastColumnWidth = saved.lastColumnWidth;
};

function pageOrientation(pageOrientationString, currentPageOrientation) {
	if (pageOrientationString === undefined) {
		return currentPageOrientation;
	} else if (isString(pageOrientationString) && (pageOrientationString.toLowerCase() === 'landscape')) {
		return 'landscape';
	} else {
		return 'portrait';
	}
}

var getPageSize = function (currentPage, newPageOrientation) {

	newPageOrientation = pageOrientation(newPageOrientation, currentPage.pageSize.orientation);

	if (newPageOrientation !== currentPage.pageSize.orientation) {
		return {
			orientation: newPageOrientation,
			width: currentPage.pageSize.height,
			height: currentPage.pageSize.width
		};
	} else {
		return {
			orientation: currentPage.pageSize.orientation,
			width: currentPage.pageSize.width,
			height: currentPage.pageSize.height
		};
	}

};


DocumentContext.prototype.moveToNextPage = function (pageOrientation) {
	var nextPageIndex = this.page + 1;

	var prevPage = this.page;
	var prevY = this.y;

	// If we are in a column group
	if (this.snapshots.length > 0) {
		var lastSnapshot = this.snapshots[this.snapshots.length - 1];
		// We have to update prevY accordingly by also taking into consideration
		// the 'y' of cells that don't break page
		if (lastSnapshot.bottomMost && lastSnapshot.bottomMost.y) {
			prevY = Math.max(this.y, lastSnapshot.bottomMost.y);
		}
	}

	var createNewPage = nextPageIndex >= this.pages.length;
	if (createNewPage) {
		var currentAvailableWidth = this.availableWidth;
		var currentPageOrientation = this.getCurrentPage().pageSize.orientation;

		var pageSize = getPageSize(this.getCurrentPage(), pageOrientation);
		this.addPage(pageSize);

		if (currentPageOrientation === pageSize.orientation) {
			this.availableWidth = currentAvailableWidth;
		}
	} else {
		this.page = nextPageIndex;
		this.initializePage();
	}

	return {
		newPageCreated: createNewPage,
		prevPage: prevPage,
		prevY: prevY,
		y: this.y
	};
};


DocumentContext.prototype.addPage = function (pageSize) {
	var page = { items: [], pageSize: pageSize };
	this.pages.push(page);
	this.backgroundLength.push(0);
	this.page = this.pages.length - 1;
	this.initializePage();

	this.tracker.emit('pageAdded');

	return page;
};

DocumentContext.prototype.getCurrentPage = function () {
	if (this.page < 0 || this.page >= this.pages.length) {
		return null;
	}

	return this.pages[this.page];
};

DocumentContext.prototype.getCurrentPosition = function () {
	var pageSize = this.getCurrentPage().pageSize;
	var innerHeight = pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
	var innerWidth = pageSize.width - this.pageMargins.left - this.pageMargins.right;

	return {
		pageNumber: this.page + 1,
		pageOrientation: pageSize.orientation,
		pageInnerHeight: innerHeight,
		pageInnerWidth: innerWidth,
		left: this.x,
		top: this.y,
		verticalRatio: ((this.y - this.pageMargins.top) / innerHeight),
		horizontalRatio: ((this.x - this.pageMargins.left) / innerWidth)
	};
};

function bottomMostContext(c1, c2) {
	var r;

	if (c1.page > c2.page) {
		r = c1;
	} else if (c2.page > c1.page) {
		r = c2;
	} else {
		r = (c1.y > c2.y) ? c1 : c2;
	}

	return {
		page: r.page,
		x: r.x,
		y: r.y,
		availableHeight: r.availableHeight,
		availableWidth: r.availableWidth
	};
}

module.exports = DocumentContext;
