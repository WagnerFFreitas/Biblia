/**
 * watermarker.js
 * Este script é responsável por adicionar uma marca d'água (imagem da Bíblia)
 * na página principal do aplicativo. A marca d'água é inserida como um elemento
 * visual de fundo quando nenhum conteúdo específico está sendo exibido.
 */

// Adiciona a marca d'água assim que todo o documento HTML for carregado
window.onload = () => {
    // Obtém o container principal de conteúdo
    const content = document.querySelector('.conteudo');
    
    // Cria um container específico para a marca d'água
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark'); // Adiciona classe para estilização
    
    // Cria o elemento de imagem para a marca d'água
    const img = document.createElement('img');
    img.src = '../img/biblia.png';     // Define o caminho da imagem
    img.alt = "Marca d'água da Bíblia"; // Texto alternativo para acessibilidade
    img.classList.add('watermark-image'); // Adiciona classe para estilização
    
    // Monta a estrutura DOM: adiciona a imagem ao container e o container ao conteúdo
    watermarkContainer.appendChild(img);
    content.appendChild(watermarkContainer);
};