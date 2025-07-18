import json
import os
from collections import defaultdict

def remover_duplicatas_arquivos_a():
    """
    Analisa todos os arquivos da letra 'a' na pasta concordancia/1/divisao/
    e remove duplicatas nos campos palavra, veja tambem, referencia e texto.
    """
    
    pasta = "concordancia/1/divisao"
    
    # Lista todos os arquivos da letra 'a'
    arquivos_a = []
    for filename in os.listdir(pasta):
        if filename.startswith('a') and filename.endswith('.json'):
            arquivos_a.append(filename)
    
    arquivos_a.sort()  # Ordena numericamente
    print(f"Encontrados {len(arquivos_a)} arquivos da letra 'a'")
    
    # Dicionários para rastrear duplicatas
    palavras_vistas = set()
    concordancias_vistas = set()  # (palavra, referencia, texto)
    veja_tambem_vistas = defaultdict(set)  # palavra -> set de veja_tambem
    
    total_duplicatas_removidas = 0
    total_arquivos_processados = 0
    
    for arquivo in arquivos_a:
        caminho_arquivo = os.path.join(pasta, arquivo)
        
        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'a' not in data:
                print(f"Arquivo {arquivo} não contém chave 'a'")
                continue
            
            entradas_originais = data['a']
            entradas_limpas = []
            duplicatas_arquivo = 0
            
            for entrada in entradas_originais:
                palavra = entrada.get('palavra', '').lower().strip()
                
                # Verifica se a palavra já foi vista
                if palavra in palavras_vistas:
                    print(f"Duplicata de palavra removida: '{palavra}' em {arquivo}")
                    duplicatas_arquivo += 1
                    continue
                
                palavras_vistas.add(palavra)
                
                # Processa concordâncias removendo duplicatas
                concordancias_limpas = []
                for c in entrada.get('concordancias', []):
                    ref = c.get('referencia', '').strip()
                    txt = c.get('texto', '').strip()
                    
                    # Verifica se esta concordância já foi vista para esta palavra
                    chave_concordancia = (palavra, ref, txt)
                    if chave_concordancia in concordancias_vistas:
                        print(f"Duplicata de concordância removida: '{palavra}' - {ref} em {arquivo}")
                        duplicatas_arquivo += 1
                        continue
                    
                    concordancias_vistas.add(chave_concordancia)
                    concordancias_limpas.append({
                        'referencia': ref,
                        'texto': txt
                    })
                
                # Processa veja tambem removendo duplicatas
                veja_tambem_original = entrada.get('veja tambem', [])
                veja_tambem_limpo = []
                
                for vt in veja_tambem_original:
                    vt_limpo = vt.lower().strip()
                    if vt_limpo and vt_limpo not in veja_tambem_vistas[palavra]:
                        veja_tambem_vistas[palavra].add(vt_limpo)
                        veja_tambem_limpo.append(vt_limpo)
                
                # Cria entrada limpa
                entrada_limpa = {
                    'palavra': palavra,
                    'veja tambem': veja_tambem_limpo,
                    'ocorrencias': entrada.get('ocorrencias', ''),
                    'fonte': entrada.get('fonte', ''),
                    'concordancias': concordancias_limpas
                }
                
                entradas_limpas.append(entrada_limpa)
            
            # Salva arquivo limpo
            if entradas_limpas:
                data_limpo = {'a': entradas_limpas}
                with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                    json.dump(data_limpo, f, ensure_ascii=False, indent=2)
                
                print(f"Processado {arquivo}: {len(entradas_originais)} -> {len(entradas_limpas)} entradas, {duplicatas_arquivo} duplicatas removidas")
                total_duplicatas_removidas += duplicatas_arquivo
                total_arquivos_processados += 1
            else:
                print(f"Arquivo {arquivo} ficou vazio após remoção de duplicatas")
                
        except Exception as e:
            print(f"Erro ao processar {arquivo}: {e}")
    
    print(f"\nResumo:")
    print(f"Arquivos processados: {total_arquivos_processados}")
    print(f"Total de duplicatas removidas: {total_duplicatas_removidas}")
    print(f"Palavras únicas encontradas: {len(palavras_vistas)}")
    print(f"Concordâncias únicas encontradas: {len(concordancias_vistas)}")

if __name__ == "__main__":
    remover_duplicatas_arquivos_a()