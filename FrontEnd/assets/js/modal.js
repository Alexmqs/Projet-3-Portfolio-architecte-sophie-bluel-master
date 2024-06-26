let targetModal = null;
const focusableSelector = "button, a , input, textarea";
let focusables = [];
let previouslyFocusableElement = null;
let uploadBtnClickHandler;
let handleSubmitNewPicture;
let selectedFile = null;


//Permet de verifier si lors de la connexion le token a bien été initialiser 
function checkEditMode() {
    const token = localStorage.getItem("token");
    if (token) {
        openModal(); 
        // Ajoute un écouteur d'événements pour la touche "Escape" pour fermer la modal
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape" || event.key === "Esc") {
                closeModal();
            }
            // Pour le focus dans la modal avec tab
            if (event.key === "Tab" && targetModal !== null) {
                focusInModal(event);
            }
        });

        // Ajoute un écouteur d'événements pour que les cliques ce produise bien qu'une seule fois 
        document.addEventListener("click", handleDocumentClick);
    }
}

//Permet de gerer les addEventListener pour pouvoir les removes et ne pas créer de copie 
function handleDocumentClick(event) {
    event.preventDefault();
    if (event.target.classList.contains("submit-add-button")) {
        modalAddPictureOpen();
        addpicture();
        submitNewPicture();
        checkConditions();
    }
    if (event.target.classList.contains("back-icon")) {
        document.getElementById("modal-add-picture").style.display = "none";
        document.getElementById("modal-galery").style.display = "block";
        showImgModal();
        //pour ne pas avoir d'evenement en double ou triple 
        removeEventListeners();
        document.addEventListener("click", handleDocumentClick);
        unloadPicture();
    }
    if (event.target.classList.contains("close-icon")) {
        closeModal();
    }
}

//Permet de supprimer les ecouteur d'evenement pour ne pas qu'il se multiplie 
function removeEventListeners() {
    document.removeEventListener("click", handleDocumentClick);
    document.querySelector(".upload-btn").removeEventListener("click", uploadBtnClickHandler);
    const submitButton = document.querySelector(".form-add-picture input[type='submit']");
    if (submitButton) {
        submitButton.removeEventListener("click", handleSubmitNewPicture);
    }
}

// Permet de décharger la photo si l'on ne l'upload pas 
function unloadPicture() {
    if (selectedFile !== null) {
        // Supprime l'image qui a été affichée dans .modal-upload-section
        const imgElement = document.querySelector(".modal-upload-section img");
        if (imgElement) {
            imgElement.remove();
        }

        // Réinitialise selectedFile à null
        selectedFile = null;

        // Fait réapparaître .upload-section
        document.querySelector(".upload-section").style.display = "flex";
    }
}

/* 
====================================================================================
==============Gestion de l'ouvrerture et fermeture de la modal======================
====================================================================================
*/

// Permet d'ouvrir la modal 
function openModal() {
    const modal = document.getElementById("modal1");
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusableElement = document.querySelector(":focus");

    modal.style.display = "block"; 

    requestAnimationFrame(() => { 
        modal.classList.remove("modal-close");
        modal.classList.add("modal-open");
    });

    modal.setAttribute("aria-hidden", false);
    modal.setAttribute("aria-modal", true);
    document.getElementById("modal-galery").style.display = "block";

    showImgModal();

    targetModal = modal;
    focusables[0].focus();

    // Ferme la modal lors d'un click extérieur à celle-ci
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

// Permet de fermer la modal 
function closeModal() {
    const modal = document.getElementById("modal1");

    modal.classList.remove("modal-open");
    modal.classList.add("modal-close");

    //setTimeout pour attendre la fin de la transition avant de cacher la modal
    setTimeout(() => {
        modal.style.display = "none"; // Masquez la modal après la transition
        document.getElementById("modal-add-picture").style.display = "none";
        document.getElementById("modal-galery").style.display = "none";
        modal.setAttribute("aria-hidden", true);
        modal.setAttribute("aria-modal", false);

        const divmodalgallery = document.getElementById("gallerymodal");
        divmodalgallery.innerHTML = "";
        showPictures("all");

        if (previouslyFocusableElement !== null) previouslyFocusableElement.focus();

        removeEventListeners();
        unloadPicture();
    }, 300); // Correspond à la durée de la transition définie dans le CSS
}


/* 
====================================================================================
==============Gestion de la modal pour supprimer des images=========================
====================================================================================
*/

// Permet de faire apparaitre les images dans la modal 
async function showImgModal() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (response.ok) {
            const data = await response.json();
            
            const galleryModal = document.querySelector("#gallerymodal");
            galleryModal.innerHTML = "";
            
            data.forEach(image => {
                const figureElement = document.createElement("figure");
                figureElement.classList.add("delete-button-container"); 
                
                const imageElement = document.createElement("img");
                imageElement.src = image.imageUrl;
                
                imageElement.setAttribute("data-id", image.id);
                
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("fa-solid", "fa-trash-can", "trash-modal-icon");
                
                deleteButton.addEventListener("click", async function(event) {
                    event.preventDefault();
                    const imageId = image.id;
                    deleteImage(imageId);
                });
                
                figureElement.appendChild(imageElement);
                figureElement.appendChild(deleteButton);
                
                galleryModal.appendChild(figureElement);
            });

        } else {
            console.error("Erreur lors de la récupération des images :", response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des images :", error);
    }
}

//Permet la suppression d'image
async function deleteImage(imageId) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            showImgModal();
        } else {
            console.error("Erreur lors de la suppression.");
        }
    } catch (error) {
        console.error("Une erreur s\'est produite lors de la suppression de l\'image :", error);
    }
} 

/* 
====================================================================================
================Gestion de la modal pour ajouter des images=========================
====================================================================================
*/

//Permet d'ouvrire la partie de la modal pour l'ajout d'image
async function modalAddPictureOpen() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const data = await categorie.json();

    document.getElementById("modal-galery").style.display = "none";
    document.getElementById("modal-add-picture").style.display = "block";

    const selectElement = document.getElementById("categorie");    
    selectElement.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "none";
    selectElement.appendChild(emptyOption);

    data.forEach(category => {
        const option = document.createElement("option");
        option.value = category.name; 
        option.textContent = category.name; 
        selectElement.appendChild(option);
    });

    const titleInput = document.getElementById("titre");
    const categorySelect = document.getElementById("categorie");
    titleInput.addEventListener("input", checkConditions);
    categorySelect.addEventListener("change", checkConditions);

    checkConditions();
}
 
// Permet d'ajouter l'image que l'on veut envoyer à l'API
async function addpicture() {
    document.querySelector(".upload-btn").addEventListener("click", uploadBtnClickHandler = async function(event) {
        event.preventDefault();

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/jpeg, image/png";

        fileInput.addEventListener("change", function(event) {
            event.preventDefault();
            selectedFile = event.target.files[0]; // Notez que nous utilisons ici la variable globale `selectedFile`

            if (selectedFile) {
                // Vérifie le type de fichier
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(selectedFile.type)) {
                    console.error("Le type de fichier n'est pas autorisé. Veuillez sélectionner un fichier JPEG ou PNG.");
                    return;
                }

                // Vérifie la taille du fichier
                if (selectedFile.size > 4 * 1024 * 1024) {
                    console.error("La taille du fichier dépasse 4 Mo.");
                    return;
                }

                document.querySelector(".upload-section").style.display = "none";

                const reader = new FileReader();
                reader.onload = function() {
                    const imgElement = document.createElement("img");
                    imgElement.src = reader.result;
                    document.querySelector(".modal-upload-section").appendChild(imgElement);
                    checkConditions();
                };
                reader.readAsDataURL(selectedFile);
            }
        });

        fileInput.click();
    });
}

//Permet d'envoie l'image a l'api avec sont titre et sa catégorie
function submitNewPicture() {
    const submitButton = document.querySelector(".form-add-picture input[type='submit']");
    submitButton.addEventListener("click", handleSubmitNewPicture = async function(event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        let categoryId = null;
        const categories = await fetch("http://localhost:5678/api/categories");
        const categoryData = await categories.json();
        const title = document.getElementById("titre").value;
        const categoryName = document.getElementById("categorie").value;

        if (categoryName.trim() === "") {
            console.error("Veuillez sélectionner une catégorie.");
            return;
        }

        categoryData.forEach(category => {
            if (category.name === categoryName) {
                categoryId = category.id;
            }
        });

        if (categoryId === null) {
            console.error("Catégorie non trouvée.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("image", selectedFile);

        await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById("titre").value = "";
                closeModal();
                showPictures("all");
            }
        })
        .catch(error => {
            console.error("Erreur lors de l\'upload de l\'image:", error.message); 
        })
    });
}

//Permet verifie si tout est ok pour l'envoie a l'api et change la couleur du btn 
function checkConditions() {
    const titleInput = document.getElementById("titre");
    const categorySelect = document.getElementById("categorie");
    const validateBtn = document.querySelector(".validate-btn input[type='submit']");

    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;

    if (selectedFile !== null && title !== "" && categoryId !== "none") {
        validateBtn.classList.add("validate-btn-active");
    } else {
        validateBtn.classList.remove("validate-btn-active");
    }
}

/* 
====================================================================================
=================================Gestion du focus===================================
====================================================================================
*/

//Permet de gerer le focus dans la modal 
const focusInModal = function (event) {
    event.preventDefault();
    let index = focusables.findIndex(f => f === targetModal.querySelector(":focus"));
    if (event.shiftKey === true) {
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
