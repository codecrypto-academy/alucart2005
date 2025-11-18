# FileHashStorage - Sistema de Verificação de Documentos em Blockchain

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglês](https://img.shields.io/badge/Inglês-🇬🇧-blue)](README.md) [![Espanhol](https://img.shields.io/badge/Espanhol-🇪🇸-red)](README.es.md) [![Português](https://img.shields.io/badge/Português-🇵🇹-green)](README.pt.md)

</div>

<p align="center">
  <img src="https://github.com/alucart2005/documentSighHash/blob/main/dapp/public/Capture.jpg?raw=true" alt="FileHashStorage dApp">
</p>

## 📋 Descrição do Projeto

**FileHashStorage** é uma aplicação descentralizada (dApp) completa que permite armazenar e verificar a autenticidade de documentos utilizando a tecnologia blockchain do Ethereum. O sistema combina smart contracts desenvolvidos com Foundry e uma interface web moderna construída com Next.js.

### Qual Problema Resolve?

No mundo atual, verificar a autenticidade de documentos digitais é um desafio constante. Este projeto oferece uma solução blockchain que permite:

- **Imutabilidade**: Uma vez registrado um documento, seu hash não pode ser modificado
- **Rastreabilidade**: Cada documento inclui timestamp e assinatura digital verificável
- **Transparência**: Qualquer pessoa pode verificar a autenticidade de um documento
- **Descentralização**: Não depende de uma autoridade central

### Casos de Uso Reais

1. **Verificação de Títulos Acadêmicos**: Universidades podem registrar os hashes de diplomas para que empregadores verifiquem sua autenticidade
2. **Certificação de Documentos Legais**: Notários podem registrar contratos e documentos legais com timestamp imutável
3. **Proteção de Propriedade Intelectual**: Artistas e criadores podem registrar suas obras para demonstrar autoria
4. **Auditoria de Documentos Corporativos**: Empresas podem manter um registro imutável de documentos importantes
5. **Verificação de Identidade**: Documentos de identidade podem ser verificados sem revelar informações sensíveis

## 🏗️ Arquitetura do Projeto

O projeto está estruturado em dois componentes principais:

```
alucart2005/
├── sc/                    # Smart Contracts (Foundry)
│   ├── src/              # Contratos Solidity
│   ├── test/             # Testes de contratos
│   └── script/           # Scripts de implantação
└── dapp/                  # Aplicação Frontend (Next.js)
    ├── app/              # Páginas e rotas
    ├── components/       # Componentes React
    ├── contexts/         # Contextos de React
    └── lib/              # Utilitários e configuração
```

## 🚀 Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v16 ou superior) - [Baixar Node.js](https://nodejs.org/)
- **Foundry** - Framework para desenvolvimento de smart contracts
- **Git** - Controle de versão
- **Anvil** (incluído com Foundry) - Rede local Ethereum para desenvolvimento

### Instalação do Foundry

Se você ainda não tem o Foundry instalado, execute:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Para Windows (usando Git Bash ou PowerShell):

```bash
# Baixar e instalar de: https://github.com/foundry-rs/foundry/releases
# Ou usar chocolatey:
choco install foundry
```

### Configuração do Projeto

#### 1. Clonar o Repositório

```bash
git clone https://github.com/alucart2005/alucart2005.git
cd alucart2005
```

#### 2. Configurar Smart Contracts

```bash
# Navegar para o diretório de contratos
cd sc

# Instalar dependências (forge-std)
forge install

# Compilar os contratos
forge build

# Executar os testes
forge test
```

#### 3. Configurar a Aplicação Frontend

```bash
# Navegar para o diretório da dApp
cd ../dapp

# Instalar dependências do Node.js
npm install

# Verificar se o Anvil está em execução
npm run check-anvil
```

## ⚙️ Configuração

### Configuração do Ambiente de Desenvolvimento

#### 1. Iniciar Anvil (Rede Local Ethereum)

Em um terminal separado, inicie o Anvil:

```bash
anvil
```

Isso iniciará uma blockchain local em `http://localhost:8545` com 10 contas pré-financiadas para testes.

#### 2. Implantar o Contrato

O contrato é implantado automaticamente quando você inicia a aplicação, mas também pode fazer isso manualmente:

```bash
cd sc
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast
```

#### 3. Configurar o Endereço do Contrato

Após a implantação, copie o endereço do contrato e atualize o arquivo de configuração:

```bash
# Editar dapp/config/contract-config.json
{
  "address": "0xSEU_ENDERECO_DO_CONTRATO_AQUI",
  "chainId": 31337
}
```

### Variáveis de Ambiente (Opcional)

Você pode criar um arquivo `.env.local` no diretório `dapp/` para configurações adicionais:

```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## 💻 Uso

### Iniciar a Aplicação

```bash
# Do diretório dapp/
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Fluxo de Trabalho Básico

1. **Conectar Carteira**: Conecte sua carteira MetaMask ou use uma das contas do Anvil
2. **Enviar Documento**: Selecione um arquivo e calcule seu hash
3. **Assinar e Registrar**: Assine o hash com sua carteira e registre-o na blockchain
4. **Verificar Documento**: Verifique a autenticidade de qualquer documento registrado

## 📚 Exemplos de Uso em Cenários Reais

### Exemplo 1: Registro de um Contrato de Trabalho

**Situação**: Um empregador precisa registrar um contrato de trabalho para demonstrar sua existência em uma data específica.

**Passos**:

1. **Preparar o documento**:

   ```bash
   # O documento "contrato_trabalho_2024.pdf" está pronto para ser registrado
   ```

2. **Da interface web**:

   - Conecte sua carteira (conta do empregador)
   - Envie o arquivo `contrato_trabalho_2024.pdf`
   - O sistema calcula automaticamente o hash SHA-256
   - Assine o hash com sua carteira
   - Confirme a transação para registrar o documento

3. **Verificação posterior**:
   - Qualquer pessoa pode verificar o documento enviando o mesmo arquivo
   - O sistema comparará o hash e mostrará:
     - ✅ Se o documento é autêntico
     - 📅 Data e hora de registro
     - 👤 Endereço da carteira que o registrou

**Benefício**: O empregador tem prova imutável de que o contrato existia em uma data específica, útil em disputas trabalhistas.

### Exemplo 2: Certificação de um Diploma Universitário

**Situação**: Uma universidade quer emitir diplomas verificáveis em blockchain.

**Processo**:

1. **A universidade registra o diploma**:

   ```javascript
   // Hash do diploma: 0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730
   // Timestamp: 1704067200 (1 de janeiro de 2024)
   // Assinatura: Assinatura criptográfica da universidade
   ```

2. **O graduado verifica seu diploma**:

   - O graduado envia seu arquivo PDF do diploma
   - O sistema verifica que o hash coincide
   - Mostra as informações de registro (data, instituição)

3. **Um empregador verifica a autenticidade**:
   - O empregador recebe o diploma do candidato
   - Envia-o ao sistema de verificação
   - Obtém confirmação imediata de autenticidade

**Benefício**: Elimina a necessidade de contatar a universidade para verificar diplomas, economizando tempo e recursos.

### Exemplo 3: Proteção de Propriedade Intelectual

**Situação**: Um fotógrafo quer proteger suas fotografias antes de publicá-las.

**Implementação**:

1. **Registro da obra original**:

   ```bash
   # O fotógrafo registra o hash de "foto_original.jpg"
   # Isso cria um registro imutável de que a foto existia em uma data específica
   ```

2. **Em caso de plágio**:
   - O fotógrafo pode demonstrar que registrou a obra antes
   - O timestamp na blockchain é prova legal de autoria
   - A assinatura criptográfica confirma a identidade do autor

**Benefício**: Prova legal de autoria sem a necessidade de registros caros em escritórios de patentes.

### Exemplo 4: Auditoria de Documentos Corporativos

**Situação**: Uma empresa precisa manter um registro auditado de documentos financeiros.

**Fluxo**:

1. **Registro mensal de demonstrações financeiras**:

   ```javascript
   // Cada mês, o CFO registra:
   // - Balanço patrimonial
   // - Demonstração de resultados
   // - Fluxo de caixa
   ```

2. **Verificação por auditores**:

   - Os auditores podem verificar que os documentos não foram alterados
   - O timestamp garante a sequência temporal
   - A assinatura do CFO é verificável

3. **Conformidade regulatória**:
   - As autoridades podem verificar documentos sem acesso a sistemas internos
   - Transparência sem comprometer a privacidade

**Benefício**: Conformidade regulatória melhorada e processos de auditoria mais eficientes.

### Exemplo 5: Verificação de Documentos de Identidade

**Situação**: Uma instituição precisa verificar documentos de identidade sem armazenar dados pessoais.

**Solução**:

1. **O usuário registra seu documento**:

   - Envia uma cópia de seu documento de identidade
   - O sistema registra apenas o hash (não os dados pessoais)
   - O usuário assina com sua carteira

2. **Verificação pela instituição**:
   - A instituição recebe o documento do usuário
   - Calcula o hash e verifica-o na blockchain
   - Confirma autenticidade sem armazenar dados sensíveis

**Benefício**: Privacidade melhorada (apenas o hash é armazenado) e verificação rápida.

## 🧪 Testes

### Executar Testes de Smart Contracts

```bash
cd sc
forge test
```

### Executar Testes com Verbosidade

```bash
forge test -vvv  # Mostra logs detalhados
```

### Executar um Teste Específico

```bash
forge test --match-test test_StoreDocumentHash
```

## 🔧 Comandos Úteis

### Smart Contracts

```bash
# Compilar contratos
forge build

# Executar testes
forge test

# Implantar em rede local
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast

# Verificar contrato em um explorador de blocos
forge verify-contract <ENDERECO> FileHashStorage --chain-id 1
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar servidor de produção
npm start

# Verificar se o Anvil está em execução
npm run check-anvil

# Implantar contrato manualmente
npm run deploy
```

## 📖 Documentação da API do Contrato

### Funções Principais

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Armazena o hash de um documento com seu timestamp e assinatura.

**Parâmetros**:

- `hash`: Hash do documento (SHA-256, Keccak-256, etc.)
- `timestamp`: Data de registro (Unix timestamp)
- `signature`: Assinatura ECDSA do hash (65 bytes)

**Retorna**: `bool` - `true` se o armazenamento foi bem-sucedido

**Exemplo de uso**:

```solidity
bytes32 docHash = keccak256("meu_documento.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* assinatura do hash */;

fileHashStorage.storeDocumentHash(docHash, timestamp, signature);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifica que uma assinatura corresponde a um documento e signatário específicos.

**Parâmetros**:

- `hash`: Hash do documento a verificar
- `signer`: Endereço do signatário esperado
- `signature`: Assinatura a verificar

**Retorna**: `bool` - `true` se a assinatura é válida

#### `getDocumentInfo(bytes32 hash)`

Obtém todas as informações de um documento registrado.

**Retorna**:

- `bytes32`: Hash do documento
- `uint256`: Timestamp de registro
- `address`: Endereço do signatário
- `bytes`: Assinatura do documento

#### `isDocumentStored(bytes32 hash)`

Verifica se um documento existe no sistema.

**Retorna**: `bool` - `true` se o documento está registrado

### Eventos

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitido quando um documento é registrado com sucesso.

## 🤝 Contribuição

Contribuições são bem-vindas! Este projeto faz parte dos materiais de aprendizado da Codecrypto Academy.

### Como Contribuir

1. **Fazer fork do repositório**

   ```bash
   git clone https://github.com/alucart2005/alucart2005.git
   ```

2. **Criar uma ramificação para sua funcionalidade**

   ```bash
   git checkout -b feature/minha-nova-funcionalidade
   ```

3. **Fazer suas alterações**

   - Siga as melhores práticas do Solidity
   - Escreva testes para novas funcionalidades
   - Atualize a documentação

4. **Executar os testes**

   ```bash
   cd sc && forge test
   cd ../dapp && npm run lint
   ```

5. **Fazer commit de suas alterações**

   ```bash
   git commit -m "feat: adicionar nova funcionalidade de verificação"
   ```

6. **Enviar para sua ramificação**

   ```bash
   git push origin feature/minha-nova-funcionalidade
   ```

7. **Abrir um Pull Request**

### Diretrizes de Desenvolvimento

- **Solidity**: Siga as [melhores práticas do Solidity](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Testes**: Escreva testes abrangentes para todas as novas funcionalidades
- **Documentação**: Atualize a documentação para quaisquer alterações na API
- **Código Limpo**: Mantenha o código legível e bem comentado

### Estrutura de Commits

Use mensagens de commit descritivas seguindo o formato:

```
tipo: descrição breve

Descrição detalhada (opcional)
```

Tipos comuns:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `test`: Adicionar ou modificar testes
- `refactor`: Refatoração de código

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Documentação do Foundry](https://book.getfoundry.sh/)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Solidity](https://docs.soliditylang.org/)
- [Recursos para Desenvolvedores Ethereum](https://ethereum.org/developers/)

## 📞 Contato

- **GitHub**: [@alucart2005](https://github.com/alucart2005)
- **Projeto**: Parte da Codecrypto Academy

## 🙏 Agradecimentos

Este projeto utiliza as seguintes tecnologias e ferramentas:

- [Foundry](https://github.com/foundry-rs/foundry) - Framework de desenvolvimento de smart contracts
- [Next.js](https://nextjs.org/) - Framework React para produção
- [Ethers.js](https://ethers.org/) - Biblioteca para interagir com Ethereum
- [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil) - Cliente Ethereum para desenvolvimento local

---

**Nota**: Este projeto foi projetado para fins educacionais e de prática. Para uso em produção, certifique-se de realizar auditorias de segurança completas e considerar as implicações legais e regulatórias.
