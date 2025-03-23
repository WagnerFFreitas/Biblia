import { BIBLE_CONFIG } from './config.js';
import { showNotification } from './common.js';

class BibleReader {
    constructor() {
        this.currentVersion = null;
        this.currentBook = 'genesis';
        this.currentChapter = 1;
        this.currentVerse = 1;
        this.versesGrid = document.querySelector('.verses-grid');
        this.verseContent = document.querySelector('.verse-content');
        this.chapterHeader = document.querySelector('.chapter-header h2');
        this.userSettings = {
            fontSize: 100,
            readingMode: 'paragraph',
            theme: 'light',
            showVerseNumbers: true,
            showCrossReferences: true,
            showNotes: true,
            presentationMode: false,
            audioEnabled: false
        };
        this.isInitialized = false;
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.galleryItems = [];
        this.currentAudio = null;
        this.currentVideo = null;
    }

    async init() {
        if (this.isInitialized) return;
        
        await this.loadChapterVerses();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    async loadChapterVerses() {
        try {
            // Simulando carregamento dos versículos do capítulo atual
            const totalVerses = this.getCurrentChapterVerses();
            this.updateVersesGrid(totalVerses);
            this.updateVerseContent();
            this.updateChapterHeader();
        } catch (error) {
            console.error('Erro ao carregar versículos:', error);
        }
    }

    getCurrentChapterVerses() {
        // Simulando número de versículos para Gênesis 1
        return 31;
    }

    updateVersesGrid(totalVerses) {
        this.versesGrid.innerHTML = '';
        
        for (let i = 1; i <= totalVerses; i++) {
            const button = document.createElement('button');
            button.className = 'verse-button';
            button.textContent = i;
            button.dataset.verse = i;
            
            if (i === this.currentVerse) {
                button.classList.add('active');
            }
            
            this.versesGrid.appendChild(button);
        }
    }

    updateVerseContent() {
        // Simulando conteúdo do versículo atual
        if (this.currentBook === 'genesis' && this.currentChapter === 1 && this.currentVerse === 1) {
            this.verseContent.innerHTML = `
                <h3 class="verse-title">CRIAÇÃO DO CÉU E DA TERRA E DE TUDO O QUE NELES SE CONTÉM</h3>
                <p class="verse-text">No princípio criou Deus os céus e a terra.</p>
            `;
        }
    }

    updateChapterHeader() {
        const bookName = this.currentBook.toUpperCase();
        this.chapterHeader.textContent = `${bookName} - CAPÍTULO ${this.currentChapter} - VERSÍCULO ${this.currentVerse}`;
    }

    setupEventListeners() {
        this.versesGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('verse-button')) {
                const verse = parseInt(e.target.dataset.verse);
                this.selectVerse(verse);
            }
        });
    }

    selectVerse(verse) {
        this.currentVerse = verse;
        
        // Atualiza botão ativo
        const buttons = this.versesGrid.querySelectorAll('.verse-button');
        buttons.forEach(button => {
            button.classList.toggle('active', parseInt(button.dataset.verse) === verse);
        });
        
        this.updateVerseContent();
        this.updateChapterHeader();
    }

    initialize() {
        this.setupReaderUI();
        this.setupEventListeners();
        this.setupMultimediaFeatures();
        this.loadLastPosition();
        this.isInitialized = true;
    }

    setupReaderUI() {
        const readerSection = document.querySelector('.bible-reader');
        if (!readerSection) return;

        readerSection.innerHTML = `
            <div class="reader-container">
                <div class="reader-header">
                    <div class="reader-controls">
                        <button class="btn btn-icon" id="toggleTheme" title="Alternar tema">
                            <span class="material-icons">dark_mode</span>
                        </button>
                        <div class="font-size-controls">
                            <button class="btn btn-icon" data-action="decrease" title="Diminuir tamanho">
                                <span class="material-icons">remove</span>
                            </button>
                            <span class="font-size-value">100%</span>
                            <button class="btn btn-icon" data-action="increase" title="Aumentar tamanho">
                                <span class="material-icons">add</span>
                            </button>
                        </div>
                        <button class="btn btn-icon" id="toggleColumns" title="Alternar layout">
                            <span class="material-icons">view_column</span>
                        </button>
                        <button class="btn btn-icon" id="togglePresentation" title="Modo Apresentação">
                            <span class="material-icons">present_to_all</span>
                        </button>
                        <button class="btn btn-icon" id="toggleAudio" title="Ler em voz alta">
                            <span class="material-icons">volume_up</span>
                        </button>
                        <button class="btn btn-icon" id="openGallery" title="Abrir galeria">
                            <span class="material-icons">photo_library</span>
                        </button>
                    </div>
                    <div class="reader-navigation">
                        <button class="btn btn-icon" id="prevChapter" title="Capítulo anterior">
                            <span class="material-icons">chevron_left</span>
                        </button>
                        <span class="chapter-info">Capítulo 1</span>
                        <button class="btn btn-icon" id="nextChapter" title="Próximo capítulo">
                            <span class="material-icons">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div class="reader-content">
                    <div class="chapter-info">
                        <h2>Capítulo 1</h2>
                        <p>Gênesis 1</p>
                    </div>
                    <div class="bible-content">
                        <!-- Conteúdo da Bíblia será carregado dinamicamente -->
                    </div>
                </div>

                <div class="reader-footer">
                    <div class="reader-info">
                        <span class="version-info">Versão: João Ferreira de Almeida</span>
                        <span class="book-info">Gênesis 1</span>
                    </div>
                    <div class="reader-actions">
                        <button class="btn btn-icon" title="Adicionar marcador">
                            <span class="material-icons">bookmark_border</span>
                        </button>
                        <button class="btn btn-icon" title="Adicionar nota">
                            <span class="material-icons">note_add</span>
                        </button>
                        <button class="btn btn-icon" title="Compartilhar">
                            <span class="material-icons">share</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal da Galeria -->
            <div id="galleryModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Galeria de Imagens</h3>
                        <button class="btn btn-icon" id="closeGallery" title="Fechar">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    <div class="gallery-grid">
                        <!-- Imagens serão carregadas dinamicamente -->
                    </div>
                </div>
            </div>

            <!-- Modal de Vídeo -->
            <div id="videoModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Reproduzir Vídeo</h3>
                        <button class="btn btn-icon" id="closeVideo" title="Fechar">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    <div class="video-container">
                        <video id="videoPlayer" controls>
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Alternar tema
        const themeBtn = document.getElementById('toggleTheme');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Controles de tamanho da fonte
        const fontSizeControls = document.querySelectorAll('.font-size-controls .btn');
        fontSizeControls.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.adjustFontSize(action);
            });
        });

        // Alternar layout de colunas
        const columnsBtn = document.getElementById('toggleColumns');
        if (columnsBtn) {
            columnsBtn.addEventListener('click', () => this.toggleColumns());
        }

        // Alternar números dos versículos
        const verseNumbersBtn = document.getElementById('toggleVerseNumbers');
        if (verseNumbersBtn) {
            verseNumbersBtn.addEventListener('click', () => this.toggleVerseNumbers());
        }

        // Navegação entre capítulos
        const prevChapterBtn = document.getElementById('prevChapter');
        const nextChapterBtn = document.getElementById('nextChapter');
        if (prevChapterBtn) {
            prevChapterBtn.addEventListener('click', () => this.navigateChapter('prev'));
        }
        if (nextChapterBtn) {
            nextChapterBtn.addEventListener('click', () => this.navigateChapter('next'));
        }

        // Adicionar novos event listeners
        const presentationButton = document.getElementById('togglePresentation');
        const audioButton = document.getElementById('toggleAudio');
        const galleryButton = document.getElementById('openGallery');
        const closeGalleryButton = document.getElementById('closeGallery');
        const galleryModal = document.getElementById('galleryModal');

        if (presentationButton) {
            presentationButton.addEventListener('click', () => this.togglePresentationMode());
        }

        if (audioButton) {
            audioButton.addEventListener('click', () => this.toggleAudioReading());
        }

        if (galleryButton) {
            galleryButton.addEventListener('click', () => this.openGallery());
        }

        if (closeGalleryButton) {
            closeGalleryButton.addEventListener('click', () => this.closeGallery());
        }

        if (galleryModal) {
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    this.closeGallery();
                }
            });
        }

        // Adicionar event listener para o botão de fechar vídeo
        const closeVideoButton = document.getElementById('closeVideo');
        if (closeVideoButton) {
            closeVideoButton.addEventListener('click', () => this.stopVideo());
        }
    }

    setupMultimediaFeatures() {
        // Configurar síntese de voz
        if (this.speechSynthesis) {
            this.speechSynthesis.onend = () => {
                this.userSettings.audioEnabled = false;
                this.updateAudioButton();
            };
        }

        // Carregar recursos multimídia
        this.loadMultimediaResources();
    }

    async loadMultimediaResources() {
        try {
            const response = await fetch('/api/multimedia');
            const data = await response.json();
            this.galleryItems = data.gallery;
            this.updateGalleryUI();
        } catch (error) {
            console.error('Erro ao carregar recursos multimídia:', error);
            showNotification('Erro ao carregar recursos multimídia', 'error');
        }
    }

    updateGalleryUI() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = this.galleryItems.map(item => `
            <div class="gallery-item" data-id="${item.id}">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="gallery-item-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        // Adicionar eventos de clique
        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => this.showGalleryItem(item.dataset.id));
        });
    }

    showGalleryItem(id) {
        const item = this.galleryItems.find(i => i.id === id);
        if (!item) return;

        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>${item.title}</h3>
                <button class="btn btn-icon" id="closeGallery" title="Fechar">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="gallery-item-detail">
                <img src="${item.image}" alt="${item.title}">
                <div class="gallery-item-detail-info">
                    <p>${item.description}</p>
                    ${item.audio ? `<button class="btn btn-audio" data-audio="${item.audio}">Ouvir Áudio</button>` : ''}
                    ${item.video ? `<button class="btn btn-video" data-video="${item.video}">Assistir Vídeo</button>` : ''}
                </div>
            </div>
        `;

        // Adicionar eventos para os botões
        const audioBtn = modalContent.querySelector('.btn-audio');
        const videoBtn = modalContent.querySelector('.btn-video');
        const closeBtn = modalContent.querySelector('#closeGallery');

        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.playAudio(audioBtn.dataset.audio));
        }

        if (videoBtn) {
            videoBtn.addEventListener('click', () => this.playVideo(videoBtn.dataset.video));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGallery());
        }
    }

    playAudio(url) {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        this.currentAudio = new Audio(url);
        this.currentAudio.play();
    }

    playVideo(url) {
        if (this.currentVideo) {
            this.currentVideo.pause();
        }

        const videoModal = document.getElementById('videoModal');
        const videoPlayer = document.getElementById('videoPlayer');
        
        if (videoPlayer) {
            videoPlayer.src = url;
            videoModal.style.display = 'block';
        }
    }

    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }

    stopVideo() {
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo = null;
        }
        const videoModal = document.getElementById('videoModal');
        if (videoModal) {
            videoModal.style.display = 'none';
        }
    }

    loadLastPosition() {
        const savedPosition = localStorage.getItem('lastBiblePosition');
        if (savedPosition) {
            const { version, book, chapter } = JSON.parse(savedPosition);
            this.setVersion(version);
            this.loadChapter(book, chapter);
        } else {
            this.setVersion(BIBLE_CONFIG.versions[0].id);
            this.loadChapter('Gênesis', 1);
        }
    }

    setVersion(versionId) {
        const version = BIBLE_CONFIG.versions.find(v => v.id === versionId);
        if (!version) return;

        this.currentVersion = version;
        this.updateVersionInfo();
        this.emitVersionChanged();
    }

    async loadChapter(book, chapter) {
        try {
            const content = await this.fetchChapter(book, chapter);
            this.currentBook = book;
            this.currentChapter = chapter;
            this.displayChapter(content);
            this.updateNavigation();
            this.savePosition();
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            showNotification('Erro ao carregar capítulo', 'error');
        }
    }

    async fetchChapter(book, chapter) {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retornar dados mock
        return {
            book,
            chapter,
            verses: [
                {
                    number: 1,
                    text: 'No princípio, criou Deus os céus e a terra.'
                },
                {
                    number: 2,
                    text: 'A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.'
                }
                // Adicionar mais versículos aqui
            ]
        };
    }

    displayChapter(content) {
        const bibleText = document.querySelector('.bible-content');
        if (!bibleText) return;

        const chapterInfo = document.querySelector('.chapter-info');
        if (chapterInfo) {
            chapterInfo.textContent = `Capítulo ${content.chapter}`;
        }

        const bookInfo = document.querySelector('.book-info');
        if (bookInfo) {
            bookInfo.textContent = `${content.book} ${content.chapter}`;
        }

        bibleText.innerHTML = content.verses.map(verse => `
            <div class="verse ${this.userSettings.showVerseNumbers ? 'numbered' : ''}" 
                 data-verse="${verse.number}">
                ${this.userSettings.showVerseNumbers ? 
                    `<span class="verse-number">${verse.number}</span>` : ''}
                <span class="verse-text">${verse.text}</span>
            </div>
        `).join('');
    }

    updateNavigation() {
        const prevChapterBtn = document.getElementById('prevChapter');
        const nextChapterBtn = document.getElementById('nextChapter');
        if (!prevChapterBtn || !nextChapterBtn) return;

        // Atualizar estado dos botões de navegação
        prevChapterBtn.disabled = this.currentChapter <= 1;
        nextChapterBtn.disabled = this.currentChapter >= this.getMaxChapters();
    }

    getMaxChapters() {
        const book = BIBLE_CONFIG.books.find(b => b.name === this.currentBook);
        return book ? book.chapters : 0;
    }

    navigateChapter(direction) {
        const newChapter = direction === 'prev' ? 
            this.currentChapter - 1 : 
            this.currentChapter + 1;

        if (newChapter >= 1 && newChapter <= this.getMaxChapters()) {
            this.loadChapter(this.currentBook, newChapter);
        }
    }

    toggleTheme() {
        const themes = ['light', 'sepia', 'dark'];
        const currentIndex = themes.indexOf(this.userSettings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    setTheme(theme) {
        this.userSettings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bibleTheme', theme);
    }

    adjustFontSize(action) {
        const fontSizeValue = document.querySelector('.font-size-value');
        if (!fontSizeValue) return;

        let currentSize = parseInt(fontSizeValue.textContent);
        if (action === 'increase') {
            currentSize = Math.min(currentSize + 10, 200);
        } else {
            currentSize = Math.max(currentSize - 10, 50);
        }

        fontSizeValue.textContent = `${currentSize}%`;
        this.setFontSize(currentSize);
    }

    setFontSize(size) {
        this.userSettings.fontSize = size;
        document.documentElement.style.setProperty('--bible-font-size', `${size}%`);
        localStorage.setItem('bibleFontSize', size);
    }

    toggleColumns() {
        const container = document.querySelector('.reader-container');
        if (!container) return;

        container.classList.toggle('multi-column');
    }

    toggleVerseNumbers() {
        this.userSettings.showVerseNumbers = !this.userSettings.showVerseNumbers;
        localStorage.setItem('showVerseNumbers', this.userSettings.showVerseNumbers);
        
        const verses = document.querySelectorAll('.verse');
        verses.forEach(verse => {
            verse.classList.toggle('numbered', this.userSettings.showVerseNumbers);
        });
    }

    updateVersionInfo() {
        const versionInfo = document.querySelector('.version-info');
        if (versionInfo && this.currentVersion) {
            versionInfo.textContent = `Versão: ${this.currentVersion.name}`;
        }
    }

    savePosition() {
        const position = {
            version: this.currentVersion.id,
            book: this.currentBook,
            chapter: this.currentChapter
        };
        localStorage.setItem('lastBiblePosition', JSON.stringify(position));
    }

    emitVersionChanged() {
        const event = new CustomEvent('versionChanged', {
            detail: {
                version: this.currentVersion
            }
        });
        document.dispatchEvent(event);
    }

    togglePresentationMode() {
        this.userSettings.presentationMode = !this.userSettings.presentationMode;
        document.body.classList.toggle('presentation-mode');
        
        if (this.userSettings.presentationMode) {
            this.setupPresentationMode();
        } else {
            this.exitPresentationMode();
        }
    }

    setupPresentationMode() {
        const content = document.querySelector('.bible-content');
        if (content) {
            content.classList.add('presentation-mode');
            // Ajustar tamanho e estilo para apresentação
            content.style.fontSize = '2em';
            content.style.lineHeight = '1.8';
            content.style.padding = '2em';
        }
    }

    exitPresentationMode() {
        const content = document.querySelector('.bible-content');
        if (content) {
            content.classList.remove('presentation-mode');
            // Restaurar tamanho e estilo normais
            content.style.fontSize = '';
            content.style.lineHeight = '';
            content.style.padding = '';
        }
    }

    toggleAudioReading() {
        if (!this.speechSynthesis) {
            showNotification('Seu navegador não suporta leitura em voz alta', 'error');
            return;
        }

        if (this.userSettings.audioEnabled) {
            this.stopAudioReading();
        } else {
            this.startAudioReading();
        }
    }

    startAudioReading() {
        const content = document.querySelector('.bible-content');
        if (!content) return;

        const text = content.innerText;
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = 'pt-BR';
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        this.speechSynthesis.speak(this.currentUtterance);
        this.userSettings.audioEnabled = true;
        this.updateAudioButton();
    }

    stopAudioReading() {
        this.speechSynthesis.cancel();
        this.userSettings.audioEnabled = false;
        this.updateAudioButton();
    }

    updateAudioButton() {
        const audioButton = document.getElementById('toggleAudio');
        if (audioButton) {
            audioButton.querySelector('.material-icons').textContent = 
                this.userSettings.audioEnabled ? 'volume_off' : 'volume_up';
        }
    }

    openGallery() {
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal) {
            galleryModal.style.display = 'block';
        }
    }

    closeGallery() {
        const galleryModal = document.getElementById('galleryModal');
        if (galleryModal) {
            galleryModal.style.display = 'none';
            this.stopAudio();
            this.stopVideo();
        }
    }
}

// Exportar uma única instância
export const bibleReader = new BibleReader();

// Inicializa o leitor da Bíblia quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const bibleReader = new BibleReader();
    bibleReader.init();
}); 