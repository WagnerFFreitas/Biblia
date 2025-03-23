import CONFIG from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class ResourcesManager {
    constructor() {
        this.currentCategory = null;
        this.currentResource = null;
        this.isLoading = false;
    }

    initialize() {
        this.setupResourcesSection();
        this.setupEventListeners();
        this.loadLastCategory();
    }

    setupResourcesSection() {
        const resourcesSection = document.querySelector('#resources');
        if (!resourcesSection) return;

        resourcesSection.innerHTML = `
            <div class="resources-container">
                <div class="resources-header">
                    <h1>Recursos</h1>
                    <div class="resources-actions">
                        <button class="btn btn-primary" id="addResource">
                            <span class="material-icons">add</span>
                            Adicionar Recurso
                        </button>
                        <button class="btn btn-secondary" id="filterResources">
                            <span class="material-icons">filter_list</span>
                            Filtrar
                        </button>
                    </div>
                </div>

                <div class="resources-content">
                    <div class="categories-sidebar">
                        <div class="categories-header">
                            <h2>Categorias</h2>
                        </div>
                        <div class="categories-list">
                            <!-- Categorias serão preenchidas dinamicamente -->
                        </div>
                    </div>

                    <div class="resources-main">
                        <div class="resources-grid">
                            <!-- Recursos serão preenchidos dinamicamente -->
                        </div>

                        <div class="resource-details">
                            <div class="resource-header">
                                <h2 class="resource-title"></h2>
                                <div class="resource-actions">
                                    <button class="btn btn-icon" id="editResource">
                                        <span class="material-icons">edit</span>
                                    </button>
                                    <button class="btn btn-icon" id="deleteResource">
                                        <span class="material-icons">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div class="resource-content">
                                <div class="resource-info">
                                    <div class="resource-meta">
                                        <span class="resource-category"></span>
                                        <span class="resource-date"></span>
                                        <span class="resource-author"></span>
                                    </div>
                                    <div class="resource-description"></div>
                                    <div class="resource-body"></div>
                                </div>

                                <div class="resource-footer">
                                    <button class="btn btn-primary" id="downloadResource">
                                        <span class="material-icons">download</span>
                                        Download
                                    </button>
                                    <button class="btn btn-secondary" id="shareResource">
                                        <span class="material-icons">share</span>
                                        Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botão de adicionar recurso
        const addResourceBtn = document.getElementById('addResource');
        if (addResourceBtn) {
            addResourceBtn.addEventListener('click', () => this.showAddResourceModal());
        }

        // Botão de filtrar recursos
        const filterResourcesBtn = document.getElementById('filterResources');
        if (filterResourcesBtn) {
            filterResourcesBtn.addEventListener('click', () => this.showFilterModal());
        }

        // Botões de ação do recurso
        const editResourceBtn = document.getElementById('editResource');
        if (editResourceBtn) {
            editResourceBtn.addEventListener('click', () => this.showEditResourceModal());
        }

        const deleteResourceBtn = document.getElementById('deleteResource');
        if (deleteResourceBtn) {
            deleteResourceBtn.addEventListener('click', () => this.confirmDeleteResource());
        }

        // Botões de ação do recurso
        const downloadResourceBtn = document.getElementById('downloadResource');
        if (downloadResourceBtn) {
            downloadResourceBtn.addEventListener('click', () => this.downloadResource());
        }

        const shareResourceBtn = document.getElementById('shareResource');
        if (shareResourceBtn) {
            shareResourceBtn.addEventListener('click', () => this.shareResource());
        }
    }

    async loadLastCategory() {
        const lastCategory = userProgress.getResourcesProgress();
        if (lastCategory) {
            await this.selectCategory(lastCategory.categoryId);
            if (lastCategory.resourceId) {
                await this.selectResource(lastCategory.resourceId);
            }
        }
    }

    async selectCategory(categoryId) {
        if (!categoryId) return;

        this.isLoading = true;

        try {
            const category = await this.fetchCategory(categoryId);
            this.currentCategory = category;
            this.displayCategory(category);
            this.loadResources(categoryId);
        } catch (error) {
            console.error('Erro ao carregar categoria:', error);
            showNotification('Erro ao carregar categoria', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async selectResource(resourceId) {
        if (!this.currentCategory || !resourceId) return;

        this.isLoading = true;

        try {
            const resource = await this.fetchResource(this.currentCategory.id, resourceId);
            this.currentResource = resource;
            this.displayResource(resource);
            this.updateResourceProgress();
        } catch (error) {
            console.error('Erro ao carregar recurso:', error);
            showNotification('Erro ao carregar recurso', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    displayCategory(category) {
        const categoriesList = document.querySelector('.categories-list');
        if (!categoriesList) return;

        // Atualiza a lista de categorias
        categoriesList.innerHTML = CONFIG.RESOURCES.map(cat => `
            <div class="category-item ${cat.id === category?.id ? 'active' : ''}" 
                 data-id="${cat.id}">
                <span class="material-icons">${cat.icon}</span>
                <span>${cat.name}</span>
            </div>
        `).join('');

        // Adiciona eventos de clique
        categoriesList.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCategory(item.dataset.id);
            });
        });
    }

    displayResource(resource) {
        const title = document.querySelector('.resource-title');
        if (title) {
            title.textContent = resource.title;
        }

        const category = document.querySelector('.resource-category');
        if (category) {
            category.textContent = resource.category;
        }

        const date = document.querySelector('.resource-date');
        if (date) {
            date.textContent = new Date(resource.date).toLocaleDateString();
        }

        const author = document.querySelector('.resource-author');
        if (author) {
            author.textContent = resource.author;
        }

        const description = document.querySelector('.resource-description');
        if (description) {
            description.textContent = resource.description;
        }

        const body = document.querySelector('.resource-body');
        if (body) {
            body.innerHTML = resource.content;
        }
    }

    async loadResources(categoryId) {
        try {
            const resources = await this.fetchResources(categoryId);
            this.displayResourcesList(resources);
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            showNotification('Erro ao carregar recursos', 'error');
        }
    }

    displayResourcesList(resources) {
        const resourcesGrid = document.querySelector('.resources-grid');
        if (!resourcesGrid) return;

        resourcesGrid.innerHTML = resources.map(resource => `
            <div class="resource-card ${resource.id === this.currentResource?.id ? 'active' : ''}" 
                 data-id="${resource.id}">
                <div class="resource-card-header">
                    <span class="material-icons">${resource.icon}</span>
                    <h3>${resource.title}</h3>
                </div>
                <div class="resource-card-body">
                    <p>${resource.description}</p>
                    <div class="resource-card-meta">
                        <span>${resource.category}</span>
                        <span>${new Date(resource.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona eventos de clique
        resourcesGrid.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectResource(card.dataset.id);
            });
        });
    }

    updateResourceProgress() {
        if (!this.currentCategory || !this.currentResource) return;

        userProgress.updateResourcesProgress(
            this.currentCategory.id,
            this.currentResource.id
        );
    }

    showAddResourceModal() {
        // Implementar modal de adicionar recurso
    }

    showEditResourceModal() {
        // Implementar modal de edição de recurso
    }

    showFilterModal() {
        // Implementar modal de filtro
    }

    confirmDeleteResource() {
        if (!this.currentResource) return;

        if (confirm('Tem certeza que deseja excluir este recurso?')) {
            this.deleteResource(this.currentResource.id);
        }
    }

    async deleteResource(resourceId) {
        try {
            await this.removeResource(resourceId);
            this.currentResource = null;
            this.displayResource(null);
            this.loadResources(this.currentCategory.id);
            showNotification('Recurso excluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir recurso:', error);
            showNotification('Erro ao excluir recurso', 'error');
        }
    }

    async downloadResource() {
        if (!this.currentResource) return;

        try {
            const url = await this.getResourceDownloadUrl(this.currentResource.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Erro ao baixar recurso:', error);
            showNotification('Erro ao baixar recurso', 'error');
        }
    }

    async shareResource() {
        if (!this.currentResource) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: this.currentResource.title,
                    text: this.currentResource.description,
                    url: window.location.href
                });
            } else {
                // Fallback para copiar link
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copiado para a área de transferência', 'success');
            }
        } catch (error) {
            console.error('Erro ao compartilhar recurso:', error);
            showNotification('Erro ao compartilhar recurso', 'error');
        }
    }

    // Métodos de simulação de API
    async fetchCategory(categoryId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return CONFIG.RESOURCES.find(cat => cat.id === categoryId);
    }

    async fetchResources(categoryId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return [
            {
                id: '1',
                title: 'Recurso 1',
                description: 'Descrição do recurso 1',
                category: 'bible',
                date: new Date().toISOString(),
                author: 'Autor 1',
                content: 'Conteúdo do recurso 1',
                icon: 'description'
            },
            {
                id: '2',
                title: 'Recurso 2',
                description: 'Descrição do recurso 2',
                category: 'bible',
                date: new Date().toISOString(),
                author: 'Autor 2',
                content: 'Conteúdo do recurso 2',
                icon: 'description'
            }
        ];
    }

    async fetchResource(categoryId, resourceId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: resourceId,
            title: 'Recurso',
            description: 'Descrição do recurso',
            category: 'bible',
            date: new Date().toISOString(),
            author: 'Autor',
            content: 'Conteúdo do recurso',
            icon: 'description'
        };
    }

    async removeResource(resourceId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async getResourceDownloadUrl(resourceId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return `https://example.com/resources/${resourceId}`;
    }
}

// Exporta uma única instância
export const resourcesManager = new ResourcesManager(); 