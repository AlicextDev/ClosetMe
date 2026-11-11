# Arquitetura de Software - ClosetMe

O ClosetMe adota uma arquitetura modular que separa claramente rotas, regras de negócio e identidade visual.

---

## 1. Organização das Pastas

* **`src/app/`**: Contém apenas as telas e rotas de navegação do app (Expo Router).
  * `(auth)/`: Telas de login e cadastro.
  * `(app)/(tabs)/`: As 3 abas principais (Guarda-roupa, Looks, Perfil).
  * `garment/`: Telas de cadastro e detalhe da peça.
  * `outfit/`: Telas de look sugerido e looks salvos.

* **`src/features/`**: Contém a lógica de negócio e banco de dados.
  * `auth/`: Serviços de login e contexto de usuário.
  * `wardrobe/`: Cadastro de peças, exclusão e fotos (câmera/galeria).
  * `outfits/`: Algoritmo de combinação e looks salvos.

* **`src/components/ui/`**: Componentes reutilizáveis (botões estilizados, campos de texto).
* **`src/theme/`**: Design Tokens centralizados (todas as cores, fontes, tamanhos e raios).
* **`src/lib/`**: Conexão com o Firebase e armazenamento local (AsyncStorage).
* **`src/types/`**: Definições de tipos do TypeScript (Garment, Outfit, User).
* **`src/constants/`**: Categorias, cores, estilos e regras de recomendação.

---

## 2. Princípios de Desenvolvimento

1. **Telas Finas:** Nenhuma tela acessa o Firebase diretamente. As telas apenas chamam os serviços da pasta `features/`.
2. **Serviços Puros:** Todo o acesso ao Cloud Firestore e Firebase Auth fica isolado em arquivos de serviço, facilitando manutenção e testes.
3. **Design Tokens:** Nenhuma cor ou espaçamento é escrito direto na tela. Tudo vem de `src/theme/`, permitindo trocar ou criar novos temas no futuro com facilidade.
4. **Persistência Segura:** Cada usuário acessa e grava apenas os seus próprios dados em `users/{uid}/garments` e `users/{uid}/outfits`.