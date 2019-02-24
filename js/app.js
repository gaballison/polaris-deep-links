$(document).ready(function () {

  // Define the "link" object to hold all formatted data
  const link = {
    title: "",
    author: "",
    prefix: "http://jeffersonville.polarislibrary.com/view.aspx?",
    url: ""
  };

  /************************
   *      FUNCTIONS       *
   ***********************/

  // FUNCTION to encode the title
  const encodeTitle = inputTitle => {
    let encoded = encodeURIComponent(inputTitle);

    // encodeURIComponent doesn't encode apostrophes, so use .replace method to correct them
    let apos = encoded.replace(/'/g, "%27");

    // encodeURIComponent replaces spaces with %20 but we need spaces to be +
    let space = apos.replace(/%20/g, "+");

    // assign the resulting encoded string to the "title" property of the link object
    link.title = space;
  };

  // FUNCTION to encode the author
  const encodeAuthor = inputAuthor => {
    let input = inputAuthor.trim();

    // create array of individual words from the input
    let matches = input.match(/\w*/g);
    let len = matches.length;
    console.log(`There are ${len} items in matches`);
    console.dir(matches);

    /*  the surname is the last item in the array,
        but array always ends in blank space so need length - 2  */
    let sur = matches[len - 2];
    let author = "";

    if (len < 2) {
      author = "";
    } else if (len == 2) {
      author = sur;
    } else {
      author = sur + ",+";

      /*  loop through the rest of the matches
        and add + after each name if multiple  */
      for (let i = 0; i < len - 2; i++) {
        if (matches[i] != "") {

          /*  if the name is the last one before the surname
              don't add a + after it                           */
          if (i == len - 4) {
            author += matches[i];
          } else {
            author += `${matches[i]}+`;
          }
        }
      }
    }
    
    link.author = author;
  };

  // FUNCTION to assemble the URL based on the values of the link object
  const buildURL = () => {
    let url = "";

    // construct the URL based on existence of title &/or author
    if (link.title != "" && link.author != "") {
      url += `${link.prefix}title=${link.title}&author=${link.author}`;
      $('#btn-submit').prop('disabled', false);
    } else if (link.title == "" && link.author != "") {
      url += `${link.prefix}author=${link.author}`;
      $('#btn-submit').prop('disabled', false);
    } else if (link.title != "" && link.author == "") {
      url += `${link.prefix}title=${link.title}`;
      $('#btn-submit').prop('disabled', false);
    } else {
      url = "";
      $('#btn-submit').prop('disabled', true);
    }
    return url;
  };

  // FUNCTION to assemble the URL based on the values of the link object
  const buildResults = url => {

    // add the HTML for the constructed URL, including ability to select and copy
    $('#results').html(`
            <div class="d-flex justify-content-between">
                <h3 class="text-muted">Encoded URL</h3> 
                <span id="copy-status" class="text-success align-self-center"></span> 
                <button id="btn-copy" class="btn btn-link text-decoration-none"><i class="fas fa-clipboard"></i> Copy</button>
            </div>

            <textarea class="form-control border border-secondary text-monospace" rows="4" col="10" id="textarea-url">${url}</textarea>
                
            <a class="btn btn-primary btn-lg btn-block mt-0" id="btn-visit" href="${url}" target="_blank"><i class="fas fa-search"></i> &nbsp; Check Polaris &nbsp; <i class="fas fa-angle-double-right fa-lg"></i></a>
        `);
  };


  // FUNCTION to select the textarea so we can copy it to clipboard
  const selectText = textarea => {
    const input = $(textarea);
    input.focus();
    input.select();
  };

  // FUNCTION to copy URL to clipboard and set statuses accordingly
  const tryCopy = () => {
    try {
      $('#btn-copy').click(function () {
        selectText('#textarea-url');
        document.execCommand("copy");
        $('#textarea-url').removeClass('border-secondary').addClass('border-success');
        $('#btn-copy').addClass('text-success');
        $('#copy-status').html(`<i class="fas fa-check-circle fa-lg"></i> Copied!`);

        $('#textarea-url').blur(function () {
          $('#textarea-url').removeClass('border-success').addClass('border-secondary');
          $('#btn-copy').removeClass('text-success').addClass('text-secondary');
          $('#copy-status').html("");
        });
      });

    } catch (error) {
      $('#textarea-url').addClass('border border-danger');
      $('#btn-copy').removeClass('btn-outline-secondary').addClass('btn-outline-danger');
      $('#copy-status').removeClass('text-success').addClass('text-danger').html(`<i class="fas fa-times-circle fa-lg"></i> ERROR`);
      console.error("Ooops, unable to copy and select. " + error);
    }
  };


  /************************
  *         EVENTS        *
  ************************/

  // Check Title on blur, keyup, or change
  $('#title').on({
    'blur keyup': function () {
      let title = $('#title').val();
      if (title !== "") {
        encodeTitle(title);
        $('#btn-submit').prop('disabled', false);
      } else {
        if ($('#author').val() !== "") {
          $('#btn-submit').prop('disabled', false);
        } else {
          $('#btn-submit').prop('disabled', true);
        }
      }
    }, change: function () {
      encodeTitle($('#title').val());
    }
  });

  // Check Author on blur, keyup, or change
  $('#author').on({
    'blur keyup': function () {
      let author = $('#author').val();
      if (author !== "") {
        encodeAuthor(author);
        $('#btn-submit').prop('disabled', false);
      } else {
        if ($('#title').val() !== "") {
          $('#btn-submit').prop('disabled', false);
        } else {
          $('#btn-submit').prop('disabled', true);
        }
      }
    }, change: function () {
      encodeAuthor($('#author').val());
    }
  });

  // Prevent default submit event
  $('#form-search').submit(function (event) {
    let url = buildURL();
    buildResults(url);
    tryCopy();
    event.preventDefault();
  });

  // Submitting the form
  $('#btn-submit').click(function () {
    let url = buildURL();
    buildResults(url);
    tryCopy();
  });

  // Clear the form and delete all of the results HTML
  $('#btn-clear').click(function (event) {
    $('#results').empty();
    event.preventDefault();
    $(':text').val('');
    $('#btn-submit').prop('disabled', true);
    link.author = "";
    link.title = "";
  });
});
