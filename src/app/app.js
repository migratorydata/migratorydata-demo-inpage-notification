const MigratoryDataClient = require("migratorydata-client");
const ClipboardJS = require('clipboard');

// the default address of the MigratoryData Server installed on local machine.
var SERVER = "https://demo.migratorydata.com";

// the subject used to receive messages fromMigratoryData Server.
var SUBJECT = "/push/notification";

// default EntitlementToken used in MigratoryData Server.
var TOKEN = "some-token";

document.addEventListener('DOMContentLoaded', function() {
	initUI();

	// init the MigratoryData client
	let client = new MigratoryDataClient();
	client.setEntitlementToken(TOKEN);
	client.setServers([SERVER]);

	client.setStatusHandler(function(event) {
        console.log("Status : " + event.type + " : " + event.info);
    });
	
	client.setMessageHandler(function(message) {
		if (message.type != MigratoryDataClient.MESSAGE_TYPE_SNAPSHOT) {
			console.log(message);

			displayNotification(message);
		}
	});

	client.subscribe([SUBJECT]);

	client.connect();
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