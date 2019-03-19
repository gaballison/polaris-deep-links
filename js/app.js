$(document).ready(function () {

  // Define the "link" object to hold all formatted data
  const link = {
    titlePolaris: "",
    authorPolaris: "",
    authorNormal: "",
    prefixPolaris: "https://jeffersonville.polarislibrary.com/view.aspx?",
    prefixWorldCat: "https://www.worldcat.org/search?q=",
    prefixGoogle: "https://www.google.com/search?safe=strict&tbm=isch&q=book+cover+",
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
    link.titlePolaris = space;
  };

  // FUNCTION to encode the author
  const encodeAuthor = inputAuthor => {
    let input = inputAuthor.trim();

    // create array of individual words from the input
    let matches = input.match(/[\w.|\w-|\w']*/g);
    let len = matches.length;
    console.log(`There are ${len} items in matches`);
    console.dir(matches);

    /*  the surname is the last item in the array,
        but array always ends in blank space so need length - 2  */
    let sur = matches[len - 2];
    let author = "";

    // Create Polaris-formatted Author [LastName, FirstName]
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
    link.authorPolaris = author;

    // CREATE GOOGLE & WORLDCAT-FORMATTED AUTHOR
    let authorGoogle = "";
    for (let j = 0; j < len - 1; j++) {
      if (matches[j] != "") {

        /*  if the name is the last one before the surname
            don't add a + after it                           */
        if (j == len - 2) {
          authorGoogle += matches[j];
        } else {
          authorGoogle += `${matches[j]}+`;
        }
      }
    }
    link.authorNormal = authorGoogle;

  };

  // FUNCTION to assemble the URL based on the values of the link object
  const buildURL = () => {
    let url = {
      polaris: "",
      google: "",
      worldcat: ""
    };

    // construct the URLs based on existence of title &/or author
    if (link.titlePolaris != "" && link.authorPolaris != "") {
      url.polaris += `${link.prefixPolaris}title=${link.titlePolaris}&author=${link.authorPolaris}`;
      $('#btn-submit').prop('disabled', false);
      url.worldcat += `${link.prefixWorldCat}ti:${link.titlePolaris}+au:${link.authorNormal}`;
      url.google += `${link.prefixGoogle}${link.titlePolaris}+by+${link.authorNormal}`;

    } else if (link.titlePolaris == "" && link.authorPolaris != "") {
      url.polaris += `${link.prefixPolaris}author=${link.authorPolaris}`;
      $('#btn-submit').prop('disabled', false);
      url.worldcat += `${link.prefixWorldCat}au:${link.authorNormal}`;
      url.google += `${link.prefixGoogle}${link.authorNormal}`;

    } else if (link.titlePolaris != "" && link.authorPolaris == "") {
      url.polaris += `${link.prefixPolaris}title=${link.titlePolaris}`;
      $('#btn-submit').prop('disabled', false);
      url.worldcat += `${link.prefixWorldCat}ti:${link.titlePolaris}`;
      url.google += `${link.prefixGoogle}${link.titlePolaris}`;

    } else {
      url.polaris, url.worldcat, url.google = "";
      $('#btn-submit').prop('disabled', true);
    }
    return url;
  };

  // FUNCTION to assemble the URL based on the values of the link object
  const buildResults = url => {

    // add the HTML for the constructed URL, including ability to select and copy
    $('#results').html(`
      <div class="card bg-light mb-3">
        <h3 class="card-header d-flex justify-content-between align-items-center">Encoded URL <span id="copy-status" class="text-success float-right"></span></h3>
          <div class="card-body">
            <textarea class="form-control border border-secondary text-monospace" rows="3" col="10" id="textarea-url">${url.polaris}</textarea>

            <div class="d-flex justify-content-between">
              <button id="btn-copy" class="btn btn-primary mt-2"><i class="fas fa-clipboard"></i> &nbsp; Copy</button>

              <div class="btn-group mt-2" role="group" aria-label="Check links">
                <a class="btn btn-info" href="${url.polaris}" target="_blank"><i class="fas fa-search"></i> Polaris</a>
                <a class="btn btn-info" href="${url.worldcat}" target="_blank"><i class="fas fa-globe"></i> WorldCat</a>
                <a class="btn btn-info" href="${url.google}" target="_blank"><i class="fas fa-images"></i> Google Images</a>
              </div>
            </div>
          </div>
      </div>
    `);
  };


  // FUNCTION to build preview if option is checked
  const buildPreview = url => {
    $('#leftCol').removeClass('col-md-9').addClass('col-md-6');
    $('#preview').addClass('col-md-6');
    $('#preview').html(`
      <div class="embed-responsive embed-responsive-4by3">
        <iframe class="embed-responsive-item" src="${url.polaris}"></iframe>
      </div>
    `);
  };


  // FUNCTION to add or remove column sizing for iframes
  const checkCol = () => {
    if($('#leftCol').hasClass('col-md-6')) {
      $('#leftCol').removeClass('col-md-6').addClass('col-md-9');
      $('#preview').empty();
    };
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
        $('#btn-copy').addClass('btn-success');
        $('#copy-status').html(`<i class="fas fa-check-circle fa-lg"></i> Copied!`);

        $('#textarea-url').blur(function () {
          $('#textarea-url').removeClass('border-success').addClass('border-secondary');
          $('#btn-copy').removeClass('btn-success').addClass('btn-primary');
          $('#copy-status').html("");
        });
      });

    } catch (error) {
      $('#textarea-url').addClass('border border-danger');
      $('#btn-copy').removeClass('btn-secondary').addClass('btn-danger');
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
    if ($('#showPreview').is(':checked')) {
      buildPreview(url);
    } else {
      checkCol();
    };
    event.preventDefault();
  });

  // Submitting the form
  $('#btn-submit').click(function () {
    let url = buildURL();
    buildResults(url);
    tryCopy();
    if ($('#showPreview').is(':checked')) {
      buildPreview(url);
    } else {
      checkCol();
    };
  });

  // Clear the form and delete all of the results HTML
  $('#btn-clear').click(function (event) {
    $('#results').empty();
    checkCol();
    event.preventDefault();
    $(':text').val('');
    $('#showPreview').prop('checked', false);
    $('#btn-submit').prop('disabled', true);
    link.authorPolaris = "";
    link.authorNormal = "";
    link.titlePolaris = "";
  });
});
