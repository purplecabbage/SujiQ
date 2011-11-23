


function preventBehavior(e)
{
	e.preventDefault();
    return false;
}

// provide our own console if it does not exist, huge dev aid!
if(typeof window.console == "undefined")
{
window.console = {log:function(str){window.external.Notify(str);}};
}

// output any errors to console log, created above.
window.onerror=function(e)
{
console.log("window.onerror ::" + JSON.stringify(e));
};

console.log("Installed console ! ");

x$(window).load(init);


/////////////////////////////////////////////////////////////////////////

var currentNum = 0;
var numbers = ["zero","ichi","ni","san","yon","go","lok","nana","hachi","kyu","jyu"];
//var huns = ["","","hyaku","byaku","hyaku","hyaku","ppyaku","hyaku","

// I like the first one, so shoot me
var bgs = ["assets/BG3.png","assets/BG5.png","assets/BG3.png","assets/BG4.png"];
var randomBG = new Date().getMilliseconds() % 4;

var currentView = 0;





function init()
{
	document.addEventListener("mousedown", preventBehavior, false);
	
	resetNumber();

    x$("#info").on("mousedown",resetNumber);
	
	//new GloveBox(document.getElementById("aboutScroll"));
	
	x$(".numBtn").on("mousedown",onTableCellClick);
	x$(".solveBtn").on("mousedown",getAnswer);
	x$(".delBtn").on("mousedown",onDelClick);
	
	loadNextBG();

    x$("#liQuiz").on("mousedown",function(e){ doSelected(0);});
    x$("#liEntry").on("mousedown",function(e){ doSelected(1);});
     x$("#liAbout").on("mousedown",function(e){ doSelected(2);});          

     aboutScroll.addEventListener("mousedown",onAboutScrollMouseDown,false);
      
}

var startY;
var startTop;
function onAboutScrollMouseDown(e)
{
    startY = e.y;
    startTop = aboutScroll.offsetTop;
    console.log("startTop = " + startTop);
    document.addEventListener("mousemove",onAboutScrollMouseMove,false);
    document.addEventListener("mouseup",onAboutScrollMouseUp,false);
    return true;
}

function onAboutScrollMouseMove(e)
{
    aboutScroll.style.top = ( startTop + startY - e.y) + "px";
    return true;
}

function onAboutScrollMouseUp(e)
{
    document.removeEventListener("mousemove",onAboutScrollMouseMove,false);
    document.removeEventListener("mouseup",onAboutScrollMouseUp,false);
    return true;
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
    var left=0;
    var currentTabPos = -260 + ( currentView * 100 );
	var tabBGPos = -260;
    var currentX = currentView * -320;
    switch(arg)
    {
        case 1 : //"entryDiv" : 
        {
            left = -320;
			tabBGPos = -160;
            break;
        }
        case 2 : // "aboutDiv" : 
        {
            left = -640;
			tabBGPos = -60;
            break;
        }
    }

    var now = function () { return new Date().getTime(); };

    var startTime = now();
    var time = 320;
    var intervalId = -1;
    var self = this;
    var onInterval = function () {
        var elapsed = now() - startTime;
        if (elapsed > time) 
        {
            clearInterval(intervalId);
            easyDiv.style.left = left + "px";
            entryDiv.style.left = ( left + 320 ) + "px";
            aboutDiv.style.left = ( left + 640 ) + "px";
            bodyBG.style.left = Math.round(left / 4) + "px";
            tabSelector.style.left =  tabBGPos + "px";
        }
        else 
        {
            var newX = Math.round(currentX + ( elapsed / time * ( left - currentX ) )); 
            easyDiv.style.left = newX + "px";
            entryDiv.style.left = ( newX + 320 ) + "px";
            aboutDiv.style.left = ( newX + 640 ) + "px";
            bodyBG.style.left = Math.round(newX / 4) + "px" ;

            var tabX = Math.round(currentTabPos + ( elapsed / time * ( tabBGPos - currentTabPos ) ));
            tabSelector.style.left =  tabX + "px";

        }
    }
    intervalId = setInterval(onInterval,10);
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




















