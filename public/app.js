
/* Sould be able to abstract this out to a general function accepting
//  the source variable as a paramter:
      function getArticles(source) {};
    and then pass in the source at the end of the click handler switching
    over to the source's info:
      getArticles(di);
*///////

/* Moving toward a single page for all results
//// After talking with intended users, this is what they want */
// $.getJSON("/vigilantcitizen", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<div class='media'><div class='media-left'><img class='media-object' src='"+data[i].image+"'></div><div class='media-body'><a href='"+data[i].link+"'><h4 class='media-heading'>"+data[i].title+"</h4></a>"+data[i].source+"</div><div class='media-right'><button type='button' class='btn btn-info btn-lg' data-id='"+data[i]._id+"'><span class='glyphicon glyphicon-comment' aria-hidden='true'></span>Comments</button></div></div>")
//   }
// });

// $(document).ready(function() {
//   $("#notesContainer").empty();
// });

$("btn-lg").on("click", function() {

  var thisId = $(this).attr("data-id");

  $("#submitNote").data("id") = thisId;
  // $("#notesContainer").
  // Empty the notes from the note section
  // $("#notesContainer").empty();
  // // Save the id from the p tag
  // var thisId = $(this).attr("data-id");

  // // Now make an ajax call for the Article
  // $.ajax({
  //   method: "GET",
  //   url: "/vigilantcitizen/" + thisId
  // })
  //   // With that done, add the note information to the page
  //   .done(function(found) {
  //     console.log(found);
      // // The title of the article
      // $("#notes").append("<h2>" + found.title + "</h2>");
      // // A button to submit a new note, with the id of the article saved to it


      // // If there's a note in the article
      // if (found.note) {
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(found.note.body);
      // }
    // });
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


