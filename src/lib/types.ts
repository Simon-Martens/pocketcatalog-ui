import type { AuthModel, RecordModel } from "pocketbase";

type Paginierung = "Römische Seitenzählung"  | "Arabische Seitenzählung"  | "Alphabetische Seitenzählung"  | "Sonstige Seitenzählung"  | "1. Arabische Seitenzählung"  | "2. Arabische Seitenzählung"  | "3. Arabische Seitenzählung"  | "4. Arabische Seitenzählung"  | "5. Arabische Seitenzählung"  | "6. Arabische Seitenzählung"  | "7. Arabische Seitenzählung"  | "8. Arabische Seitenzählung"  | "1. Römische Seitenzählung"  | "2. Römische Seitenzählung"  | "3. Römische Seitenzählung"  | "4. Römische Seitenzählung"  | "5. Römische Seitenzählung"  | "6. Römische Seitenzählung"  | "7. Römische Seitenzählung"  | "8. Römische Seitenzählung" | "";
type Typ = "Corrigenda" | "Diagramm" | "Gedicht/Lied" | "Graphik" | "Graphik-Verzeichnis" | "graph. Anleitung" | "graph. Strickanleitung" | "graph. Tanzanleitung" | "Inhaltsverzeichnis" | "Kalendarium" | "Karte" | "Musikbeigabe" | "Musikbeigaben-Verzeichnis" | "Motto" | "Prosa" | "Rätsel" | "Sammlung" | "Spiegel" | "szen. Darstellung" | "Tabelle" | "Tafel" | "Titel" | "Text" | "Trinkspruch" | "Umschlag" | "Widmung" | "";
type Status = "Original vorhanden" | " Reprint vorhanden" | "Fremde Herkunft" | "";
type UserRole = "Admin" | "Editor" | "User";

type FieldType = "bool" | "date" | "id" | "image" | "multirelation" | "singlerelation" | "text" | "HTML" | "number" | "multiselect" | "singleselect" | "searchonly";

export interface SammlungsEintragType extends RecordModel {
    Musenalm_ID: string;
}

export interface PersonType extends SammlungsEintragType {
    Name: string;
    Nachweis: string;
    Pseudonyme: string;
    GND: string;
    Beruf: string;
    Anmerkungen: string;
    Lebensdaten: string;
    Koerperschaft: boolean;
}

export interface TitelTextanfangType extends RecordModel {
    Anfang: string;
    Band: string;
    KT: string;
    Objektnummer: number;
    Paginierung: string;
    Seite: string;
    id: string;    
}

export interface ReiheType extends SammlungsEintragType {
    Anmerkungen: string;
    Nachweis: string;
    Titel: string;
    expand?: ExpandReihe;
}

export interface ExpandReihe {
    "Baende(Bevorzugter_Reihentitel)"?: BandType[];
    "Baende(Franzoesischer_Reihentitel)"?: BandType[];
    "Baende(Deutscher_Reihentitel)"?: BandType[];

    // Not possible to use this yet, since we cant back expand on multi-relation fields
    "Baende(Alternativer_Reihentitel)"?: BandType[];
    "Baende(Alternatives_Titelblatt)"?: BandType[];
    "Baende(TA_von)"?: BandType[];
    "Baende(hat_TA)"?: BandType[];
}

export interface BandType extends SammlungsEintragType {
    Titelangabe: string;
    Kurztitel: string;
    Jahr: number;
    Verantwortlichkeitsangabe: string;
    Ortsangabe: string;
    Ausgabebezeichnung: string;
    Nachweis: string;
    Biblio_ID: number;
    Struktur: string;
    Norm: string;
    Anmerkungen: string;
    Gesichtet: boolean;
    Erfasst: boolean;
    Bevorzugter_Reihentitel: string;
    Alternativer_Reihentitel: string[];
    Franzoesischer_Reihentitel: string;
    Deutscher_Reihentitel: string;
    Alternatives_Titelblatt: string[];
    TA_von: string[];
    hat_TA: string[];
    Herausgabe: string[];
    Verlag: string[];
    Druck: string[];
    Vertrieb: string[];
    Status: Status[];
    expand?: ExpandBand;
}

export interface ExpandBand {
    Bevorzugter_Reihentitel?: ReiheType;
    Alternativer_Reihentitel?: ReiheType[];
    TA_von?: ReiheType[];
    hat_TA?: ReiheType[];
    Franzoesischer_Reihentitel?: ReiheType;
    Deutscher_Reihentitel?: ReiheType;
    Alternatives_Titelblatt?: TitelTextanfangType[];
    Herausgabe?: PersonType[];
    Verlag?: PersonType[];
    Druck?: PersonType[];
    Vertrieb?: PersonType[];
}

export interface InhaltType extends SammlungsEintragType {
    Band: string;
    Anmerkungen: string;
    Incipit: string;
    Objektnummer: number;
    Paginierung: Paginierung;
    Scans: string[];
    Seite: string;
    Titelangabe: string;
    Urheberangabe: string;
    Typ: Typ[];
    Geschaffen: string[];
    Geschrieben: string[];
    Gestochen: string[];
    Gezeichnet: string[];
    expand?: ExpandInhalt;
}

export interface ExpandInhalt {
    Band?: BandType;
    Geschaffen?: PersonType[];
    Geschrieben?: PersonType[];
    Gestochen?: PersonType[];
    Gezeichnet?: PersonType[];
}

export interface TextType extends RecordModel {
    Stichworte: string;
    Text: string;
    Titel: string;
}

export interface BildType extends RecordModel {
    Titel: string;
    Bilder: string[];
}

export interface BinType extends RecordModel {
    oldid: string;
    oldcollection: string;
    oldjson: RecordModel;
    olddep: RecordModel;
    deletionfailed: boolean;
}

export interface UserType extends RecordModel {
    email: string;
    emailVisibility: boolean;
    verified: boolean;
    name: string;
    avatar: string;
    role: UserRole;
    settings?: SettingsType;
}

export interface SettingsType {
    VisibleFields?: { [key: string]: string[] };
    SearchHistory?: { [key: string]: string[] };
    PinnedSearches?: { [key: string]: { Name: string, Search: string }[] };
}

export interface SchemaType {
    Name: string;
    TableName: string;
    DefaultSort: string[];
    DefaultFilter?: string;
    DefaultExpand?: string[];
    Columns: ColumnType[];
    MiniColumns: string[];
    OptionalBackRelations?: BackRelation[];
    RequiredBackRelations?: BackRelation[];
}

export interface BackRelation {
    Table: string;
    Fields: string[];
}

export interface ColumnType {
    Name: string;  // Name of the colum
    OnlyExplicitlySearchable?: boolean; // if the column should only be searchable if explicitly requested
    Searchable?: boolean; // if the column should be searchable; true by default
    ShortName?: string; // Short alias for the column name; if present allows for searching by this field name
    Icon?: string; // Icon for the list header
    TIcon?: string; // Icon for the data rows, if true
    NIicon?: string; // Icon for the data rows, if false
    Tooltip?: string; // Tooltip for the list header
    DefaultVisible: boolean; // if the field should be included in the visible fields by default
    Hidden?: boolean; // if the field should be hidden
    NameVisible: boolean; // If the name should be shown in the list header
    Width?: number; // 1-100
    Fields: SchemaFieldType[]; // Fields that are shownn in the column
}

export interface SchemaFieldType {
    Field: string;  // Name of the field; must match the field name in the database
    OnlyExplicitlySearchable?: boolean; // if the column should only be searchable if explicitly requested
    Searchable?: boolean; // if the field should be searchable; true by default
    Name?: string;  // Alias for the field name; if present allows for searching by this field name
    ShortName?: string; // Short alias for the field name; if present allows for searching by this field name
    Type: FieldType;   // Type of the field; must match the type in the database
    Tooltip?: string; // Tooltip for the field
    Text?: string;  // Text to show if type = Boolean && value == true or before the value if there is any
    Icon?: string;  // Icon to show if type = Boolean && value == true or before the value if there is any
    NotText?: string; // Text to show if type = Boolean && value == false or after the value if there is any
    NotIcon?: string; // Icon to show if type = Boolean && value == false or after the value if there is any
}


export interface AlertType {
    id: string;
    type: "success" | "info" | "interaction" | "warning" | "error";
    timed: boolean;
    message: string;
    ok_button?: string;
    cancel_button?: string;
    callback?: (ok: boolean) => void;
}