# Glossário de Domínio - ClosetMe

Este documento estabelece a equivalência oficial entre os termos de negócio exibidos na interface em português do Brasil (pt-BR) e os identificadores utilizados no código e no banco de dados em inglês (en-US).

---

## Tabela de Equivalências

| Termo na Interface (pt-BR) | Identificador no Código (en-US) | Tipo / Coleção | Descrição / Contexto |
| :--- | :--- | :--- | :--- |
| **Peça** | `garment` | `Garment` / `users/{uid}/garments` | Item individual cadastrado no guarda-roupa. |
| **Look** | `outfit` | `Outfit` / `users/{uid}/outfits` | Combinação de peças gerada para uma ocasião e estilo. |
| **Guarda-roupa** | `wardrobe` | Rota `(tabs)/wardrobe` | Coleção de peças do usuário. |
| **Ocasião** | `occasion` | `Occasion` | Momento de uso do look (trabalho, passeio, estudo). |
| **Estilo** | `style` | `GarmentStyle` | Identidade visual da peça ou look (casual, elegante, esportivo, minimalista, criativo). |
| **Estação** | `season` | `GarmentSeason` | Clima recomendado (verão, inverno, meia-estação, todo ano). |
| **Categoria** | `category` | `GarmentCategory` | Tipo estrutural (parte de cima, parte de baixo, peça inteira, calçado, acessório). |
| **Cor** | `color` | `GarmentColor` | Cor predominante (preta, branca, cinza, azul, verde, rosa). |
| **Provador Virtual** | *Virtual Fitting* | *Fora do MVP* | Recurso futuro com IA para simulação visual. |

---

## Regras de Nomenclatura no Código
* **Nomes de variáveis, funções, tipos e arquivos:** sempre em inglês (`garmentService`, `useOutfits`, `categoryOrder`).
* **Rótulos, alertas, mensagens de erro e textos da interface:** sempre em português do Brasil ("Minhas peças", "Look sugerido", "Salvar peça").