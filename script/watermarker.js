// O bloco abaixo carrega a imagem da Bíblia assim que a página abre
window.onload = () => {
    const content = document.querySelector('.content');
    const watermarkContainer = document.createElement('div');
    watermarkContainer.classList.add('watermark');
    
    const img = document.createElement('img');
    img.src = '../img/biblia.png';
    img.alt = "Marca d'água da Bíblia";
    img.classList.add('watermark-image');
    
    watermarkContainer.appendChild(img);
    content.appendChild(watermarkContainer);
};