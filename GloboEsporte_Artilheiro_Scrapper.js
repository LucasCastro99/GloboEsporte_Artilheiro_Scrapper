const fs = require('fs'); // Biblioteca padrão para arquivos de sistema
const axios = require('axios'); // Biblioteca usada para fazer chamada de API's
const cheerio = require('cheerio'); // Implementação do jQuery que é usado para funções do servidor

// Endereço do site a ser acessado. Essa URL contem uma tabela com os artilheiros da rodada do campeonato
const url = "https://globoesporte.globo.com/rj/futebol/campeonato-carioca/"

// Função responsável por gravar o objeto em um arquivo JSON
function write_json_file(object)
{
    const data = JSON.stringify(object) // Transformação do objeto em texto

    // Biblioteca FS, que fará o resto do serviço, cabendo apenas dar o nome ao arquivo, passar a variável e determinar a função que retorna informações em caso de sucesso e erro
    fs.writeFile("OUTPUT.json", data, function(error)
    {
        if (error === null)
        {
            console.log("O Arquivo Foi Salvo Corretamente!")    
        }
        else
        {
            console.error("Ocorreram Erros ao Salvar o Arquivo: " + error)
        }
    })
}

// Função do AXIOS que será responsável pela requisição dos dados da página em questão
axios(url)
    // Se houver sucesso na requisição de dados...
    .then(function(sucess)
    {
        const html = sucess.data // Captura do HTML
        const processed = cheerio.load(html) // Processamento pela biblioteca Cheerio
        const table = processed(".ranking-item-wrapper") // Instanciando um determinado elemento HTML/DOM para manipulação

        let players = [] // Criação da lista de objetos

        // "Função Loop" que irá processar todos os dados do elemento que condizem com a procura
        table.each(function()
        {
            let name = processed(this).find(".jogador-nome").text() // Nome do jogador
            let position = processed(this).find(".jogador-posicao").text() // Posição do jogador
            let goals = processed(this).find(".jogador-gols").text() // Gols do jogador
            let club = processed(this).find(".jogador-escudo > img").attr("alt") // Time do jogador

            players.push({name, position, goals, club}) // Inserção na lista
        })

        write_json_file(players) // Chamada para escrita da lista de objetos em um arquivo JSON
    })
    // Se houver sucesso na requisição de dados, será mostrado a mensagem de erro no console
    .catch(function(error)
    {
        console.error(error); 
    })