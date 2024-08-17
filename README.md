# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


- Generalize Types: take in a json File, containing Information about the tables. Pocketbase can read in the same json and generate a migrations for the tables.
- Have real, binding types: Akteure (Name), Orte (Name), Werke (Title proper, Creator, Datum, Ort, Unterscheidende Eigenschaften: JSON), Reihen (Titel), Sammlungen (Titel, Info, Standort), Manifestation-Expression (Werk, Titel, Autor, Sammlung oder eher In Werk?). Gemeinsame Eigenschaften: id, created, updated, Anmerkungen, Anmerkungen Felder (JSON), Bearbeitungsvermerke, Bearbeitungsstand 
- Vl Creator bei Werk algorithmisch bestimmen? In Werke kann quasi durch Auto-Vervollständigung des Titels einiges Auto-ausgefüllt werden.



Einschränkungen:
- Expression zu großen Teil Manifestation
- Nur Bücher
- Keine Ansicht für Werke
- Keine Leseansicht
- Keine Ansicht für Exemplare
- Fest generierte IDs.
