

(function(win){
    
    // returns an Array of nodes matching the query
    // query can be a selector, an existing node, or an array of nodes
    var mQ = function(query)
    {
        var results; // Array
        switch(true)
        {
            // already a node
            case (query.nodeType > 0) :
                results = [query];
                break;
            // a selector string    
            case (typeof query === "string") :
                var nl = document.querySelectorAll(query);
                results = [];
                for(var n = 0, len=nl.length; n < len; n++)
                {
                    results.push(nl[n]);
                }
                break;
            // already an array of nodes    
            case (query instanceof Array) :
                results = query.slice(0);
                break;
        }
        return results;
    }; 

    mQ.hasClass = function(elem,className)
    {
        return elem.className.split(" ").indexOf(className) > -1;
    };
    
    mQ.removeClass = function(elem,className)
    {
        if(Array.isArray(elem))
        {
            var funk = function(el){mQ.removeClass(el,className);}
            elem.forEach(funk);
        }
        else
        {
            var splitV = elem.className.split(" ");
            var index = splitV.indexOf(className);
            if(index > -1)
            {
                splitV.splice(index,1);
                elem.className = splitV.join(" ");
            }
        }
        return this;
    };
    
    mQ.addClass = function(elem,className)
    {
        if(Array.isArray(elem))
        {
            var funk = function(el){mQ.addClass(el,className);};
            elem.forEach(funk);
        }
        else
        {
            if(!this.hasClass(elem,className))
            {
                elem.className += " " + className;
            }
        }
        return this;
    };

    mQ.toggleClass = function(elem,className)
    {
        if(Array.isArray(elem))
        {
            var funk = function(el){mQ.toggleClass(el,className);};
            elem.forEach(funk);
        }
        else
        {
            if(this.hasClass(elem,className))
            {
                this.removeClass(elem,className);
            }
            else
            {
                this.addClass(elem,className);
            }
        }
    };
    
    mQ.mixin = function(a,b)
    {
        for(var v in b)
        {
            a[v] = b[v];
        }
    };
    
    // supply a bind function if Function.bind is not available
    mQ.bind = mQ.bind || function(obj){
        return function(){
            return this.apply(obj,arguments);
        }
    };
    
    mQ.namespace = function(ns,value)
    {
        var nsArr = ns.split(".");
        var obj = window;
        var prop;
         for(var n=0; n < nsArr.length-1; n++)
         {
             prop = nsArr[n];
             if(!obj[prop])
             {
                 obj[prop] = {};
             }
             obj = obj[prop];
         }
         obj[nsArr[nsArr.length-1]] = value; 
         return obj;
    };
    
    win.mQ = mQ;
    
})(window);