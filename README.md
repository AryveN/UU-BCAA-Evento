# Evento 

## Technologie

* Node.js
* Express.js
* MongoDB (Mongoose)
* Ajv + ajv-formats (validace JSON schémat)
* Jest + Supertest + mongodb-memory-server (testy)

## Instalace

1. Klon repo a přejdi do složky projektu:

   ```bash
   git clone <repo-url>
   cd UU-BCAA-Evento
   ```
2. Nainstaluj závislosti:

   ```bash
   npm install
   ```
3. Vytvoř soubor `.env` podle `.env.example` a uprav hodnoty:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/evento
   ```

## Skripty v `package.json`

| Skript        | Popis                                       |
| ------------- | ------------------------------------------- |
| `npm run dev` | Spustí server s hot-reloadem (`nodemon`).   |
| `npm start`   | Spustí server jednorázově (`node`).         |
| `npm test`    | Spustí integrační testy (Jest + Supertest). |

## Spuštění serveru

```bash
npm run dev
```

Server naslouchá na `http://localhost:3000`.

## API Reference

Předpony endpointů:

* Události: `/api/event`
* Výdaje:    `/api/expense`

### Event

| Endpoint                     | Popis                                      |
| ---------------------------- | ------------------------------------------ |
| **POST** `/event/create`     | Vytvoření nové události.                   |
| **POST** `/event/get`        | Získání detailu události podle `id`.       |
| **POST** `/event/list`       | Seznam událostí s volitelným filtrem data. |
| **PUT**  `/event/update`     | Aktualizace existující události.           |
| **DELETE** `/event/remove`   | Smazání události (včetně výdajů).          |
| **POST** `/event/addGuest`   | Přidání e-mailu hosta k události.          |
| **POST** `/event/listGuests` | Seznam hostů a jejich RSVP statusů.        |

#### Příklad `curl`

```bash
curl -X POST http://localhost:3000/api/event/create \
  -H "Content-Type: application/json" \
  -d '{
        "name":"Oslava",
        "date":"2025-06-20T18:00:00Z",
        "location":"Praha",
        "description":"Firemní večírek",
        "budget":5000
      }'
```

---

### Expense

| Endpoint                     | Popis                              |
| ---------------------------- | ---------------------------------- |
| **POST**   `/expense/create` | Přidání nového výdaje k události.  |
| **POST**   `/expense/get`    | Získání detailu výdaje podle `id`. |
| **POST**   `/expense/list`   | Seznam výdajů pro zadanou událost. |
| **PUT**    `/expense/update` | Aktualizace existujícího výdaje.   |
| **DELETE** `/expense/remove` | Smazání výdaje podle `id`.         |

#### Příklad `curl`

```bash
curl -X POST http://localhost:3000/api/expense/create \
  -H "Content-Type: application/json" \
  -d '{
        "eventId":"<EVENT_ID>",
        "title":"Catering",
        "amount":2500,
        "date":"2025-05-01T12:00:00Z"
      }'
```

---

## Validace DTO

Používáme middleware `validate` s Ajv podle JSON schémat v `src/schemas/`:

* `event.schema.js`
* `expense.schema.js`

## Testování

Spusť integrační testy:

```bash
npm test
```

Test suite pokrývá CRUD operace pro `event` i `expense`.

---