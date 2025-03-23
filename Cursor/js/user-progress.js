import { STORAGE_CONFIG } from './config.js';
import { showNotification } from './common.js';

class UserProgressManager {
    constructor() {
        this.progress = {
            bible: {
                lastRead: null,
                bookmarks: [],
                notes: [],
                highlights: []
            },
            hymns: {
                lastRead: null,
                favorites: [],
                notes: []
            },
            study: {
                lastRead: null,
                completedLessons: [],
                notes: [],
                certificates: []
            },
            resources: {
                lastRead: null,
                favorites: [],
                notes: [],
                downloads: []
            },
            settings: {
                theme: 'system',
                fontSize: 'medium',
                notifications: true,
                reminderTime: '08:00'
            }
        };

        this.loadProgress();
        this.setupAutoSave();
    }

    loadProgress() {
        try {
            const savedProgress = localStorage.getItem(STORAGE_CONFIG.keys.progress);
            if (savedProgress) {
                this.progress = JSON.parse(savedProgress);
            }
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
            showNotification('Erro ao carregar progresso', 'error');
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(STORAGE_CONFIG.keys.progress, JSON.stringify(this.progress));
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
            showNotification('Erro ao salvar progresso', 'error');
        }
    }

    setupAutoSave() {
        setInterval(() => this.saveProgress(), 5 * 60 * 1000); // Salvar a cada 5 minutos
    }

    // Métodos para Bíblia
    updateBibleProgress(book, chapter, verse) {
        this.progress.bible.lastRead = {
            book,
            chapter,
            verse,
            timestamp: new Date().toISOString()
        };
        this.saveProgress();
    }

    getBibleProgress() {
        return this.progress.bible.lastRead;
    }

    addBibleBookmark(book, chapter, verse, note = '') {
        this.progress.bible.bookmarks.push({
            book,
            chapter,
            verse,
            note,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeBibleBookmark(book, chapter, verse) {
        this.progress.bible.bookmarks = this.progress.bible.bookmarks.filter(
            bookmark => !(bookmark.book === book && bookmark.chapter === chapter && bookmark.verse === verse)
        );
        this.saveProgress();
    }

    getBibleBookmarks() {
        return this.progress.bible.bookmarks;
    }

    addBibleNote(book, chapter, verse, note) {
        this.progress.bible.notes.push({
            book,
            chapter,
            verse,
            note,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeBibleNote(book, chapter, verse) {
        this.progress.bible.notes = this.progress.bible.notes.filter(
            note => !(note.book === book && note.chapter === chapter && note.verse === verse)
        );
        this.saveProgress();
    }

    getBibleNotes() {
        return this.progress.bible.notes;
    }

    addBibleHighlight(book, chapter, verse, color = '#FFD700') {
        this.progress.bible.highlights.push({
            book,
            chapter,
            verse,
            color,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeBibleHighlight(book, chapter, verse) {
        this.progress.bible.highlights = this.progress.bible.highlights.filter(
            highlight => !(highlight.book === book && highlight.chapter === chapter && highlight.verse === verse)
        );
        this.saveProgress();
    }

    getBibleHighlights() {
        return this.progress.bible.highlights;
    }

    // Métodos para Hinários
    updateHymnsProgress(book, hymn) {
        this.progress.hymns.lastRead = {
            book,
            hymn,
            timestamp: new Date().toISOString()
        };
        this.saveProgress();
    }

    getHymnsProgress() {
        return this.progress.hymns.lastRead;
    }

    toggleHymnFavorite(book, hymn) {
        const index = this.progress.hymns.favorites.findIndex(
            f => f.book === book && f.hymn === hymn
        );

        if (index === -1) {
            this.progress.hymns.favorites.push({
                book,
                hymn,
                createdAt: new Date().toISOString()
            });
            this.saveProgress();
            return true;
        } else {
            this.progress.hymns.favorites.splice(index, 1);
            this.saveProgress();
            return false;
        }
    }

    getFavoriteHymns() {
        return this.progress.hymns.favorites;
    }

    addHymnNote(book, hymn, note) {
        this.progress.hymns.notes.push({
            book,
            hymn,
            note,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeHymnNote(book, hymn) {
        this.progress.hymns.notes = this.progress.hymns.notes.filter(
            note => !(note.book === book && note.hymn === hymn)
        );
        this.saveProgress();
    }

    getHymnNotes() {
        return this.progress.hymns.notes;
    }

    // Métodos para Estudos
    updateStudyProgress(plan, lesson) {
        this.progress.study.lastRead = {
            plan,
            lesson,
            timestamp: new Date().toISOString()
        };
        this.saveProgress();
    }

    getStudyProgress() {
        return this.progress.study.lastRead;
    }

    addCompletedLesson(plan, lesson) {
        this.progress.study.completedLessons.push({
            plan,
            lesson,
            completedAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeCompletedLesson(plan, lesson) {
        this.progress.study.completedLessons = this.progress.study.completedLessons.filter(
            completed => !(completed.plan === plan && completed.lesson === lesson)
        );
        this.saveProgress();
    }

    getCompletedLessons() {
        return this.progress.study.completedLessons;
    }

    addStudyNote(plan, lesson, note) {
        this.progress.study.notes.push({
            plan,
            lesson,
            note,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeStudyNote(plan, lesson) {
        this.progress.study.notes = this.progress.study.notes.filter(
            note => !(note.plan === plan && note.lesson === lesson)
        );
        this.saveProgress();
    }

    getStudyNotes() {
        return this.progress.study.notes;
    }

    addCertificate(plan, certificate) {
        this.progress.study.certificates.push({
            plan,
            certificate,
            earnedAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    getCertificates() {
        return this.progress.study.certificates;
    }

    // Métodos para Recursos
    updateResourcesProgress(category, resource) {
        this.progress.resources.lastRead = {
            category,
            resource,
            timestamp: new Date().toISOString()
        };
        this.saveProgress();
    }

    getResourcesProgress() {
        return this.progress.resources.lastRead;
    }

    toggleResourceFavorite(category, resource) {
        const index = this.progress.resources.favorites.findIndex(
            f => f.category === category && f.resource === resource
        );

        if (index === -1) {
            this.progress.resources.favorites.push({
                category,
                resource,
                createdAt: new Date().toISOString()
            });
            this.saveProgress();
            return true;
        } else {
            this.progress.resources.favorites.splice(index, 1);
            this.saveProgress();
            return false;
        }
    }

    getFavoriteResources() {
        return this.progress.resources.favorites;
    }

    addResourceNote(category, resource, note) {
        this.progress.resources.notes.push({
            category,
            resource,
            note,
            createdAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    removeResourceNote(category, resource) {
        this.progress.resources.notes = this.progress.resources.notes.filter(
            note => !(note.category === category && note.resource === resource)
        );
        this.saveProgress();
    }

    getResourceNotes() {
        return this.progress.resources.notes;
    }

    addDownload(category, resource) {
        this.progress.resources.downloads.push({
            category,
            resource,
            downloadedAt: new Date().toISOString()
        });
        this.saveProgress();
    }

    getDownloads() {
        return this.progress.resources.downloads;
    }

    // Métodos para Configurações
    updateSettings(settings) {
        this.progress.settings = {
            ...this.progress.settings,
            ...settings
        };
        this.saveProgress();
    }

    getSettings() {
        return this.progress.settings;
    }

    // Métodos para estatísticas
    getStats() {
        return {
            bible: {
                totalBookmarks: this.progress.bible.bookmarks.length,
                totalNotes: this.progress.bible.notes.length,
                totalHighlights: this.progress.bible.highlights.length
            },
            hymns: {
                totalFavorites: this.progress.hymns.favorites.length,
                totalNotes: this.progress.hymns.notes.length
            },
            study: {
                totalCompleted: this.progress.study.completedLessons.length,
                totalNotes: this.progress.study.notes.length,
                totalCertificates: this.progress.study.certificates.length
            },
            resources: {
                totalFavorites: this.progress.resources.favorites.length,
                totalNotes: this.progress.resources.notes.length,
                totalDownloads: this.progress.resources.downloads.length
            }
        };
    }

    // Métodos para sincronização
    async syncProgress() {
        try {
            // Simular sincronização com o servidor
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Progresso sincronizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao sincronizar progresso:', error);
            showNotification('Erro ao sincronizar progresso', 'error');
        }
    }

    // Métodos para backup
    async backupProgress() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                progress: this.progress
            };

            const backups = JSON.parse(localStorage.getItem('biblia_backups') || '[]');
            backups.push(backup);

            if (backups.length > STORAGE_CONFIG.backup.maxBackups) {
                backups.shift();
            }

            localStorage.setItem('biblia_backups', JSON.stringify(backups));
            showNotification('Backup criado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            showNotification('Erro ao criar backup', 'error');
        }
    }

    // Métodos para gerenciamento de dados
    exportData() {
        try {
            const data = JSON.stringify(this.progress, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `biblia_progress_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            showNotification('Erro ao exportar dados', 'error');
        }
    }

    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            this.progress = data;
            this.saveProgress();
            showNotification('Dados importados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            showNotification('Erro ao importar dados', 'error');
        }
    }

    clearData() {
        try {
            this.progress = {
                bible: {
                    lastRead: null,
                    bookmarks: [],
                    notes: [],
                    highlights: []
                },
                hymns: {
                    lastRead: null,
                    favorites: [],
                    notes: []
                },
                study: {
                    lastRead: null,
                    completedLessons: [],
                    notes: [],
                    certificates: []
                },
                resources: {
                    lastRead: null,
                    favorites: [],
                    notes: [],
                    downloads: []
                },
                settings: {
                    theme: 'system',
                    fontSize: 'medium',
                    notifications: true,
                    reminderTime: '08:00'
                }
            };
            this.saveProgress();
            showNotification('Dados limpos com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            showNotification('Erro ao limpar dados', 'error');
        }
    }
}

// Criar e exportar a instância do gerenciador de progresso
export const userProgress = new UserProgressManager(); 