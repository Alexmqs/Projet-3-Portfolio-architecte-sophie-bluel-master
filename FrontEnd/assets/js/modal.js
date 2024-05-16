let targetModal = null;
const focusableSelector = 'button, a , input, textarea';
let focusables = [];
let previouslyFocusableElement = null;
let uploadBtnClickHandler;
let handleSubmitNewPicture;
let selectedFile = null;


function checkEditMode() {
    const token = localStorage.getItem('token');
    if (token) {
        openModal(); 
        // Ajoute un écouteur d'événements pour la touche "Escape" pour fermer la modal
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape" || event.key === "Esc") {
                closeModal();
            }
            // Pour le focus dans la modal avec tab
            if (event.key === "Tab" && targetModal !== null) {
                focusInModal(event)
            }
        });

        // Ajoute un écouteur d'événements pour que les cliques ce produise bien qu'une seule fois 
        document.addEventListener('click', handleDocumentClick);
    }
}

function handleDocumentClick(event) {
    event.preventDefault();
    if (event.target.classList.contains('submit-add-button')) {
        modalAddPictureOpen();
        addpicture();
        submitNewPicture();
        checkConditions();
    }
    if (event.target.classList.contains('back-icon')) {
        document.getElementById("modal-add-picture").style.display = "none";
        document.getElementById("modal-galery").style.display = "block";
        showImgModal();
        //pour ne pas avoir d'evenement en double ou triple 
        removeEventListeners();
        document.addEventListener('click', handleDocumentClick);
        unloadPicture();
    }
    if (event.target.classList.contains('close-icon')) {
        closeModal();
    }
}

//Permet de supprimer les ecouteur d'evenement pour ne pas qu'il se multiplie 
function removeEventListeners() {
    document.removeEventListener('click', handleDocumentClick);
    document.querySelector('.upload-btn').removeEventListener('click', uploadBtnClickHandler);
    const submitButton = document.querySelector('.form-add-picture input[type="submit"]');
    if (submitButton) {
        submitButton.removeEventListener('click', handleSubmitNewPicture);
    }
}

function unloadPicture() {
    if (selectedFile !== null) {
        // Supprime l'image qui a été affichée dans .modal-upload-section
        const imgElement = document.querySelector('.modal-upload-section img');
        if (imgElement) {
            imgElement.remove();
        }

        // Réinitialise selectedFile à null
        selectedFile = null;

        // Fait réapparaître .upload-section
        document.querySelector('.upload-section').style.display = "flex";
    }
}

/* 
====================================================================================
==============Gestion de l'ouvrerture et fermeture de la modal======================
====================================================================================
*/

function openModal() {
    const modal = document.getElementById('modal1');
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusableElement = document.querySelector(':focus');

    modal.style.display = "block"; // Assurez-vous que la modal est visible pour la transition

    requestAnimationFrame(() => { 
        modal.classList.remove('modal-close');
        modal.classList.add('modal-open');
    });

    modal.setAttribute('aria-hidden', false);
    modal.setAttribute('aria-modal', true);
    document.getElementById("modal-galery").style.display = "block";

    showImgModal();

    targetModal = modal;
    focusables[0].focus();
    console.log("Boutons de la galerie d'images ajoutés à focusables :", focusables);

    // Ferme la modal lors d'un click extérieur à celle-ci
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('modal1');

    modal.classList.remove('modal-open');
    modal.classList.add('modal-close');

    // Utilisez setTimeout pour attendre la fin de la transition avant de cacher la modal
    setTimeout(() => {
        modal.style.display = "none"; // Masquez la modal après la transition
        document.getElementById("modal-add-picture").style.display = "none";
        document.getElementById("modal-galery").style.display = "none";
        modal.setAttribute('aria-hidden', true);
        modal.setAttribute('aria-modal', false);

        const divmodalgallery = document.getElementById("gallerymodal");
        divmodalgallery.innerHTML = "";
        showPictures("all");

        if (previouslyFocusableElement !== null) previouslyFocusableElement.focus();

        removeEventListeners();
        unloadPicture();
    }, 300); // Correspond à la durée de la transition définie dans le CSS (0.3s)
}


/* 
====================================================================================
==============Gestion de la modal pour supprimer des images=========================
====================================================================================
*/

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

async function deleteImage(imageId) {
    const token = localStorage.getItem('token');
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

/* 
====================================================================================
================Gestion de la modal pour ajouter des images=========================
====================================================================================
*/

async function modalAddPictureOpen() {
    const categorie = await fetch("http://localhost:5678/api/categories");
    const data = await categorie.json();

    document.getElementById("modal-galery").style.display = "none";
    document.getElementById("modal-add-picture").style.display = "block";

    const selectElement = document.getElementById("categorie");    
    selectElement.innerHTML = '';

    const emptyOption = document.createElement('option');
    emptyOption.value = "none";
    selectElement.appendChild(emptyOption);

    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name; 
        option.textContent = category.name; 
        selectElement.appendChild(option);
    });

    const titleInput = document.getElementById('titre');
    const categorySelect = document.getElementById('categorie');
    titleInput.addEventListener('input', checkConditions);
    categorySelect.addEventListener('change', checkConditions);

    checkConditions();
}

async function addpicture() {
    document.querySelector('.upload-btn').addEventListener('click', uploadBtnClickHandler = async function(event) {
        event.preventDefault();

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png';
        fileInput.maxlength = 4 * 1024 * 1024;

        fileInput.addEventListener('change', function(event) {
            event.preventDefault();
            selectedFile = event.target.files[0];
            if (selectedFile) {
                if (selectedFile.size <= 4 * 1024 * 1024) {
                    document.querySelector('.upload-section').style.display = "none";

                    const reader = new FileReader();
                    reader.onload = function() {
                        const imgElement = document.createElement('img');
                        imgElement.src = reader.result;
                        document.querySelector('.modal-upload-section').appendChild(imgElement);
                        checkConditions();
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    console.error('La taille du fichier dépasse 4 Mo.');
                }
            }
        });

        fileInput.click();
    });
}

function submitNewPicture() {
    const submitButton = document.querySelector('.form-add-picture input[type="submit"]');
    submitButton.addEventListener('click', handleSubmitNewPicture = async function(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');
        let categoryId = null;
        const categories = await fetch("http://localhost:5678/api/categories");
        const categoryData = await categories.json();
        const title = document.getElementById('titre').value;
        const categoryName = document.getElementById('categorie').value;

        if (categoryName.trim() === '') {
            console.error('Veuillez sélectionner une catégorie.');
            return;
        }

        categoryData.forEach(category => {
            if (category.name === categoryName) {
                categoryId = category.id;
            }
        });

        if (categoryId === null) {
            console.error('Catégorie non trouvée.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', categoryId);
        formData.append('image', selectedFile);

        await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                showPictures("all");
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'upload de l\'image:', error.message); 
        })
    });
}



function checkConditions() {
    const titleInput = document.getElementById('titre');
    const categorySelect = document.getElementById('categorie');
    const validateBtn = document.querySelector('.validate-btn input[type="submit"]');

    const title = titleInput.value.trim();
    const categoryId = categorySelect.value;

    if (selectedFile !== null && title !== '' && categoryId !== 'none') {
        validateBtn.classList.add('validate-btn-active');
    } else {
        validateBtn.classList.remove('validate-btn-active');
    }
}
/* 
====================================================================================
=================================Gestion du focus===================================
====================================================================================
*/

const focusInModal = function (event) {
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
