# Desafio Técnico — Desenvolvedor Front-end (STi3)

Bem-vindo ao desafio técnico para a vaga de Desenvolvedor Front-end na STi3.
Este repositório contém todas as instruções necessárias para a realização do teste.

## **O que será avaliado:**

- Reproduzir com precisão o layout proposto no Figma (atenção a cores, espaçamentos, tipografia e componentes).
- Identificar e corrigir problemas de lógica presentes no código.
- Consumir corretamente uma API REST mockada, aplicando boas práticas.
- Estruturar um projeto React de forma organizada, seguindo boas práticas de arquitetura.
- Utilizar o GitHub para versionamento, histórico de desenvolvimento e organização do projeto.

## **Descrição do desafio**

Este repositório já contém um projeto base configurado com:

- React + Vite
- Chakra UI
- Linting e formatação
- API mockada utilizando MSW

O objetivo é ajustar, completar e implementar todas as telas seguindo exatamente:

- O layout do Figma
- O comportamento da versão publicada

## **Figma**

[Ver Layout do Figma](https://www.figma.com/design/oYZ5V0WLAHFD7NEfIkSPky/Desafio-T%C3%A9cnico-STi3--Front-end-?node-id=0-1&t=VijYQPESM9LTm7Pd-1)

## **Versão publicada**

[Ver desafio completo publicado](https://front-sti3.vercel.app/)
Use-a como referência de funcionalidades esperadas.

## **Como rodar**

1. Instale dependências:
   ```bash
   npm install
   ```
2. Suba o projeto:
   ```bash
   npm run dev
   ```
3. Abra o navegador no endereço indicado pelo Vite.

> Dica: o toggle “Mocks API” no rodapé da sidebar liga/desliga a API mockada, caso estiver ocorrendo problemas relacionados a API você pode tentar desligar e ligar ela novamente.

## **API mockada (MSW)**

A aplicação usa MSW (Mock Service Worker) para simular uma API real. Cada requisição possui ~250ms de latência simulada e pode ser consumida como se fosse uma API real

### Endpoints

**Produtos**

- `GET /api/produtos` → lista todos os produtos
- `GET /api/produtos/:id` → obter um produto por id (GUID)
- `POST /api/produtos` → cria um produto
  - body: `{ nome: string, descricao?: string, preco: number, estoque?: number }`
- `PUT/PATCH /api/produtos/:id` → atualiza produto
- `DELETE /api/produtos/:id` → remove produto

**Clientes**

- `GET /api/clientes` → lista clientes
- `GET /api/clientes/:id` → obter um cliente por id (GUID)
- `POST /api/clientes` → cria um cliente
  - body: `{ nome: string, email: string, telefone?: string }`
- `PUT /api/clientes/:id` → altera um cliente
- `DELETE /api/clientes/:id` → remove cliente

## **Requisitos obrigatórios**

Seu projeto deve ficar:

- **Visualmente idêntico** ao design do Figma
- **Funcionalmente equivalente** ao projeto publicado

### Funcionalidades obrigatórias

#### **Clientes**

- Criar, editar e excluir clientes.
- Filtrar clientes pelo nome.
- Exibir visualmente quando um cliente não possuir telefone.

#### **Produtos**

- Criar, editar e excluir produtos.
- Filtrar produtos pelo nome.
- Exibir aviso visual quando o produto não tiver estoque.
- Ajustar os totalizadores na listagem.

---

## **Funcionalidades diferenciais (opcionais)**

As funcionalidades a seguir não são obrigatórias, mas serão consideradas como um
diferencial na avaliação do teste técnico.

- Versão responsiva das telas.
- Deploy em Vercel ou outro provedor.
- Separação de lógica e view usando hooks.
- Organização do Git:
  - Commits claros
  - Branches organizadas
  - README bem estruturado
- Implementação das telas de **Pedidos** seguindo o padrão das demais telas.

---

## **Entrega**

Você deve entregar:

- Código completo da aplicação.
- `README.md` contendo:
  - Instruções de execução
  - Dependências
  - Exemplos de uso
  - Informações relevantes

- Prints ou vídeos da aplicação rodando, caso não faça deploy.

---

## **Como entregar**

1. Clone este repositório como **privado** em sua conta.
2. Adicione como colaborador:

```
william.angelis@sti3.com.br
```

3. Desenvolva a solução até a data combinada para entrega.

---

## **Observações finais**

- Você tem liberdade para organizar o projeto como achar melhor.

- Funcionalidades extras são bem-vindas.

- Não buscamos perfeição, mas sim:
  - Clareza
  - Organização
  - Lógica de desenvolvimento
  - Proatividade

- Em caso de dúvidas:

  **✉️ [william.angelis@sti3.com.br](mailto:william.angelis@sti3.com.br)**

- **Importante:** Não é permitido copiar projetos prontos da internet (sim, verificamos).

---

## **Boa sorte!**

Estamos ansiosos para ver o seu trabalho!
