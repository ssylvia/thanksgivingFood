  dojo.require("esri.map");
  dojo.require("esri.dijit.Legend");
  dojo.require("esri.dijit.Scalebar");
  dojo.require("esri.arcgis.utils");
  dojo.require("esri.IdentityManager");
  dojo.require("dijit.dijit");
  dojo.require("dijit.layout.BorderContainer");
  dojo.require("dijit.layout.ContentPane");
  dojo.require("dijit.layout.StackContainer");
  
  
  
     var map, urlObjects;
	 
	 function initMap() {
       patchID();
      
       if(configOptions.geometryserviceurl && location.protocol === "https:"){
         configOptions.geometryserviceurl = configOptions.geometryserviceurl.replace('http:','https:');
       }
       esri.config.defaults.geometryService = new esri.tasks.GeometryService(configOptions.geometryserviceurl);

       if(!configOptions.sharingurl){
         configOptions.sharingurl = location.protocol + '//' + location.host + "/sharing/content/items";
       }
       esri.arcgis.utils.arcgisUrl = configOptions.sharingurl;
       
       if(!configOptions.proxyurl){   
         configOptions.proxyurl = location.protocol + '//' + location.host + "/sharing/proxy";
       }

       esri.config.defaults.io.proxyUrl =  configOptions.proxyurl;

       esri.config.defaults.io.alwaysUseProxy = false;
      
       urlObject = esri.urlToObject(document.location.href);
       urlObject.query = urlObject.query || {};
      
       if(urlObject.query.title){
         configOptions.title = urlObject.query.title;
       }
       if(urlObject.query.subtitle){
         configOptions.title = urlObject.query.subtitle;
       }
       if(urlObject.query.webmap){
         configOptions.webmap = urlObject.query.webmap;      
       } 
       if(urlObject.query.bingMapsKey){
         configOptions.bingmapskey = urlObject.query.bingMapsKey;      
       }

	   esri.arcgis.utils.arcgisUrl = "http://arcgis.com/sharing/content/items";	
		
	   var mapDeferred = esri.arcgis.utils.createMap(configOptions.webmap, "map", {
         mapOptions: {
           slider: true,
           nav: false,
           wrapAround180:true
         },
         ignorePopups:false,
         bingMapsKey: configOptions.bingmapskey
       });

       mapDeferred.addCallback(function (response) {
        
		 document.title = configOptions.title|| response.itemInfo.item.title || "";
         dojo.byId("title").innerHTML = configOptions.title ||response.itemInfo.item.title;
         dojo.byId("subtitle").innerHTML = configOptions.subtitle|| response.itemInfo.item.snippet || "";
        
         map = response.map;
		
		 dojo.connect(map,"onUpdateEnd",hideLoader);
		
         var layers = response.itemInfo.itemData.operationalLayers;
         if(map.loaded){
           initUI(layers);
         }
         else{
           dojo.connect(map,"onLoad",function(){
             initUI(layers);
           });
         }
         //resize the map when the browser resizes
         dojo.connect(dijit.byId('map'), 'resize', map,map.resize);
       });

       mapDeferred.addErrback(function (error) {
         alert("Unable to create map: " + " " + dojo.toJson(error.message));
       });
	   
     }


     function initUI(layers) {
       //add chrome theme for popup
       dojo.addClass(map.infoWindow.domNode, "chrome");
       //add the scalebar 
       var scalebar = new esri.dijit.Scalebar({
         map: map,
         scalebarUnit:"english" //metric or english
       }); 

       var layerInfo = buildLayersList(layers);
      
       if(layerInfo.length > 0){
         var legendDijit = new esri.dijit.Legend({
           map:map,
           layerInfos:layerInfo
         },"legendDiv");
         legendDijit.startup();
       }
       else{
         dojo.byId('legendDiv').innerHTML = '';
       }
     }
	 
function buildLayersList(layers) {
    var layerInfo = [];
    dojo.forEach(layers, function (mapLayer, index) {
      if (mapLayer.featureCollection && !mapLayer.layerObject) {
        if (mapLayer.featureCollection.layers && mapLayer.featureCollection) {
          if (mapLayer.featureCollection.layers.length === 1) {
            layerInfo.push({
              "layer": mapLayer.featureCollection.layers[0].layerObject,
              "title": mapLayer.title
            });
          } else {
            dojo.forEach(mapLayer.featureCollection.layers, function (layer) {
              layerInfo.push({
                layer: layer.layerObject,
                title: mapLayer.title
              });
            });
          }
        }
      } else if (mapLayer.layerObject) {
        layerInfo.push({
          layer: mapLayer.layerObject,
          title: mapLayer.title
        });
      }
    });
    return layerInfo;
  }
    
     function patchID() {  //patch id manager for use in apps.arcgis.com
       esri.id._isIdProvider = function(server, resource) {
       // server and resource are assumed one of portal domains
 
       var i = -1, j = -1;
 
       dojo.forEach(this._gwDomains, function(domain, idx) {
         if (i === -1 && domain.regex.test(server)) {
           i = idx;
         }
         if (j === -1 && domain.regex.test(resource)) {
           j = idx;
         }
       });
 
       var retVal = false;
   
       if (i > -1 && j > -1) {
         if (i === 0 || i === 4) {
           if (j === 0 || j === 4) {
             retVal = true;
           }
         }
         else if (i === 1) {
           if (j === 1 || j === 2) {
             retVal = true;
           }
         }
         else if (i === 2) {
           if (j === 2) {
             retVal = true;
           }
         }
         else if (i === 3) {
           if (j === 3) {
             retVal = true;
           }
         }
       }
 
       return retVal;
     };    
    }
	
	function hideLoader(){
	  $("#loadingCon").hide();
	}
	
	//Jquery Layout
	$(document).ready(function(e) {
	  $("#legendToggle").click(function(){
		if ($("#legendDiv").css('display')=='none'){
		  $("#legTogText").html('MAP LEGEND ▲');
		}
		else{
		  $("#legTogText").html('MAP LEGEND ▼');
		}
		$("#legendDiv").slideToggle();
	  });
    });