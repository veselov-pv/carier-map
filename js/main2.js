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
		}

	}
};

$(document).ready(function () {
	mapper.init({container: '#container'});
	mapper.renderMap();
});

