// Écouter le clic sur l'élément avec l'ID login
document.getElementById("login").addEventListener("click", function(event) {
    event.preventDefault();
    if (document.getElementById("login").textContent === "login") {
        showLoginPage();
    }
    if (document.getElementById("login").textContent === "logout") {
        removeEditionMode();
    }
});

/* 
====================================================================================
=======================Gestion de la page de connexion==============================
====================================================================================
*/


// Fonction pour afficher la page de connexion et masquer les autres sections
function showLoginPage() {
    // Masquer toutes les sections
    const sections = document.querySelectorAll("section");
    sections.forEach(function(section) {
        section.style.display = "none";
    });

    // Afficher la section de connexion
    const loginPage = document.getElementById("login-page");
    loginPage.style.display = "block";

    // Écouter la soumission du formulaire de connexion
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupérer les valeurs du formulaire
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Créer l'objet de données à envoyer
        const data = {
            email: email,
            password: password
        };

        // Envoyer la requête POST à l'endpoint /users/login
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                // Si la réponse est OK (200), récupérer le token
                return response.json();
            } else if (response.status === 401) {
                // Si non autorisé (401), afficher un message d'erreur
                document.getElementById("loginError").textContent = "Erreur dans l’identifiant ou le mot de passe"; 
                throw new Error("Non autorisé");
            } 
        })
        .then(data => {
            // Si le token est récupéré avec succès, le stocker dans le local storage
            const token = data.token;
            localStorage.setItem("token", token);
            editionMode();
        })
        .catch(error => {
            console.error("Erreur lors de la connexion :", error.message);
        });
    });
}


/* 
====================================================================================
=================Gestion de l'affichage si connecter ou deconnecter ================
====================================================================================
*/


// Fonction pour afficher toutes les autres sections et masquer la section de connexion
function editionMode() {
    // Masquer la section de connexion
    document.getElementById("login-page").style.display = "none";
    document.getElementById("introduction").style.display = "flex";
    document.getElementById("portfolio").style.display = "block";
    document.getElementById("contact").style.display = "block";

    // Appeler showPictures("all") pour charger toutes les images
    showPictures("all");

    document.getElementById("filterButtons").style.display = "none";

    // Changer le texte de l'élément avec l'ID "login" en "Logout"
    const loginLink = document.getElementById("login");
    loginLink.textContent = "logout";

    // Créer une div avec la classe "edition-mode-bar"
    const editionModeBar = document.createElement("div");
    editionModeBar.classList.add("edition-mode-bar");

    // Créer une icône avec les classes "fa-solid", "fa-pen-to-square" et "icon-div"
    const icon = document.createElement("span");
    icon.classList.add("fa-solid", "fa-pen-to-square", "icon-div");

    editionModeBar.appendChild(icon);

    // Créer un texte pour "Mode édition"
    const text = document.createElement("span");
    text.textContent = "Mode édition";
    text.classList.add("mode-edition-text");

    editionModeBar.appendChild(text);
    document.body.appendChild(editionModeBar);

    const editionModeProjetsDiv = document.getElementById("edition-mode-projets");

    // Vérifier s'il n'y a pas déjà un bouton "Modifier" présent
    if (!editionModeProjetsDiv.querySelector(".modif-btn")) {
        const modifBtn = document.createElement("button");
        modifBtn.classList.add("modif-btn");
    
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-pen-to-square");
    
        const text = document.createElement("span");
        text.textContent = "modifier";
    
        modifBtn.appendChild(icon);
        modifBtn.appendChild(text);
    
        editionModeProjetsDiv.appendChild(modifBtn);
    }

    document.querySelector(".modif-btn").addEventListener("click", function(event) {
        event.preventDefault();
        checkEditMode();
    });

}

// Fonction pour supprimer le mode d'édition
function removeEditionMode() {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");

    document.getElementById("filterButtons").style.display = "block";
    
    // Changer le texte de l'élément avec l'ID "login" en "Login"
    const loginLink = document.getElementById("login");
    loginLink.textContent = "login";

    //Supprime la barre d'etition 
    const editionModeBar = document.querySelector(".edition-mode-bar");
    editionModeBar.remove();
    //Supprime le bouton modifier 
    const buttonEditionProjets = document.querySelector(".modif-btn");
    buttonEditionProjets.remove()
}



