/**
Data Catalog Project - SEA Stage 2
 */

// Global Variables
const paginationMax = 10; // How many cards per page
let paginationIndex = 0;  // Current index
let query; // Search query


//Update the search
function searchUpdate(search) {
    query = search;  // Update the query
    paginationIndex = 0; // Reset the index
    removeAll(); // Remove all visible cards
    showCards(); // Show new cards
}

// Tabs 
function changeTab(el,index) {
    const parent = el.parentNode;
    const activeButton = parent.querySelector('.active'); 
    const listItems = parent.querySelectorAll('.desc');
    activeButton.classList.remove('active'); // Remove the 'active' class from button previously selected button
    el.classList.add('active'); // Add 'active' class to the currently selected button
    listItems.forEach(ul => ul.classList.add('hidden')); // Make all of the list items hidden
    listItems[index].classList.remove('hidden'); // Make the selected list item not hidden
}

// If the item doesn't have a iso_code remove it 
function sortIsoCode(item) {
    if (item.iso_code) {
        return true;
    }
    else {
        return false;
    }
}

// Function for searching (can be updated to include more search criteria)
function searchFilter(item) {
    return item.geopoliticalarea.toLowerCase().includes(query.toLowerCase()) || item.destination_description.toLowerCase().includes(query.toLowerCase());
} 

// This function loads the data from csi.json
async function loadData() {
    let destinations;
    await fetch('data/csi.json')
    .then(response => response.json())
    .then(data => destinations = data)
    .catch(error => console.log(error));
    destinations = destinations.filter(sortIsoCode); // Remove any destinations without iso codes (No flags :( )
    if (query) {destinations = destinations.filter(searchFilter);} // If there is a query, filter items based on that query
    return destinations;
}

// This function creates the descriptions for the modals
function makeDescription(dest) {
    let tmp = "<h2>Short Description:</h2>";
    tmp += dest.destination_description;
    tmp += "</br>"
    tmp += "<h2>Relevant Information:</h2>";
    //Adding information in this order: health, safety, entry/exit requirements, embassy, local laws, transportation
    tmp += "<button onclick='(()=>changeTab(this,0))()' class='active' style='margin:0.5rem;'>"+"Health"+"</button>"
    tmp += "<button onclick='(()=>changeTab(this,1))()' style='margin:0.5rem;'>"+"Safety"+"</button>"
    tmp += "<button onclick='(()=>changeTab(this,2))()' style='margin:0.5rem;'>"+"Entry/exit"+"</button>"
    tmp += "<button onclick='(()=>changeTab(this,3))()' style='margin:0.5rem;'>"+"Embassy"+"</button>"
    tmp += "<button onclick='(()=>changeTab(this,4))()' style='margin:0.5rem;'>"+"Local laws"+"</button>"
    tmp += "<button onclick='(()=>changeTab(this,5))()' style='margin:0.5rem;'>"+"Transportation"+"</button>"
    tmp += "<ol class='tabs'>" // Make an ordered list of all the information 
    tmp +=      "<li class='desc'>"+dest.health+"</li>"
    tmp +=      "<li class='desc hidden'>"+dest.safety_and_security+"</li>"
    tmp +=      "<li class='desc hidden'>"+dest.entry_exit_requirements+"</li>"
    tmp +=      "<li class='desc hidden'>"+dest.travel_embassyAndConsulate+"</li>"
    tmp +=      "<li class='desc hidden'>"+dest.local_laws_and_special_circumstances+"</li>"
    tmp +=      "<li class='desc hidden'>"+dest.travel_transportation+"</li>"
    tmp += "</ol>"
    return tmp;
}

// This function adds cards the page to display the data in the array
async function showCards() {
    const cardContainer = document.getElementById("card-container");
    const templateCard = document.querySelector(".card");
    const pageNumber = document.querySelector("#pageNumber");
    const data = await loadData();

    // Pagination arrows
    // Right (If the pagination is above the length of the data, hide the right arrow)
    if (data.length <= paginationIndex*paginationMax+paginationMax) {
        document.querySelector("#right").classList.add("hidden");
    } else {
        document.querySelector("#right").classList.remove("hidden");
    }
    // Left  (If the pagination is below 0, hide the left arrow)
    if (0 >= paginationIndex*paginationMax) {
        document.querySelector("#left").classList.add("hidden");
    } else {
        document.querySelector("#left").classList.remove("hidden");
    }

    // Show page number
    pageNumber.textContent = "Page " + (paginationIndex+1) + " of " + Math.ceil(data.length / paginationMax); 


    // Create cards
    for (let i = paginationIndex*paginationMax; i < paginationIndex*paginationMax + paginationMax; i++) {
        let title = data[i].geopoliticalarea;
        let imageURL;
        // Some countries have changed their iso codes
        if (data[i].iso_code.toString().toLowerCase() == "cs") {
            imageURL = "https://flagcdn.com/h240/rs.png";
        }
        else if(data[i].iso_code.toString().toLowerCase() == "bu") {
            imageURL = "https://flagcdn.com/h240/mm.png";
        } else {
            imageURL = "https://flagcdn.com/w160/"+data[i].iso_code.toString().toLowerCase()+".png";
        }
        let description = makeDescription(data[i]);
        const nextCard = templateCard.cloneNode(true); // Copy the template card
        nextCard.classList.remove("hidden"); // Make sure they aren't hidden
        editCardContent(nextCard, title, imageURL,description); // Edit title, image and add description
        cardContainer.appendChild(nextCard); // Add new card to the container
    }
}

function editCardContent(card, newTitle, newImageURL, description) {
    const cardHeader = card.querySelector("h2");
    cardHeader.textContent = newTitle;

    const cardImage = card.querySelector("img");
    cardImage.src = newImageURL; 
    cardImage.alt = "Flag of "+ newTitle; // Alternative text for screen readers
    cardImage.title = newTitle; // When the user hovers their mouse over the image, shows the name of the country

    const cardDialog = card.querySelector("dialog span"); 
    cardDialog.innerHTML = description; // Render the description as html (Can be kind of dangerous)

    // You can use console.log to help you debug!
    // View the output by right clicking on your website,
    // select "Inspect", then click on the "Console" tab
    console.log("new card:", newTitle, "- html: ", card);
}


// Remove all cards 
function removeAll() {
    document.querySelectorAll(".card").forEach(el => {if (!el.classList.contains('hidden')){el.remove()}});
}

// Paginatiation
function pagination(direction) {
    // Remove all cards before showing new cards
    removeAll();
    if(direction == "right") {
        paginationIndex+=1;
    }
    if(direction == "left") {
        paginationIndex-=1;
    }

    // Update cards after changing pagination
    showCards();
}


// This calls the showCard() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);



