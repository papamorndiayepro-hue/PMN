# Portfolio – Papa Mor Ndiaye

Site portfolio bilingue (FR/EN), statique, sans dépendance externe.

```
index.html   page principale (CSP stricte, aucun script/style inline)
style.css    styles
content.js   contenu éditable (textes FR/EN, téléphone, e-mail, liens)
config.js    configuration Supabase (clés publiques uniquement)
app.js       logique : langues, base de données, admin
assets/      papa-mor.jpg (photo, EXIF supprimé) + tes futures images de projets
supabase/setup.sql   création de la base + règles de sécurité
```

## 1. Mettre en ligne (GitHub Pages)
1. Crée un dépôt GitHub, puis **Add file → Upload files** : envoie le *contenu* du dossier (index.html à la racine).
2. **Settings → Pages → Deploy from a branch → main / (root) → Save**.
3. Coche **Enforce HTTPS** dans Pages.

## 2. Activer la base de données (Supabase, gratuit)
1. Crée un projet sur supabase.com.
2. **SQL Editor** → colle `supabase/setup.sql` → **Run**.
3. **Authentication → Users → Add user** : ton e-mail (papamor.ndiaye.pro@gmail.com) + un mot de passe fort (cocher *Auto confirm*).
4. **Authentication → Sign In / Providers** : **désactive « Allow new users to sign up »** (sinon n'importe qui pourrait créer un compte).
5. **Project Settings → API** : copie l'URL du projet et la clé **anon / publishable** dans `config.js`.
   ⚠️ Ne copie JAMAIS la clé `service_role`.
6. Va sur `ton-site/#admin`, connecte-toi avec ton e-mail + mot de passe, modifie, clique **Publish**.

Tant que `config.js` est vide, l'admin fonctionne en mode aperçu (mot de passe `changeme`, enregistrement local au navigateur uniquement).

## Utiliser l'admin (ultra simple)
1. Ouvre l'admin (voir plus bas) et connecte-toi.
2. Tu vois le vrai site avec une barre d'outils en bas. **Clique directement sur n'importe quel texte pour le modifier** (titres, paragraphes, services, FAQ…). Utilise le bouton FR/EN pour modifier chaque langue.
3. **＋ Projet** : colle l'adresse du site d'un projet → carte avec capture d'écran et lien créée automatiquement (les 3 exemples disparaissent). Clique sur son titre/description pour les écrire ; ↑ pour monter, 🔗 pour changer l'adresse, ✕ pour supprimer.
4. **⚙ Réglages** : téléphone (et WhatsApp), e-mail, Snapchat, GitHub, LinkedIn, photo, et **changement du mot de passe** (12 caractères minimum).
5. **⬆ Publier** : rend tes modifications (images comprises) **permanentes et visibles par tous**, via Supabase (si configuré) ou via GitHub (voir ci-dessous).
Les captures sont générées par le service gratuit WordPress mShots (l'adresse du projet lui est transmise) ; si une capture échoue, la carte garde un fond dégradé.

## Publier de façon permanente SANS Supabase (le plus simple)
Le bouton **⬆ Publier** enregistre tes modifications dans le fichier `data.json` de ton dépôt GitHub ; le site le lit au chargement, donc tout le monde voit tes textes, projets et images, pour toujours.
**Créer le jeton (une seule fois, 2 minutes) :**
1. GitHub → ta photo → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. *Repository access* : **Only select repositories** → choisis ton dépôt du portfolio.
3. *Permissions → Repository permissions → Contents* : **Read and write**. Valide avec **Generate token** et copie-le.
4. Sur ton site, admin → barre d'outils → **⬆ Publier** → entre `ton-pseudo/nom-du-dépôt` et colle le jeton → **Publier**. Les modifications apparaissent pour tout le monde en ~1 minute (GitHub Pages se met à jour).
Garde le jeton secret : il n'est mémorisé sur l'appareil que si tu coches « Se souvenir ». Le jeton ne donne accès qu'à ce dépôt, et c'est lui qui protège la publication.
**Sans jeton** : dans la même fenêtre, **Télécharger data.json**, puis envoie ce fichier dans ton dépôt (Add file → Upload files, il remplace l'ancien).
Ne fonctionne pas dans l'aperçu de Claude (réseau bloqué) : uniquement sur ton vrai site GitHub.

## Images (projets et photo)
En mode édition : bouton **🖼 Image** sur chaque projet, **🖼 Changer la photo** sur ta photo (ou dans ⚙ Réglages). Choisis une image sur ton appareil : elle est réduite et compressée automatiquement. C'est la méthode la plus fiable ; la capture automatique d'un site dépend d'un service externe et peut ne pas s'afficher.
**Si tu as déjà créé la base Supabase**, exécute une fois cette commande dans SQL Editor pour autoriser les images :
`alter table public.site_content drop constraint if exists site_content_data_check; alter table public.site_content add constraint site_content_data_check check (pg_column_size(data) < 4000000);`

## Accès à l'admin
Ajoute `#admin` à l'URL, ou `Ctrl + Maj + A`, ou 5 clics rapides sur « © Papa Mor Ndiaye » en bas de page.

## Sécurité mise en place
- Écriture en base réservée à ton compte (règles RLS Supabase) ; lecture publique seulement.
- Connexion par e-mail + mot de passe Supabase (le mot de passe n'est stocké nulle part dans le code) ; jeton gardé en mémoire uniquement ; blocage 1 min après 5 échecs.
- CSP stricte (`script-src 'self'`) : aucun script externe, aucun script inline.
- Données lues en base filtrées (clés autorisées uniquement), échappées avant affichage, liens limités à http(s)/mailto/tel.
- Liens externes avec `rel="noopener noreferrer"`, `referrer: no-referrer`.

## Limites à connaître
- GitHub Pages ne permet pas d'ajouter des en-têtes HTTP (HSTS, anti-iframe). Pour cela, place le site derrière Cloudflare (gratuit).
- Active la double authentification sur ton compte GitHub et ton compte Supabase.
- Si tu utilises un domaine Supabase personnalisé, ajoute-le dans `connect-src` de la balise CSP de `index.html`.
