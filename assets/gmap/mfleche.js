/* ---------------------------------------------------------------
  Author : CHOMEL Lucie
  Sept 2014
  lucie.chomel.dev@gmail.com
--------------------------------------------------------------- */

// Map object
var mfleche = {
	// Params
	latCenter : 47.896902,
	lngCenter : 1.904316,
	defaultZoom : 14,
	// Inner objects
	map : false,
	geocoder : false,
	LatLngControl : false,
	ppanorama : null,
	
	/* ---------------------------- */
	// Map initialization
	initmap: function() {
		// Check browser compatibility
		if (!mfleche.checkBrowser()) return false;

		// Extend OverlayView so we can access MapCanvasProjection.
		LatLngControl.prototype = new google.maps.OverlayView();
		LatLngControl.prototype.draw = function() {};

		var myOptions = {
			center: new google.maps.LatLng(mfleche.latCenter, mfleche.lngCenter),
			mapTypeId: google.maps.MapTypeId.HYBRID,
			zoom: mfleche.defaultZoom,
			zoomControl : true,
			mapTypeControl : true,
			panControl : true,
			streetViewControl: false
		};
		this.map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
		this.geocoder = new google.maps.Geocoder();

		// Create new control to display latlng and coordinates under mouse.
		this.LatLngControl = new LatLngControl(this.map);
	},
	
	/* ---------------------------- */
	checkBrowser: function() {
		var detect = navigator.userAgent.toLowerCase();
		var browser = '';
		var version = 0;
		var thestring = 'msie';
		var place = 0;
		
		if (place = detect.indexOf(thestring) + 1) {
			browser = 'Internet Explorer';
		}
		if (browser != '') version = detect.charAt(place + thestring.length);
		if (version == 7) return false;
		return true;
	},
	
	/* ---------------------------- */
	// Choose localization
	loc: function (address) {
		if (address != '') {
			var self = this;
			this.geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					self.map.setCenter(results[0].geometry.location);
				} else {
					alert('Impossible de trouver l\'emplacement pour le lieu que vous avez tapé.');
				}
			});
		} else {
			alert('Merci d\'entrer un lieu dans le champ prévu à cet effet.');
		}
	}
};

/* ---------------------------- */
/* Arrow object */
var polygoneFleche = {
	polygon : false,
	latlng : null,
	nbDots : 0,
	bounds : [],
	dots : [],
	fcouleur : '#FF0000',
	fepaisseur : 2,
	fplein : 0,
	fdouble : 0,
	ftrait : 0,
	fpointe : 4,
	
	/* ---------------------------- */	
	start: function() {
		this.setType();
		this.resetPolygon();
	},
	
	/* ---------------------------- */
	// Collect user choices
	setType: function() {
		this.fcouleur = $('#fcouleur').val();
		this.fepaisseur = $('#fepaisseur').val();
		this.fplein = $('#fplein').val();
		this.fdouble = $('#fdouble').val();
		this.ftrait = $('#ftrait').val();
		this.fpointe = $('#fpointe').val();
	},
	
	/* --------------------- */	
	resetPolygon: function() {		
		var first = true;
		if (this.polygon !== false) {			
			// Delete all markers
			for (var i in this.dots) {
				this.dots[i].setMap(null);
			}
			this.bounds = [];
			this.dots = [];
			this.nbDots = 0;
			this.polygon.setMap(null);
			
			first = false;
		}
		
		this.polygon = new google.maps.Polygon({strokeColor:this.fcouleur,strokeOpacity:1,strokeWeight:this.fepaisseur,fillColor:this.fcouleur,fillOpacity:1,map:mfleche.map});
		this.polygon.setPath(new Array());
		
		if (first) {
			// Add map listener		
			var self = this;
			google.maps.event.addListener(this.polygon.getMap(), 'click', function(event) {
				if (self.nbDots < 2) {
					if (self.nbDots == 0) {
						self.addPoint(event.latLng, false);
					} else {
						self.addPoint(event.latLng, true);
						// Drag on first marker					
						self.dots[0].setDraggable(true);
						self.recalc();
					}
				}
			});
		}
	},
	
	/* --------------------- */	
	deleteFleche: function() {
		if (this.nbDots != 0) {			
			this.resetPolygon();
		} else {
			alert('Aucune flèche à supprimer');
		}
	},
	
	/* --------------------- */	
	findFleche: function() {
		if (this.nbDots != 0) {			
			mfleche.map.setCenter(new google.maps.LatLng(this.dots[0].position.lat(), this.dots[0].position.lng()));
		} else {
			alert('Vous n\'avez pas tracé de flèche pour le moment');
		}
	},
	
	/* ---------------------------- */	
	addPoint: function (pos, draggable) {
		// Add point
		this.dots[this.nbDots] = new google.maps.Marker({position:pos, map:this.polygon.getMap(), 'draggable': draggable});
		this.dots[this.nbDots].num = this.nbDots;
		
		// Add drag
		var self = this;	
		google.maps.event.addListener(this.dots[this.nbDots],'dragend',function() {	
			self.bounds[this.num] = this.getPosition();
			self.polygon.setPath(self.bounds);					
			self.recalc();					
		});
		// Set other variables
		this.bounds[this.nbDots] = pos;
		this.polygon.setPath(this.bounds);			
		this.nbDots++;
	},
	
	/* ---------------------------- */	
	recalc: function() {
		this.setType();
		this.polygon.setOptions({strokeColor:this.fcouleur,strokeWeight:this.fepaisseur,fillColor:this.fcouleur});		
		
		var posBout = this.bounds[0];
		var posPointe = this.bounds[1];
		
		// Reinit polygopn
		this.bounds = [];
		this.bounds[0] = posBout;
		this.bounds[1] = posPointe;
		
		this.polygon.setPath(this.bounds);								
		this.nbDots = 2;
		
		this.tracePointe(posBout, posPointe, posPointe, (1/this.fpointe), this.fplein);	
		
		// Double arrow
		if (this.fdouble == 1) {
			// Calc new point for the second apex
			var latApex = posPointe.lat() + ((posBout.lat() - posPointe.lat()) * (1/this.fpointe));
			var lngApex = posPointe.lng() + ((posBout.lng() - posPointe.lng()) * (1/this.fpointe));
			
			var newApex = new google.maps.LatLng(latApex, lngApex);
			
			this.bounds[this.nbDots] = newApex;
			this.polygon.setPath(this.bounds);
			this.nbDots++;
			this.tracePointe(posBout, posPointe, newApex, 1/(this.fpointe), this.fplein);
		}
		
		// End of the arrow
		if (this.ftrait == 1) {
			this.bounds[this.nbDots] = posBout;
			this.polygon.setPath(this.bounds);
			this.nbDots++;
			this.traceBout(posBout, posPointe);			
		}
	},
	
	/* ---------------------------- */
	// Draw a circle from center and with 'numPoints' points
	drawCircle: function(center, circleLat, circleLng, numPoints) {
		var latlngbounds = new google.maps.LatLngBounds();
		var theta = 0;
		var vertexLat = '';
		var vertexLng = '';
		
		var tabPoints = new Array();
		var circleLatLngs = new Array();
	
		for (var i = 0; i < numPoints + 1; i++) { 
			theta = Math.PI * (i / (numPoints / 2));
			vertexLat = center.lat() + (circleLat * Math.sin(theta));
			vertexLng = parseFloat(center.lng()) + parseFloat((circleLng * Math.cos(theta)));
			tabPoints.push(new google.maps.LatLng(vertexLat, vertexLng));
			circleLatLngs.push(new google.maps.LatLng(vertexLat, vertexLng));
			latlngbounds.extend(new google.maps.LatLng(vertexLat, vertexLng));
		}		
		return [tabPoints, circleLatLngs];
	},
	
	/* ---------------------------- */
	// Draw the end of the arrow
	traceBout: function(posBout, posPointe) {
		var pourcentageBout = 8;
		var distance = calcDistance(posBout, posPointe);
		
		// Calculate circle central point 
		var latApex = posBout.lat() + ((posPointe.lat() - posBout.lat()) * (1/pourcentageBout));
		var lngApex = posBout.lng() + ((posPointe.lng() - posBout.lng()) * (1/pourcentageBout));				
		var center = new google.maps.LatLng(latApex, lngApex);
		
		// Radius
		var rayon = Math.sqrt((distance / pourcentageBout) * (distance / pourcentageBout) * 2);
		
		// Calculate circle
		var d2r = Math.PI / 180;
		var circleLat = (rayon * 0.014483) / 1.609344; // Convert statute miles into degrees latitude
		var circleLng = circleLat / Math.cos(center.lat() * d2r);
		var numPoints = 5000 / mfleche.map.getZoom();
		
		var circle = this.drawCircle(center, circleLat, circleLng, numPoints);
		// Array of circle's points and coordinates
		var tabPoints = circle[0];
		var circleLatLngs = circle[1];
		
		var delta = 2;
		if (mfleche.map.getZoom() <= 11 && mfleche.map.getZoom() > 8) delta = 10;
		if (mfleche.map.getZoom() <= 8) delta = 50;		
			
		var dcalc = 0;
		var dcalcprec = 0;		
		var distanceVerif = (distance / pourcentageBout) * 1000;
		
		// Browse array to find 2 points at the good distance
		for (var i in tabPoints) {
			dcalc = Math.round(calcDistance(tabPoints[i], posBout) * 1000);							
			if ((Math.abs(distanceVerif - dcalc)) <= delta) {
				
				if (i != 0)
					dcalcprec = Math.round(calcDistance(tabPoints[i-1], posBout) * 1000);
				
				// Place point if previous not taken
				if (i == 0 || Math.abs((distanceVerif - dcalcprec)) > delta) {
					this.bounds[this.nbDots] = tabPoints[i];
					this.polygon.setPath(this.bounds);
					this.nbDots++;					
				}						
			}					
		}		
	},
	
	/* ---------------------------- */	
	// Draw arrowhead
	tracePointe: function(posBout, posPointe, posPointe2, fpointe, fplein) {	
		var distance = calcDistance(posBout, posPointe);
		// Calculate center
		var latApex = posPointe2.lat() + ((posBout.lat() - posPointe.lat()) * fpointe);
		var lngApex = posPointe2.lng() + ((posBout.lng() - posPointe.lng()) * fpointe);
		var center = new google.maps.LatLng(latApex, lngApex);
		
		// Calculate circle from cordinates
		var d2r = Math.PI / 180;
		var circleLat = ((distance / (1 /fpointe) / 2) * 0.014483) / 1.609344; // Convert statute miles into degrees latitude
		var circleLng = circleLat / Math.cos(center.lat() * d2r);
		var numPoints = 5000 / mfleche.map.getZoom();
		
		var circle = this.drawCircle(center, circleLat, circleLng, numPoints);
		// Array of circle's points and coordinates
		var tabPoints = circle[0];
		var circleLatLngs = circle[1];
		
		// Find good points to make the arrowhead start with delta related to zoom
		var delta = 0;
		if (mfleche.map.getZoom() <= 11 && mfleche.map.getZoom() > 8) delta = 3;	
		if (mfleche.map.getZoom() <= 8) delta = 5;
		
		// Distance between point_2 and point_4
		var distance_2_4 = Math.round(calcDistance(center, posPointe2) * 100);
		var dcalc = 0;
		var dcalcprec = 0;
		var first = null;
		
		// Browse array to find the two points at the good distance
		for (var i in tabPoints) {
			dcalc = Math.round(calcDistance(tabPoints[i], posPointe2) * 100);
			if ((Math.abs(distance_2_4 - dcalc)) <= delta) {
				if (i != 0) dcalcprec = Math.round(calcDistance(tabPoints[i-1], posPointe2) * 100);
				
				// Place point if previous not taken
				if (i != 0 && Math.abs((distance_2_4 - dcalcprec)) > delta) {
					this.bounds[this.nbDots] = tabPoints[i];
					this.polygon.setPath(this.bounds);
					this.nbDots++;
					
					// If full arrow
					if (fplein == 1) {
						if (first == null) {
							first = tabPoints[i];
						} else {
							this.bounds[this.nbDots] = first;
							this.polygon.setPath(this.bounds);
							this.nbDots++;
						}
					}
					
					// Back to last point
					this.bounds[this.nbDots] = posPointe2;
					this.polygon.setPath(this.bounds);
					this.nbDots++;
				}						
			}					
		}		
	},
	
	/* ---------------------------- */	
	transformBGR: function(hexcolor) {
		var blue = hexcolor.substring(5,7);
		var green = hexcolor.substring(3,5);
		var red = hexcolor.substring(1,3);
		return 'ff' + blue + green + red; // ff is no opacity
	},
	
	/* ---------------------------- */	
	exportkml: function() {
		var txt = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2"><Document><name>fleche.kml</name><open>1</open><Style id="fstyle"><LineStyle><color>' + this.transformBGR(this.fcouleur) + '</color><width>'+this.fepaisseur+'</width></LineStyle><PolyStyle><color>' + this.transformBGR(this.fcouleur) + '</color><fill>' + this.fplein + '</fill></PolyStyle></Style><Folder id="layer_1"><name>fleche_WGS84</name><visibility>1</visibility><Placemark><name></name><description><![CDATA[Ma flèche]]></description><visibility>1</visibility><styleUrl>#fstyle</styleUrl><Polygon><extrude>1</extrude><outerBoundaryIs><LinearRing><coordinates>';
		
		var txtFin = '</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Folder></Document></kml>';
		
		var liste_points = '';
		var sep = '';
		
		for (var i = 0; i < this.nbDots; i++) {
			liste_points += sep + Math.round(this.bounds[i].lng()*100000)/100000 + ',' + Math.round(this.bounds[i].lat()*100000)/100000 + ',0';
			sep = ' ';						
		}
		if (liste_points == '') {
			alert('Erreur : merci de créer une flèche avant de l\'exporter !');
		} else {
			$('#divtxtfleche').show();
			$('#txtfleche').val(txt + liste_points + txtFin);	
		}
	}
};

/* ---------------------------- */	
/* Other functions */

// Extend OverlayView so we can access MapCanvasProjection
function LatLngControl(overlayMap) {
	this.setMap(overlayMap);
}

// Calculate distance in meters between two geolocation-based points 
function calcDistance(p1, p2) {
	// Earth's mean radius in km
	var R = 6371;
	var dLat  = rad(p2.lat() - p1.lat());
	var dLong = rad(p2.lng() - p1.lng());
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d.toFixed(3);
}

// Calculate radians from degrees
function rad(x) {
	return x*Math.PI/180;
}