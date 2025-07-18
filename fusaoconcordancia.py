import os
import json

# Sugestões de fontes e veja_tambem (pode expandir conforme desejar)
fontes = {
    "abaixar": "strong's h7817 (שָׁchach); dicionário bíblico",
    "aba": "strong's g5 (abba); dicionário bíblico",
    # Adicione mais conforme necessário
}
veja_tambem_sugestoes = {
    "abaixar": ["humilhar", "inclinar", "submeter"],
    "aba": ["pai", "paternidade", "abba"],
    # Adicione mais conforme necessário
}

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def process_entradas(entradas, key):
    resultado = []
    palavras_vistas = set()
    for entrada in entradas:
        # NÃO normalizar para radical, apenas minúsculo e strip
        palavra = (entrada.get("termo") or entrada.get("palavra") or "").strip().lower()
        if not palavra or palavra in palavras_vistas:
            continue
        palavras_vistas.add(palavra)

        veja_tambem = [v.strip().lower() for v in entrada.get("veja tambem", []) if v]
        if not veja_tambem:
            veja_tambem = veja_tambem_sugestoes.get(palavra, [])

        fonte = entrada.get("fonte") or fontes.get(palavra, "dicionário bíblico")

        concordancias = []
        refs_vistas = set()
        for c in entrada.get("concordancias", []):
            ref = c.get("referencia", "")
            txt = c.get("texto", "")
            if (ref, txt) in refs_vistas:
                continue
            refs_vistas.add((ref, txt))
            concordancias.append({
                "referencia": ref,
                "texto": txt
            })

        resultado.append({
            "palavra": palavra,
            "veja tambem": veja_tambem,
            "ocorrencias": len(concordancias),
            "fonte": fonte,
            "concordancias": concordancias
        })
    return resultado

dir_1 = os.path.join("concordancia", "1")
dir_2 = os.path.join("concordancia", "2")
dir_out = "concordancia"

# Descobre todas as letras presentes em /1/ e /2/
letras = set()
for d in [dir_1, dir_2]:
    if os.path.exists(d):
        for filename in os.listdir(d):
            if filename.endswith('.json'):
                letras.add(filename[0].lower())

for letra in sorted(letras):
    entradas = []
    # /1/
    path1 = os.path.join(dir_1, f"{letra}.json")
    data1 = load_json(path1)
    key1 = letra.upper() if letra.upper() in data1 else letra.lower()
    if key1 in data1:
        entradas += data1[key1]
    # /2/
    path2 = os.path.join(dir_2, f"{letra}.json")
    data2 = load_json(path2)
    key2 = letra.upper() if letra.upper() in data2 else letra.lower()
    if key2 in data2:
        entradas += data2[key2]

    resultado = process_entradas(entradas, letra)

    # Salva no padrão correto
    path_out = os.path.join(dir_out, f"{letra}.json")
    with open(path_out, "w", encoding="utf-8") as f:
        json.dump({letra: resultado}, f, ensure_ascii=False, indent=2)

print("Fusão concluída! Verifique os arquivos em concordancia/[letra].json")