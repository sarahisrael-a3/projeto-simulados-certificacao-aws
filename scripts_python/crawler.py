import requests
from bs4 import BeautifulSoup

def sugar_documentacao(url, arquivo_saida="contexto.txt"):
    print(f"📥 Coletando dados de: {url}")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Remove scripts e estilos
        for script in soup(["script", "style"]):
            script.extract()
            
        texto = soup.get_text(separator=' ', strip=True)
        with open(arquivo_saida, "w", encoding="utf-8") as f:
            f.write(texto)
        print(f"✅ Conteúdo salvo em {arquivo_saida} ({len(texto)} caracteres)")
    else:
        print(f"❌ Erro ao acessar: {response.status_code}")

# sugar_documentacao("https://aws.amazon.com/pt/s3/faqs/")