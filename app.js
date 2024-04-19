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

            imageElement.src = data[i].imageUrl
            descriptionElement.textContent = data[i].title

            // Dans ma div gallery ajoute l'image et de la déscription 
            figureElement.appendChild(imageElement);
            figureElement.appendChild(descriptionElement)

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

                imageElement.src = data[i].imageUrl
                descriptionElement.textContent = data[i].title

                // Dans ma div gallery ajoute l'image et de la déscription 
                figureElement.appendChild(imageElement);
                figureElement.appendChild(descriptionElement)

                divgallery.appendChild(figureElement);
           }
        }
    }
}


// Récupération de filtres .filterButton
const filterButtons = document.querySelectorAll(".filterButton");
// Ajout d'un forEach pour récuperer tous les boutons 
filterButtons.forEach(button => {
    //Ecoute l'evenement du click sur un bouton 
    button.addEventListener("click", function() {
        // Supprimer ou ajoute la classe active si le bouton est cliquer 
        filterButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        
        const id = this.dataset.id;
        showPictures(id)
    });
});




//Génere les images de la page
showPictures("all") 


// Partie pour générer la page de login 

function loginPage() {
    //Supprimer le contenue du main 
    let main = document.querySelector("main"); 
    main.innerHTML = ""; 
    //document.querySelector("main").innerHTML = "";

    let html =`
        <div class ="login-page">
            <h2>Log In</h2>
            <form id="loginForm" action="login" method="post">
                <label for="email">Email</label><br>
                <input type="email" id="email" name="email" required><br>
                <label for="password">Mot de passe</label><br>
                <input type="password" id="password" name="password" required><br>
                <input type="submit" id = "submit" value="Se connecter">
            </form>
            <p><a href="/password-reset">Mot de passe oublié ?</a></p>
        </div>
    `;

    main.innerHTML = html;


}

let loginBtn = document.getElementById("login")
loginBtn.addEventListener("click",function() {
//Charger la login page
    loginPage()
})




