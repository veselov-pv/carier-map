$(document).ready(function () {
	mapper.init({container: '#container'});
	mapper.addModule(mapperEditor);
	mapper.renderMap();
});