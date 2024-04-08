/**
Data Catalog Project - SEA Stage 2
 */

// Global Variables
const paginationMax = 10;
let paginationIndex = 0; 


function sortIsoCode(item) {
    if (item.iso_code) {
        return true
    }
    else {
        return false
    }
}

// This funciton loads the data from csi.json
async function loadData() {
    let destinations;
    await fetch('data/csi.json')
    .then(response => response.json())
    .then(data => destinations = data)
    .catch(error => console.log(error));
    destinations = destinations.filter(sortIsoCode);
    return destinations;
}

// This function adds cards the page to display the data in the array
async function showCards() {
    const cardContainer = document.getElementById("card-container");
    const templateCard = document.querySelector(".card");
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
        let description = data[i].destination_description + '</br>' + data[i].travel_embassyAndConsulate
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
    cardImage.alt = "Flag of "+ newTitle;

    const cardDialog = card.querySelector("dialog span");
    cardDialog.innerHTML = description;

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



