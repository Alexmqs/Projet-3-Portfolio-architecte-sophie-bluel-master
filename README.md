# Portfolio-architecte-sophie-bluel

Code du projet 6 d'intégrateur web.

## Information pour le lancer le code

 - Lancer le backend depuis votre terminal en suivant les instruction du fichier ReadMe.
 - Si vous désirez afficher le code du backend et du frontend, faites le dans 2 instances de VSCode différentes pour éviter tout problème


## Voici les informations concernant les différentes fonctions
login.js :

showLoginPage()         : Affiche la page de connexion et masque les autres sections.
editionMode()           : Affiche les sections principales et active le mode édition.
removeEditionMode()     : Désactive le mode édition et réinitialise l'affichage.

gallery.js :

showCat()               : Affiche les catégories avec des filtres.
showPictures()          : Affiche les images et leurs descriptions sur le site.

modal.js :

checkEditMode()         : Vérifie si l'utilisateur est en mode édition.
handleDocumentClick()   : Gère les clics sur le document pour la modal.
removeEventListeners()  : Supprime les écouteurs d'événements pour éviter la multiplication.
unloadPicture()         : Réinitialise l'image sélectionnée dans la modal.
openModal()             : Ouvre la modal et gère le focus et les événements de clic.
closeModal()            : Ferme la modal et réinitialise l'affichage.
showImgModal()          : Affiche les images dans la modal pour la gestion.
deleteImage()           : Supprime une image sélectionnée de l'API.
modalAddPictureOpen()   : Ouvre la modal pour ajouter une nouvelle image.
addPicture()            : Gère le téléchargement d'une nouvelle image dans la modal.
submitNewPicture()      : Soumet une nouvelle image à l'API.
checkConditions()       : Vérifie les conditions pour activer le bouton de validation.
focusInModal()          : Gère le focus des éléments interactifs dans la modal.