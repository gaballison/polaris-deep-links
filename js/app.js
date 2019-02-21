$(document).ready(function () {

  // Define the "link" object to hold all formatted data
  const link = {
    title: "",
    author: "",
    subject: "",
    url: "http://jeffersonville.polarislibrary.com/view.aspx?"
  };

  /************************
   *      FUNCTIONS       *
   ***********************/

  // Encode the title
  const encodeTitle = inputTitle => {
    if (inputTitle !== "") {
      let encoded = encodeURIComponent(inputTitle);

      // encodeURIComponent doesn't encode apostrophes, so use .replace method to correct them
      let apos = encoded.replace(/'/g, "%27");

      // encodeURIComponent replaces spaces with %20 but we need spaces to be +
      let space = apos.replace(/%20/g, "+");

      // assign the resulting encoded string to the "title" property of the link object
      link.title = space;
    } else {
      link.title = "";
    }

  };

  // Encode the author
  const encodeAuthor = inputAuthor => {
    if (inputAuthor !== "") {
      let input = inputAuthor.trim();

      // create array of individual words from the input
      let matches = input.match(/\w*/g);
      let len = matches.length;

      // the surname is the last item in the array, but array always ends in blank space so need penultimate item instead of last
      let sur = matches[len - 2];
      let author = sur + ",+";

      // loop through the rest of the matches and add + after each name if multiple
      for (let i = 0; i < len - 2; i++) {
        if (matches[i] != "") {
          if (i == len - 4) {
            author += matches[i];
          } else {
            author += `${matches[i]}+`;
          }
        }
      }
      link.author = author;
    } else {
      link.author = "";
    }

  };

  // Select the textarea so we can copy it to clipboard
  const selectText = (textarea) => {
    const input = $(textarea);
    input.focus();
    input.select();
  };


  /************************
  *         EVENTS        *
  ************************/

  // Check Title on blur
  $('#title').blur(function(){
      let title = $('#title').val();
      encodeTitle(title);
  });

  // Check Author on blur
  $('#author').blur(function(){
    let author = $('#author').val();
    encodeAuthor(author);
  });

  // Submitting the form
  $('#btn-submit').click(function () {

    // construct the URL based on existence of title &/or author
    let url = "";
    if (link.title != "" && link.author != "") {
      url += `${link.url}title=${link.title}&author=${link.author}`;
    } else if (link.title == "" && link.author != "") {
      url += `${link.url}author=${link.author}`;
    } else if (link.title != "" && link.author == "") {
      url += `${link.url}title=${link.title}`;
    } else {
      url = "You haven't entered any data!";
    }

    $('#results-url').html(`<h4 class="text-muted">Encoded URL</h4>
        <textarea class="col-auto d-block border border-secondary" cols="50" rows="5" id="textarea-url">${url}</textarea>
        <div class="d-flex justify-content-between mt-3"><button class="btn btn-secondary d-inline-block" id="btn-copy"><i class="fa fas-clipboard"></i> &nbsp; Copy link</button><span id="copy-status" class="text-success"></span><a class="btn btn-primary d-inline-block" id="btn-visit" href="${url}" target="_blank"><i class="fa fas-sign-out-alt"></i> Check Polaris</a></div>`);

    // see if it will copy properly
    try {
      $('#btn-copy').click(function () {
        selectText('#textarea-url');
        document.execCommand("copy");
        $('#textarea-url').addClass('border border-success');
        $('#btn-copy').removeClass('btn-secondary').addClass('btn-success');
        $('#copy-status').html(`<img src="img/check.svg" class="text-success" id="img-check" alt="Success!"> <i class="fa fas-check"></i> Copied!`);
        $('#textarea-url').blur(function () {
          $(this).removeClass('border-success').addClass('border-secondary');
          $('#btn-copy').removeClass('btn-success').addClass('btn-secondary');
          $('#copy-status').html("");
        });
      });

    } catch (error) {
      $('#textarea-url').addClass('border border-danger');
      $('#btn-copy').removeClass('btn-secondary').addClass('btn-danger');
      console.error("Ooops, unable to copy and select. " + error);
    }

  });

  // Clear the form and delete all of the results HTML
  $('#btn-clear').click(function () {
    $("#results-url").html("");
    $("#preview").html("");
    $(':text').val('');
  });


});
