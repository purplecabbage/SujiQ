


function preventBehavior(e)
{
	e.preventDefault();
}

x$(window).load(init);


/////////////////////////////////////////////////////////////////////////

var currentNum = 0;
var numbers = ["zero","ichi","ni","san","yon","go","lok","nana","hachi","kyu","jyu"];
//var huns = ["","","hyaku","byaku","hyaku","hyaku","ppyaku","hyaku","

// I like the first one, so shoot me
var bgs = ["assets/BG3.png","assets/BG5.png","assets/BG3.png","assets/BG4.png"];
var randomBG = new Date().getMilliseconds() % 4;

var currentView = "easyDiv";





function init()
{
	document.addEventListener("touchmove", preventBehavior, false);
	document.addEventListener("deviceready",initAds);
	
	resetNumber();

    x$("#info").touchstart(resetNumber);
	
	new GloveBox(document.getElementById("aboutScroll"));
	
	x$(".numBtn").touchstart(onTableCellClick);
	x$(".solveBtn").touchstart(getAnswer);
	x$(".delBtn").touchstart(onDelClick);
	
	loadNextBG();
}

function loadNextBG()
{
	randomBG++;
	randomBG %= 4;
	x$("#bodyBG").css({"background-image":"url(" + bgs[randomBG] + ")" });
	setTimeout(loadNextBG,60000);
}

function getNumber()
{
	var n = Math.floor(Math.random() * 100);
	currentNum = n;
	return n;
}


function initAds()
{
	doSelected(0);
	document.addEventListener("iAdBannerViewDidFailToReceiveAdWithErrorEvent",onAdLoadFailed,false);
	document.addEventListener("iAdBannerViewDidLoadAdEvent",onAdLoadSuccess,false);
	
	window.plugins.iAdPlugin.prepare(true);
	
}

function onAdLoadSuccess()
{
	window.plugins.iAdPlugin.showAd(true);
}

function onAdLoadFailed()
{
	window.plugins.iAdPlugin.showAd(false);
}


function onTableCellClick(e)
{
	var num = parseInt(e.currentTarget.innerHTML);
	
	currentNum = (currentNum * 10 + num) % 100;
	
	x$(".currentNumber").html(currentNum + "");
	x$(".answerDiv").html("?");
}

function onDelClick(e)
{
	currentNum = 0;
	
	x$(".currentNumber").html(currentNum + "");
	x$(".answerDiv").html("?");
}


function tweenCallback()
{
	//alert("wtf!");
}


function doSelected(arg)
{
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
    
    x$("#easyDiv").css({"-webkit-transform":"translate3D(" + left + ",0px,0px)"}); 
    x$("#entryDiv").css({"-webkit-transform":"translate3D(" + left + ",0px,0px)"});
    x$("#aboutDiv").css({"-webkit-transform":"translate3D(" + left + ",0px,0px)"});    
	
	x$("#bodyBG").css({"-webkit-transform":"translate3D(" + bgLeft + ",0px,0px)"});	
	
	x$("#tabSelector").css({"-webkit-transform":"translate3D(" + tabBGPos + ",0px,0px)"});	

	currentView = arg;
}

function resetNumber()
{
	getNumber();
	x$(".currentNumber").html(currentNum + "");
	x$(".answerDiv").html("?");
}

function getAnswer()
{
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
	
	x$(".answerDiv").html(answer);
}




















