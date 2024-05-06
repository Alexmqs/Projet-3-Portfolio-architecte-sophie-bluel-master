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


showCat();

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
  //        
                const divgallery = document.querySelector(".gallery")
  //        
                // Création de la balise figure
                const figureElement = document.createElement("figure");
                //Permet de creer une balise img et d'integrer l'image associer 
                const imageElement = document.createElement("img");
                const descriptionElement = document.createElement("figcaption");
  //        
                imageElement.src = data[i].imageUrl;
                descriptionElement.textContent = data[i].title;
  //        
                // Dans ma div gallery ajoute l'image et de la déscription 
                figureElement.appendChild(imageElement);
                figureElement.appendChild(descriptionElement);
  //        
                divgallery.appendChild(figureElement);
           }
        }
    }
}

let tokenConnection;

// Partie pour générer la page de login 
function loginPage() {
    //Sauvegarde le main pour pouvoir le recharger lors d'une connection valide 

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
                <p id="loginError"></p> 
                <input type="submit" id = "submit" value="Se connecter">
            </form>
            <p><a href="/password-reset">Mot de passe oublié ?</a></p>
        </div>
    `;

    main.innerHTML = html;

    //Ecoute l'evenement du formulaire  id="loginForm"

    document.getElementById("loginForm").addEventListener("submit", function(event) {
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

        //envoie des données a l'api
        fetch("http://localhost:5678/api/users/login", { 
            method: "POST", 
            body: jsonLogin, 
            headers: { "Content-Type": "application/json" }
        })

        .then(response => {
            if (!response.ok) {
                document.getElementById('loginError').textContent = "Erreur dans l’identifiant ou le mot de passe"; 
            } else {
                response.json().then(data => {
                    //Enregistrement du token 
                    const token = data.token;
                    tokenConnection = token;
        
                    document.querySelector("main").innerHTML = mainContent;
                    showPictures("all")
                    editionMode();
                });
            }

        })
    })
}

//Permet d'ouvrire la page de login ou de se déconnecter
let loginBtn = document.getElementById("login")
loginBtn.addEventListener("click",function() {
    const loginButton = document.getElementById('login');
    if (loginButton.textContent === "login") {
        //Charger la login page
        loginPage();
    }else{
        removeEditionMode()
    }
})


//Ouvre le mode edition 
async function editionMode() {

    //Crée une div de la classe "edition-mode-bar" avec un span à l'intérieur.
    const editionModeBar = document.createElement('div');
    editionModeBar.classList.add('edition-mode-bar');
    const spanEditionBar = document.createElement('span');
  

    //Ajoute le contenue dans le span
    spanEditionBar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Mode édition';

    //Ajoute le span dans la div
    editionModeBar.appendChild(spanEditionBar);
    //Insert la div au sommet de la page en tant que premier enfant 
    document.body.insertBefore(editionModeBar, document.body.firstChild);

    //Modification du bouton login par logout
    const loginButton = document.getElementById('login');
    loginButton.textContent = 'Logout';

    //Ajout du span dans l'id edition-mode-projets
    const portfolioSection = document.getElementById('edition-mode-projets')
    const spanEditionProjets = document.createElement('span');
    spanEditionProjets.classList.add("modif-btn");
    
    spanEditionProjets.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>Modifier';
    portfolioSection.appendChild(spanEditionProjets)
    openModal()
  
}


//Supprime le mode edition 
function removeEditionMode() {
    tokenConnection = null;

    //change le bouton logout en login 
    const loginButton = document.getElementById('login');
    loginButton.textContent = 'login';

    //Supprime la barre d'etition 
    const editionModeBar = document.querySelector('.edition-mode-bar');
    editionModeBar.remove();

    //Supprime le bouton modifier 
    const spanEditionProjets = document.querySelector('#edition-mode-projets span');
    spanEditionProjets.remove()

}


let targetModal = null
const focusableSelector = 'button, a , input, textarea'
let focusables = []
let previouslyFocusableElement = null

//Permet d'ouvrir la modal 
function openModal() {
    const modif = document.querySelector(".modif-btn");
    modif.onclick = function() {
        const modal = document.querySelector(".modal");
        focusables = Array.from(modal.querySelectorAll(focusableSelector));
        const trashIcons = Array.from(modal.querySelectorAll('.trash-modal-icon'));
        focusables.push(...trashIcons);
        previouslyFocusableElement = document.querySelector(':focus');
        modal.style.display = "block";
        focusables[0].focus();
        modal.setAttribute('aria-hidden', false);
        modal.setAttribute('aria-modal', true);

        targetModal = modal;

        showModalPicture();
        //Ferme la modal lors d'un click exterieur à celle-ci
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
    }
}

//Fait apparaitre les photos dans la modal modal-galery
async function showModalPicture() {
    const picture = await fetch("http://localhost:5678/api/works");
    const data = await picture.json();

    const divmodalgallery = document.getElementById("gallerymodal");
    divmodalgallery.innerHTML = ""; // Vide la galerie modal avant de générer

    for (let i = 0; i < data.length; i++) {
        const imageModalContainer = document.createElement("div");
        const imageModalElement = document.createElement("img");
        const trashModalIcon = document.createElement("i");

        imageModalElement.src = data[i].imageUrl;
        imageModalContainer.dataset.imageId = data[i].id;

        imageModalContainer.classList.add("image-modal-container");
        trashModalIcon.classList.add("fa-solid", "fa-trash-can", "trash-modal-icon");

        imageModalContainer.appendChild(imageModalElement);
        imageModalContainer.appendChild(trashModalIcon);

        divmodalgallery.appendChild(imageModalContainer);
    }
}

// Ajoute un écouteur d'événements au clic sur l'icône de corbeille une seule fois
document.addEventListener('click', async function(event) {
    //Supprime une image
    if (event.target.classList.contains('trash-modal-icon')) {
        event.preventDefault();
        // Récupère l'élément parent contenant l'image et la corbeille
        const imageContainer = event.target.parentElement;
        // Récupère l'ID de l'image à supprimer à partir de l'attribut personnalisé
        const imageId = imageContainer.dataset.imageId;
        // Supprime l'image en faisant directement la requête DELETE
        await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenConnection}`
            },
        });
        console.log("l'image a bien été supprimée");
        // Rafraîchit la galerie modal après suppression
        await showModalPicture();
        await showPictures("all");
    }

    //Permet de passer à modal-add-picture modal-galery
    if (event.target.classList.contains('submit-add-button')) {
        event.preventDefault();
        modalAddPictureOpen();
    }

    //Permet de revenir à 
    if (event.target.classList.contains('back-icon')) {
        event.preventDefault();
        document.getElementById("modal-add-picture").style.display = "none";
        document.getElementById("modal-galery").style.display = "block";
        showModalPicture()
    }

});

async function modalAddPictureOpen() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const data = await categorie.json();

    //Fait apparaitre modal-add-picture et disparaitre modal-galery
    document.getElementById("modal-galery").style.display = "none";
    document.getElementById("modal-add-picture").style.display = "block";

    //vide les categories
    const selectElement = document.getElementById("categorie");    
    selectElement.innerHTML = '';

    //Ajoute une option vide 
    const emptyOption = document.createElement('option');
    emptyOption.value = "none";
    selectElement.appendChild(emptyOption);

    //Ajoute les option de catégorie via l'api 
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name; // Assurez-vous de remplacer "value" par la propriété correcte de vos données
        option.textContent = category.name; // Assurez-vous de remplacer "label" par la propriété correcte de vos données
        selectElement.appendChild(option);
    });


}


//Fonction qui permet de fermer la modal
function closeModal() {
    targetModal.style.display = "none";
    document.getElementById("modal-add-picture").style.display = "block";
    document.getElementById("modal-galery").style.display = "none";
    targetModal.setAttribute('aria-hidden', true);
    targetModal.setAttribute('aria-modal', false);
    const divmodalgallery = document.getElementById("gallerymodal");
    divmodalgallery.innerHTML = "";

    if (previouslyFocusableElement !== null) previouslyFocusableElement.focus()
}

//Permet de garder le focus dans la modal 
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === targetModal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++; 
    }   
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}


//Ferme la modal avec un click sur la croix 
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close-icon')) {
        event.preventDefault();
        closeModal();
    }
});


window.addEventListener("keydown", function (e) {
    //Ferme la modal avec Echape
    if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        closeModal(e)
    }
    //Pour le focus dans la modal avec tab
    if (e.key === "Tab" && targetModal !== null) {
        e.preventDefault();
        focusInModal(e)
    }
});

