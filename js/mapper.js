var mapper = new function () {
	var plumb, $container, _t;
	var defaultContainer = document.body;
	var afterRenderActionLib = [];

	return {

		init: function (initOptions) {
			_t = this;
			var cont = initOptions.container || defaultContainer;
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
					html: '<span class="text-wrapper">' + o.html + '</span>'
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

			_t.doAfterRenderActions();
		},

		setContainer: function (container) {
			$container = $(container);
		},

		getContainer: function () {
			return $container;
		},

		addAfterRenderAction: function (action) {
			afterRenderActionLib.push(action);
		},

		getAfterRenderActions: function () {
			return afterRenderActionLib;
		},

		removeAfterRenderAction: function () {
			afterRenderActionLib = [];
		},

		addModule: function (module) {
			var _module = $.extend({}, module);
			if (_module.afterRenderAction) {
				_t.addAfterRenderAction(_module.afterRenderAction);
				delete _module.afterRenderAction;
			}

			$.extend(_t, _module);

			if (_module.initModule) {
				_t.initModule();
				delete _module.initModule;
				delete _t.initModule;
			}
		},

		doAfterRenderActions: function () {
			var actionLib = _t.getAfterRenderActions();
			if (!actionLib.length) return;
			$.each(actionLib, function (index, action) {
				action();
			});
			_t.removeAfterRenderAction();
		}

	}
};