
//Fonction qui permet de recuperer et afficher les images et la déscription sur le site 
async function getpicture() {
    //Recuperation des données de l'api concernant les images
    const picture = await fetch("http://localhost:5678/api/works");
    const data = await picture.json();

    //Boucle pour créer les images et déscription
    for (let i = 0; i < data.length; i++) {
        //divgallery permet de savoir que l'on va stocker les donner dans la div .gallery
        const divgallery = document.querySelector(".gallery")

        // Création de la balise figure
        const figureElement = document.createElement("figure");

        //Permet de creer une balise img et d'integrer l'image associer 
        const imageElement = document.createElement("img");
        imageElement.src = data[i].imageUrl

        const descriptionElement = document.createElement("figcaption");
        descriptionElement.textContent = data[i].title

        // Dans ma div gallery ajoute l'image et de la déscription 
        figureElement.appendChild(imageElement);
        figureElement.appendChild(descriptionElement)

        
        divgallery.appendChild(figureElement);


    }
    
}

getpicture()
