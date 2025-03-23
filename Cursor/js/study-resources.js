import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyResourcesManager {
    constructor() {
        this.resources = [];
        this.currentResource = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupResourcesUI();
        this.setupEventListeners();
        this.loadResources();
        this.isInitialized = true;
    }

    setupResourcesUI() {
        const resourcesSection = document.querySelector('.study-resources');
        if (!resourcesSection) return;

        resourcesSection.innerHTML = `
            <div class="resources-container">
                <div class="resources-header">
                    <h3>Recursos de Estudo</h3>
                    <div class="resources-actions">
                        <button class="btn btn-icon" id="addResource">
                            <span class="material-icons">add</span>
                        </button>
                        <button class="btn btn-icon" id="searchResources">
                            <span class="material-icons">search</span>
                        </button>
                    </div>
                </div>

                <div class="resources-content">
                    <div class="resources-sidebar">
                        <div class="resources-filters">
                            <select id="resourceType">
                                <option value="all">Todos os Tipos</option>
                                <option value="document">Documentos</option>
                                <option value="video">Vídeos</option>
                                <option value="audio">Áudios</option>
                                <option value="image">Imagens</option>
                            </select>
                            <select id="resourceCategory">
                                <option value="all">Todas as Categorias</option>
                                <option value="bible">Bíblia</option>
                                <option value="church">Igreja</option>
                                <option value="doctrine">Doutrina</option>
                            </select>
                            <select id="resourceSort">
                                <option value="date">Data</option>
                                <option value="title">Título</option>
                                <option value="size">Tamanho</option>
                            </select>
                        </div>

                        <div class="resources-list">
                            <!-- Lista de recursos será preenchida dinamicamente -->
                        </div>
                    </div>

                    <div class="resource-viewer">
                        <div class="viewer-header">
                            <h4 class="resource-title"></h4>
                            <div class="viewer-actions">
                                <button class="btn btn-icon" id="downloadResource">
                                    <span class="material-icons">download</span>
                                </button>
                                <button class="btn btn-icon" id="shareResource">
                                    <span class="material-icons">share</span>
                                </button>
                                <button class="btn btn-icon" id="favoriteResource">
                                    <span class="material-icons">favorite_border</span>
                                </button>
                            </div>
                        </div>

                        <div class="viewer-content">
                            <div class="resource-info">
                                <div class="info-item">
                                    <span class="info-label">Tipo</span>
                                    <span class="info-value type"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Categoria</span>
                                    <span class="info-value category"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Tamanho</span>
                                    <span class="info-value size"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Data</span>
                                    <span class="info-value date"></span>
                                </div>
                            </div>

                            <div class="resource-description">
                                <h5>Descrição</h5>
                                <p class="description-text"></p>
                            </div>

                            <div class="resource-preview">
                                <!-- Preview do recurso será preenchido dinamicamente -->
                            </div>

                            <div class="resource-tags">
                                <h5>Tags</h5>
                                <div class="tags-list">
                                    <!-- Tags serão preenchidas dinamicamente -->
                                </div>
                            </div>

                            <div class="resource-comments">
                                <h5>Comentários</h5>
                                <div class="comments-list">
                                    <!-- Comentários serão preenchidos dinamicamente -->
                                </div>
                                <div class="comment-form">
                                    <textarea placeholder="Adicione um comentário..."></textarea>
                                    <button class="btn btn-primary">Comentar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="search-panel" style="display: none;">
                    <div class="search-header">
                        <input type="text" class="search-input" placeholder="Pesquisar recursos...">
                        <button class="btn btn-icon" id="closeSearch">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    <div class="search-results">
                        <!-- Resultados da pesquisa serão preenchidos dinamicamente -->
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botões de ação
        const addResourceBtn = document.getElementById('addResource');
        if (addResourceBtn) {
            addResourceBtn.addEventListener('click', () => this.addResource());
        }

        const searchResourcesBtn = document.getElementById('searchResources');
        if (searchResourcesBtn) {
            searchResourcesBtn.addEventListener('click', () => this.toggleSearch());
        }

        const closeSearchBtn = document.getElementById('closeSearch');
        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => this.toggleSearch());
        }

        const downloadResourceBtn = document.getElementById('downloadResource');
        if (downloadResourceBtn) {
            downloadResourceBtn.addEventListener('click', () => this.downloadResource());
        }

        const shareResourceBtn = document.getElementById('shareResource');
        if (shareResourceBtn) {
            shareResourceBtn.addEventListener('click', () => this.shareResource());
        }

        const favoriteResourceBtn = document.getElementById('favoriteResource');
        if (favoriteResourceBtn) {
            favoriteResourceBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Filtros
        const resourceType = document.getElementById('resourceType');
        if (resourceType) {
            resourceType.addEventListener('change', () => this.applyFilters());
        }

        const resourceCategory = document.getElementById('resourceCategory');
        if (resourceCategory) {
            resourceCategory.addEventListener('change', () => this.applyFilters());
        }

        const resourceSort = document.getElementById('resourceSort');
        if (resourceSort) {
            resourceSort.addEventListener('change', () => this.applyFilters());
        }

        // Campo de pesquisa
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Formulário de comentário
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            const textarea = commentForm.querySelector('textarea');
            const submitBtn = commentForm.querySelector('button');

            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.addComment(textarea.value));
            }
        }
    }

    async loadResources() {
        try {
            const savedResources = await this.fetchResources();
            this.resources = savedResources;
            this.displayResources();
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            showNotification('Erro ao carregar recursos', 'error');
        }
    }

    displayResources() {
        const resourcesList = document.querySelector('.resources-list');
        if (!resourcesList) return;

        resourcesList.innerHTML = this.resources.map(resource => `
            <div class="resource-item ${resource.id === this.currentResource?.id ? 'active' : ''}" 
                 data-id="${resource.id}">
                <div class="resource-icon">
                    <span class="material-icons">${this.getResourceIcon(resource.type)}</span>
                </div>
                <div class="resource-info">
                    <h4>${resource.title}</h4>
                    <div class="resource-meta">
                        <span>${this.formatSize(resource.size)}</span>
                        <span>${this.formatDate(resource.date)}</span>
                    </div>
                    <div class="resource-tags">
                        ${resource.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os recursos
        this.setupResourcesListeners();
    }

    setupResourcesListeners() {
        const resources = document.querySelectorAll('.resource-item');
        resources.forEach(resource => {
            resource.addEventListener('click', () => {
                this.viewResource(resource.dataset.id);
            });
        });
    }

    getResourceIcon(type) {
        switch (type) {
            case 'document':
                return 'description';
            case 'video':
                return 'video_library';
            case 'audio':
                return 'audiotrack';
            case 'image':
                return 'image';
            default:
                return 'insert_drive_file';
        }
    }

    viewResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;

        this.currentResource = resource;
        this.displayResourceViewer();
    }

    displayResourceViewer() {
        const viewer = document.querySelector('.resource-viewer');
        if (!viewer) return;

        viewer.style.display = 'block';

        // Preenche informações
        const titleElement = viewer.querySelector('.resource-title');
        const typeElement = viewer.querySelector('.type');
        const categoryElement = viewer.querySelector('.category');
        const sizeElement = viewer.querySelector('.size');
        const dateElement = viewer.querySelector('.date');
        const descriptionElement = viewer.querySelector('.description-text');
        const previewElement = viewer.querySelector('.resource-preview');
        const tagsList = viewer.querySelector('.tags-list');
        const commentsList = viewer.querySelector('.comments-list');
        const favoriteBtn = viewer.querySelector('#favoriteResource');

        if (titleElement) {
            titleElement.textContent = this.currentResource.title;
        }

        if (typeElement) {
            typeElement.textContent = this.currentResource.type;
        }

        if (categoryElement) {
            categoryElement.textContent = this.currentResource.category;
        }

        if (sizeElement) {
            sizeElement.textContent = this.formatSize(this.currentResource.size);
        }

        if (dateElement) {
            dateElement.textContent = this.formatDate(this.currentResource.date);
        }

        if (descriptionElement) {
            descriptionElement.textContent = this.currentResource.description;
        }

        if (previewElement) {
            previewElement.innerHTML = this.getResourcePreview(this.currentResource);
        }

        if (tagsList) {
            tagsList.innerHTML = this.currentResource.tags.map(tag => `
                <span class="tag">${tag}</span>
            `).join('');
        }

        if (commentsList) {
            commentsList.innerHTML = this.currentResource.comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${this.formatDate(comment.date)}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `).join('');
        }

        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('.material-icons');
            if (icon) {
                icon.textContent = this.currentResource.isFavorite ? 'favorite' : 'favorite_border';
            }
        }
    }

    getResourcePreview(resource) {
        switch (resource.type) {
            case 'image':
                return `<img src="${resource.url}" alt="${resource.title}">`;
            case 'video':
                return `
                    <video controls>
                        <source src="${resource.url}" type="video/mp4">
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                `;
            case 'audio':
                return `
                    <audio controls>
                        <source src="${resource.url}" type="audio/mpeg">
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                `;
            case 'document':
                return `
                    <div class="document-preview">
                        <iframe src="${resource.url}" frameborder="0"></iframe>
                    </div>
                `;
            default:
                return '<p>Preview não disponível para este tipo de recurso.</p>';
        }
    }

    async addResource() {
        // Implementar lógica de adicionar recurso
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async downloadResource() {
        if (!this.currentResource) return;

        try {
            // Simula download
            const link = document.createElement('a');
            link.href = this.currentResource.url;
            link.download = this.currentResource.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('Download iniciado', 'success');
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
                    url: this.currentResource.url
                });
            } else {
                // Fallback para copiar link
                await navigator.clipboard.writeText(this.currentResource.url);
                showNotification('Link copiado para a área de transferência', 'success');
            }
        } catch (error) {
            console.error('Erro ao compartilhar recurso:', error);
            showNotification('Erro ao compartilhar recurso', 'error');
        }
    }

    async toggleFavorite() {
        if (!this.currentResource) return;

        try {
            this.currentResource.isFavorite = !this.currentResource.isFavorite;
            await this.updateResourceOnServer(this.currentResource);

            const favoriteBtn = document.querySelector('#favoriteResource');
            if (favoriteBtn) {
                const icon = favoriteBtn.querySelector('.material-icons');
                if (icon) {
                    icon.textContent = this.currentResource.isFavorite ? 'favorite' : 'favorite_border';
                }
            }

            showNotification(
                this.currentResource.isFavorite ? 'Recurso adicionado aos favoritos' : 'Recurso removido dos favoritos',
                'success'
            );
        } catch (error) {
            console.error('Erro ao atualizar favorito:', error);
            showNotification('Erro ao atualizar favorito', 'error');
        }
    }

    async addComment(text) {
        if (!this.currentResource || !text.trim()) return;

        try {
            const comment = {
                id: Date.now().toString(),
                author: 'Usuário', // Substituir pelo nome real do usuário
                text: text.trim(),
                date: new Date().toISOString()
            };

            this.currentResource.comments.push(comment);
            await this.updateResourceOnServer(this.currentResource);

            // Limpa o campo de comentário
            const textarea = document.querySelector('.comment-form textarea');
            if (textarea) {
                textarea.value = '';
            }

            // Atualiza a lista de comentários
            this.displayResourceViewer();

            showNotification('Comentário adicionado com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            showNotification('Erro ao adicionar comentário', 'error');
        }
    }

    toggleSearch() {
        const searchPanel = document.querySelector('.search-panel');
        if (!searchPanel) return;

        searchPanel.style.display = searchPanel.style.display === 'none' ? 'block' : 'none';
    }

    handleSearch(query) {
        if (!query) {
            this.displaySearchResults([]);
            return;
        }

        const results = this.resources.filter(resource => {
            const searchText = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        searchResults.innerHTML = results.map(resource => `
            <div class="search-result-item" data-id="${resource.id}">
                <div class="result-icon">
                    <span class="material-icons">${this.getResourceIcon(resource.type)}</span>
                </div>
                <div class="result-info">
                    <div class="result-title">${resource.title}</div>
                    <div class="result-meta">
                        <span>${this.formatSize(resource.size)}</span>
                        <span>${this.formatDate(resource.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os resultados
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                this.viewResource(item.dataset.id);
                this.toggleSearch();
            });
        });
    }

    applyFilters() {
        const type = document.getElementById('resourceType')?.value;
        const category = document.getElementById('resourceCategory')?.value;
        const sort = document.getElementById('resourceSort')?.value;

        let filteredResources = [...this.resources];

        // Aplica filtros
        if (type && type !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.type === type);
        }

        if (category && category !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.category === category);
        }

        // Aplica ordenação
        switch (sort) {
            case 'date':
                filteredResources.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                filteredResources.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'size':
                filteredResources.sort((a, b) => b.size - a.size);
                break;
        }

        this.displayFilteredResources(filteredResources);
    }

    displayFilteredResources(resources) {
        const resourcesList = document.querySelector('.resources-list');
        if (!resourcesList) return;

        resourcesList.innerHTML = resources.map(resource => `
            <div class="resource-item ${resource.id === this.currentResource?.id ? 'active' : ''}" 
                 data-id="${resource.id}">
                <div class="resource-icon">
                    <span class="material-icons">${this.getResourceIcon(resource.type)}</span>
                </div>
                <div class="resource-info">
                    <h4>${resource.title}</h4>
                    <div class="resource-meta">
                        <span>${this.formatSize(resource.size)}</span>
                        <span>${this.formatDate(resource.date)}</span>
                    </div>
                    <div class="resource-tags">
                        ${resource.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os recursos
        this.setupResourcesListeners();
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Métodos de simulação de API
    async fetchResources() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return [
            {
                id: '1',
                title: 'Documento 1',
                type: 'document',
                category: 'bible',
                size: 1024 * 1024, // 1MB
                date: '2024-01-15T09:00:00Z',
                description: 'Descrição do documento 1',
                url: 'https://example.com/document1.pdf',
                tags: ['importante', 'revisar'],
                comments: [
                    {
                        id: '1',
                        author: 'Usuário 1',
                        text: 'Comentário 1',
                        date: '2024-01-15T10:00:00Z'
                    }
                ],
                isFavorite: false
            },
            {
                id: '2',
                title: 'Vídeo 1',
                type: 'video',
                category: 'church',
                size: 50 * 1024 * 1024, // 50MB
                date: '2024-01-20T19:00:00Z',
                description: 'Descrição do vídeo 1',
                url: 'https://example.com/video1.mp4',
                tags: ['igreja'],
                comments: [],
                isFavorite: true
            }
        ];
    }

    async updateResourceOnServer(resource) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyResources = new StudyResourcesManager(); 
export const studyResources = new StudyResourcesManager(); 