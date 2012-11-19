var foods = {
    "turkey" : {
        "layerName" : "turkey",
        "linkText" : "Turkey",
        "description" : "Turkey farmers want to be where there the corn and soybeans are. Geographically, then, big turkey producers are located near to processing plants and the cheap foods that will feed their livestock (Which explains the dots few and far between in regions like Utah and Texas).<br><br>There is also a large and vibrant industry of small scale production, as the smattering of dots on the map indicate. In fact, it’s not unusual to have turkey farms with a relatively small number of hogs and small-scale beef production too."
    },
    "sweetPotatoes" : {
        "layerName" : "potatoes",
        "linkText" : "Sweet Potatoes",
        "description" : "Like cranberries, sweet potatoes are picky and require specific conditions to yield the best crops. They need a long growing season, heat in the summer and a ton of water. For this reason sweet potatoes have the best yield in the south. They were first grown in South America, though they are often confused with the white starchy yam originating from West Africa and Asia—especially during the holidays."
    },
    "cranberries" : {
        "layerName" : "cranberries",
        "linkText" : "Cranberries",
        "description" : "Cranberries require very specific growing conditions. Because they are traditionally grown in natural wetlands, they need a lot of water. They also require a period of dormancy during the winter months which limits the regions in which they are grown to the northern parts of America."
    },
    "greenbeans" : {
        "layerName" : "greenbeans",
        "linkText" : "Green Beans",
        "description" : "Though the map indicates that green bean farms are evenly scattered throughout a large part of the country, in the regions with the highest production—the south and the midwest for example—most of the production is driven by the location of the processing industries."
    }
};

var initApp = function(){
    $("#description").html(foods.turkey.description);
    dojo.forEach(getLayerByName(map,"thanksgiving",true,false),function(lyr){
        lyr.setOpacity(0);
        lyr.hide();
    });
    startFade(getLayerByName(map,"turkey"));
};

var changeFood = function(food){
    $("#description").html(foods[food].description);
    $("#foodTitleText").html(foods[food].linkText);
    startFade(getLayerByName(map,food));
};
    
var getLayerByName = function(mapVariable,layerName,searchMainLayers,searchGraphicsLayers){
    var layers = [];
        
    if(searchMainLayers !== false){
        dojo.forEach(mapVariable.layerIds,function(lyr){
            if(lyr.toLowerCase().search(layerName.toLowerCase()) !== -1){
                layers.push(mapVariable.getLayer(lyr));
            }
        });
    }
    if(searchGraphicsLayers !== false){
        dojo.forEach(mapVariable.graphicsLayerIds,function(lyr){
            if(lyr.toLowerCase().search(layerName.toLowerCase()) !== -1){
                layers.push(mapVariable.getLayer(lyr));
            }
        });
    }
        
    return layers;
};
    
var startFade = function(layers){
    dojo.forEach(getLayerByName(map,"thanksgiving",true,false),function(lyr){
        lyr.fading = false;
        if ($.inArray(lyr,layers) !== -1) {
            setTimeout(function() {
                lyr.fading = true;
                fadeLayerIn(map,lyr);
            }, 11);
        }
        else{
            setTimeout(function() {
                lyr.fading = true;
                fadeLayerOut(map,lyr);
            }, 11);
        }
    });
};
    
var fadeLayerIn = function(mapVariable,layer){
    if(!layer.visible){
        layer.show();
    }
    if(layer.opacity < 1 && layer.fading === true){
        layer.setOpacity(layer.opacity + 0.1);
        setTimeout(function() {
            fadeLayerIn(mapVariable,layer);
        }, 20);
    }
    else{
        layer.setOpacity(1);
        layer.fading = false;
    }
};
    
var fadeLayerOut = function(mapVariable,layer){
    if(layer.opacity > 0 && layer.fading === true){
        layer.setOpacity(layer.opacity - 0.1);
        setTimeout(function() {
            fadeLayerOut(mapVariable,layer);
        }, 20);
    }
    else{
        layer.setOpacity(0);
        layer.hide();
        layer.fading = false;
    }
};