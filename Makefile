# Makefile pour StructureClerk
# Simplifie les commandes Docker et de développement

.PHONY: help build run stop clean dev install test logs shell

# Variables
IMAGE_NAME = structureclerk
CONTAINER_NAME = structureclerk-app
PORT = 3000

# Couleurs pour les messages
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

## help: Affiche cette aide
help:
	@echo "$(GREEN)StructureClerk - Commandes Disponibles:$(NC)"
	@echo ""
	@echo "$(YELLOW)Développement:$(NC)"
	@echo "  make dev         - Lancer le serveur de développement"
	@echo "  make install     - Installer les dépendances"
	@echo "  make test        - Lancer les tests"
	@echo "  make build-next  - Builder Next.js (sans Docker)"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@echo "  make build       - Builder l'image Docker"
	@echo "  make run         - Lancer le conteneur"
	@echo "  make stop        - Arrêter le conteneur"
	@echo "  make restart     - Redémarrer le conteneur"
	@echo "  make logs        - Voir les logs"
	@echo "  make shell       - Ouvrir un shell dans le conteneur"
	@echo "  make clean       - Nettoyer les images et conteneurs"
	@echo ""
	@echo "$(YELLOW)Docker Compose:$(NC)"
	@echo "  make up          - Lancer avec docker-compose"
	@echo "  make down        - Arrêter docker-compose"
	@echo "  make ps          - Voir le statut des services"
	@echo ""
	@echo "$(YELLOW)Utilitaires:$(NC)"
	@echo "  make health      - Vérifier la santé de l'app"
	@echo "  make stats       - Statistiques du conteneur"

## dev: Lancer le serveur de développement
dev:
	@echo "$(GREEN)Lancement du serveur de développement...$(NC)"
	npm run dev

## install: Installer les dépendances
install:
	@echo "$(GREEN)Installation des dépendances...$(NC)"
	npm install

## test: Lancer les tests
test:
	@echo "$(GREEN)Lancement des tests...$(NC)"
	npm run test

## build-next: Builder Next.js
build-next:
	@echo "$(GREEN)Build de Next.js...$(NC)"
	npm run build

## build: Builder l'image Docker (avec --build-arg)
build:
	@echo "$(GREEN)Build de l'image Docker $(IMAGE_NAME)...$(NC)"
	@echo "$(YELLOW)⚠️  Assurez-vous que les variables NEXT_PUBLIC_* sont exportées$(NC)"
	@if [ -z "$$NEXT_PUBLIC_SUPABASE_URL" ]; then \
		echo "$(RED)✗ NEXT_PUBLIC_SUPABASE_URL non définie!$(NC)"; \
		echo "$(YELLOW)💡 Exportez vos variables ou utilisez: ./docker-build.sh$(NC)"; \
		exit 1; \
	fi
	docker build \
		--build-arg NEXT_PUBLIC_SUPABASE_URL="$$NEXT_PUBLIC_SUPABASE_URL" \
		--build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
		--build-arg NEXT_PUBLIC_APP_URL="$$NEXT_PUBLIC_APP_URL" \
		--build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" \
		-t $(IMAGE_NAME):latest \
		.
	@echo "$(GREEN)✓ Image buildée avec succès!$(NC)"

## run: Lancer le conteneur Docker
run:
	@echo "$(GREEN)Lancement du conteneur $(CONTAINER_NAME)...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):3000 \
		--env-file .env.production \
		$(IMAGE_NAME):latest
	@echo "$(GREEN)✓ Conteneur démarré sur http://localhost:$(PORT)$(NC)"

## stop: Arrêter le conteneur
stop:
	@echo "$(YELLOW)Arrêt du conteneur $(CONTAINER_NAME)...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	@echo "$(GREEN)✓ Conteneur arrêté$(NC)"

## restart: Redémarrer le conteneur
restart: stop run

## logs: Voir les logs du conteneur
logs:
	@echo "$(GREEN)Logs du conteneur $(CONTAINER_NAME):$(NC)"
	docker logs -f $(CONTAINER_NAME)

## shell: Ouvrir un shell dans le conteneur
shell:
	@echo "$(GREEN)Ouverture d'un shell dans $(CONTAINER_NAME)...$(NC)"
	docker exec -it $(CONTAINER_NAME) sh

## clean: Nettoyer les images et conteneurs
clean:
	@echo "$(RED)Nettoyage des conteneurs et images...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker rmi $(IMAGE_NAME):latest || true
	@echo "$(GREEN)✓ Nettoyage terminé$(NC)"

## up: Lancer avec docker-compose
up:
	@echo "$(GREEN)Lancement avec docker-compose...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services démarrés$(NC)"

## down: Arrêter docker-compose
down:
	@echo "$(YELLOW)Arrêt des services docker-compose...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

## ps: Voir le statut des services
ps:
	@echo "$(GREEN)Statut des services:$(NC)"
	docker-compose ps

## health: Vérifier la santé de l'application
health:
	@echo "$(GREEN)Vérification de la santé de l'application...$(NC)"
	@curl -f http://localhost:$(PORT)/ > /dev/null 2>&1 && \
		echo "$(GREEN)✓ Application en bonne santé$(NC)" || \
		echo "$(RED)✗ Application inaccessible$(NC)"

## stats: Statistiques du conteneur
stats:
	@echo "$(GREEN)Statistiques du conteneur:$(NC)"
	docker stats $(CONTAINER_NAME) --no-stream

# Docker build avec cache
.PHONY: build-cache
build-cache:
	@echo "$(GREEN)Build avec cache...$(NC)"
	DOCKER_BUILDKIT=1 docker build --cache-from $(IMAGE_NAME):latest -t $(IMAGE_NAME):latest .

# Push vers Docker Hub
.PHONY: push
push:
	@echo "$(GREEN)Push vers Docker Hub...$(NC)"
	docker push $(IMAGE_NAME):latest
	@echo "$(GREEN)✓ Image pushée$(NC)"

# Rebuild complet (sans cache)
.PHONY: rebuild
rebuild:
	@echo "$(YELLOW)Rebuild complet sans cache...$(NC)"
	docker build --no-cache -t $(IMAGE_NAME):latest .
	@echo "$(GREEN)✓ Rebuild terminé$(NC)"

# Tout en un: build et run
.PHONY: deploy
deploy: build run
	@echo "$(GREEN)✓ Déploiement terminé!$(NC)"

# Vérifier les variables d'environnement
.PHONY: check-env
check-env:
	@if [ ! -f .env.production ]; then \
		echo "$(RED)✗ Fichier .env.production manquant!$(NC)"; \
		echo "$(YELLOW)Copiez .env.production.example vers .env.production$(NC)"; \
		exit 1; \
	else \
		echo "$(GREEN)✓ Fichier .env.production trouvé$(NC)"; \
	fi
