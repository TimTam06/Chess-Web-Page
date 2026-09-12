# ♟️ Moteur d'échecs avec interface web

Projet de jeu d'échecs développé en **JavaScript, HTML et CSS**, intégrant un moteur de jeu orienté objet et une interface web interactive.

L'objectif du projet est d'implémenter les règles des échecs ainsi que la logique nécessaire à la validation des coups, tout en maintenant une séparation claire entre le **moteur de jeu** et l'**interface utilisateur**.

## Fonctionnalités

### Moteur d'échecs

* Déplacement des six types de pièces
* Validation des coups légaux
* Détection des échecs
* Détection des échecs et mat
* Détection du pat
* Gestion des tours des joueurs
* Roque
* Prise en passant
* Promotion des pions
* Détection du matériel insuffisant
* Règle des 50 coups
* Détection de la répétition de position
* Historique des coups
* Notation algébrique des coups (SAN)

### Interface utilisateur

* Échiquier interactif
* Sélection des pièces à la souris
* Mise en évidence de la pièce sélectionnée
* Affichage des déplacements légaux
* Indication différente pour les captures possibles
* Affichage du joueur dont c'est le tour
* Historique des coups avec notation d'échecs
* Défilement automatique de l'historique vers le dernier coup
* Interface adaptative selon la taille de la fenêtre
* Bouton permettant de commencer une nouvelle partie

## Architecture

Le projet utilise une architecture orientée objet afin de séparer la logique du jeu de son affichage.

### `ChessGame`

Contrôle le déroulement général de la partie :

* gestion des tours;
* validation des coups;
* détection des échecs et des fins de partie;
* gestion de l'historique;
* application des règles spéciales.

### `Board`

Représente l'échiquier et gère la position des pièces sur les 64 cases.

### `Piece`

Classe de base des différentes pièces. Chaque type de pièce possède sa propre logique de déplacement.

### `Move`

Représente un coup effectué et conserve les informations nécessaires à l'historique et à sa notation.

## Validation des coups

Le moteur distingue les déplacements possibles des déplacements réellement légaux.

Lorsqu'un coup est évalué, une copie de la position est créée et le déplacement y est simulé. Le moteur vérifie ensuite si le roi du joueur serait en échec dans cette nouvelle position.

Un coup qui laisse son propre roi en échec est donc rejeté.

Cette approche permet notamment de gérer correctement les pièces clouées et les situations où un déplacement exposerait le roi.

## Notation des coups

L'historique utilise la notation algébrique des échecs.

Exemples :

```text
e4
Nf3
Nxe5
exd6
O-O
O-O-O
e8=Q
Qh5+
Qh7#
```

La génération de la notation prend notamment en compte :

* les captures;
* les promotions;
* le roque;
* la prise en passant;
* les échecs;
* les échecs et mat;
* la désambiguïsation lorsque plusieurs pièces identiques peuvent atteindre la même case.

## Technologies

* **JavaScript**
* **HTML5**
* **CSS3**
* Programmation orientée objet
* Manipulation du DOM

Aucune bibliothèque ou framework externe n'est nécessaire au fonctionnement du jeu.

## Structure du projet

```text
/
├── index.html
├── styles.css
├── js/
├── images/
└── sounds/
```

## Lancement

1. Cloner le dépôt.
2. Ouvrir le projet dans un éditeur tel que Visual Studio Code.
3. Démarrer un serveur web local, par exemple avec **Live Server**.
4. Ouvrir `index.html` dans le navigateur.

L'utilisation d'un serveur local est recommandée puisque le projet utilise les modules JavaScript.

## Objectifs du projet

Ce projet permet principalement de mettre en pratique :

* la programmation orientée objet;
* la conception d'un moteur basé sur des règles;
* la séparation entre logique métier et interface utilisateur;
* la manipulation du DOM;
* la gestion d'état;
* la validation de règles complexes;
* le développement d'une interface interactive sans framework.

## Améliorations futures

Quelques fonctionnalités pourraient être ajoutées par la suite :

* chronomètre fonctionnel pour chaque joueur;
* effets sonores pour les déplacements, captures et échecs;
* choix de la pièce lors d'une promotion;
* possibilité de revenir à une position précédente;
* sauvegarde et chargement de parties;
* exportation de parties au format PGN;
* adversaire contrôlé par ordinateur;
* modes de temps configurables.

## Auteur

**Timothé Quintal**

Projet personnel de développement d'un moteur d'échecs et de son interface web.
