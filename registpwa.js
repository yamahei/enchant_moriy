window.addEventListener('load', function() {
	if ('serviceWorker' in navigator) {
		const path_to_service_worke = "/enchant_moriy/pwabuilder-sw.js";
		const register_option = {};//{scope: "."};
		navigator.serviceWorker.register(path_to_service_worke, register_option)
		.then(function(registration) {
			console.log("serviceWorker registed.");
		}).catch(function(error) {
			console.warn("serviceWorker error.", error);
		});
	}
});

