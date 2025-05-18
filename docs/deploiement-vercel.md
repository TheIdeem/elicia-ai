# Déploiement de l'application sur Vercel

## 1. Pré-requis
- Compte Vercel (https://vercel.com/)
- Accès au repo Git (GitHub, GitLab, Bitbucket ou repo privé)
- Accès aux clés/API nécessaires :
  - Supabase (URL + service role key)
  - Retell (API key, agent ID, numéro d'appel)
  - Firecrawl (API key)
- Variables d'environnement listées dans `.env` (voir section dédiée)

## 2. Préparation du projet
- Nettoyer le code : supprimer les fichiers de test/démo non nécessaires
- Vérifier que toutes les dépendances sont à jour (`npm install`)
- Vérifier que le build fonctionne en local (`npm run build`)
- S'assurer que le code ne contient pas de secrets ou credentials en dur
- Vérifier la configuration de `next.config.ts` (rien de spécifique à l'environnement local)

## 3. Variables d'environnement à configurer sur Vercel
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : clé service role Supabase (attention à la sécurité)
- `RETELL_API_KEY` : clé API Retell
- `RETELL_AGENT_ID` : ID de l'agent Retell
- `RETELL_FROM_NUMBER` : numéro d'appel Retell
- `FIRECRAWL_API_KEY` : clé API Firecrawl
- (optionnel) `SKIP_WEBHOOK_VERIFICATION` : true/false pour dev

Configurer ces variables dans l'interface Vercel (Project Settings > Environment Variables).

## 4. Procédure de déploiement
1. Pousser le code sur le repo Git (branche principale ou dédiée prod)
2. Sur Vercel, importer le repo ("Add New Project")
3. Renseigner les variables d'environnement
4. Lancer le déploiement (Vercel build automatiquement le projet Next.js)
5. Attendre la fin du build et tester l'URL fournie par Vercel

## 5. Vérifications post-déploiement
- Accès à l'app (URL Vercel)
- Accès à Supabase (lecture/écriture)
- Création d'appel Retell (test d'un call)
- Import Firecrawl (test d'un import de propriété)
- Webhooks Retell fonctionnels (si utilisés)
- Logs d'erreur (Vercel > Monitoring)

## 6. Conseils et points d'attention
- Ne jamais exposer la clé service role Supabase côté client (utiliser uniquement côté server)
- Vérifier les CORS si besoin
- Activer le monitoring/alerting sur Vercel
- Passer les variables d'environnement en mode "Production" sur Vercel
- Désactiver les features de démo/test en prod
- Vérifier la gestion des erreurs (API, UI)
- Sécuriser les endpoints sensibles

## 7. Checklist finale
- [ ] Build Next.js OK en local et sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Accès Supabase OK
- [ ] Accès Retell OK
- [ ] Accès Firecrawl OK
- [ ] Webhooks fonctionnels
- [ ] Monitoring/logs activés
- [ ] Tests manuels des features clés (calls, import, dashboard...)
- [ ] Pas de credentials exposés
- [ ] Documentation à jour

---

**En cas de problème, consulter les logs Vercel et vérifier la configuration des variables d'environnement.**
