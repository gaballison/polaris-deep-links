$(document).ready(function(){
	const link = {
    title:"",
    author:"",
    subject: "",
    format: "",
    url:"http://jeffersonville.polarislibrary.com/view.aspx?"
  };

  $("#title").blur(function(){
  	let str = $(this).val();

    // replacing every space in a title with +
    let newstr = str.replace(/\s/g,"+");
    
    link.title = newstr;
	});

  $("#author").blur(function(){
  	let input = $(this).val().trim();
    // let trimmed = input.trim();
    let matches = input.match(/\w*/g);
  	let len = matches.length;
    let sur = matches[len-2];
    let author = sur+",%20";
    for (let i = 0; i < len-2; i++) {
    	if (matches[i] != "") {
				if (i == len-4) {
        	author += matches[i];
        } else {
					author += matches[i]+"%20";
        }
      }
    }
    link.author = author;
  });

//  $("#genlink").click(function(){
	$("#polaris").submit(function(){
  	let url = "";
  	if (link.title != "" && link.author != "") {
    	url += link.url+"title="+link.title+"&author="+link.author;
    } else if (link.title == "" && link.author != ""){
    	url += link.url+"author="+link.author;
    } else if (link.title != "" && link.author == ""){
    	url += link.url+"title="+link.title;
    } else {
    	url = "You haven't entered any data!";
    }
   $("#test").html(url+"<br/>");
   $("#output").html("<object data=\""+url+"\" width=\"700\" height=\"400\"><embed src=\""+url+"\" width=\"700\" height=\"400\"> </embed>Error: Embedded data could not be displayed.</object>");
   $("#output").addClass("border border-primary");
	 return false;
  });



});
