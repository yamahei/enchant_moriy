window.addEventListener('load', function() {
	if ('serviceWorker' in navigator) {
		const path_to_service_worke = "pwabuilder-sw.js";
		const register_option = {scope: "/enchant_moriy/"};
		navigator.serviceWorker.register(path_to_service_worke, register_option)
		.then(function(registration) {
			console.log("serviceWorker registed.");
		}).catch(function(error) {
			console.warn("serviceWorker error.", error);
		});
	}
});

