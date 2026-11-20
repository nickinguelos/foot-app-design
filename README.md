# foot-app-design

Maquettes HTML/CSS/JS du jeu de football. Notion garde la documentation et les décisions ; ce dépôt garde les designs.

## Structure

- `index.html` : index de tous les designs (lit `designs.json`).
- `designs.json` : liste des designs (titre, chemin, statut, date, auteur, résumé, couleurs).
- `designs/<id>/` : un dossier par proposition de design, ouvrable seul (`index.html`).
- `shared/` : socle commun des propositions v2 et suivantes (`base.css`, `scenes.js`).
- `archive/` : anciennes maquettes conservées (ex. test Hello World).

## Ajouter un design

1. Créer `designs/<id>/` (convention : `vN-nom-court`).
2. Ajouter une entrée dans `designs.json`.
3. Ne jamais supprimer un design : changer son statut (Proposition, Retenu, Écarté) dans `designs.json`.

Aucune couleur ni direction n'est validée tant que l'utilisateur ne l'a pas arbitré dans Notion (AICOL-4).
