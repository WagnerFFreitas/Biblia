// Lista de animes dentro de uma Array
var animeList = []

// Push de animes(título e imagem)

// jujutsu kaisen
animeList.push({
  titleAnime: 'jujutsu kaisen',
  img: 'https://img1.ak.crunchyroll.com/i/spire3/02c909684baa37d6ef70a9df742d58951610752067_full.jpg'
})

// demon slayer
animeList.push({
  titleAnime: 'demon slayer',
  img: 'https://img1.ak.crunchyroll.com/i/spire3/f1fe5c7a43cb2f38f4152a58f89479821554508873_full.jpg'
})

// attack on titan
animeList.push({
  titleAnime: 'attack on titan',
  img: 'https://img1.ak.crunchyroll.com/i/spire3/1ce8ca573ac440e55f9482f42eac5a251608611536_full.jpg'
}) 

// fma:brotherhood
animeList.push({
  titleAnime: 'fma:brotherhood',
  img: 'https://img1.ak.crunchyroll.com/i/spire4/fabddf1040abbd18948b9aacc18011b31475523493_full.jpg'
})

// your name
animeList.push({
  titleAnime: 'your name',
  img: 'https://br.web.img3.acsta.net/pictures/17/10/04/19/01/4966397.jpg'
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

// ?
function createElementAnime (anime) {
  const listItem = document.createElement('li')
  const img = document.createElement('img')
  const name = document.createElement('h2')
  img.src=anime.img
  name.innerHTML = anime.titleAnime
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