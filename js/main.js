
function main(){

var source,html;
var currentCategoryId = 0;
var resultsObj = {results:[]};
      
////////////////////////////////////
/// Handlebars preparing templates
////////////////////////////////////
source=$("#menu-template").html();
var menuTemplate=Handlebars.compile(source);
    
source = $("#heading-template").html();
var headingTemplate=Handlebars.compile(source);

source = $("#main-template").html();
var mainTemplate=Handlebars.compile(source);
    
source=$("#class-template").html();
var classTemplate=Handlebars.compile(source);
    
source=$("#animal-details-template").html();
var animalTemplate=Handlebars.compile(source);
    
source=$("#results-template").html();
var resultsTemplate=Handlebars.compile(source);

    
//////////////////////////////////////   
/// initial display of the main page
//////////////////////////////////////
html=menuTemplate(data);
$("#category-menu").html(html);
html=headingTemplate(data);
$("#heading").html(html);
html=mainTemplate(data);
$("#content").html(html);

/* Making the dropdown in menu automatic */    
$(".navbar .dropdown").mouseenter(function() {
    $(this).addClass("open");
});
$(".navbar .dropdown").mouseleave(function() {
    $(this).removeClass("open");
});
    
/* make navbar not transparent after the page is scrolled down */
$(document).scroll(function(event) {
    var windowWith =  $(window).width(); 
    if($(this).scrollTop()==0&&windowWith>768){ // the window is scrolled to top and the screen is bigger than 768px - the background of the menu should not be transparent on small screens
        $(".navbar-default").css("background-color", "rgba(6,6,6,0.5)");
        $(".breadcrumb").css("background-color", "rgba(6,6,6,0.5)");
    } else {
        $(".navbar-default").css("background-color", "rgba(6,6,6,0.8)");
        $(".breadcrumb").css("background-color", "rgba(6,6,6,0.8)");        
    }
})
    
    

/////////////////////////////////////////////////    
/// open modal window after clicking on a image
/////////////////////////////////////////////////
$("body").on("click","img",function(event){
	var index=$(this).data("id");
    var imgSrc=event.target.currentSrc;
    $("#image-modal-content .modal-body").html("<img src='"+imgSrc+"' />");
});


/////////////////////////////////////////////////////////////////////////
/// display animal category after menu or button on main page is clicked
/////////////////////////////////////////////////////////////////////////    
$("body").on("click",".choose-category",function(event){ 
    if($(this).data("id")) { //if back to category button is pressed, id of category is not changed - it is done by not delivering data-id in the button
        currentCategoryId=$(this).data("id"); // select current category (its id in array)
    };
    
    var currentCategoryName = data.category[currentCategoryId].name;
    
    $(".breadcrumb").html("<li> <a href='index.htm'>Home</a> </li>");
    $(".breadcrumb").append("<li class='choose-category' data-id='" + currentCategoryId + "' ><a href='#'>" + currentCategoryName + "</a></li>"); // update breadcrumb and make it clickable
    
    var bgImage=data.category[currentCategoryId].image1; // choose background image
    $('#main-page').css('background-image', 'url(' + bgImage + ')'); // change background image
    
    var toDisplay =data.category[currentCategoryId];
    html=headingTemplate(toDisplay);
    $("#heading").html(html);
    html=classTemplate(toDisplay);
    $("#content").html(html);
    $("#additional-content").html("");
});


    
////////////////////////////////////////////////////////////////////
/// display details about the animal if button in summary is clicked 
////////////////////////////////////////////////////////////////////
$("body").on("click",".choose-animal-btn",function(event){
    $(".breadcrumb").append("<li>"+$(this).data("name")+"</li>"); // update breadcrumb
    var chosen=$(this).data("id"); // select current animal (its id in array)
    var bgImage=data.category[currentCategoryId].image1; // choose background image
    $('#main-page').css('background-image', 'url(' + bgImage + ')'); // change background image
    
    var toDisplay= data.category[currentCategoryId].animals[chosen];
    html=headingTemplate(toDisplay);
    $("#heading").html(html);
    html=animalTemplate(toDisplay);
    $("#content").html(html);    
});


//////////////////////////////////////////////////////
/// display animal after result of search is clicked
//////////////////////////////////////////////////////  
$("body").on("click", ".choose-result-btn", function(event){ 
    $(".breadcrumb").append("<li>"+$(this).data("name")+"</li>"); // update breadcrumb
    currentCategoryId=$(this).data("ctg"); // select current category (its id in array)
    currentAnimalId=$(this).data("ani"); // select current animal (its id in array)
    var bgImage=data.category[currentCategoryId].image1; // choose background image
    $('#main-page').css('background-image', 'url(' + bgImage + ')'); // change background image
    console.log("ctg:"+currentCategoryId);
    console.log("ani:"+currentAnimalId);    
    var toDisplay =data.category[currentCategoryId].animals[currentAnimalId];
    html=headingTemplate(toDisplay);
    $("#heading").html(html);
    html=animalTemplate(toDisplay);
    $("#content").html(html);
    $("#additional-content").html("");
});

    
//////////////////
/// S E A R C H
//////////////////
/* I have used two ways of displaying results - for categories I make not fitting thumbs invisible and for animals I create a new object -resultsObj which contains an array of results - its name, image, position in category array and position in animal array */
$("#searchbox").keypress(function(e){
	if(e.which==13){  //enter is pressed after typing in the searchbox
        var found=false;
        resultsObj = {results:[]}; //clearing previous results
        var search_text=$("#searchbox").val().toLowerCase(); //taking searched string and removing uppercase

        /* Searching within categories */
		for (var i = 0; i < data.category.length; i++) {
            data.category[i].displayStyle=""; //clear previous search
            var str = data.category[i].name.toLowerCase(); //make the string case insensitive           
			if (str.search(search_text)==-1) { 
                data.category[i].displayStyle="display:none;";//make the category which does not fit the searching string invisible
			}
			else {
                found=true;
			};          
            
            /* Searching within animals of the current category */
            for (var j = 0; j < data.category.length; j++) {
                var str = data.category[i].animals[j].name.toLowerCase(); //make the string case insensitive     
                if (str.search(search_text)!==-1) { //found something
                    resultsObj.results.push({name: data.category[i].animals[j].name, image1: data.category[i].animals[j].image1, categoryIndex:i, animalIndex:j}); // add new object with data about found item into results
                }
            };    
		};
        
        /* Updating breadcrumb */
        $(".breadcrumb").html("<li> <a href='index.htm'>Home</a> </li><li>Search results</li>");
        
        /* displaying search results header*/
        html="<h1>Search results</h1>";
        $("#heading").html(html);
        
        /*displaying results of search within categories*/
        var html = mainTemplate(data);
		$("#content").html(html);
        if (found===true) {
            $("#content").prepend("<h3>Results found in categories</h3>");
        };

        /*displaying results of search within animals*/
        var html = resultsTemplate(resultsObj);
		$("#additional-content").html(html);
        if(resultsObj.results.length>0) {
            $("#additional-content").prepend("<h3>Results found in animals</h3>");
        };
        
		/*Message to display when nothing is found*/
		if (found===false&&resultsObj.results.length==0) {
			html="<h1>No result</h1><p>Your text string does not match any content... <br/><p>Return to the <a href='index.htm'>home page</a>.</p>";
            $("#heading").html(html);
            html=classTemplate("");
            $("#content").html(html);
		};
	};
});


};
$(document).ready(main);