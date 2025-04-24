// Lista das versões da biblia dentro de uma Array
var animeList = []

// Push do título e imagem)

// Almeida Revisada e Atualizada
animeList.push({
  titleAnime: 'Bíblia ARC',
  img: '../img/arc.png'
})

// Almeida Revista e Atualizada
animeList.push({
  titleAnime: 'Bíblia ARA',
  img: '../img/ara.png'
})

// Almeida Corrigida Fiel
animeList.push({
  titleAnime: ' Bíblia ACF',
  img: '../img/acf.png'
})

// Nova Almeida Atualizada 
animeList.push({
  titleAnime: 'Bíblia NAA',
  img: '../img/naa.png'
}) 

// Nova Versão Internacional
animeList.push({
  titleAnime: 'Bíblia NVI',
  img: '../img/nvi.png'
})

// Nova Tradução na Linguagem de Hoje
animeList.push({
  titleAnime: ' Bíblia NTLH',
  img: '../img/ntlh.png'
})

// Bíblia King James
animeList.push({
  titleAnime: ' Bíblia BKJ',
  img: '../img/bkj.png'
})

// Original em Hebraico e Grego
animeList.push({
  titleAnime: ' Bíblia Original',
  img: '../img/original.png'
})

// Variável que representa o input do usuário
var inputUserFilter = document.getElementById('inputUser')

// Função responsável por filtrar os itens do site
function searchBar () {
  // Variável que define a lista como elemento
  var list = document.getElementById('List')
  // ?
  list.innerHTML = ''
  // Resumo da sintaxe abaixo: var filteredAnimes = animeList.filter(anime => anime.titleAnime.startsWith(inputUserFilter.value))
  // Constante animes filtrados
  const filteredAnimes = []
  // ?
  for (let i = 0; i < animeList.length; i++) {
    const animeName = animeList[i].titleAnime
    if (animeName.includes(inputUserFilter.value)) {
      filteredAnimes.push(animeList[i])
    }
  }
  // ?
  for (let i = 0; i < filteredAnimes.length; i++) {
    list.appendChild(createElementAnime(filteredAnimes[i]))
  }
}



/* 24/04/25 14:33 Função responsável por criar os elementos do site
function createElementAnime (anime) {
  const listItem = document.createElement('li')
  const img = document.createElement('img')
  const name = document.createElement('h2')
  img.src=anime.img
  name.innerHTML = anime.titleAnime
  listItem.appendChild(img)
  listItem.appendChild(name)
  return listItem
}*/

function createElementAnime(anime) {
  const listItem = document.createElement('li')
  const img = document.createElement('img')
  const name = document.createElement('h2')
  
  img.src = anime.img
  name.innerHTML = anime.titleAnime
  
  // Adiciona evento de clique
  listItem.addEventListener('click', () => {
    let url;
    // Verifica qual bíblia foi clicada
    if (anime.titleAnime.includes('ARC')) {
      url = '../html/arc.html';
    } else if (anime.titleAnime.includes('ARA')) {
      url = 'biblia/html/ara.html';
    } else if (anime.titleAnime.includes('ACF')) {
      url = 'biblia/html/acf.html';
    } else if (anime.titleAnime.includes('NAA')) {
      url = 'biblia/html/naa.html';
    } else if (anime.titleAnime.includes('NVI')) {
      url = 'biblia/html/nvi.html';
    } else if (anime.titleAnime.includes('NTLH')) {
      url = 'biblia/html/ntlh.html';
    } else if (anime.titleAnime.includes('BKJ')) {
      url = 'biblia/html/bkj.html';
    } else if (anime.titleAnime.includes('Original')) {
      url = 'biblia/html/original.html';
    }

    // Redireciona para a página correspondente
    if (url) {
      window.open(url, '_self');
    }
  });

  listItem.appendChild(img)
  listItem.appendChild(name)
  return listItem
}

// Chama a função sem que o usuário coloque alguma informação na barra de pesquisa
searchBar()

// ?
const realFileBtn = document.getElementById('realFile');
// ?
const customBtn = document.getElementById('newAnimeImg');
// ?
var uploadedImg = '';

// ?
customBtn.addEventListener('click', function() {
  realFileBtn.click();
});
// ?
realFileBtn.addEventListener('change', (event) => {
  // ?
  if (realFileBtn.files.length <=0){
    return;
  }
  // ?
  let reader = new FileReader();
  reader.onloadend = () => {
    uploadedImg = reader.result;
    const preImg = document.getElementById('imgPreview');
    customBtn.style.display = 'none';
    preImg.src = uploadedImg;
    preImg.style.display = 'flex';
  }
  // ?
  reader.readAsDataURL(realFileBtn.files[0]);
})

// Função responsável por fazer o pop-up ficar visível
function openPopup () {
  document.querySelector('body').classList.add('visible')
}

// Função responsável por fazer o pop-up ficar invisível
function closePopup () { 
  document.querySelector('body').classList.remove('visible')
  const preImg = document.getElementById('imgPreview');
  customBtn.style.display = 'block';
  preImg.src = '';
  preImg.style.display = 'none';
  document.getElementById('inputUser').value='';
}

// Função responsável por fazer o pop-up ficar invisível
function closeWlc () {                    
  var welcomePopup = document.getElementById('popupWlc')
  console.log(welcomePopup)
  welcomePopup.classList.remove('visibleWlc')
}

// Função que salva os novos animes colocados pelo usuário na lista
function saveAnime () {
  // Função que coleta e da um valor para o título de anime inserido pelo usuário 
  const animeName = document.getElementById('newAnimeTitle').value;
  // função que coleta a imagem enviada pelo usuário
  const animeImg = uploadedImg;
  animeList.push({
    titleAnime: animeName,
    img: animeImg
  })
  // Atualiza lista de animes
  searchBar()
  // Chamando função que fecha pop-up
  closePopup('closeStyle')
}