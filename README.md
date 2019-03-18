# Polaris Deep Link Generator

This is a tool created for my [Code Louisville](https://codelouisville.org/) front end web development portfolio. I maintain [my library's website](https://jefflibrary.org) and one of my monthly tasks is updating the page listing what all of our [book clubs](https://jefflibrary.org/events/book-clubs) are reading that month. However, one of the frustrating things I've encountered is not being able to copy a link to a specific item directly from [our online catalog](http://jeffersonville.polarislibrary.com); the urls are session-specific and so don't work as permanent links.

The simplest solution I've found so far is to use what our integrated library system, [Polaris](https://www.iii.com/products/polaris-ils/), calls "deep links" to search results (instead of to specific item records), and these links have to be properly [percent-encoded/URL-encoded](https://www.w3schools.com/tags/ref_urlencode.asp). Doing that manually is tedious so I wanted to create an app that would easily generate a properly encoded URL for me. It also includes a button to test the resulting URL which then also allows me to check the catalog to see if we actually own that item, since sometimes our clubs read books we don't have in our collection.

## Resources Used

* [jQuery](https://jquery.com)
* [Bootstrap](https://getbootstrap.com)
* [Bootswatch Theme: Pulse](https://bootswatch.com/pulse/)


## Custom CSS Classes

1. ```css
    footer {
        width: 100%;
        margin-top: auto;
        font-size: .7em;
        padding: 20px;
        text-align: center;
    }
    ```
    Selects footer and styles it with a small font size, 20 pixels of padding, and centered font. The `margin-top: auto` makes it sticky because the `body` has uses [Bootstrap's](https://getbootstrap.com) `d-flex flex-column` classes to make it a flexbox layout.
2. ```css
    #textarea-url {
        font-family: monospace;
        font-size: 1.3em;
        border-radius: 10px;
        box-shadow: 0px 2px 5px 0.5px dimgray;
    }
    ```
    Selects the textarea with the id `textarea-url` and changes the font to monospace, makes it larger, and gives it the same border properties as the wrapper for the form.


## Custom JavaScript Functions

1. ```javascript
    const encodeTitle = inputTitle => {
        if (inputTitle !== "") {
            let encoded = encodeURIComponent(inputTitle);

            // encodeURIComponent doesn't encode apostrophes, 
            // so use .replace method to correct them
            let apos = encoded.replace(/'/g, "%27");

            // encodeURIComponent replaces spaces with %20 but we need spaces to be +
            let space = apos.replace(/%20/g, "+");

            // assign the resulting encoded string to the "title" property of the link object
            link.title = space;
        } else {
            link.title = "";
        }
    };
    ```
    Function that takes a single argument (the value of the `title` form field) and checks if the value is empty. If not, it first runs the value through JavaScript's [native](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) `encodeURIComponent()` function. That doesn't encode apostrophes, so it then uses the `.replace()` string method to replace them with the correct URI encoding. All spaces are converted to `%20` in the original method, but Polaris requires words to be separated by `+` so the next line uses the same `.replace()` method to make that change. Finally the finished string is assigned to the `title` property of the `link` object created at the beginning of my JS file.
2. ```javascript
    const encodeAuthor = inputAuthor => {
        let input = inputAuthor.trim();

        // create array of individual words from the input
        let matches = input.match(/\w*/g);
        let len = matches.length;

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
    ```
    Function that takes the value of the `author` form field as an argument and first checks to see if the value is empty. If not, it trims whitespace from the beginning and end of the input. It then creates an array consisting of each word in the input, using the `.match()` method. Because the last value of this array is always an empty string, we use the text in the penultimate position in the array as the surname, and then loop through the rest of the array to build the author query string in the format of `LastName,+FirstName+MiddleName`. This is then assigned to the `author` property of the `link` object.


## Future Improvements

Ideally I'd like to just return an item count based on the search parameters, but the only way I've seen to do that is using the [Polaris API (PAPI)](http://developer.polarislibrary.com/), which would require some back-end scripting to handle authentication securely. Since I want this to work on Github Pages, back end programs aren't an option for now.
