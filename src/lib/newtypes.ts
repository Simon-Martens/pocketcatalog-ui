import type { RecordModel } from 'pocketbase';

export type Group = "EditorNotes" | "System" | "Main" | "Diff" | "MainSymbol" | "Norm" | "Description" | "IncludedIn" | "Includes" | "Transcriptions" | "MediaSpecific" | "MediaMeta" | "Exemplare" | "Collections" | "Research" | "Deprecated" | "Identifier" | "Title" | "Tag" | "File" | "Actors" | "Additional" | "" | "None";

export type Type = "Text" | "Editor" | "SelectOne" | "SelectUnlimited" | "Json" | "Boolean" | "JsonArrayFixedKeys" | "RelationUnlimited" | "JsonFixedKeys" | "JsonMap" | "RelationOne" | "BackRelationUnlimited" | "BackRelationNM" | "BackRelationOne" | "JsonArrayFields";

export type Bearbeitungsstatus = "Unbekannt" | "Gesichtet" | "In Bearbeitung" | "Rückmeldung" | "Erfasst" | "";

export interface Table {
    Name: string;
    Schema: Schema[];
    BackRelations?: Schema[];
    ListRule?: string;
    ViewRule?: string;
    CreateRule?: string;
    DeleteRule?: string;
    NoDefaults?: boolean;
    Fields?: FieldList;
}

export interface FieldList {
    EditorNotes?: Schema[];
    System?: Schema[];
    Main?: Schema[];
    Diff?: Schema[];
    MainSymbol?: Schema[];
    Norm?: Schema[];
    Description?: Schema[];
    IncludedIn?: Schema[];
    Includes?: Schema[];
    MediaSpecific?: Schema[];
    MediaMeta?: Schema[];
    Exemplare?: Schema[];
    Collections?: Schema[];
    Research?: Schema[];
    Deprecated?: Schema[];
    Identifier?: Schema[];
    Title?: Schema[];
    Tag?: Schema[];
    File?: Schema[];
    Actors?: Schema[];
    Additional?: Schema[];
    None?: Schema[];
    Transcriptions?: Schema[];
}

export interface Schema {
    Name: string;
    Type: string;
    Index?: boolean;
    Group?: Group;
    TVisibility?: boolean;
    EVisibility?: boolean;
    Options?: Options;
    Internal?: boolean;
    friendlyName?: string;
    Presentable?: boolean;
    Required?: boolean;
    ShortName?: string;
    THidden?: boolean;
    EHidden?: boolean;
    Default?: string;
    Or?: string;
}
export interface Options {
    Transcription?: Transcription;
    Values?: string[];
    MaxSelect?: number;
    Collection?: string;
    MaxSize?: number;
    MimeTypes?: string[];
    Thumbs?: string[];
    Protected?: boolean;
    Keys?: string[];
    View?: string;
    Table: string;
    Field?: string[];
    Expand?: string;
}
export interface Transcription {
    For: string;
}

export interface Entity extends RecordModel {
    Anmerkungen: string;
    Feldanmerkungen: { key: string, value: string };
    Bearbeitungsvermerk: string[] | string;
    Felder: { key: string, value: string };
    Bearbeitungsstatus: Bearbeitungsstatus;
}

