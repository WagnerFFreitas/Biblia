// script/config_dicionarioeconcordancia.js

export const bibliaConfig = {
    ordemLivros: [
        "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
        "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis",
        "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó",
        "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias",
        "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias",
        "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias",
        "Malaquias", "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos",
        "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses",
        "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo",
        "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro",
        "2 Pedro", "1 João", "2 João", "3 João", "Judas", "Apocalipse"
    ],
    detalhesLivros: {
        "Gênesis": { testamento: "Antigo Testamento" },
        "Êxodo": { testamento: "Antigo Testamento" },
        "Levítico": { testamento: "Antigo Testamento" },
        "Números": { testamento: "Antigo Testamento" },
        "Deuteronômio": { testamento: "Antigo Testamento" },
        "Josué": { testamento: "Antigo Testamento" },
        "Juízes": { testamento: "Antigo Testamento" },
        "Rute": { testamento: "Antigo Testamento" },
        "1 Samuel": { testamento: "Antigo Testamento" },
        "2 Samuel": { testamento: "Antigo Testamento" },
        "1 Reis": { testamento: "Antigo Testamento" },
        "2 Reis": { testamento: "Antigo Testamento" },
        "1 Crônicas": { testamento: "Antigo Testamento" },
        "2 Crônicas": { testamento: "Antigo Testamento" },
        "Esdras": { testamento: "Antigo Testamento" },
        "Neemias": { testamento: "Antigo Testamento" },
        "Ester": { testamento: "Antigo Testamento" },
        "Jó": { testamento: "Antigo Testamento" },
        "Salmos": { testamento: "Antigo Testamento" },
        "Provérbios": { testamento: "Antigo Testamento" },
        "Eclesiastes": { testamento: "Antigo Testamento" },
        "Cantares": { testamento: "Antigo Testamento" },
        "Isaías": { testamento: "Antigo Testamento" },
        "Jeremias": { testamento: "Antigo Testamento" },
        "Lamentações": { testamento: "Antigo Testamento" },
        "Ezequiel": { testamento: "Antigo Testamento" },
        "Daniel": { testamento: "Antigo Testamento" },
        "Oséias": { testamento: "Antigo Testamento" },
        "Joel": { testamento: "Antigo Testamento" },
        "Amós": { testamento: "Antigo Testamento" },
        "Obadias": { testamento: "Antigo Testamento" },
        "Jonas": { testamento: "Antigo Testamento" },
        "Miquéias": { testamento: "Antigo Testamento" },
        "Naum": { testamento: "Antigo Testamento" },
        "Habacuque": { testamento: "Antigo Testamento" },
        "Sofonias": { testamento: "Antigo Testamento" },
        "Ageu": { testamento: "Antigo Testamento" },
        "Zacarias": { testamento: "Antigo Testamento" },
        "Malaquias": { testamento: "Antigo Testamento" },
        "Mateus": { testamento: "Novo Testamento" },
        "Marcos": { testamento: "Novo Testamento" },
        "Lucas": { testamento: "Novo Testamento" },
        "João": { testamento: "Novo Testamento" },
        "Atos": { testamento: "Novo Testamento" },
        "Romanos": { testamento: "Novo Testamento" },
        "1 Coríntios": { testamento: "Novo Testamento" },
        "2 Coríntios": { testamento: "Novo Testamento" },
        "Gálatas": { testamento: "Novo Testamento" },
        "Efésios": { testamento: "Novo Testamento" },
        "Filipenses": { testamento: "Novo Testamento" },
        "Colossenses": { testamento: "Novo Testamento" },
        "1 Tessalonicenses": { testamento: "Novo Testamento" },
        "2 Tessalonicenses": { testamento: "Novo Testamento" },
        "1 Timóteo": { testamento: "Novo Testamento" },
        "2 Timóteo": { testamento: "Novo Testamento" },
        "Tito": { testamento: "Novo Testamento" },
        "Filemom": { testamento: "Novo Testamento" },
        "Hebreus": { testamento: "Novo Testamento" },
        "Tiago": { testamento: "Novo Testamento" },
        "1 Pedro": { testamento: "Novo Testamento" },
        "2 Pedro": { testamento: "Novo Testamento" },
        "1 João": { testamento: "Novo Testamento" },
        "2 João": { testamento: "Novo Testamento" },
        "3 João": { testamento: "Novo Testamento" },
        "Judas": { testamento: "Novo Testamento" },
        "Apocalipse": { testamento: "Novo Testamento" }
    },
    getNomesLivrosOrdenados() {
        return this.ordemLivros;
    },
    getNomesLivrosPorTestamento(testamentoFiltro) {
        if (testamentoFiltro === "todos") return this.getNomesLivrosOrdenados();
        return this.getNomesLivrosOrdenados().filter(livro => {
            const detalhes = this.detalhesLivros[livro];
            return detalhes && detalhes.testamento === testamentoFiltro;
        });
    },
    getTestamentoDoLivro(nomeLivroReferencia) {
        const nomeNormalizado = this.normalizarNomeLivro(nomeLivroReferencia);
        const detalhes = this.detalhesLivros[nomeNormalizado];
        return detalhes ? detalhes.testamento : null;
    },
    normalizarNomeLivro(nome) {
        if (!nome) return null;
        if (nome.toLowerCase().startsWith("cântico")) return "Cantares";
        if (nome.toLowerCase().startsWith("1 ") || nome.toLowerCase().startsWith("2 ") || 
            nome.toLowerCase().startsWith("3 ")) {
            return nome;
        }
        return nome.split(' ')[0];
    }
};