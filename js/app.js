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
      let apos = encoded.replace(/'/g, "%27");
      let space = apos.replace(/%20/g, "+");
      link.title = space;
    } else {
      link.title = "";
    }

  };

  // Encode the author
  const encodeAuthor = inputAuthor => {
    if (inputAuthor !== "") {
      let input = inputAuthor.trim();
      let matches = input.match(/\w*/g);
      let len = matches.length;
      let sur = matches[len - 2];
      let author = sur + ",%20";
      for (let i = 0; i < len - 2; i++) {
        if (matches[i] != "") {
          if (i == len - 4) {
            author += matches[i];
          } else {
            author += matches[i] + "%20";
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

  // Submitting the form
  $('#btn-submit').click(function () {
    const title = $('#title').val();
    const author = $('#author').val();
    console.log(`The author value is ${author}`);

    encodeTitle(title);
    encodeAuthor(author);

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

    $('#results-url').html(`<h4>Encoded URL</h4>
        <textarea class="col-auto" cols="50" rows="5" id="textarea-url">${url}</textarea>
        <button class="btn btn-secondary mr-3" id="btn-copy">Copy this?</button><span id="copy-status" class="text-success"></span>`);

    $("#preview").html(`<h4>Check Polaris For A Copy</h4><object data="${url}" width="700" height="400"><embed src="${url}" width="700" height="400"> </embed>Error: Embedded data could not be displayed. Try going <a href="${url} target="_blank">straight to Polaris</a> and looking for copies instead.</object>`);

    // see if it will copy properly
    try {
      $('#btn-copy').click(function () {
        selectText('#textarea-url');
        document.execCommand("copy");
        $('#textarea-url').addClass('border border-success');
        $('#btn-copy').removeClass('btn-secondary').addClass('btn-success');
        $('#copy-status').html(`<img src="img/check.svg" class="text-success" alt="Success!"> Copied successfully!`);
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
