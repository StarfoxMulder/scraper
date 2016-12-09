
/* Sould be able to abstract this out to a general function accepting
//  the source variable as a paramter:
      function getArticles(source) {};
    and then pass in the source at the end of the click handler switching
    over to the source's info:
      getArticles(di);
*///////
$.getJSON("/vigilantcitizen", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleContainer").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
  }
});
// Above Top Secret ajax
$.getJSON("/abovetopsecret", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleContainer").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
  }
});
// Cryptomundo ajax
$.getJSON("/cryptomundo", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleContainer").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
  }
});
// Paranormal News ajax
$.getJSON("/paranormalnews", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleContainer").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
  }
});
// David Icke ajax
$.getJSON("/davidicke", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleContainer").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
  }
});

// function getArticles() {
//   $("#articleContainer").empty();

//   $.getJSON("/")
// }
