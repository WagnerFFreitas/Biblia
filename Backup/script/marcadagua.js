/*===============================================================================*/
/*                      SCRIPT PARA MARCA D'ÁGUA DA BÍBLIA                       */
/*===============================================================================*/
/*  Este arquivo contém:                                                         */
/*                    - Funções para adicionar marca d'água na página principal  */
/*                    - Criação e inserção do elemento visual de fundo           */
/*===============================================================================*/

// Este bloco adiciona a marca d'água assim que todo o documento HTML for carregado
window.onload = () => {
    const content = document.querySelector('.conteudo');                          // Obtém o container principal de conteúdo
    const marcadaguaContainer = document.createElement('div');                    // Cria um container específico para a marca d'água
    marcadaguaContainer.classList.add('marcadagua');                              // Adiciona classe para estilização
    const img = document.createElement('img');                                    // Cria o elemento de imagem para a marca d'água
    img.src = '../img/biblia.png';                                                // Define o caminho da imagem
    img.alt = "Marca d'água da Bíblia";                                           // Define texto alternativo para acessibilidade
    img.classList.add('marcadagua-image');                                        // Adiciona classe para estilização
    marcadaguaContainer.appendChild(img);                                         // Adiciona a imagem ao container
    content.appendChild(marcadaguaContainer);                                     // Adiciona o container ao conteúdo principal
};