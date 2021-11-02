// the default address of the MigratoryData Server installed on local machine.
var SERVER = "http://127.0.0.1:8800";

// the subject used to receive messages fromMigratoryData Server.
var SUBJECT = "/push/notification";

// default EntitlementToken used in MigratoryData Server.
var TOKEN = "some-token";

document.addEventListener('DOMContentLoaded', function() {
	initUI();

	// init the MigratoryData client
	MigratoryDataClient.setEntitlementToken(TOKEN);
	MigratoryDataClient.setServers([SERVER]);

	MigratoryDataClient.setStatusHandler(function(event) {
        console.log("Status : " + event.type + " : " + event.info);
    });
	
	MigratoryDataClient.setMessageHandler(function(message) {
		if (message.type != MigratoryDataClient.MESSAGE_TYPE_SNAPSHOT) {
			console.log("Message : " + message);

			displayNotification(message);
		}
	});	
	MigratoryDataClient.connect();
	MigratoryDataClient.subscribe([SUBJECT]);
});

function initUI() {
	// init the UI
	document.getElementById("curl_textarea").value = "curl -d \"my realtime message\" -X POST \"" + SERVER + "/rest/produce?token=" + TOKEN + "&subject=" + SUBJECT + "\"";

	// init copy and tooltip
	var clipboard = new ClipboardJS('.copy-button');
	clipboard.on('success', function(e) {
		e.clearSelection();
		document.getElementsByClassName("tooltiptext")[0].innerHTML = "Copied";
		setTimeout(function(){ document.getElementsByClassName("tooltiptext")[0].innerHTML = "Copy"; }, 600);
	});
};

function displayNotification(message) {
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