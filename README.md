# Golsf - Jogo de Golfe 2D

Bem-vindo ao **Golsf - 2D Golf Game**! Este é um jogo de golfe interativo desenvolvido em **HTML**, **CSS** e **JavaScript**, utilizando conceitos de **Programação Orientada a Objetos (POO) na linguagem Javascript**. O objetivo do jogo é proporcionar uma experiência divertida e desafiadora para os amantes de golfe e Jogos em 2d.

## Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina de Programação Orientada a Objetos na faculdade de Engenharia de Computação. Ele visa aplicar os conceitos aprendidos em sala de aula em um projeto prático e divertido. O jogo permite que os jogadores escolham um nickname e joguem em diferentes níveis, com um sistema de pontuação que registra o desempenho.

### Como Foi Feito

O Golsf foi construído utilizando as seguintes tecnologias:

- **HTML**: Para a estrutura básica do jogo e a interface do usuário.
- **CSS**: Para estilização e layout, proporcionando uma experiência visual agradável.
- **JavaScript**: Para a lógica do jogo e interatividade, implementando POO para organizar o código e facilitar a manutenção.
- **MySQL**: Para o armazenamento de dados, como pontuações e nicknames dos jogadores, acessado através do MySQL Workbench.
- **Node.js**: Para criar um servidor que gerencia as requisições e interações com o banco de dados.

### Necessidade de Rodar o Servidor

Para que o sistema de pontuação funcione corretamente, é necessário que o servidor Node.js esteja em execução. Para isso, siga os passos abaixo:

1. **Instale o Node.js LTS** em sua máquina. O Node.js está disponível para Windows, macOS e Linux. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).
2. **Acesse a pasta `public`** do projeto.
3. **Execute o servidor** com o comando no terminal:
   ```bash
   node server.js
   ```

Isso permitirá que o jogo se conecte ao banco de dados e registre as pontuações dos jogadores.

## Funcionalidades

- **Interface Interativa**: Uma interface amigável que permite aos jogadores interagir facilmente com o jogo.
- **Múltiplos Níveis**: Desafios em diferentes níveis de dificuldade, cada um com seus próprios obstáculos e características.
- **Sistema de Pontuação**: Acompanhe seu desempenho com um sistema de pontuação que registra o número de tacadas.
- **Animações e Efeitos Visuais**: Animações suaves que tornam o jogo mais envolvente.

## Tecnologias Utilizadas

- **HTML**: Estrutura básica do jogo.
- **CSS**: Estilização e layout do jogo.
- **JavaScript**: Lógica do jogo e interatividade, implementando POO para organizar o código.
- **MySQL**: Banco de dados para armazenar informações dos jogadores.
- **Node.js**: Servidor para gerenciar requisições e interações com o banco de dados.
- **Vercel**: Plataforma para implantar e hospedar o aplicativo web.
- **Git**: Sistema de controle de versão utilizado para gerenciar o código-fonte.

## Como Jogar

1. Clone o repositório:
   ```bash
   git clone https://github.com/abrahao-dev/golsf-2d-game
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd golf-game
   ```
3. Abra o site em seu navegador:
   - Acesse `https://golsf-2d-game.vercel.app/src/components/login.html` diretamente.
   - Ou, se preferir, instale o Vercel e execute o comando `vercel dev` para rodar o projeto localmente.

## Estrutura do Projeto

- **public/**: Contém todos os arquivos públicos, incluindo HTML, CSS, JavaScript e imagens.
- **src/**: Contém os componentes do jogo, como a lógica e a interface.
- **database/**: Contém o esquema do banco de dados e scripts relacionados.
- **server.js**: O arquivo principal do servidor Node.js.

## Futuros Updates

- **Novos Níveis**: Adicionar mais níveis e desafios para aumentar a complexidade do jogo.
- **Melhorias na UI**: Atualizar a interface do usuário para torná-la mais intuitiva e atraente.
- **Multiplayer**: Implementar um modo multiplayer para que os jogadores possam competir entre si.
- **Feedback do Usuário**: Coletar feedback dos jogadores para melhorias contínuas.