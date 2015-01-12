var mapper = new function () {
	var plumb, $container, _t;

	return {

		init: function (initOptions) {
			_t = this;
			var cont = initOptions.container || document.body;
			_t.setContainer(cont);
			_t.initPlumb();
			_t.getContainer().resize(plumb.repaintEverything);
		},

		initPlumb: function () {
			plumb = jsPlumb.getInstance({
				Container: "container"
			});

			plumb.importDefaults({
				Connector: "Straight", // "Flowchart"
				ConnectionsDetachable: true,
				ConnectionOverlays: [
					[ "Arrow", {
						location: 0.7,
						width: 12,
						length: 15,
						foldback: 1
					} ]
				],
				Endpoint: 'Blank',
				MaxConnections: 10,
				PaintStyle: {
					strokeStyle: '#666',
					lineWidth: 2
				},
				RenderMode: "svg"
			});

			plumb.registerEndpointTypes({
				'left': {anchor: 'Left'},
				'right': {anchor: 'Right'},
				'top': {anchor: 'Top'},
				'bottom': {anchor: 'Bottom'}
			});
		},

		getPlumb: function () {
			return plumb;
		},

		addAllEndpoints: function (nodes) {
			var $nodes = $(nodes);
			var endpointOptions = {
				isSource: true,
				isTarget: true
			};

			$.each(['top', 'right', 'bottom', 'left'], function () {
				var type = this;
				var points = plumb.addEndpoint($nodes, endpointOptions);
				points = Array.isArray(points) ? points : [points];

				$.each(points, function () {
					this.addType(type);
				});
			});
		},

		getEndpointByAnchorData: function (nodeId, anchorData) {
			var neededEndpoint;
			plumb.selectEndpoints({element: nodeId}).each(function (endpoint) {
				if (endpoint.anchor.x == anchorData[0] && endpoint.anchor.y == anchorData[1]) neededEndpoint = endpoint;
			});
			return neededEndpoint;
		},

		renderMap: function () {

			if (!localStorage.mapData) return;

			var mapData = JSON.parse(localStorage.mapData);

			/* load nodes */

			var $nodes = $();
			$.each(mapData.nodes, function (index, o) {
				var $newNode = $('<div/>', {
					id: o.id,
					class: 'node',
					css: {
						left: o.left,
						top: o.top,
						width: o.width,
						height: o.height
					},
					html: o.html
				});
				$nodes = $nodes.add($newNode);
			});

			$container.append($nodes);

			_t.addAllEndpoints($nodes);

			/* load connections */

			$.each(mapData.connections, function (index, c) {
				var source = _t.getEndpointByAnchorData(c.source, c.anchors[0]);
				var target = _t.getEndpointByAnchorData(c.target, c.anchors[1]);
				plumb.connect({
					source: source,
					target: target
				});
			});
		},

		setContainer: function (container) {
			$container = $(container);
		},

		getContainer: function () {
			return $container;
		},

		addModule: function (module) {
			$.extend(_t, module);
			if (module.initModule) {
				_t.initModule();
				delete _t.initModule;
			}
		}

	}
};

$(document).ready(function () {
	mapper.init({container: '#container'});
	mapper.addModule(mapperEditor);
	mapper.renderMap();
	mapper.initEditMode();
});

/* ================================================================================ */
/*                                edit mode addition                                */
/* ================================================================================ */

var mapperEditor = new function () {
	var gridStep, plumb, _t, $container;

	return {
		initModule: function () {
			_t = this;
			$container = _t.getContainer();
			plumb = _t.getPlumb();
			_t.initEditStyle();
		},
		afterRender: function () {

		},
		removeSelectedNodes: function () {
			var $nodes = $('.selected-node');
			$nodes.each(function () {
				plumb.detachAllConnections(this);
				plumb.removeAllEndpoints(this);
				plumb.detach(this);
				$(this).remove();
			});
		},
		selectNode: function (e) {
			if ($(this).hasClass('editing')) return;
			if ($(this).hasClass('noclick')) {
				$(this).removeClass('noclick');
			} else {
				e.stopPropagation();
				var sel = 'selected-node';
				if (e.shiftKey) {
					$(this).toggleClass(sel);
				} else {
					var selectedNodeAmount = $('.' + sel).size();
					if (selectedNodeAmount > 1 || !$(this).hasClass(sel)) {
						$('.node').removeClass(sel);
						$(this).addClass(sel);
					} else {
						$(this).toggleClass(sel);
					}
				}
			}
		},
		getGeneratedId: function () {
			var id = null;
			while (id == null) {
				var rnd = Math.round(Math.random() * 1000);
				if ($('#' + 'node' + rnd).length) continue;
				id = 'node' + rnd;
			}
			return id;
		},
		addNode: function () {
			var defaultObj = {
				id: _t.getGeneratedId(),
				class: 'node',
				css: {
					left: 40,
					top: 40,
					width: 100,
					height: 40
				},
				html: 'New node',
				click: _t.selectNode
			};

			var $newNode = $('<div/>', defaultObj);

			_t.contentEditable($newNode);
			_t.draggable($newNode);
			_t.resizable($newNode);

			$container.append($newNode);

			_t.addAllEndpoints($newNode);
		},
		setGridStep: function (step) {
			gridStep = step;
		},
		getGridStep: function () {
			return gridStep;
		},
		resizable: function (el, mode) {
			if (mode === false) {
				$(el).resizable('destroy');
				return;
			}
			var step = _t.getGridStep();
			$(el).resizable({grid: step});
		},
		draggable: function (el, mode) {
			mode = (mode === false); // not '!=' because only for strict false
			var step = _t.getGridStep();
			$(el).draggable({
				grid: [step, step],
				containment: 'parent',
				disabled: mode,
				//stack: '.node',  // high z-index for current draggable element
				start: function () {
					$(this).addClass('noclick');
				},
				drag: function () {
					plumb.repaintEverything();
				},
				stop: function () {
					plumb.repaintEverything();
				}
			});
		},
		placeCaretAtEnd: function (el) {
			el.focus();
			if (typeof window.getSelection != "undefined"
				&& typeof document.createRange != "undefined") {
				var range = document.createRange();
				range.selectNodeContents(el.firstChild);
				range.collapse(false);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (typeof document.body.createTextRange != "undefined") {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(el);
				textRange.collapse(false);
				textRange.select();
			}
		},
		contentEditable: function (el) {
			$(el).on('dblclick', function () {
				$('.node').removeClass('selected-node');
				_t.draggable(this, false);
				$(this).addClass('editing');
				$(this).prop('contenteditable', true);
				_t.placeCaretAtEnd(this);
			}).on('blur', function () {
				$(this).prop('contenteditable', false);
				$(this).removeClass('editing');
				_t.draggable(this);
			}).on('click', function () {
				$('.node').not(this).trigger('blur');
			});
		},
		save: function () {

			/* save nodes */
			var $nodeCollection = $('.node');
			_t.resizable($nodeCollection, false);
			var nodes = [];
			$nodeCollection.each(function () {
				nodes.push({
					id: $(this).attr('id'),
					html: $(this).html(),
					left: $(this).css('left'),
					top: $(this).css('top'),
					width: $(this).css('width'),
					height: $(this).css('height')
				});
			});
			_t.resizable($nodeCollection);

			/* save connections */
			var connections = [];
			var plumbConnections = plumb.getConnections();
			plumbConnections = Array.isArray(plumbConnections) ? plumbConnections : [plumbConnections];
			$.each(plumbConnections, function (idx, connection) {
				connections.push({
					connectionId: connection.id,
					source: connection.sourceId,
					target: connection.targetId,
					anchors: $.map(connection.endpoints, function (endpoint) {
						return [
							[
								endpoint.anchor.x,
								endpoint.anchor.y,
								endpoint.anchor.orientation[0],
								endpoint.anchor.orientation[1],
								endpoint.anchor.offsets[0],
								endpoint.anchor.offsets[1]
							]
						];

					})
				});
			});

			var data = {
				nodes: nodes,
				connections: connections
			};

			localStorage.mapData = JSON.stringify(data);
		},
		discard: function () {
			_t.draggable('.node', false); //not necessary
			_t.resizable('.node', false); //not necessary
			plumb.reset();
			$('.node').remove();
			_t.renderMap();
			_t.draggable('.node');
			_t.resizable('.node');
			_t.contentEditable('.node');
			plumb.repaintEverything();
		},
		buildGrid: function () {
			var $nodeCollection = $('.node');
			var gridSelectorValue = $('#grid-selector').val();

			_t.setGridStep(parseInt(gridSelectorValue));
			$container.removeClass('grid-10px grid-20px');
			$container.addClass('grid-' + gridSelectorValue);

			_t.draggable($nodeCollection); // reload grid step
			_t.resizable($nodeCollection); // reload grid step
		},
		deselectAllNodes: function () {
			$('.node').removeClass('selected-node');
		},
		removeConnection: function (connection) {
			plumb.detach(connection);
		},
		initEditStyle: function () {
			plumb.Defaults.Endpoint = [ "Dot", { radius: 8 } ];
		},
		initEditMode: function () {
			_t.draggable('.node');
			_t.resizable('.node');
			_t.contentEditable('.node');
			$('#add-btn').on('click', _t.addNode);
			$('#save-btn').on('click', _t.save);
			$('#discard-btn').on('click', _t.discard);
			$('#grid-selector').on('change', _t.buildGrid);
			$('#remove-btn').on('click', _t.removeSelectedNodes);
			$('.node').on('click', _t.selectNode);
			$container.on('click', _t.deselectAllNodes);
			plumb.bind('dblclick', _t.removeConnection);
			_t.buildGrid();
		}
	}
};