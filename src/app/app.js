document.addEventListener('DOMContentLoaded', function() {
	// init the UI
	document.getElementById("curl_textarea").value = "curl -d \"my realtime message\" -X POST \"" + SERVER + "/rest/produce?token=" + TOKEN + "&subject=" + SUBJECT + "\"";

	// init copy and tooltip
	var clipboard = new ClipboardJS('.copy-button');
	clipboard.on('success', function(e) {
		e.clearSelection();
		document.getElementsByClassName("tooltiptext")[0].innerHTML = "Copied";
		setTimeout(function(){ document.getElementsByClassName("tooltiptext")[0].innerHTML = "Copy"; }, 600);
	});

	// init the MigratoryData client
	MigratoryDataClient.setEntitlementToken(TOKEN);
	MigratoryDataClient.setServers([SERVER]);
	MigratoryDataClient.setStatusHandler(function(event) {
        console.log("Status : " + event.type + " : " + event.info);
    });
	MigratoryDataClient.setMessageHandler(function(message) {
		if (message.type != MigratoryDataClient.MESSAGE_TYPE_SNAPSHOT) {
			// add text
			console.log(message);

			document.getElementById("notification-message").innerHTML += message.content + "</br>";
			
			// show notification
			var element = document.getElementById("notification-container");
			element.style.display = "block";
		
			document.getElementById("notification-close").addEventListener('click', function () {
			  var element = document.getElementById("notification-container");
			  element.style.display = "none";
		
			  document.getElementById("notification-message").innerHTML = "";
			}, false);
		}
	});	
	MigratoryDataClient.connect();
	MigratoryDataClient.subscribe([SUBJECT]);
});