


function preventBehavior(e) {
	e.preventDefault();
}

document.addEventListener("DOMContentLoaded",init);


/////////////////////////////////////////////////////////////////////////

var currentNum = 0;
var numbers = ["zero","ichi","ni","san","yon","go","lok","nana","hachi","kyu","jyu"];
//var huns = ["","","hyaku","byaku","hyaku","hyaku","ppyaku","hyaku","

// I like the first one, so shoot me
var bgs = ["assets/BG3.png","assets/BG5.png","assets/BG3.png","assets/BG4.png"];
var randomBG = new Date().getMilliseconds() % 4;

var currentView = "easyDiv";

function init() {

	getNumber();
	
	mQ(".numBtn").forEach(function(item){
		item.addEventListener("mousedown",onTableCellClick);
	});

	mQ("#info")[0].addEventListener("mousedown",getNumber);
	mQ(".delBtn")[0].addEventListener("mousedown",onDelClick);
	mQ(".solveBtn").forEach(function (item) {
		item.addEventListener("mousedown",getAnswer); 
	});
	
	loadNextBG();
	
	doSelected(0);
}


function loadNextBG() {

	randomBG++;
	randomBG %= 4;
	mQ("#bodyBG")[0].style.backgroundImage = "url(" + bgs[randomBG] + ")";
	setTimeout(loadNextBG,60000);
}

function getNumber() {

	var n = Math.floor(Math.random() * 100);
	currentNum = n;
	updateCurrentNumber();
	return n;
}


function initAds() {

	document.addEventListener("iAdBannerViewDidFailToReceiveAdWithErrorEvent",onAdLoadFailed,false);
	document.addEventListener("iAdBannerViewDidLoadAdEvent",onAdLoadSuccess,false);
	
	window.plugins.iAdPlugin.prepare(true);
}

function onAdLoadSuccess() {
	window.plugins.iAdPlugin.showAd(true);
}

function onAdLoadFailed() {
	window.plugins.iAdPlugin.showAd(false);
}

function updateCurrentNumber() {

	mQ(".currentNumber").forEach(function(elem){
		elem.innerText = currentNum + "";
	});
	mQ(".answerDiv").forEach(function(elem){
		elem.innerText = "?";
	});
}

function onTableCellClick(e) {
	var num = parseInt(e.currentTarget.innerHTML);
	currentNum = (currentNum * 10 + num) % 100;
	updateCurrentNumber();

}

function onDelClick(e) {
	currentNum = 0;
	updateCurrentNumber();
}


function tweenCallback() {
	//alert("wtf!");
}


function doSelected(arg) {
	
    var left="0px";
	var bgLeft = "0px";
	var tabBGPos = "-260px";

    switch(arg)
    {
        case 1 : //"entryDiv" : 
        {
            left = "-320px";
			bgLeft = "-80px";
			tabBGPos = "-160px";
            break;
        }
        case 2 : // "aboutDiv" : 
        {
            left = "-640px";
			bgLeft = "-160px";
			tabBGPos = "-60px";
            break;
        }
    }
    
    mQ("#easyDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";
    mQ("#entryDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";
    mQ("#aboutDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";    
	mQ("#bodyBG")[0].style.transform = "translate3D(" + bgLeft + ",0px,0px)";   
	mQ("#tabSelector")[0].style.transform = "translate3D(" + tabBGPos + ",0px,0px)";

	currentView = arg;
	
}

function getAnswer() {
	var answer = "";
	var ones = currentNum % 10;
	var tens = ((currentNum % 100 ) - ones) / 10;
	
	if(currentNum == 0) // special case
	{
		answer += numbers[ones];
	}
	else
	{
		if(tens > 0)
		{
			answer += tens == 1 ? "jyu " : numbers[tens] + " jyu ";
		}
	
		if(ones > 0)
		{
			answer += numbers[ones];
		}
	}
	
	mQ(".answerDiv").forEach(function(elem) {
		elem.innerText = answer;
	});
}




















