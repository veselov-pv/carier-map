var mapperEditor = new function () {
	var gridStep, plumb, _t, $container;

	return {
		initModule: function () {
			_t = this;
			$container = _t.getContainer();
			plumb = _t.getPlumb();
			_t.initEditStyle();
		},
		removeNode: function () {
			var node = $(this).parent('.node').get(0);
			plumb.detachAllConnections(node);
			plumb.removeAllEndpoints(node);
			plumb.detach(node);
			$(node).remove();
		},
		getGeneratedId: function () {
			var id = null;
			while (id == null) {
				var rnd = Math.round(Math.random() * 1000);
				var generatedId = 'node' + rnd;
				if ($('#' + generatedId).length) continue;
				id = generatedId;
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
				}
			};

			var textWrapperObj = {
				class: 'text-wrapper',
				text: 'New node'
			};

			var $newNode = $('<div/>', defaultObj).append($('<span/>', textWrapperObj));

			_t.contentEditable($newNode);
			_t.draggable($newNode);
			_t.resizable($newNode);
			_t.removable($newNode);

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
			mode = (mode === false); // inverse, not '!=' because only for strict false
			var step = _t.getGridStep();
			$(el).draggable({
				grid: [step, step],
				containment: 'parent',
				disabled: mode,
				//stack: '.node',  // high z-index for current draggable element
				start: function () {
				},
				drag: function () {
					plumb.repaintEverything();
				},
				stop: function () {
					plumb.repaintEverything();
				}
			});
		},
		removable: function (nodeSelector, mode) {
			var $nodeCollection = $(nodeSelector);
			if (mode === false) {
				$nodeCollection.find('.remove-button').remove();
				return;
			}
			$nodeCollection.each(function () {
				var removeBtnSetObj = {
					class: 'remove-button',
					title: 'Delete',
					click: _t.removeNode
				};
				var $removeBtn = $('<div/>', removeBtnSetObj);

				$(this).append($removeBtn);
			});
		},
		placeCaretAtEnd: function (el) {
			el.focus();
			if ($(el).text() == '') return;
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
			$(el).find('>*').not('.text-wrapper').prop('contenteditable', false);

			$(el).on('dblclick',function () {
				_t.draggable(this, false);
				$(this).addClass('editing');
				var $textWr = $(this).find('.text-wrapper');
				$textWr.prop('contenteditable', true);
				_t.placeCaretAtEnd($textWr.get(0));
			}).on('click', function () {
					if (!$('.editing').not(this).size()) return;
					$('.node').not(this).find('.text-wrapper').trigger('blur');
				});
			$(el).find('.text-wrapper').on('blur', function () {
				$(this).prop('contenteditable', false);
				var $parentNode = $(this).parent('.node');
				$parentNode.removeClass('editing');
				_t.draggable($parentNode);
			});
		},
		save: function () {

			/* save nodes */
			var $nodeCollection = $('.node');
			_t.resizable($nodeCollection, false);
			_t.removable($nodeCollection, false);
			var nodes = [];
			$nodeCollection.each(function () {
				nodes.push({
					id: $(this).attr('id'),
					html: $(this).find('.text-wrapper').html(),
					left: $(this).css('left'),
					top: $(this).css('top'),
					width: $(this).css('width'),
					height: $(this).css('height')
				});
			});
			_t.resizable($nodeCollection);
			_t.removable($nodeCollection);

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
		buildGrid: function () {
			var $nodeCollection = $('.node');
			var gridSelectorValue = $('.edit-panel .grid-selector').val();

			_t.setGridStep(parseInt(gridSelectorValue));
			$container.removeClass('grid-10px grid-20px');
			$container.addClass('grid-' + gridSelectorValue);

			_t.draggable($nodeCollection); // reload grid step
			_t.resizable($nodeCollection); // reload grid step
		},
		removeConnection: function (connection) {
			plumb.detach(connection);
		},
		initEditStyle: function () {
			plumb.Defaults.Endpoint = [ "Dot", { radius: 7 } ];
			plumb.Defaults.EndpointStyle = { strokeStyle: '#aaa', lineWidth: 1 };
			plumb.Defaults.EndpointHoverStyle = { strokeStyle: '#666', lineWidth: 2 };
			plumb.Defaults.HoverPaintStyle = { strokeStyle: '#333' };

			$container.parent().addClass('mapper-edit-mode');
		},
		buildEditControls: function () {
			var $editPanel = $('<div/>', {
				class: 'edit-panel'
			});
			var $addBtn = $('<button/>', {
				class: 'add-btn',
				text: 'Add node'
			});
			var $saveBtn = $('<button/>', {
				class: 'save-btn',
				text: 'Save'
			});
			var $gridSelectorLabel = $('<label/>', {
				for: 'gridSelector',
				text: 'Grid'
			});
			var $gridSelector = $('<select/>', {
				id: 'gridSelector',
				class: 'grid-selector'
			});
			var optionValueArray = ['10px', '20px'];
			for (var i = 0; i < 2; i++) {
				$('<option/>', {
					value: optionValueArray[i],
					text: optionValueArray[i],
					selected: (i == 0)
				}).appendTo($gridSelector);
			}
			$editPanel.append($addBtn).append($saveBtn).append($gridSelectorLabel).append($gridSelector).insertBefore($container);
		},
		afterRenderAction: function () {
			_t.draggable('.node');
			_t.resizable('.node');
			_t.contentEditable('.node');
			_t.removable('.node');

			_t.buildEditControls();
			$('.edit-panel .add-btn').on('click', _t.addNode);
			$('.edit-panel .save-btn').on('click', _t.save);
			$('.edit-panel .grid-selector').on('change', _t.buildGrid);

			plumb.bind('dblclick', _t.removeConnection);
			_t.buildGrid();
		}
	}
};

/* TODO: fix content editable mode - caret position strange behavior on dblclick in multiline text */
/* TODO: !!! vertical centering of node titles !!! */
/* TODO: addNode() common approach */
/* TODO: all css-selectors replace to variables. create css-selectors library */
/* TODO: create editable method (draggable, resizable... in one block) */
/* TODO:  !!! different types of nodes !!! */
