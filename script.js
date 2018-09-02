// Options
const CLIENT_ID = '______________';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('enter-button');
const signoutButton = document.getElementById('exit-button');
const content = document.getElementById('content');

// default youtube channel
const defaultChannel = 'googledevelopers';

// Load auth2 library
function handleClientLoad(){
	gapi.load('client:auth2', initClient);
}

// Init API client library and set up sing in listeners
function initClient(){
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(() => {
		// Listen for sing state changes
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle initial sign in state
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignouClick;
	});
}

// update UI sign in state changes
function updateSigninStatus(isSignedIn){
	if(isSignedIn){
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		content.style.display = 'block';
		getChannel(defaultChannel);
	}else{
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
		content.style.display = 'none';
	}
}

// Handle Login
function handleAuthClick(){
	gapi.auth2.getAuthInstance().signIn();
}

// Handle Logout
function handleSignouClick(){
	gapi.auth2.getAuthInstance().signOut();
}

// Display channel Data
function showChannelData(data){
	const channelData = document.getElementById('channel-data');
	channelData.innerHTML = data;
}

// Get channel from API
function getChannel(channel){
	gapi.client.youtube.channels
	.list({
		part: 'snippet,contentDetails,statistics',
		forUsername: channel
	})
	.then(response => {
		console.log(response);
		const channel = response.result.items[0];
		
		const output = `
			<ul class="collection">
				<li class="collection-item">Title: ${channel.snippet.title}</li>
				<li class="collection-item">ID: ${channel.id}</li>
				<li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
				<li class="collection-item">Views: ${channel.statistics.viewCount}</li>
				<li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
			</ul>
			<p>${channel.snippet.description}</p>
			<hr />
			<a class="btn red darken-2" target="_blnak" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
		`;
		showChannelData(output);
	})
	.catch(err => alert('No Channel By THat Name'));
}