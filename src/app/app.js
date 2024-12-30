const MigratoryDataClient = require("migratorydata-client");
const ClipboardJS = require('clipboard');

var CONTENT = 'Hello, World!';

// the default address of the MigratoryData Server installed on local machine.
var SERVER = "https://cloud.migratorydata.com";

// the subject used to receive messages fromMigratoryData Server.
var SUBJECT = "/migratorydata/notification/" + getPushNotificationDemoId();

// default EntitlementToken used in MigratoryData Server.
var TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NmIyMGUzZmExMmUyMC43NTI5MjY4MCIsImlhdCI6MTcyMjk0NTA4Ny42NTkyNywiZXhwIjoxNzU0NDgxMDg3LjY1OTI3LCJwZXJtaXNzaW9ucyI6eyJhbGwiOlsiL21pZ3JhdG9yeWRhdGEvbm90aWZpY2F0aW9uLyoiXX19.609S936WTW7v2iR7P5Epmfs1qaDK97z9BGq4YDvd4PU";

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
	document.getElementById("curl_textarea").innerHTML = "<div style=\"text-align:left;color:#333333;\"><code class=\"language-bash\" data-lang=\"bash\"><span style=\"color:#FF5733;\">SUBJECT</span>='" + SUBJECT + "' <br><span style=\"color:#FF5733;\">CONTENT</span>='" + CONTENT + "' <br><div class=\"truncate\"><span style=\"color:#FF5733;\">TOKEN</span>='" + TOKEN + "'</div> <br><span style=\"color:#272822;\">curl -d \"<span style=\"color:#FF5733;\">\$CONTENT</span>\" -X POST</span> \"" + SERVER + "/rest/produce?token=<span style=\"color:#FF5733;\">\$TOKEN</span>" + '&' + "subject=<span style=\"color:#FF5733;\">\$SUBJECT</span>\"</code></div>";

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
