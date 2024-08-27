import type { RecordModel } from 'pocketbase';

export type Group = "Main" | "Serials" | "Items" | "MainSymbol" | "Diff" | "Entries" | "Works" | "Places" | "Collections" | "Description" | "Schema" | "Template" | "Order" | "Count" | "Parent" | "Title" | "Date" | "Issue" | "MediaSpecific" | "MediaMeta" | "Tag" | "Agents" | "Children" | "Relation" | "Transcriptions" | "Identifier" | "URL" | "Contents" | "Research" | "Deprecated" | "EditorNotes" | "Annotations" | "FieldMetaData" | "Fields" | "State" | "" | "None" | "Extend";
export type Type = "Text" | "Editor" | "SelectOne" | "SelectUnlimited" | "Json" | "Boolean" | "JsonArrayFixedKeys" | "RelationUnlimited" | "JsonFixedKeys" | "JsonMap" | "RelationOne" | "BackRelationUnlimited" | "BackRelationNM" | "BackRelationOne" | "JsonArrayFields";

export type Bearbeitungsstatus = "Unbekannt" | "Gesichtet" | "In Bearbeitung" | "Rückmeldung" | "Erfasst" | "Überprüfen" | "";

export type TableType = "Collections" | "NMRelations" | "Works" | "Entries" | "Agents" | "Places" | "Serials" | "None" | "Templates" | "Contents" | "Items";

export interface Table {
    Name: string;
    Schema: Schema[];
    friendlyName?: string;
    friendlyNameEN?: string;
    BackRelations?: Schema[];
    ListRule?: string;
    ViewRule?: string;
    CreateRule?: string;
    DeleteRule?: string;
    NoDefaults?: boolean;
    Fields?: FieldList;
    Type?: TableType;
    Icon?: string;
    DefaultFilter?: string;
    DefaultSort?: string[];
    ListFilter?: string;
}

export interface FieldList {
    Main: Schema[];
    MainSymbol?: Schema[];
    Diff?: Schema[];
    Entries?: Schema[];
    Works?: Schema[];
    Places?: Schema[];
    Collections?: Schema[];
    Description?: Schema[];
    Schema?: Schema[];
    Template?: Schema[];
    Order?: Schema[];
    Count?: Schema[];
    Parent?: Schema[];
    Title?: Schema[];
    Date?: Schema[];
    Items?: Schema[];
    Serials?: Schema[];
    Issue?: Schema[];
    MediaSpecific?: Schema[];
    MediaMeta?: Schema[];
    Tag?: Schema[];
    Agents?: Schema[];
    Children?: Schema[];
    Relation?: Schema[];
    Transcriptions?: Schema[];
    Identifier?: Schema[];
    URL?: Schema[];
    Contents?: Schema[];
    Research?: Schema[];
    Deprecated?: Schema[];
    EditorNotes?: Schema[];
    Annotations?: Schema[];
    FieldMetaData?: Schema[];
    Fields?: Schema[];
    State?: Schema[];
    None?: Schema[];
    Extend?: Schema[];
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
    friendlyNameEN?: string;
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

export interface Collection extends RecordModel {
    Name: string;
    Description?: string;
}
