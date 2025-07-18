import json
import os

# Configurações
MAX_CONCORDANCIAS = 50  # Máximo de concordâncias por arquivo

# Solicita informações do usuário
INPUT_DIR = input("Digite a pasta de origem (ex.: /concordancia/1/): ").strip()
LETRA = input("Digite a letra do arquivo de origem (ex.: b para b.json): ").strip()
OUTPUT_DIR = input("Digite a pasta de destino (ex.: /concordancia/1/): ").strip()

# Define o caminho do arquivo de entrada
INPUT_FILE = os.path.join(INPUT_DIR, f"{LETRA}.json")
OUTPUT_PREFIX = LETRA.lower()  # Prefixo para b1.json, b2.json, etc.

# Verifica se o arquivo de entrada existe
if not os.path.exists(INPUT_FILE):
    print(f"Erro: O arquivo {INPUT_FILE} não foi encontrado.")
    exit(1)

# Garante que a pasta de destino existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Carrega o arquivo JSON
with open(INPUT_FILE, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Extrai a letra da chave principal (ex.: 'B')
key = list(data.keys())[0]
key_lower = key.lower()  # Converte para minúscula (ex.: 'b')
palavras = data.get(key, [])

# Verifica duplicatas nas concordâncias e processa as palavras
palavras_processadas = []
for palavra in palavras:
    # Verifica duplicatas nas concordâncias
    concordancias = palavra.get('concordancias', [])
    seen = set()
    concordancias_unicas = []
    for conc in concordancias:
        ref_texto = (conc['referencia'], conc['texto'])
        if ref_texto not in seen:
            seen.add(ref_texto)
            concordancias_unicas.append(conc)
        else:
            print(f"Duplicata encontrada em '{palavra['termo']}': {conc['referencia']}")

    # Cria a nova estrutura
    nova_palavra = {
        "palavra": palavra["termo"],
        "veja tambem": palavra.get("veja tambem", []),
        "ocorrencias": "",  # Deixa vazio; será preenchido posteriormente
        "fonte": "",  # Deixa vazio para preenchimento após a fusão
        "concordancias": concordancias_unicas
    }
    palavras_processadas.append(nova_palavra)

# Divide em grupos com base no número de concordâncias
current_concordancias = 0
current_grupo = []
partes = []
for palavra in palavras_processadas:
    num_concordancias = len(palavra["concordancias"])
    # Se adicionar a palavra exceder o limite, salvar o grupo atual
    if current_concordancias + num_concordancias > MAX_CONCORDANCIAS and current_grupo:
        partes.append(current_grupo)
        current_grupo = []
        current_concordancias = 0
    # Adicionar a palavra ao grupo atual
    current_grupo.append(palavra)
    current_concordancias += num_concordancias

# Adicionar o último grupo, se não estiver vazio
if current_grupo:
    partes.append(current_grupo)

# Salvar cada parte em um arquivo separado (ex.: b1.json, b2.json)
for i, grupo in enumerate(partes, 1):
    output_file = os.path.join(OUTPUT_DIR, f'{OUTPUT_PREFIX}{i}.json')
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump({key_lower: grupo}, file, ensure_ascii=False, indent=4)
    total_concordancias = sum(len(p["concordancias"]) for p in grupo)
    print(f'Salvo {output_file} com {len(grupo)} palavras e {total_concordancias} concordâncias')

print(f'Total de partes criadas: {len(partes)}')