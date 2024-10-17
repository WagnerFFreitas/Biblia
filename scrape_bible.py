import requests
from bs4 import BeautifulSoup

# URL da passagem da Bíblia
url = "https://www.biblegateway.com/passage/?search=G%C3%AAnesis%209&version=ARC"

# Faz uma requisição GET para o site
response = requests.get(url)

# Verifica se a requisição foi bem-sucedida
if response.status_code == 200:
    # Analisa o conteúdo da página
    soup = BeautifulSoup(response.text, 'html.parser')

    # Encontra o conteúdo desejado
    # O seletor pode ser ajustado conforme a estrutura do HTML
    verses = soup.find_all('span', class_='text')
    
    # Imprime cada verso encontrado
    for verse in verses:
        print(verse.get_text())
else:
    print(f"Erro ao acessar a página: {response.status_code}")