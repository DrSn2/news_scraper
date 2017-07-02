
// This displays all articles and controls GET AND POST --- 



// 1. Scrapes articles from website

$(document).on("click", "#rescrape", function () {
  // $.getJSON("/scrape", function () {

  // })
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function (data){ 

})
 
console.log("hit");
display()

})


// 2. deletes all scraped articles

$(document).on("click", "#delete", function () {
  $.ajax({
    method: "DELETE",
    url: "/delete"
  }).done(function (data)
  { console.log("done") }
    )

  $("#articles").empty();
location.reload();
})


 
// 3. gets all articles from database and displays them

// $(document).on("click", "#rescrape", display);

function display() {
  $("#articles").empty();
  // location.reload();

  $.getJSON("/articles", function (data) {
    // For each one
console.log("superhit")
    for (var i = 0; i < data.length; i++) {
      var y = i + 1
      // Display the apropos information on the page
      var button = $("<button>").addClass("deleteOne").attr("data-id", data[i]._id).text("Delete this article");
      var button2 = $("<button>").addClass("readNote").attr("data-id", data[i]._id).text("Read Note");
      if (data[i].note) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + y + " )   Title: " + data[i].title + '  <a href="' + data[i].link + '"> Link </a>'+"<br>").append(button).append(button2).append("<br>  ____________________________" + "</p>")
      }
      else {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + y + " )   Title: " + data[i].title +  '  <a href="' + data[i].link + '"> Link </a>'+"<br>").append(button).append("<br>  ____________________________" + "</p>");
      }
    }
  });
  $("#complete").empty().text("Click on a title to add a note").css("margin", "0 auto");
  // .append("<br>");
}

// 4. Whenever someone CLICKS a p tag, GET article and append it to page. 

$(document).on("click", ".deleteOne", function () {

  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article

  $.ajax({
    method: "DELETE",
    url: "/delete2/" + thisId
  })
    // With that done, add the note information to the page
    .done(function (data) {
     
   display()

    }) 

});


$(document).on("click", ".readNote", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function (data) {
     
     displayNotes(data);

    })
})

$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function (data) {
     
     displayNotes(data);

    })
})

function displayNotes(data) {

/// breaking here. 

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("Enter a title...");
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("Enter your notes...");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
}
//     });
// });

// 5. When you CLICK the savenote button, run a POST request ---- 

$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
 
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
display()

});


// 6. When you CLICK the DELETE NOTE, run a DELETE request. 

$(document).on("click", "#deletenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: "",
      body: ""
    }

  })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });


});