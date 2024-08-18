import type { ColumnType, SchemaType } from "./types"

// GND might be a field in the table but we're not using it yet since
// it requires impelmentation using the DNB API.
export const personenColumns: ColumnType[] = [
    {
        Name: "ID",
        DefaultVisible: false,
        OnlyExplicitlySearchable: true,
        NameVisible: true,
        Icon: "id",
        Fields: [
            {
                Field: "id",
                Type: "id",
            }
        ]
    },
    {
        Name: "Name",
        Searchable: false,
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Name",
                Name: "Name",
                Type: "text",
            },
            {
                Field: "Koerperschaft",
                Name: "Körperschaft",
                Text: "ORG",
                Type: "bool",
            }
        ]
    },
    {
        Name: "Pseudonyme",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Pseudonyme",
                Type: "text",
            }
        ]
    },
    {
        Name: "Lebensdaten",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Lebensdaten",
                Type: "text",
            }
        ]
    },
    {
        Name: "Beruf",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Beruf",
                Type: "text",
            }
        ]
    },
    {
        Name: "Nachweis",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Nachweis",
                Type: "text",
            }
        ]
    },
    {
        Name: "Anmerkungen",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "HTML",
        Fields: [
            {
                Field: "Anmerkungen",
                Type: "HTML",
            }
        ]
    },
    {
        Name: "Erstellt",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "created",
                Type: "date",
            }
        ]
    },
    {
        Name: "Bearbeitet",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "updated",
                Type: "date",
            }
        ]
    },
]

export const personenSchema: SchemaType = {
    Name: "Personen & Körperschaften",
    TableName: "Akteure",
    DefaultSort: ["Name"],
    Columns: personenColumns,
    MiniColumns: ["Name", "Lebensdaten", "Nachweis"],
    OptionalBackRelations: [
        { Table: "Inhalte", Fields: ["Geschaffen", "Geschrieben", "Gezeichnet", "Gestochen"] },
        { Table: "Baende", Fields: ["Herausgabe", "Verlag", "Druck", "Vertrieb"] },
    ],
}


// TODO: add indirect and otherwise searchable fields to schema
export const inhalteColumns: ColumnType[] = [
    {
        Name: "ID",
        DefaultVisible: false,
        NameVisible: true,
        OnlyExplicitlySearchable: true,
        Icon: "id",
        Fields: [
            {
                Field: "id",
                Type: "id",
            }
        ]
    },
    {
        Name: "Band",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Band",
        Fields: [
            {
                Field: "Band.Kurztitel",
                Type: "singlerelation",
            },
            {
                Field: "Band.id",
                Type: "searchonly",
            }
        ]
    },
    {
        Name: "Nummer",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "number",
        Fields: [
            {
                Field: "Objektnummer",
                Type: "number"
            }
        ]
    },
    {
        Name: "Typ",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "text",
        Fields: [
            {
                Field: "Typ",
                Type: "multiselect",
            }
        ]
    },
    {
        Name: "Seite",
        Searchable: false,
        DefaultVisible: true,
        NameVisible: true,
        Icon: "text",
        Fields: [
            {
                Field: "Seite",
                Type: "text",
            },
            {
                Field: "Paginierung",
                Type: "singleselect",
            }
        ]
    },
    {
        Name: "Titelangabe",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "text",
        Fields: [
            {
                Field: "Titelangabe",
                Type: "text",
            }
        ]
    },
    {
        Name: "Incipit",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "text",
        Fields: [
            {
                Field: "Incipit",
                Type: "text",
            }
        ]
    },
    {
        Name: "Urheberangabe",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "text",
        Fields: [
            {
                Field: "Urheberangabe",
                Type: "text",
            }
        ]
    },
    {
        Name: "Scans",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "files",
        Fields: [
            {
                Field: "Scans",
                Type: "image",
            }
        ]
    },
    {
        Name: "Personen",
        Searchable: false,
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Person",
        Fields: [
            {
                Field: "Geschaffen.Name,Geschaffen.Lebensdaten",
                Name: "Geschaffen",
                Type: "multirelation",
                Text: "Geschaffen"
            },
            {
                Field: "Geschaffen.id",
                Type: "searchonly",
            },
            {
                Field: "Geschrieben.Name,Geschrieben.Lebensdaten",
                Name: "Geschrieben",
                Type: "multirelation",
                Text: "Geschrieben"
            },
            {
                Field: "Geschrieben.id",
                Type: "searchonly",
            },
            {
                Field: "Gezeichnet.Name,Gezeichnet.Lebensdaten",
                Name: "Gezeichnet",
                Type: "multirelation",
                Text: "Gezeichnet"
            },
            {
                Field: "Gezeichnet.id",
                Type: "searchonly",
            },
            {
                Field: "Gestochen.Name,Gestochen.Lebensdaten",
                Name: "Gestochen",
                Type: "multirelation",
                Text: "Gestochen"
            },
            {
                Field: "Gestochen.id",
                Type: "searchonly",
            }
        ]
    },
    {
        Name: "Anmerkungen",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "HTML",
        Fields: [
            {
                Field: "Anmerkungen",
                Type: "HTML",
            }
        ]
    },
    {
        Name: "Erstellt",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "created",
                Type: "date",
            }
        ]
    },
    {
        Name: "Bearbeitet",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "updated",
                Type: "date",
            }
        ]
    },
]

export const inhalteSchema: SchemaType = {
    Name: "Inhalte",
    TableName: "Inhalte",
    DefaultSort: ["Band.Kurztitel", "Objektnummer"],
    Columns: inhalteColumns,
    DefaultExpand: ["Band", "Geschaffen", "Geschrieben", "Gezeichnet", "Gestochen"],
    MiniColumns: ["Band", "Nummer", "Seite", "Typ", "Scans"],
}

export const baendeColumns: ColumnType[] = [
    {
        Name: "ID",
        DefaultVisible: false,
        OnlyExplicitlySearchable: true,
        NameVisible: true,
        Icon: "id",
        Fields: [
            {
                Field: "id",
                Type: "id",
            }
        ]
    },
    {
        Name: "Gesichtet",
        DefaultVisible: true,
        NameVisible: false,
        Icon: "gesichtet",
        Fields: [
            {
                Field: "Gesichtet",
                Type: "bool",
                Icon: "gesichtet",
            }
        ]
    },
    {
        Name: "Vollständig erfasst",
        ShortName: "Erfasst",
        DefaultVisible: true,
        NameVisible: false,
        Icon: "erfasst",
        Fields: [
            {
                Field: "Erfasst",
                Type: "bool",
                Icon: "erfasst",
            }
        ]
    },
    {
        Name: "Kurztitel",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Kurztitel",
                Type: "text",
            }
        ]
    },
    {
        Name: "Bev. Reihentitel",
        ShortName: "Reihentitel",
        Tooltip: "Bevorzugter Reihentitel",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Reihe",
        Fields: [
            {
                Field: "Bevorzugter_Reihentitel.Titel",
                Type: "singlerelation",
            },
            {
                Field: "Bevorzugter_Reihentitel.id",
                Type: "searchonly",
            }
        ]
    },
    {
        Name: "Jahr",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "number",
        Fields: [
            {
                Field: "Jahr",
                Type: "number",
                NotText: "o.J."
            }
        ]
    },
    {
        Name: "Ausgabe",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Ausgabebezeichnung",
                Type: "text",
            }
        ]
    },
    {
        Name: "Titelangabe",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Titelangabe",
                Type: "text",
            }
        ]
    },
    {
        Name: "Herausgeberangabe",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Verantwortlichkeitsangabe",
                Type: "text",
            }
        ]
    },
    {
        Name: "Ort",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Ortsangabe",
                Type: "text",
            }
        ]
    },
    {
        Name: "Andere Reihentitel",
        DefaultVisible: true,
        Searchable: false,
        NameVisible: true,
        Icon: "Reihe",
        Fields: [
            {
                Field: "Alternativer_Reihentitel.Titel",
                Name: "Alternativer Reihentitel",
                Text: "Alt.",
                Tooltip: "Alternativer Reihentitel",
                Type: "multirelation",
            },
            {
                Field: "Alternativer_Reihentitel.id",
                Type: "searchonly",
            },
            {
                Field: "Franzoesischer_Reihentitel.Titel",
                Name: "Französischer Reihentitel",
                Text: "Frz.",
                Tooltip: "Französischer Reihentitel",
                Type: "singlerelation",
            },
            {
                Field: "Franzoesischer_Reihentitel.id",
                Type: "searchonly",
            },
            {
                Field: "Deutscher_Reihentitel.Titel",
                Name: "Deutscher Reihentitel",
                Text: "Dt.",
                Tooltip: "Deutscher Reihentitel",
                Type: "singlerelation",
            },
            {
                Field: "Deutscher_Reihentitel.id",
                Type: "searchonly",
            },
            {
                Field: "Alternatives_Titelblatt.Titel",
                Name: "Alternatives Titelblatt",
                Text: "Anderes Titelblatt",
                Tooltip: "Alternatives Titelblatt",
                Type: "multirelation",
            },
            {
                Field: "Alternatives_Titelblatt.id",
                Type: "searchonly",
            },
            {
                Field: "TA_von.Titel",
                Name: "TA von",
                Text: "TA von",
                Tooltip: "Titelauflage von",
                Type: "multirelation",
            },
            {
                Field: "TA_von.id",
                Type: "searchonly",
            },
            {
                Field: "hat_TA.Titel",
                Name: "hat TA",
                Text: "hat TA",
                Tooltip: "hat Titelauflage«",
                Type: "multirelation",
            },
            {
                Field: "hat_TA.id",
                Type: "searchonly",
            },
        ]
    },
    {
        Name: "Personen",
        Searchable: false,
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Person",
        Fields: [
            {
                Field: "Herausgabe.Name,Herausgabe.Lebensdaten",
                Name: "Herausgabe",
                Text: "Herausgabe",
                Type: "multirelation",
            },
            {
                Field: "Herausgabe.id",
                Type: "searchonly",
            },
            {
                Field: "Verlag.Name,Verlag.Lebensdaten",
                Name: "Verlag",
                Text: "Verlag",
                Type: "multirelation",
            },
            {
                Field: "Verlag.id",
                Type: "searchonly",
            },
            {
                Field: "Druck.Name,Druck.Lebensdaten",
                Name: "Druck",
                Text: "Druck",
                Type: "multirelation",
            },
            {
                Field: "Druck.id",
                Type: "searchonly",
            },
            {
                Field: "Vertrieb.Name,Vertrieb.Lebensdaten",
                Name: "Vertrieb",
                Text: "Vertrieb",
                Type: "multirelation",
            },
            {
                Field: "Vertrieb.id",
                Type: "searchonly",
            },
        ]
    },
    {
        Name: "Nachweis",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Nachweis",
                Type: "text",
            }
        ]
    },
    {
        Name: "Struktur",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Struktur",
                Type: "text",
            }
        ]
    },
    {
        Name: "Status",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Status",
        Fields: [
            {
                Field: "Status",
                Type: "multiselect",
            }
        ]
    },
    {
        Name: "Biblio ID",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Biblio_ID",
                Type: "text",
            }
        ]
    },
    {
        Name: "Anmerkungen",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "HTML",
        Fields: [
            {
                Field: "Anmerkungen",
                Type: "HTML",
            }
        ]
    },
    {
        Name: "Norm (abgekündigt)",
        ShortName: "Norm",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Norm_DEPR",
                Type: "text",
            }
        ]
    },
    {
        Name: "Reihentitel (abgekündigt)",
        ShortName: "Reihentitel (alt)",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Reihentitel_DEPR",
                Type: "text",
            }
        ]
    },
    {
        Name: "Erstellt",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "created",
                Type: "date",
            }
        ]
    },
    {
        Name: "Bearbeitet",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "updated",
                Type: "date",
            }
        ]
    },
]

export const baendeSchema: SchemaType = {
    Name: "Bände",
    TableName: "Aufnahme",
    DefaultSort: ["created"],
    Columns: baendeColumns,
    MiniColumns: ["Gesichtet", "Vollständig erfasst", "Bev. Reihentitel", "Jahr", "Ausgabe", "Biblio ID"],
    RequiredBackRelations: [{ Table: "Inhalte", Fields: ["Band"] }],
}

export const reihenColumns: ColumnType[] = [
    {
        Name: "ID",
        OnlyExplicitlySearchable: true,
        DefaultVisible: false,
        NameVisible: true,
        Icon: "id",
        Fields: [
            {
                Field: "id",
                OnlyExplicitlySearchable: true,
                Type: "id",
            }
        ]
    },
    {
        Name: "Titel",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Titel",
                Type: "text",
            }
        ]
    },
    {
        Name: "Nachweis",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "Text",
        Fields: [
            {
                Field: "Nachweis",
                Type: "text",
            }
        ]
    },
    {
        Name: "Anmerkungen",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "HTML",
        Fields: [
            {
                Field: "Anmerkungen",
                Type: "HTML",
            }
        ]
    },
    {
        Name: "Erstellt",
        DefaultVisible: false,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "created",
                Type: "date",
            }
        ]
    },
    {
        Name: "Bearbeitet",
        DefaultVisible: true,
        NameVisible: true,
        Icon: "date",
        Fields: [
            {
                Field: "updated",
                Type: "date",
            }
        ]
    },
]

export const reihenSchema: SchemaType = {
    Name: "Reihentitel",
    TableName: "Reihentitel",
    DefaultSort: ["Titel"],
    Columns: reihenColumns,
    MiniColumns: ["Titel", "Nachweis", "Anmerkungen"],
    OptionalBackRelations: [{ Table: "Baende", Fields: ["Alternativer_Reihentitel", "Franzoesischer_Reihentitel", "Deutscher_Reihentitel", "Alternatives_Titelblatt", "TA_von", "hat_TA"] }],
    RequiredBackRelations: [{ Table: "Baende", Fields: ["Bevorzugter_Reihentitel"] }],
}
