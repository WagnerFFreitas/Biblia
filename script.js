// Lista das versões da Bíblia (padrão) - cada item com título e imagem
var animeList = []

// Adicionando versões padrões
animeList.push({ titleAnime: 'Bíblia ARC', img: './img/arc.png' })
animeList.push({ titleAnime: 'Bíblia ARA', img: './img/ara.png' })
animeList.push({ titleAnime: 'Bíblia ACF', img: './img/acf.png' })
animeList.push({ titleAnime: 'Bíblia NAA', img: './img/naa.png' })
animeList.push({ titleAnime: 'Bíblia NVI', img: './img/nvi.png' })
animeList.push({ titleAnime: 'Bíblia NTLH', img: './img/ntlh.png' })
animeList.push({ titleAnime: 'Bíblia BKJ', img: './img/bkj.png' })
animeList.push({ titleAnime: 'Bíblia Original', img: './img/original.png' })

// Input da barra de busca
var inputUserFilter = document.getElementById('inputUser')

// Função que filtra as versões da Bíblia com base no texto digitado
function searchBar() {
  var list = document.getElementById('List')
  list.innerHTML = '' // Limpa a lista atual

  const filteredAnimes = []

  // Verifica quais Bíblias correspondem ao texto pesquisado
  for (let i = 0; i < animeList.length; i++) {
    const animeName = animeList[i].titleAnime
    if (animeName.includes(inputUserFilter.value)) {
      filteredAnimes.push(animeList[i])
    }
  }

  // Adiciona as Bíblias filtradas na lista
  for (let i = 0; i < filteredAnimes.length; i++) {
    list.appendChild(createElementAnime(filteredAnimes[i]))
  }
}

// Cria o elemento HTML (li, img, h2) para cada Bíblia
function createElementAnime(anime) {
  const listItem = document.createElement('li')
  const img = document.createElement('img')
  const name = document.createElement('h2')

  img.src = anime.img
  name.innerHTML = anime.titleAnime

  // Redireciona para a página correspondente ao clicar
  listItem.addEventListener('click', () => {
    let url;
    if (anime.titleAnime.includes('ARC')) url = './html/arc.html';
    else if (anime.titleAnime.includes('ARA')) url = './html/ara.html';
    else if (anime.titleAnime.includes('ACF')) url = './html/acf.html';
    else if (anime.titleAnime.includes('NAA')) url = './html/naa.html';
    else if (anime.titleAnime.includes('NVI')) url = './html/nvi.html';
    else if (anime.titleAnime.includes('NTLH')) url = './html/ntlh.html';
    else if (anime.titleAnime.includes('BKJ')) url = './html/bkj.html';
    else if (anime.titleAnime.includes('Original')) url = './html/original.html';

    if (url) {
      window.open(url, '_self');
    }
  })

  listItem.appendChild(img)
  listItem.appendChild(name)
  return listItem
}

// Inicializa carregando toda a lista (sem filtro)
searchBar()

// Botões de upload e visualização de imagem
const realFileBtn = document.getElementById('realFile');
const customBtn = document.getElementById('newAnimeImg');
var uploadedImg = '';

// Botão de upload de imagem (clicável)
customBtn.addEventListener('click', function() {
  realFileBtn.click();
});

// Preview da imagem selecionada
realFileBtn.addEventListener('change', (event) => {
  if (realFileBtn.files.length <= 0) return;

  let reader = new FileReader();
  reader.onloadend = () => {
    uploadedImg = reader.result;
    const preImg = document.getElementById('imgPreview');
    customBtn.style.display = 'none';
    preImg.src = uploadedImg;
    preImg.style.display = 'flex';
  }
  reader.readAsDataURL(realFileBtn.files[0]);
})

// Mostra o pop-up para adicionar nova versão
function openPopup() {
  document.querySelector('body').classList.add('visible')
}

// Fecha o pop-up de adicionar versão
function closePopup() { 
  document.querySelector('body').classList.remove('visible')
  const preImg = document.getElementById('imgPreview');
  customBtn.style.display = 'block';
  preImg.src = '';
  preImg.style.display = 'none';
  document.getElementById('inputUser').value = '';
}

// Fecha o pop-up de boas-vindas
function closeWlc() {                    
  var welcomePopup = document.getElementById('popupWlc')
  welcomePopup.classList.remove('visibleWlc')
}

// Salva uma nova versão de Bíblia na lista
function saveAnime() {
  const animeName = document.getElementById('newAnimeTitle').value;
  const animeImg = uploadedImg;
  animeList.push({ titleAnime: animeName, img: animeImg })
  searchBar() // Atualiza a lista
  closePopup() // Fecha o pop-up
}
