import type { RecordModel } from 'pocketbase';

export type Group = "EditorNotes" | "System" | "Main" | "Diff" | "MainSymbol" | "Norm" | "Description" | "IncludedIn" | "Includes" | "Transcriptions" | "MediaSpecific" | "MediaMeta" | "Exemplare" | "Collections" | "Research" | "Deprecated" | "Identifier" | "Title" | "Tag" | "File" | "Actors" | "Additional" | "";

export type Type = "Text" | "Editor" | "Select" | "Json" | "Boolean" | "JsonArrayFixedKeys" | "RelationUnlimited" | "JsonFixedKeys" | "JsonMap" | "RelationOne";

export type RType = "BackRelationUnlimited" | "BackRelationNM" | "BackRelationOne";

export type Bearbeitungsstatus = "Unbekannt" | "Gesichtet" | "In Bearbeitung" | "Rückmeldung" | "Erfasst" | "";

export interface Table {
    Name: string;
    Schema: Schema[];
    BackRelations?: BackRelation[];
    ListRule?: string;
    ViewRule?: string;
    CreateRule?: string;
    DeleteRule?: string;
    NoDefaults?: boolean;
}
export interface BackRelation {
    Name: string;
    type: RType;
    Table: string;
    Fields?: string[];
    Group?: string;
    Field?: string;
    Expand?: string;
    THidden?: boolean;
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

