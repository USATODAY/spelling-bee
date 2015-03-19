//Created simple plugin to detect touchstart
;(function($){
    $.fn.extend({  touch: function(func) {  return this.each(function() { 	this.addEventListener("touchstart",func)   });  }   });
})(jQuery)

$(function(){
	objImmerse.arrHTMLTag = jQuery("html");
	objImmerse.arrPageContainer = jQuery(".page-container");
	objImmerse.arrPanelWindow = jQuery(".panel-window");
	objImmerse.arrVideos = jQuery("video");
	objImmerse.arrAudios = jQuery("audio");
	objImmerse.arrPanels = jQuery(".panel");
	objImmerse.arrAudioPlayButtons = jQuery(".audio-button");
	objImmerse.arrCheckButton = jQuery(".check-button");
	objImmerse.arrSpellingContainer = jQuery(".spelling-container");
	objImmerse.arrCorrect = jQuery(".correct");
	objImmerse.arrNextButton = jQuery(".next-button");
	objImmerse.arrSpellingForm = jQuery(".word-input");
	objImmerse.arrSpellingButton = jQuery(".spelling-button");
	objImmerse.arrSpellingSubmit = jQuery(".spelling-form");
	objImmerse.arrIntroButton = jQuery(".intro-button");
	objImmerse.arrIntro = jQuery(".intro-container");
	objImmerse.arrMain = jQuery(".spelling-container");
	objImmerse.arrNumber = jQuery(".number-string");
	var blnIframeEmbed = window != window.parent;
	if ((jQuery.browser.mobile) && (!objImmerse.arrHTMLTag.hasClass("touch"))) {
		objImmerse.arrHTMLTag.addClass("touch");
	}
	if (blnIframeEmbed) {
		jQuery("#header").css({"display" : "none"});
		jQuery(".section").css({"top" : "10%"});
	} 
	window.addEventListener("orientationchange", function() {
		objImmerse.reformatPage();
	}, false);
	onresize=onload=function(){
		objImmerse.reformatPage();
	}
	objImmerse.shuffleAnswers(objImmerse.arrWords);
	objImmerse.addEventListeners();
 })
 
var objImmerse = objImmerse || {};
objImmerse.arrHTMLTag = [];
objImmerse.arrPageContainer = [];
objImmerse.arrPanelWindow = [];
objImmerse.arrVideos = [];
objImmerse.arrPanels = [];
objImmerse.arrAudioPlayButtons = [];
objImmerse.arrAudios = [];
objImmerse.arrNextButton = [];
objImmerse.currentWord = 0;
objImmerse.currentVideo = 0;
objImmerse.currentAudio = 0;
objImmerse.totalWords = 7;
objImmerse.numCorrect = 0;
objImmerse.arrCheckButton = [];
objImmerse.arrSpellingContainer = [];
objImmerse.arrCorrect = [];
objImmerse.arrNextButton = [];
objImmerse.arrSpellingForm = [];
objImmerse.arrSpellingSubmit = [];
objImmerse.arrSpellingButton = [];
objImmerse.arrIntroButton = [];
objImmerse.arrIntro = [];
objImmerse.arrMain = [];
objImmerse.arrNumber = [];
objImmerse.numWindowWidth = window.innerWidth;
objImmerse.arrWords = ["appoggiatura", "autochthonous", "demarche", "guerdon", "knaidel", "laodicean", "pococurante", "prospicience", "stromuhr", "succedaneum", "ursprache"];

objImmerse.reformatPage = function() {
	objImmerse.numWindowWidth = window.innerWidth;
	if (window.innerWidth / window.innerHeight < 1920 / 1080) {
		var numWidth = 100 * ((1920 / 1080) / (window.innerWidth / window.innerHeight));
		objImmerse.arrVideos.css({"width" : numWidth.toString() + "%", "left" : ((100 - numWidth) / 2).toString() + "%"});
	} else {
		objImmerse.arrVideos.css({"width" : "100%", "left" : "0%"});
	}
}

objImmerse.addEventListeners = function() {
	objImmerse.arrAudioPlayButtons.click(function(e) {
		var _this = jQuery(this);
		var intIndex = objImmerse.arrAudioPlayButtons.index(this);
		objImmerse.audioPlayClip(intIndex);
		Analytics.click("audioPlayed" + intIndex.toString());
	});

	objImmerse.arrIntroButton.click(function(e) {
		objImmerse.arrIntro.addClass("hidden");
		objImmerse.arrMain.removeClass("hidden");
		objImmerse.setUpQuestion(0);
	});
	objImmerse.arrCheckButton.on("click", function(event) {
		objImmerse.checkAnswer();
		Analytics.click("checkAnswer" + objImmerse.currentWord.toString());
	});

	objImmerse.arrNextButton.on("click", function() {		
		if (objImmerse.currentWord >= objImmerse.totalWords - 1) {
			document.location.reload();
		} else {
			objImmerse.setUpQuestion(objImmerse.currentWord + 1);
		}
		Analytics.click("NextButton" + objImmerse.currentWord.toString());
	});
	
	objImmerse.arrVideos[2].addEventListener("ended", function () {
		objImmerse.setVideos(1);
		objImmerse.arrNextButton.addClass("show");
		Analytics.click("videoComplete" + objImmerse.currentWord.toString());
	});
	
	objImmerse.arrVideos[3].addEventListener("ended", function () {
		objImmerse.setVideos(1);
		objImmerse.arrNextButton.addClass("show");
		Analytics.click("videoComplete" + objImmerse.currentWord.toString());
	});
	objImmerse.arrSpellingSubmit.submit(function(event) {
		event.preventDefault();
		objImmerse.arrCheckButton.trigger("click");
	});
	objImmerse.arrSpellingButton.click(function(e) {
		objImmerse.arrCorrect.find("h2").html(objImmerse.arrWords[objImmerse.currentWord]);
	});
	objImmerse.setVideos(0);
}

objImmerse.setUpQuestion = function(intWord) {
	var arrSources = [];
	var strWordNum = "";
	objImmerse.setVideos(1);
	if (intWord >= objImmerse.totalWords) {
		intWord = 0;
		objImmerse.currentWord = 0;
	} else {
		objImmerse.currentWord = intWord;
	}
	jQuery.each(objImmerse.arrAudios, function (index) {
		arrSources = objImmerse.arrAudios.eq(index).find("source");
		switch (index) {
			case 0: 
				jQuery.each(arrSources, function(sourceIndex) {
					if (sourceIndex == 0) {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-word.mp3", "type": "audio/mpeg"}).detach().appendTo(objImmerse.arrAudios.eq(index));
					} else {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-word.ogg", "type": "audio/ogg"}).detach().appendTo(objImmerse.arrAudios.eq(index));						
					}
				});
				objImmerse.arrAudios.eq(index).load();
				break;
			case 1: 
				jQuery.each(arrSources, function(sourceIndex) {
					if (sourceIndex == 0) {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-definition.mp3", "type": "audio/mpeg"}).detach().appendTo(objImmerse.arrAudios.eq(index));
					} else {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-definition.ogg", "type": "audio/ogg"}).detach().appendTo(objImmerse.arrAudios.eq(index));						
					}
				});
				objImmerse.arrAudios.eq(index).load();
				break;
			case 2: 
				jQuery.each(arrSources, function(sourceIndex) {
					if (sourceIndex == 0) {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-origin.mp3", "type": "audio/mpeg"}).detach().appendTo(objImmerse.arrAudios.eq(index));
					} else {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-origin.ogg", "type": "audio/ogg"}).detach().appendTo(objImmerse.arrAudios.eq(index));						
					}
				});
				objImmerse.arrAudios.eq(index).load();
				break;
			case 3: 
				jQuery.each(arrSources, function(sourceIndex) {
					if (sourceIndex == 0) {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-sentence.mp3", "type": "audio/mpeg"}).detach().appendTo(objImmerse.arrAudios.eq(index));
					} else {
						arrSources.eq(sourceIndex).attr({"src": "http://usatoday30.usatoday.com/exp/spelling-bee/media/audio/" + objImmerse.arrWords[intWord] + "-sentence.ogg", "type": "audio/ogg"}).detach().appendTo(objImmerse.arrAudios.eq(index));						
					}
				});
				objImmerse.arrAudios.eq(index).load();
				break;
		}
	});
	switch (intWord) {
		case 0:
			strWordNum = "first";
			break;
		case 1:
			strWordNum = "second";
			break;
		case 2:
			strWordNum = "third";
			break;
		case 3:
			strWordNum = "fourth";
			break;
		case 4:
			strWordNum = "fifth";
			break;
		case 5:
			strWordNum = "sixth";
			break;
		case 6:
			strWordNum = "seventh";
			break;
	}
	objImmerse.arrNumber.html(strWordNum);
	objImmerse.arrSpellingForm[0].value = "";
	objImmerse.arrSpellingContainer.removeClass("hidden");
	objImmerse.arrCorrect.addClass("hidden");	
}

objImmerse.checkAnswer = function() {
	var strShareHead, strShareChatter;
	var strTwitterURL = window.location.href;
	var strPageURL = document.location.href;
	if (!objImmerse.arrAudios[objImmerse.currentAudio].paused) {
		objImmerse.arrAudios[objImmerse.currentAudio].pause();
	}
	if (strPageURL.indexOf("#") != -1) {
		strPageURL = strPageURL.substr(0, strPageURL.indexOf("#"));
	}
	if (objImmerse.arrWords[objImmerse.currentWord].toLowerCase() === objImmerse.arrSpellingForm[0].value.toLowerCase()) {
		objImmerse.arrCorrect.find("h2").html("Correct!");
		objImmerse.arrCorrect.removeClass("wrong");
		objImmerse.setVideos(2);
		strShareChatter = "I got it right! Think you could spell any of the winning words from previous National Spelling Bees?";
		objImmerse.numCorrect = objImmerse.numCorrect + 1;
	} else {
		objImmerse.arrCorrect.find("h2").html("Wrong!");
		objImmerse.arrCorrect.addClass("wrong");
		objImmerse.setVideos(3);
		strShareChatter = "This is hard! Think you could spell any of the winning words from previous National Spelling Bees?";
	}
	if (objImmerse.currentWord >= objImmerse.totalWords - 1) {
		objImmerse.arrCorrect.find("h2").after("<h3>You got " + objImmerse.numCorrect + " out of " + objImmerse.totalWords + " correct.</h3>");
		strShareChatter = "I got " + objImmerse.numCorrect + " out of " + objImmerse.totalWords + " correct. Can you do better?";
		objImmerse.arrNextButton.html("Start Over");
	}
	//objImmerse.arrNextButton.removeClass("show");
	strShareHead = "Winning Words";
	strShareHead = strShareHead.replace(/'/gi, "\\'");
	strShareChatter = strShareChatter.replace(/'/gi, "\\'");
	objImmerse.arrCorrect.find(".fbshare").attr({"href" : "javascript: var sTop=window.screen.height/2-(218);var sLeft=window.screen.width/2-(313);window.open('https://www.facebook.com/dialog/feed?display=popup&app_id=215046668549694&link=" + encodeURIComponent(strPageURL) + "&picture=" + strPageURL.substr(0, strPageURL.lastIndexOf("/") + 1) + "img/fb-post.jpg&name=" + encodeURIComponent(strShareHead) + "&description=" + encodeURIComponent(strShareChatter) + "&redirect_uri=http://usatoday30.usatoday.com/_common/_dialogs/fb-share-done.html','sharer','toolbar=0,status=0,width=580,height=400,top='+sTop+',left='+sLeft);Analytics.click('Facebook share');void(0);"});
	objImmerse.arrCorrect.find(".tshare").attr({"href" : "javascript: window.open('https://twitter.com/intent/tweet?url=" + encodeURIComponent(strTwitterURL) + "&text=" + encodeURIComponent(strShareChatter) + "&via=usatoday', 'twitterwindow', 'height=450, width=550, top=200, left=200, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');Analytics.click('Twitter share');void(0);"});
	objImmerse.arrCorrect.find(".eshare").attr({"href" : "mailto:?body=" + strShareChatter + " %0d%0d " + encodeURIComponent(strPageURL) + "&subject=" + strShareHead});
	objImmerse.arrSpellingContainer.addClass("hidden");
	objImmerse.arrCorrect.removeClass("hidden");
}

objImmerse.audioPlayClip = function(intAudio) {
	if (!objImmerse.arrAudios[objImmerse.currentAudio].paused) {
		objImmerse.arrAudios[objImmerse.currentAudio].pause();
	}
	if ((Modernizr.touch) || (jQuery.browser.mobile)) {
		objImmerse.arrAudios[intAudio].load();
	}
  	objImmerse.arrAudios[intAudio].play();
  	objImmerse.currentAudio = intAudio;
}

objImmerse.setVideos = function(intVideo) {
	if (!jQuery.browser.mobile) {
		if (!objImmerse.arrVideos[objImmerse.currentVideo].paused) {
			objImmerse.arrVideos[objImmerse.currentVideo].pause();
			objImmerse.arrVideos[objImmerse.currentVideo].load();
		}
		objImmerse.arrVideos[intVideo].play();
		objImmerse.arrVideos.removeClass("play").eq(intVideo).addClass("play");
		objImmerse.currentVideo = intVideo;
	}
}

objImmerse.shuffleAnswers = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
