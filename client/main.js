import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

var map, infoWindow;


if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });
}

Template.body.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: {lat: -34.397, lng: 150.644},
        zoom: 14
      };
    }
  }
});

var popup_content = "<div style='height:200px'>" +
"<div class='list' >" +
"<div style='padding-bottom:11px'>Choose what you want to rate? </div>"+
"<div><img src='road.png' style='width:20px'/><span class='typ'>Road</span>"+
"<div><div class='rateYo' id='road_rating'></div></div></div>"+
"<div><img src='sew.png' style='width:20px'/><span class='typ'>Seweage System</span>"+
"<div><div class='rateYo' id='sew_rating'></div></div></div>"+
"<div><img src='light.png' style='width:20px'/><span class='typ'>Street lights</span>"+
"<div><div class='rateYo' id='light_rating'></div></div></div>"+
"<div><button class='submit_rating'>Submit</button></div>"+
"</div>"+

"<div class='feedback_success' ><h2>Thankyou for rating the your street, lights and drainage system.</h2>" +
"<div class='rating_results'></div></div>"+
"</div>";
var o_ratings = {position: {}};
Template.body.onCreated(function() {
var pos = {}
$('body').on('click', '.submit_rating', function(){
	$('.list').hide()
	$('.feedback_success').show();
	
	$('.rating_results').html();
	// o_ratings
	console.log(firebase)
	console.log(firebase.database)
	f  = firebase.database().ref()
	o_ratings['position'] = pos
	f.push().set(o_ratings)
})

  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
  	console.log('oncreart----------------')
    
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      // position: map.options.center,
      map: map.instance,
      title: 'Uluru (Ayers Rock)'
    });


if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
infoWindow = new google.maps.InfoWindow;
console.log('geolocation----------------')
marker.setPosition(pos);
            infoWindow.setPosition(pos);
            infoWindow.setContent(popup_content);
            marker.addListener('click', function() {
          infoWindow.open(map.instance);
           $(".rateYo").rateYo({
    starWidth: "20px",
     onSet: function (rating, rateYoInstance) {
 		// debugger
 		o_ratings[$(rateYoInstance.node).attr("id")] = rating;

      // alert("Rating is set to: " + rating);
    }
  });
           $('.list').show()
	$('.feedback_success').hide()
        });
           
             map.instance.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }



  });


})

