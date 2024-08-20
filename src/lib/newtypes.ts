import type { RecordModel } from 'pocketbase';

export type Group = "EditorNotes" | "System" | "Main" | "Diff" | "MainSymbol" | "Norm" | "Description" | "IncludedIn" | "Includes" | "Transcriptions" | "MediaSpecific" | "MediaMeta" | "Exemplare" | "Collections" | "Research" | "Deprecated" | "Identifier" | "Title" | "Tag" | "File" | "Actors" | "Additional" | "" | "BackRelationUnlimited" | "BackRelationNM" | "BackRelationOne";


export type Type = "Text" | "Editor" | "SelectOne" | "SelectUnlimited" | "Json" | "Boolean" | "JsonArrayFixedKeys" | "RelationUnlimited" | "JsonFixedKeys" | "JsonMap" | "RelationOne";

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

