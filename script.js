function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var forumid = getUrlVars()['forumid'];

if(localStorage['hidden' + forumid]) {
	var hidden_threads = localStorage['hidden' + forumid].split(',');
} else {
	var hidden_threads = Array();
}




$(document).ready(function() {
	
	if(hidden_threads) {
		console.log(hidden_threads.toString());
		$(hidden_threads.toString()).addClass('hidden');
	}
})


function hide_thread(thread_id) {
	var thread_selector = '#' + thread_id;
	
	if($.inArray(thread_selector, hidden_threads) == -1 && forumid) {
		console.log("Hiding thread: " + thread_id + " in forum: " + forumid);
		hidden_threads.push(thread_selector);
		localStorage['hidden' + forumid] = hidden_threads;
		$(thread_selector).addClass('hidden');
	}
	
}

function unhide_thread(thread_id) {
	var thread_selector = '#' + thread_id;
	var index = $.inArray(thread_selector, hidden_threads);
	if(index >= 0) {
		console.log("Unhiding thread: " + thread_id + " in forum: " + forumid);
		hidden_threads.splice(index,1);
		localStorage['hidden' + forumid] = hidden_threads;
		$(thread_selector).removeClass('hidden_disabled');
	}
}

function display_hidden() {
	$('tr.hidden').addClass('hidden_disabled');
	$('tr.hidden').removeClass('hidden');
}


function messageHandler(event) {
	switch(event.name) {
		case 'hide_thread':
			var threadid = event.message;
			hide_thread(threadid);
			break;
		case 'unhide_thread':
			var threadid = event.message;
			unhide_thread(threadid);
			break;
		case 'display_hidden':
			display_hidden();
			break;
	}
}

function handleContextMenu(event)
{
    var userInfo = {
    	name: event.target.nodeName,
        thread_id: event.target.parentElement.parentElement.id,
        is_hidden: event.target.parentElement.parentElement.className.search('hidden') >= 0,
    }
    safari.self.tab.setContextMenuEventUserInfo(event, userInfo)
}

safari.self.addEventListener("message", messageHandler, false);
window.addEventListener("contextmenu", handleContextMenu, false);

