# Sistema de Convites de Formatura - CTBJ

Sistema simples para verificação e emissão de convites de formatura do Colégio Técnico de Bom Jesus - UFPI.

## Arquivos do Projeto

- `index.html` - Página principal
- `style.css` - Estilos
- `script.js` - Lógica da aplicação
- `convidados.js` - Dados dos convidados

## Como Publicar no Netlify

### Opção 1: Arrastar e Soltar (Mais Fácil)

1. Acesse [netlify.com](https://www.netlify.com/)
2. Faça login ou crie uma conta gratuita
3. Na dashboard, arraste a pasta `static-site` para a área "Drag and drop your site folder here"
4. Pronto! Seu site estará no ar em segundos

### Opção 2: Deploy via GitHub

1. Crie um repositório no GitHub
2. Faça upload dos 4 arquivos para o repositório
3. Acesse [netlify.com](https://www.netlify.com/)
4. Clique em "Add new site" > "Import an existing project"
5. Escolha GitHub e selecione seu repositório
6. Deixe as configurações padrão e clique em "Deploy"

## Como Publicar no GitHub Pages

1. Crie um repositório no GitHub chamado `seu-usuario.github.io`
2. Faça upload dos 4 arquivos para o repositório
3. Vá em Settings > Pages
4. Em "Source", selecione "main branch"
5. Clique em "Save"
6. Seu site estará disponível em `https://seu-usuario.github.io`

## Personalizações

### Adicionar Novos Convidados

Edite o arquivo `convidados.js` e adicione novos objetos no array:

```javascript
{
    nome: "Nome Completo",
    telefone: "(00) 00000-0000",
    tipo: "convidado", // convidado, padrinho, madrinha, paraninfo, homenageado, familiar
    aluno_responsavel: "Nome do Aluno"
}
```

### Alterar Cores

Edite o arquivo `style.css` e procure pelas cores:
- Azul escuro: `#013A89`
- Azul médio: `#4E6BD0`
- Rosa: `#EE74D4` e `#D428C0`

### Trocar Logo

Substitua a URL da logo nos arquivos `index.html` e `script.js`:
```
https://customer-assets.emergentagent.com/job_ccc59e95-7fd4-48e3-a746-8b1aa59da1db/artifacts/qf1bp2ln_1762870726512.png
```

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- jsPDF (para geração de PDFs)

## Suporte

Desenvolvido por Jamison Gabriel
Instagram: [@jotta.sx_](https://www.instagram.com/jotta.sx_)
