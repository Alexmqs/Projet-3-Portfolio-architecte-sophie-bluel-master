// Vide le localStorage et appel showCat()
document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear();
    showCat()
});


/* 
====================================================================================
====================Gestion de l'affichage des catégories===========================
====================================================================================
*/


//Permet d'afficher les categorie avec les filtres et de l'evenement pour cliquer dessus
async function showCat() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const data = await categorie.json();

    //sauvegarde le html de base pour pouvoir le reload lors d'une connexion reussit 
    mainContent = document.querySelector("main").innerHTML;

    //Creation du boutons Tous et le rend active 
    const divfilterallButtons = document.querySelector("#filterButtons");
    const btnallelement = document.createElement("button");

    btnallelement.textContent = "Tous";

    btnallelement.classList.add("filterButton");
    btnallelement.classList.add("active");
    btnallelement.id = "all"

    btnallelement.addEventListener("click", function(event) {
        event.preventDefault()
        const filterButtons = document.querySelectorAll(".filterButton");
        filterButtons.forEach(button => button.classList.remove("active"));

        btnallelement.classList.add("active");

        showPictures("all");
    });

    divfilterallButtons.appendChild(btnallelement);

    showPictures("all");

    for (let i = 0; i < data.length; i++) {

        const divfilterButtons = document.querySelector("#filterButtons");
        const btnelement = document.createElement("button");

        btnelement.textContent = data[i].name;
        btnelement.classList.add("filterButton");

        btnelement.addEventListener("click", function(event) {
            event.preventDefault()
            const filterButtons = document.querySelectorAll(".filterButton");
            filterButtons.forEach(button => button.classList.remove("active"));

            btnelement.classList.add("active");
            showPictures(data[i].id);
        });

        divfilterButtons.appendChild(btnelement);
    }
}


/* 
====================================================================================
================Gestion de l'affichage des images dans la gallerie==================
====================================================================================
*/


//Fonction qui permet de recuperer et afficher les images et la déscription sur le site 
async function showPictures(id) {

    //Recuperation des données de l'api concernant les images
    const picture = await fetch("http://localhost:5678/api/works");
    const data = await picture.json();
    // Si la page viens d'etre charger ou le bouton filtre tous est cliquer charge les images
    if ( id === "all") {
        document.querySelector(".gallery").innerHTML = ""; //Vide la gallery avant de générer 
        
        //Boucle pour créer les images et déscription
        for (let i = 0; i < data.length; i++) {
            //divgallery permet de savoir que l'on va stocker les donner dans la div .gallery
            const divgallery = document.querySelector(".gallery")
        
            // Création de la balise figure
            const figureElement = document.createElement("figure");
            //Permet de creer une balise img et d'integrer l'image associer 
            const imageElement = document.createElement("img");
            const descriptionElement = document.createElement("figcaption");
        
            imageElement.src = data[i].imageUrl;
            descriptionElement.textContent = data[i].title;
        
            // Dans ma div gallery ajoute l'image et de la déscription 
            figureElement.appendChild(imageElement);
            figureElement.appendChild(descriptionElement);
        
            divgallery.appendChild(figureElement);
        }
    } else {
    
        document.querySelector(".gallery").innerHTML = "";//Vide la gallery avant de générer 
    
        for (let i = 0; i < data.length; i++) {
            // Verifie si la categorie du filtre correspond a l'id de l'image dans l'api
            if (data[i].category.id.toString() === id.toString()) {
     
                const divgallery = document.querySelector(".gallery")
     
                // Création de la balise figure
                const figureElement = document.createElement("figure");
                //Permet de creer une balise img et d'integrer l'image associer 
                const imageElement = document.createElement("img");
                const descriptionElement = document.createElement("figcaption");
      
                imageElement.src = data[i].imageUrl;
                descriptionElement.textContent = data[i].title;
      
                // Dans ma div gallery ajoute l'image et de la déscription 
                figureElement.appendChild(imageElement);
                figureElement.appendChild(descriptionElement);
       
                divgallery.appendChild(figureElement);
           }
        }
    }
}


