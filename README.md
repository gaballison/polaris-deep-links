# Polaris Deep Link Generator
This is a tool created for my [Code Louisville](https://codelouisville.org/) front end web development portfolio. I wanted to create an app that would easily generate a properly encoded URL to include when updating our library's Wordpress site with links to items in our online catalog. However, Polaris doesn't allow direct linking to search results or specific item or bibliographic records in the OPAC, so you have to create what Polaris terms "deep links". The process of creating these by hand is a bit tedious, so I wanted something to do it for me.

I also have it embed the search string it creates so I can a) make sure the URL is actually correct and b) see if we have any items with that particular title/by that author/etc. in our collection. I most frequently need these links on our [Book Clubs page](https://jefflibrary.org/events/book-clubs/) and the clubs don't always read books we own.

Ideally I'd like to skip the embedding step and just return an item count based on the search parameters, but that requires using the Polaris API (PAPI) and I haven't gotten into that yet. 
