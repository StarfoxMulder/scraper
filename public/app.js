
/* Sould be able to abstract this out to a general function accepting
//  the source variable as a paramter:
      function getArticles(source) {};
    and then pass in the source at the end of the click handler switching
    over to the source's info:
      getArticles(di);
*///////

/* Moving toward a single page for all results
//// After talking with intended users, this is what they want */
$.getJSON("/vigilantcitizen", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<div class='media'><div class='media-left'><img class='media-object' src='"+data[i].image+"'></div><div class='media-body'><a href='"+data[i].link+"'><h4 class='media-heading'>"+data[i].title+"</h4></a>"+data[i].source+"</div><div class='media-right'><button type='button' class='btn btn-info btn-lg' data-id='"+data[i]._id+"'><span class='glyphicon glyphicon-comment' aria-hidden='true'></span>Comments</button></div></div>")
  }
});


/*
$("#articles").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a>"+data[i].source+"</p>")
*/

/*
$("#articles").append("<div class='media'><div class='media-left'><img class='media-object' src='"+data[i].image+"'></div>
  <div class='media-body'>
    <a href='"+data[i].link+"'>
      h4 class='media-heading'>"+data[i].title+"</h4>
    </a>"+data[i].source+"
  </div>
  <div class='media-right'>
    <button type='button' class='btn btn-info btn-lg' data-id='"+data[i]._id+"'>
      <span class='glyphicon glyphicon-comment' aria-hidden='true'></span>Comments
    </button>
  </div>
</div>
*/

// // Above Top Secret ajax
// $.getJSON("/abovetopsecret", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
//   }
// });
// // Cryptomundo ajax
// $.getJSON("/cryptomundo", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
//   }
// });
// // Paranormal News ajax
// $.getJSON("/paranormalnews", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
//   }
// });
// // David Icke ajax
// $.getJSON("/davidicke", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<p data-id='"+data[i]._id+"'><a href='"+data[i].link+"'>"+data[i].title+"</a></p>")
//   }
// });


