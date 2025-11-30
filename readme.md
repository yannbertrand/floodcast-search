# floodcast-search

https://floodcast-search.netlify.app/

**Stability: 1 - Experimental**

Interface de recherche du contenu du FloodCast.

<img width="1232" height="729" alt="screenshot" src="https://github.com/user-attachments/assets/d61589ff-efea-43f2-9f0c-8e2d0fc50094" />

Ce site web permet aux utilisateurs d'effectuer des recherches dans l'ensemble du Podcast « FloodCast » à partir du contenu de chaque épisode.

L'extraction des sous-titres est faite grâce à [Whisper](https://openai.com/fr-FR/index/whisper/) et les resultats sont conservés dans le dossier `data`.

## Stack technique

- [Astro](https://astro.build/) - Framework web
- [Algolia](https://www.algolia.com/) - Recherche complexe
- [PicoCSS](https://picocss.com/) - Framework CSS minimaliste
- [Netlify](https://www.netlify.com/) - Hébergeur

## Installation en local

1. `npm ci`
2. `npm run dev`

Ouvrir http://localhost:4321/

## Configuration

La recherche Algolia est préconfigurée pour se connecter à :

- App ID: UA7S1T9E77
- Index: floodcast-search-distinct-by-episodes
- Search API Key: 263dbfb3c0765ad133b807b9701a9df8 (public, read-only)

## Transcription

La génération des sous-titres a été produite en local durant 3 jours avec un ordinateur Windows 11.
