const MigratoryDataClient = require("migratorydata-client");
const ClipboardJS = require('clipboard');

// the default address of the MigratoryData Server installed on local machine.
var SERVER = "https://cloud.migratorydata.com";

// the subject used to receive messages fromMigratoryData Server.
var SUBJECT = "/migratorydata/notification/" + getPushNotificationDemoId();

// default EntitlementToken used in MigratoryData Server.
var TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1NzhmZDAiLCJwZXJtaXNzaW9ucyI6eyJhbGwiOlsiL21pZ3JhdG9yeWRhdGEvbm90aWZpY2F0aW9uLyoiXX0sImFwcCI6Im5vdGlmaWNhdGlvbiIsImlhdCI6MTY5MTYwMTE2OCwiZXhwIjoxNzIyNzA1MTY4fQ.C9yGVC6j0w-mscbYyXEWQ8Nf-8GFuqjNj0SoOOiU4Ow";

function generateRandomId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function getPushNotificationDemoId() {
  var id = localStorage.getItem('notificationDemoId');
  if (id) {
    return id;
  }

  id = "id_" + generateRandomId(4);
  localStorage.setItem('notificationDemoId', id);
  return id;
};


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
