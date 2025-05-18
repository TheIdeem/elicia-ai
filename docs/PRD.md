# Product Requirements Document (PRD) — Elicia AI

## 1. Objectif du produit
Elicia AI est un assistant d'appels intelligent pour agences immobilières, permettant de gérer, qualifier et suivre les leads, appels, biens et rendez-vous, avec intégration d'IA (Retell) et de scraping (Firecrawl) pour enrichir les données et automatiser la prospection.

## 2. Utilisateurs cibles
- Agents immobiliers
- Managers d'agence
- Leads/prospects (via interaction téléphonique)
- Administrateurs techniques

## 3. Fonctionnalités principales (en production)
- Gestion des leads (création, édition, suppression, qualification)
- Gestion des appels (historique, détails, statut, enregistrement)
- Intégration Retell AI pour appels automatisés
- Gestion des biens immobiliers (listing, ajout, édition, import via scraping DrivenProperties)
- Gestion des rendez-vous/meetings
- Dashboard analytique (KPIs, stats)
- Import CSV pour leads, appels, meetings
- Recherche et filtrage avancés sur tous les modules
- Injection du contexte properties dans les appels Retell

## 4. Fonctionnalités en cours d'implémentation
- Recherche dynamique de propriétés pendant l'appel (API Retell)
- Amélioration du mapping et extraction des données lors de l'import (robustesse, nettoyage, typage)
- UI/UX avancée pour la galerie d'images et la visualisation des biens
- Gestion fine des droits utilisateurs (RBAC)

## 5. Fonctionnalités prévues/non implémentées
- Notifications (email, SMS, push)
- Export de données (CSV, PDF)
- Intégration CRM externe (Hubspot, Salesforce...)
- Gestion multi-agence
- Automatisation avancée (workflows, triggers)
- IA conversationnelle multilingue
- Historique complet des interactions (timeline)
- Audit & logs avancés

## 6. Contraintes techniques
- Next.js 15, React 19, Supabase, Retell SDK, Firecrawl
- Hébergement Vercel (serverless)
- Sécurité des API keys (jamais côté client)
- RGPD : gestion des données personnelles
- Scalabilité (support de plusieurs milliers de leads/biens)

## 7. KPIs / Indicateurs de succès
- Taux de qualification des leads
- Nombre d'appels automatisés réussis
- Temps moyen de traitement d'un lead
- Nombre de propriétés importées automatiquement
- Satisfaction utilisateur (NPS)

## 8. Roadmap synthétique
- T1 : Stabilisation, robustesse extraction, UI/UX
- T2 : Recherche dynamique, notifications, export
- T3 : Intégration CRM, multi-agence, IA avancée

## 9. Liens utiles
- [Déploiement Vercel](./deploiement-vercel.md)
- [API & intégrations](./API.md)
- [Changelog & releases](./CHANGELOG.md) 