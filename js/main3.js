$(document).ready(function () {
	var pastMapDataString = localStorage.getItem('mapData');
	var exampleMap = {"nodes":[{"id":"node275","nodeType":"dev-node","html":"Project Manager","left":"400.467px","top":"530.467px","width":"139.76666px","height":"19.76666px"},{"id":"node551","nodeType":"dev-node","html":"Technical Leader","left":"230.117px","top":"630.117px","width":"149.76666px","height":"19.76666px"},{"id":"node829","nodeType":"dev-node","html":"Architect","left":"250px","top":"530px","width":"109.76666px","height":"19.76666px"},{"id":"node739","nodeType":"dev-node","html":"Development/Test Manager","left":"590.467px","top":"530.467px","width":"239.76666px","height":"19.76666px"},{"id":"node83","nodeType":"dev-node","html":"Program Manager","left":"390px","top":"460px","width":"159.76666px","height":"19.76666px"},{"id":"node979","nodeType":"manager-node","html":"Senior Specialist","left":"250.117px","top":"710.117px","width":"439.76666px","height":"19.76666px"},{"id":"node160","nodeType":"manager-node","html":"Regular Specialist","left":"250.233px","top":"780.233px","width":"439.76666px","height":"19.76666px"},{"id":"node615","nodeType":"director-node","html":"Junior Specialist","left":"250.117px","top":"850.117px","width":"439.76666px","height":"19.76666px"},{"id":"node377","nodeType":"head-node","html":"CFO","left":"220.233px","top":"60.2333px","width":"80px","height":"20px"},{"id":"node794","nodeType":"head-node","html":"CEO<br>","left":"430.233px","top":"0.233333px","width":"90px","height":"20px"},{"id":"node176","nodeType":"head-node","html":"COO","left":"350.233px","top":"60.2333px","width":"80px","height":"20px"},{"id":"node492","nodeType":"dev-node","html":"Team Leader","left":"400.117px","top":"610.117px","width":"139.76666px","height":"19.76666px"},{"id":"node75","nodeType":"head-node","html":"Vice President","left":"370px","top":"120px","width":"200px","height":"20px"},{"id":"node390","nodeType":"head-block","html":"TOP MANAGEMENT<br>","left":"120px","top":"0px","width":"730px","height":"160px"},{"id":"node364","nodeType":"director-node","html":"Delivery Manager","left":"380.233px","top":"390.233px","width":"179.76666px","height":"19.76666px"},{"id":"node628","nodeType":"director-node","html":"Account/Division Manager","left":"340.233px","top":"330.233px","width":"259.76666px","height":"19.76666px"},{"id":"node236","nodeType":"director-node","html":"Site Manager","left":"370.35px","top":"260.35px","width":"199.76666px","height":"19.76666px"},{"id":"node955","nodeType":"director-node","html":"Managing/LoB Director","left":"360px","top":"190px","width":"219.76666px","height":"19.76666px"},{"id":"node583","nodeType":"head-node","html":"CTO","left":"500.117px","top":"60.1167px","width":"80px","height":"20px"},{"id":"node34","nodeType":"head-node","html":"Executive VP","left":"640.233px","top":"60.2333px","width":"110px","height":"20px"},{"id":"node614","nodeType":"dev-block","html":"Delivery line","left":"120.233px","top":"450.233px","width":"730px","height":"420px"}],"connections":[{"connectionId":"con_245","source":"node615","target":"node160","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_249","source":"node160","target":"node979","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_265","source":"node979","target":"node492","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_269","source":"node979","target":"node551","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_277","source":"node492","target":"node275","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_281","source":"node492","target":"node739","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_285","source":"node492","target":"node829","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_289","source":"node551","target":"node829","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_389","source":"node83","target":"node364","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_421","source":"node628","target":"node236","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_425","source":"node364","target":"node628","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_433","source":"node275","target":"node83","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_481","source":"node75","target":"node34","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_485","source":"node75","target":"node583","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_489","source":"node75","target":"node176","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_493","source":"node75","target":"node377","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_497","source":"node377","target":"node794","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_501","source":"node176","target":"node794","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_505","source":"node583","target":"node794","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_509","source":"node34","target":"node794","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_529","source":"node236","target":"node955","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]},{"connectionId":"con_533","source":"node955","target":"node75","anchors":[[0.5,0,0,-1,0,0],[0.5,1,0,1,0,0]]}]};
	localStorage.setItem('mapData', JSON.stringify(exampleMap));

	mapper.init({container: '#container'});
	mapper.renderMap();

	localStorage.removeItem('mapData');
	if (pastMapDataString) {
		localStorage.setItem('mapData', pastMapDataString);
	}
});