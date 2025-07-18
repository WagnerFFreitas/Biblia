import json
import os
from collections import defaultdict

def reorganizar_arquivos_a_numerados():
    """
    Reorganiza arquivos da letra 'a' em a1.json, a2.json, etc.
    com máximo 100 referências por arquivo.
    """
    
    pasta_origem = "concordancia/1/divisao"
    arquivo_principal = "concordancia/a.json"
    pasta_destino = "concordancia/fusao"
    
    # Cria a pasta de destino se não existir
    os.makedirs(pasta_destino, exist_ok=True)
    
    # Coleta todas as entradas
    todas_entradas = []
    palavras_unicas = set()
    referencias_unicas = set()
    
    # 1. Lê arquivos da pasta divisao
    for filename in os.listdir(pasta_origem):
        if filename.startswith('a') and filename.endswith('.json'):
            arquivo_path = os.path.join(pasta_origem, filename)
            try:
                with open(arquivo_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Processa entradas (assume que a chave é 'a' ou 'A')
                chave = 'a' if 'a' in data else 'A' if 'A' in data else None
                if chave and data[chave]:
                    for entrada in data[chave]:
                        palavra = entrada.get('palavra', '').lower()
                        
                        # Remove duplicatas de palavras
                        if palavra not in palavras_unicas:
                            palavras_unicas.add(palavra)
                            
                            # Remove duplicatas de concordâncias
                            concordancias_unicas = []
                            for conc in entrada.get('concordancias', []):
                                ref = conc.get('referencia', '')
                                texto = conc.get('texto', '')
                                chave_conc = f"{ref}|{texto}"
                                
                                if chave_conc not in referencias_unicas:
                                    referencias_unicas.add(chave_conc)
                                    concordancias_unicas.append(conc)
                            
                            # Cria entrada limpa
                            entrada_limpa = {
                                'palavra': palavra,
                                'veja tambem': entrada.get('veja tambem', []),
                                'ocorrencias': len(concordancias_unicas),
                                'fonte': entrada.get('fonte', ''),
                                'concordancias': concordancias_unicas
                            }
                            todas_entradas.append(entrada_limpa)
                            
            except Exception as e:
                print(f"Erro ao processar {filename}: {e}")
    
    # 2. Lê arquivo principal
    try:
        with open(arquivo_principal, 'r', encoding='utf-8') as f:
            data_principal = json.load(f)
            
        if 'a' in data_principal and data_principal['a']:
            for entrada in data_principal['a']:
                palavra = entrada.get('palavra', '').lower()
                
                if palavra not in palavras_unicas:
                    palavras_unicas.add(palavra)
                    
                    # Remove duplicatas de concordâncias
                    concordancias_unicas = []
                    for conc in entrada.get('concordancias', []):
                        ref = conc.get('referencia', '')
                        texto = conc.get('texto', '')
                        chave_conc = f"{ref}|{texto}"
                        
                        if chave_conc not in referencias_unicas:
                            referencias_unicas.add(chave_conc)
                            concordancias_unicas.append(conc)
                    
                    entrada_limpa = {
                        'palavra': palavra,
                        'veja tambem': entrada.get('veja tambem', []),
                        'ocorrencias': len(concordancias_unicas),
                        'fonte': entrada.get('fonte', ''),
                        'concordancias': concordancias_unicas
                    }
                    todas_entradas.append(entrada_limpa)
                    
    except Exception as e:
        print(f"Erro ao processar arquivo principal: {e}")
    
    # 3. Distribui em arquivos numerados
    arquivo_atual = 1
    entradas_arquivo = []
    total_referencias = 0
    
    for entrada in todas_entradas:
        num_referencias = len(entrada.get('concordancias', []))
        
        # Se adicionar esta entrada ultrapassaria 100 referências, salva arquivo atual
        if total_referencias + num_referencias > 100 and entradas_arquivo:
            # Salva arquivo atual
            nome_arquivo = f"a{arquivo_atual}.json"
            caminho_arquivo = os.path.join(pasta_destino, nome_arquivo)
            
            with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                json.dump({'a': entradas_arquivo}, f, ensure_ascii=False, indent=2)
            
            print(f"Salvo {nome_arquivo} com {len(entradas_arquivo)} palavras e {total_referencias} referências")
            
            # Inicia novo arquivo
            arquivo_atual += 1
            entradas_arquivo = []
            total_referencias = 0
        
        # Adiciona entrada ao arquivo atual
        entradas_arquivo.append(entrada)
        total_referencias += num_referencias
    
    # Salva último arquivo se houver entradas
    if entradas_arquivo:
        nome_arquivo = f"a{arquivo_atual}.json"
        caminho_arquivo = os.path.join(pasta_destino, nome_arquivo)
        
        with open(caminho_arquivo, 'w', encoding='utf-8') as f:
            json.dump({'a': entradas_arquivo}, f, ensure_ascii=False, indent=2)
        
        print(f"Salvo {nome_arquivo} com {len(entradas_arquivo)} palavras e {total_referencias} referências")
    
    print(f"\nTotal: {len(todas_entradas)} palavras únicas, {len(referencias_unicas)} referências únicas")
    print(f"Arquivos criados: a1.json até a{arquivo_atual}.json")

# Executa a reorganização
if __name__ == "__main__":
    reorganizar_arquivos_a_numerados()