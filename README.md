# Polaris Deep Link Generator

This is a tool created for my [Code Louisville](https://codelouisville.org/) front end web development portfolio. 

I maintain [my library's website](https://jefflibrary.org) and one of my monthly tasks is updating the page listing what all of our [book clubs](https://jefflibrary.org/events/book-clubs) are reading that month. However, one of the frustrating things I've encountered is not being able to copy a link to a specific item directly from [our online catalog](http://jeffersonville.polarislibrary.com); the urls are session-specific and so don't work as permanent links.

The simplest solution I've found so far is to use what our integrated library system, Polaris, calls "deep links" to search results (instead of to specific item records), and these links have to be properly [percent-encoded/URL-encoded](https://www.w3schools.com/tags/ref_urlencode.asp). Doing that manually is tedious so I wanted to create an app that would easily generate a properly encoded URL for me. It also includes a button to test the resulting URL which then also allows me to check the catalog to see if we actually own that item, since sometimes our clubs read books we don't have in our collection.

## Resources Used

* [jQuery](https://jquery.com)
* [Bootstrap](https://getbootstrap.com)
* [Bootswatch Theme: Pulse](https://bootswatch.com/pulse/)


## Custom CSS Classes

1. ```css
    body {
        height: 100vh;
        font-family: 'PT Sans', sans-serif;
        background: linear-gradient(#D0B6F3 0%, #704C5E 100%) no-repeat 100%;
        background-attachment: fixed;
    }
    ```
    Selects the entire body of the page and gives it a height of 100% of the viewport height, sets the base font to [PT Sans](https://fonts.google.com/specimen/PT+Sans), and creates a fixed purple gradient background.
2. ```css
    header h1 {
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    ```
    Selects the `h1` element in the `header` and gives it an inline text shadow based on the example from [CSS-Tricks](https://css-tricks.com/almanac/properties/t/text-shadow/).
3. ```css
    .link {
        display: inline-block;
        text-decoration: none;
        color: lavenderblush;
    }

    .link:hover {
        text-decoration: none;
    }

    .link::after {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: lavenderblush;
        transition: width .3s;
    }

    .link:hover::after {
        width: 100%;
    }
    ```
    Creates a class to give links the illusion of a thick bottom border but in actuality uses a background with a height of 2px, which allows you to use the `transition` property to animate the "border".


## Custom JavaScript Functions

1. ```javascript
    // FUNCTION to encode the title
    const encodeTitle = inputTitle => {
        let encoded = encodeURIComponent(inputTitle);

        // encodeURIComponent doesn't encode apostrophes, so use .replace method to correct them
        let apos = encoded.replace(/'/g, "%27");

        // encodeURIComponent replaces spaces with %20 but we need spaces to be +
        let space = apos.replace(/%20/g, "+");

        // assign the resulting encoded string to the "titlePolaris" property of the link object
        link.titlePolaris = space;
    };
    ```
    Function that takes a single argument (the value of the `title` form field) and checks if the value is empty. If not, it first runs the value through JavaScript's [native](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) `encodeURIComponent()` function. That doesn't encode apostrophes, so it then uses the `.replace()` string method to replace them with the correct URI encoding. All spaces are converted to `%20` in the original method, but Polaris requires words to be separated by `+` so the next line uses the same `.replace()` method to make that change. Finally the finished string is assigned to the `titlePolaris` property of the `link` object created at the beginning of my JS file.
2. ```javascript
    // FUNCTION to encode the author
    const encodeAuthor = inputAuthor => {
        let input = inputAuthor.trim();

        // create array of individual words from the input
        let matches = input.match(/[\w.-]*/g);
        let len = matches.length;

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

                    /*  if the name is the last one before 
                    the surname don't add a + after it    */
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

                /*  if the name is the last one before 
                the surname don't add a + after it     */
                if (j == len - 2) {
                    authorGoogle += matches[j];
                } else {
                    authorGoogle += `${matches[j]}+`;
                }
            }
        }
        link.authorNormal = authorGoogle;

    };
    ```
    Function that takes the value of the `author` form field as an argument and first checks to see if the value is empty. If not, it trims whitespace from the beginning and end of the input. It then creates an array consisting of each word in the input, using the `.match()` method. Because the last value of this array is always an empty string, we use the text in the penultimate position in the array as the surname, and then loop through the rest of the array to build the author query string in the format of `LastName,+FirstName+MiddleName` for Polaris searches. This is then assigned to the `authorPolaris` property of the `link` object. However, for searching WorldCat and Google Images doesn't require that Last Name, First Name format so we create a separate string for searching those sites and save it to the `authorNormal` property.


## Future Improvements

Ideally I'd like to just return an item count based on the search parameters, but the only way I've seen to do that is using the [Polaris API (PAPI)](http://developer.polarislibrary.com/), which would require some back-end scripting to handle authentication securely. Since I want this to work on Github Pages, back end programs aren't an option for now.
