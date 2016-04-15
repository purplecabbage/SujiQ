


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

    // window.navigator.standalone

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


function doSelected(arg) {

    var left="0px";
	var bgLeft = "0px";


	var deltaWidth = ( window.innerWidth - 640 ) / 2;
	var diff = window.innerWidth / 3;

	var tabBGPos = (deltaWidth - diff) + "px";

	//window.alert('deltaWidth ' + deltaWidth);
    var bgOffset = Math.floor(window.innerWidth / 4);

    switch(arg) {
        case 1 : { //"entryDiv" :
            left = "-100%";
			bgLeft = -bgOffset + "px";
			tabBGPos = deltaWidth + "px";
            break;
        }
        case 2 : { // "aboutDiv" :
            left = "-200%";
			bgLeft = -(2 * bgOffset) + "px";
			tabBGPos = (deltaWidth + diff) + "px";
            break;
        }
    }

    mQ("#easyDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";
    mQ("#entryDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";
    mQ("#aboutDiv")[0].style.transform = "translate3D(" + left + ",0px,0px)";
	mQ("#bodyBG")[0].style.transform = "translate3D(" + bgLeft + ",0px,0px)";
	mQ("#tabSelector")[0].style.backgroundPosition = tabBGPos + " 0";
	//mQ("#tabSelector")[0].style.transform = "translate3D(" + tabBGPos + ",0px,0px)";

	currentView = arg;

}

function getAnswer() {
	var answer = "";
	var ones = currentNum % 10;
	var tens = ((currentNum % 100 ) - ones) / 10;

	if(currentNum == 0) { // special case
		answer += numbers[ones];
	}
	else {
		if(tens > 0) {
			answer += tens == 1 ? "jyu " : numbers[tens] + " jyu ";
		}

		if(ones > 0) {
			answer += numbers[ones];
		}
	}

	mQ(".answerDiv").forEach(function(elem) {
		elem.innerText = answer;
	});
}




















