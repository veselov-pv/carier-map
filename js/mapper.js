var mapper = new function () {
	var plumb, $container, _t;
	var defaultContainer = document.body;
	var afterRenderActionLib = [];

	var exampleMap = {"nodes":[{"id":"node275","nodeType":"dev-node","html":"New node","left":"420px","top":"440px","width":"100px","height":"40px"},{"id":"node551","nodeType":"dev-node","html":"New node","left":"250px","top":"540px","width":"100px","height":"40px"},{"id":"node829","nodeType":"dev-node","html":"New node","left":"250px","top":"440px","width":"100px","height":"40px"},{"id":"node739","nodeType":"dev-node","html":"New node","left":"420px","top":"340px","width":"100px","height":"40px"},{"id":"node83","nodeType":"dev-node","html":"New node","left":"250px","top":"340px","width":"100px","height":"40px"},{"id":"node979","nodeType":"manager-node","html":"New node","left":"250px","top":"650px","width":"440px","height":"40px"},{"id":"node160","nodeType":"manager-node","html":"New node","left":"250px","top":"740px","width":"440px","height":"40px"},{"id":"node615","nodeType":"director-node","html":"Director","left":"250px","top":"830px","width":"440px","height":"40px"},{"id":"node377","nodeType":"head-node","html":"FBR","left":"580px","top":"150px","width":"100px","height":"40px"},{"id":"node794","nodeType":"head-node","html":"CEO","left":"410px","top":"50px","width":"120px","height":"40px"},{"id":"node176","nodeType":"head-node","html":"XYZ","left":"260px","top":"150px","width":"100px","height":"40px"},{"id":"node372","nodeType":"dev-node","html":"New node","left":"590px","top":"340px","width":"100px","height":"40px"},{"id":"node517","nodeType":"dev-node","html":"New node","left":"590px","top":"540px","width":"100px","height":"40px"},{"id":"node492","nodeType":"dev-node","html":"New node","left":"420px","top":"540px","width":"100px","height":"40px"},{"id":"node444","nodeType":"dev-node","html":"New node","left":"590px","top":"440px","width":"100px","height":"40px"},{"id":"node75","nodeType":"head-node","html":"OLOLO","left":"420px","top":"150px","width":"100px","height":"40px"},{"id":"node390","nodeType":"head-block","html":"HEAD MANAGEMENT<br>","left":"130px","top":"0px","width":"680px","height":"230px"},{"id":"node754","nodeType":"dev-block","html":"DEV LINE","left":"130px","top":"250px","width":"680px","height":"60px"}],"connections":[{"connectionId":"con_217","source":"node739","target":"node275","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_218","source":"node83","target":"node829","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_219","source":"node829","target":"node551","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_220","source":"node979","target":"node160","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_221","source":"node160","target":"node615","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_222","source":"node829","target":"node739","anchors":[[1,0.5,1,0,0,0],[0,0.5,-1,0,0,0]]},{"connectionId":"con_223","source":"node372","target":"node444","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_224","source":"node444","target":"node517","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_225","source":"node275","target":"node492","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_226","source":"node444","target":"node739","anchors":[[0,0.5,-1,0,0,0],[1,0.5,1,0,0,0]]},{"connectionId":"con_227","source":"node517","target":"node979","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_228","source":"node492","target":"node979","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]},{"connectionId":"con_229","source":"node551","target":"node979","anchors":[[0.5,1,0,1,0,0],[0.5,0,0,-1,0,0]]}]};
	if (localStorage.getItem('exampleMapFlag') == 'true') {
		localStorage.removeItem('exampleMapFlag');
		localStorage.setItem('mapData', JSON.stringify(exampleMap));
	}

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
				'Container': "container"
			});

			plumb.importDefaults({
				'Connector': [ 'Flowchart', {
					'cornerRadius': 10,
					'stub': 28
				} ],// "Straight", "Flowchart", "Bezier", "StateMachine"
				'ConnectionsDetachable': true,
				'ConnectionOverlays': [
					[ 'Arrow', {
						'location': 1,
						'width': 8,
						'length': 10,
						'foldback': 1
					} ]
				],
				'Endpoint': 'Blank',
				'MaxConnections': 10,
				'PaintStyle': {
					'strokeStyle': '#888',
					'lineWidth': 2,
					'stroke-dasharray': '2, 2',
					'stroke-dashoffset': '1, 1'
				},
				'RenderMode': 'svg'
			});

			plumb.registerEndpointTypes({
				'left': {'anchor': 'Left'},
				'right': {'anchor': 'Right'},
				'top': {'anchor': 'Top'},
				'bottom': {'anchor': 'Bottom'}
			});
		},

		getPlumb: function () {
			return plumb;
		},

		addAllEndpoints: function (nodes) {
			var $nodes = $(nodes);
			var endpointOptions = {
				'isSource': true,
				'isTarget': true
			};

			$.each(['top', 'right', 'bottom', 'left'], function () {
				var type = this;
				var points = plumb.addEndpoint($nodes, endpointOptions);
				points = (Object.prototype.toString.call(points) === '[object Array]') ? points : [points];

				$.each(points, function () {
					this.addType(type);
				});
			});
		},

		getEndpointByAnchorData: function (nodeId, anchorData) {
			var neededEndpoint;
			plumb.selectEndpoints({'element': nodeId}).each(function (endpoint) {
				if (endpoint.anchor.x == anchorData[0] && endpoint.anchor.y == anchorData[1]) neededEndpoint = endpoint;
			});
			return neededEndpoint;
		},

		verticalCenterAlign: function (elCollection) {
			$(elCollection).each(function () {
				var $el = $(this);
				var $parent = $el.parent();
				var marginTop = ($parent.height() - parseFloat($parent.css('padding-top')) - $el.height()) / 2;
				$el.css('margin-top', marginTop);
			});
		},

		renderMap: function () {

			if (localStorage.mapData) {

				var mapData = JSON.parse(localStorage.mapData);

				/* load nodes */

				var $nodes = $();
				$.each(mapData.nodes, function (index, o) {
					var nodeObj = {
						'id': o.id,
						'class': 'node' + ' ' + o.nodeType,
						'css': {
							'left': o.left,
							'top': o.top,
							'width': o.width,
							'height': o.height
						},
						'data': {
							'nodeType': o.nodeType
						}
					};

					var textWrapperObj = {
						'class': 'text-wrapper',
						'html': o.html
					};

					var $textWrapper = $('<span/>', textWrapperObj);

					var $newNode = $('<div/>', nodeObj).append($textWrapper);

					$nodes = $nodes.add($newNode);
				});

				$container.append($nodes);

				_t.verticalCenterAlign($nodes.not('.head-block, .dev-block').find('.text-wrapper'));
				_t.addAllEndpoints($nodes);

				/* load connections */

				$.each(mapData.connections, function (index, c) {
					var source = _t.getEndpointByAnchorData(c.source, c.anchors[0]);
					var target = _t.getEndpointByAnchorData(c.target, c.anchors[1]);
					plumb.connect({
						'source': source,
						'target': target
					});
				});
			}
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