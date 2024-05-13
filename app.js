function checkEditMode() {
    const token = localStorage.getItem('token');
    if (token) {
        openModal(); 
        // Ajoute un écouteur d'événements pour la touche "Escape" pour fermer la modal
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape" || event.key === "Esc") {
                closeModal();
            }
             //Pour le focus dans la modal avec tab
            if (event.key === "Tab" && targetModal !== null) {
                focusInModal(event)
            }
        });

        // Ajoute un écouteur d'événements au clic sur l'icône de corbeille une seule fois
        document.addEventListener('click', async function(event) {
            event.preventDefault();
            if (event.target.classList.contains('submit-add-button')) {
                modalAddPictureOpen();
            }
            if (event.target.classList.contains('back-icon')) {
                document.getElementById("modal-add-picture").style.display = "none";
                document.getElementById("modal-galery").style.display = "block";
                showImgModal();
            }
            if (event.target.classList.contains('close-icon')) {
                closeModal();
            }
        });
    }
}

let targetModal = null
const focusableSelector = 'button, a , input, textarea'
let focusables = []
let previouslyFocusableElement = null


// Fonction pour ouvrir la modal
function openModal() {
    const modal = document.getElementById('modal1');
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusableElement = document.querySelector(':focus');
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', false);
    modal.setAttribute('aria-modal', true);
    
    showImgModal();
  
    targetModal = modal;
    focusables[0].focus();
     console.log("Boutons de la galerie d'images ajoutés à focusables :", focusables);


     //Ferme la modal lors d'un click exterieur à celle-ci
     window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
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
    showPictures("all");

    if (previouslyFocusableElement !== null) previouslyFocusableElement.focus()
}

//
async function showImgModal() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
            if (response.ok) {
            const data = await response.json();
            
            const galleryModal = document.querySelector("#gallerymodal");
            galleryModal.innerHTML = "";
            
            // Parcours les données et affiche chaque image dans la galerie modale
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


async function deleteImage(imageId) {
    const token = localStorage.getItem('token');
    // Effectuer une requête pour supprimer l'image avec l'ID donné
    try {
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            showImgModal();
        } else {
            console.error('Erreur lors de la suppression.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression de l\'image :', error);
    }
} 


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
        option.value = category.name; 
        option.textContent = category.name; 
        selectElement.appendChild(option);
    });

    addpicture()
}



let selectedFile = null;
//Fonction pour ajouter une photo
function addpicture() {
     // Écoute de l'événement clic sur le bouton "Ajouter photo"
     document.querySelector('.upload-btn').addEventListener('click', function(event) {
         event.preventDefault();
         const fileInput = document.createElement('input');
 
         // Limite la taille du fichier à 4 Mo et restreint les types de fichiers à jpg et png
         fileInput.type = 'file';
         fileInput.accept = 'image/jpeg, image/png';
         fileInput.maxlength = 4 * 1024 * 1024;
 
         fileInput.addEventListener('change', function(event) {
             event.preventDefault();
             selectedFile = event.target.files[0];
             if (selectedFile) {
                 // Vérifie si la taille du fichier est inférieure ou égale à 4 Mo
                 if (selectedFile.size <= 4 * 1024 * 1024) {
                     document.querySelector('.upload-section').style.display = "none";
 
                     // Affiche l'image à l'intérieur de la section
                     const reader = new FileReader();
                     reader.onload = function() {
                         const imgElement = document.createElement('img');
                         imgElement.src = reader.result;
                         document.querySelector('.modal-upload-section').appendChild(imgElement);
                     };
                     reader.readAsDataURL(selectedFile);
                 } else {
                     console.error('La taille du fichier dépasse 4 Mo.');
                 }
             }
         });
 
         // Clique automatiquement sur l'élément input de type file pour ouvrir la boîte de dialogue de sélection de fichier
         fileInput.click();

     });
 
     document.querySelector('.form-add-picture').addEventListener('submit', async function(event) {
         event.preventDefault();
 
         // Récupère les valeurs du formulaire
         const title = document.getElementById('titre').value;
         const categoryName = document.getElementById('categorie').value;
         
         // Vérifie si la catégorie sélectionnée est vide
         if (categoryName.trim() === '') {
             console.error('Veuillez sélectionner une catégorie.');
             return;
         }
 
         // Récupérer l'ID de la catégorie correspondante
         let categoryId = null;
         const categories = await fetch("http://localhost:5678/api/categories");
         const categoryData = await categories.json();
         categoryData.forEach(category => {
             if (category.name === categoryName) {
                 categoryId = category.id;
             }
         });
     
         // Vérifie si l'ID de la catégorie a été trouvé
         if (categoryId === null) {
             console.error('Catégorie non trouvée.');
             return;
         }
     
         // Création d'un objet pour stocker les données à envoyer
         const formData = new FormData();
         formData.append('title', title);
         formData.append('category', categoryId);
         formData.append('image', selectedFile );
         const token = localStorage.getItem('token');

         // Envoi des données à votre API
         fetch('http://localhost:5678/api/works', {
             method: 'POST',
             body: formData,
             headers: {
                 'Authorization': `Bearer ${token}`
             }
         })
         .then(response => {
             if (response.ok) {
                 console.log('Données envoyées avec succès !');
                 showPictures("all");
                } else {
                 console.error('Erreur lors de l\'envoi des données à l\'API.');
             }
         })
         .catch(error => {
             console.error('Erreur lors de l\'envoi des données :', error);
         });
     });
 
}

//Permet de garder le focus dans la modal 
focusInModal = function (event) {
    event.preventDefault();
    let index = focusables.findIndex(f => f === targetModal.querySelector(':focus'));
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

