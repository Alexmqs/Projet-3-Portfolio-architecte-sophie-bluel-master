async function showcat() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const data = await categorie.json();

    //Creation du boutons Tous et le rend active 
    const divfilterallButtons = document.querySelector("#filterButtons");
    const btnallelement = document.createElement("button");

    btnallelement.textContent = "Tous";

    btnallelement.classList.add("filterButton");
    btnallelement.classList.add("active");
    btnallelement.id = "all"

    btnallelement.addEventListener("click", function() {
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

        btnelement.addEventListener("click", function() {
            const filterButtons = document.querySelectorAll(".filterButton");
            filterButtons.forEach(button => button.classList.remove("active"));

            btnelement.classList.add("active");
            showPictures(data[i].id);
        });

        divfilterButtons.appendChild(btnelement);
    }
}

showcat();

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
  //        
                const divgallery = document.querySelector(".gallery")
  //        
                // Création de la balise figure
                const figureElement = document.createElement("figure");
                //Permet de creer une balise img et d'integrer l'image associer 
                const imageElement = document.createElement("img");
                const descriptionElement = document.createElement("figcaption");
  //        
                imageElement.src = data[i].imageUrl
                descriptionElement.textContent = data[i].title
  //        
                // Dans ma div gallery ajoute l'image et de la déscription 
                figureElement.appendChild(imageElement);
                figureElement.appendChild(descriptionElement)
  //        
                divgallery.appendChild(figureElement);
           }
        }
    }
}


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

    //Ecoute l'evenement du formulaire  id="loginForm"

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        //Pour ne pas recharger la page
        event.preventDefault();

        //Recuperation du mail et du mot de passe 
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        //transformation en Json des données 
        const loginData = {
            email: email,
            password: password
        }
        const jsonLogin = JSON.stringify(loginData)

        console.log(jsonLogin)

        //envoie des données a l'api
        fetch("http://localhost:5678/api/users/login", { 
            method: "POST", 
            body: jsonLogin, 
            headers: { "Content-Type": "application/json" }
        })

        .then(response => {
            if (!response.ok) {
                console.log("Echec de connexion!");
            }
            console.log("Connexion réussie !");
        })
    })
}

let loginBtn = document.getElementById("login")
loginBtn.addEventListener("click",function() {
//Charger la login page
    loginPage()
})