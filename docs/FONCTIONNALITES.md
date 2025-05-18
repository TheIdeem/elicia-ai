# Fonctionnalités Elicia AI — Suivi & Statut

| Fonctionnalité                                      | Module         | Statut         | Remarques / Problème |
|-----------------------------------------------------|----------------|----------------|---------------------|
| Gestion des leads (CRUD, qualification, import CSV) | Leads          | En production  |                     |
| Gestion des appels (historique, statut, enregistrement) | Calls      | En production  |                     |
| Intégration Retell AI (création d'appel, injection contexte) | Calls/IA | En production  |                     |
| Gestion des biens immobiliers (listing, ajout, édition, import scraping) | Properties | En production  |                     |
| Galerie d'images moderne pour les biens             | Properties     | En production  |                     |
| Gestion des meetings/rendez-vous                    | Meetings       | En production  |                     |
| Dashboard analytique (KPIs, stats)                  | Dashboard      | En production  |                     |
| Recherche avancée et filtres                        | Tous           | En production  |                     |
| Import CSV (leads, calls, meetings)                 | Tous           | En production  |                     |
| Injection du contexte properties dans Retell        | Calls/Properties| En production |                     |
| Recherche dynamique de propriétés pendant l'appel   | Calls/IA       | En cours       | API Retell OK, UI/UX à finaliser |
| Extraction/mapping robuste à l'import (Firecrawl)   | Properties     | En cours       | Nettoyage, typage, edge cases |
| RBAC (gestion fine des droits utilisateurs)         | Auth           | En cours       | Pas encore activé en prod |
| Notifications (email, SMS, push)                    | Tous           | À venir        | Non implémenté      |
| Export de données (CSV, PDF)                        | Tous           | À venir        | Non implémenté      |
| Intégration CRM externe                             | Intégrations   | À venir        | Non implémenté      |
| Multi-agence                                       | Auth           | À venir        | Non implémenté      |
| Automatisation avancée (workflows, triggers)        | IA/Backend     | À venir        | Non implémenté      |
| IA multilingue                                      | IA             | À venir        | Non implémenté      |
| Timeline/historique complet                        | Tous           | À venir        | Non implémenté      |
| Audit & logs avancés                               | Backend        | À venir        | Non implémenté      |
| Problème extraction parking (Firecrawl)             | Properties     | Bloqué         | Parking parfois absent des features, regex amélioré mais edge cases possibles |
| Problème nettoyage adresse (Firecrawl)              | Properties     | Résolu         | Entités HTML nettoyées | 