import type { RecordModel } from 'pocketbase';

export type Group = "Serials" | "Items" | "Symbol" | "Diff" | "Entries" | "Works" | "Places" | "Collections" | "Description" | "Schema" | "Template" | "Order" | "Count" | "Parent" | "Title" | "Date" | "Issue" | "MediaSpecific" | "MediaMeta" | "Tag" | "Agents" | "Children" | "Relation" | "Transcriptions" | "Identifier" | "URL" | "Contents" | "Research" | "Deprecated" | "EditorNotes" | "Annotations" | "FieldMetaData" | "Fields" | "State" | "" | "None" | "Extend" | "Name" | "File";

export type Type = "Text" | "Editor" | "SelectOne" | "SelectUnlimited" | "Json" | "Boolean" | "JsonArrayFixedKeys" | "RelationUnlimited" | "JsonFixedKeys" | "JsonMap" | "RelationOne" | "BackRelationUnlimited" | "BackRelationNM" | "BackRelationOne" | "JsonArrayFields" | "Number";

export type Presentation = "Main" | "Diff" | "MainSymbol" | "FromWhere" | "Relation";

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
    Fields?: { [FieldType in Group]: Schema[] };
    Type?: TableType;
    Icon?: string;
    DefaultFilter?: string;
    DefaultSort?: string[];
    ListFilter?: string;
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
    Presentation?: Presentation;
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

export interface ViewGroup {
    Name: string;
    friendlyName?: string;
    Groups: Group[];
    NeverGroup?: boolean;
    Showable?: { [FieldType in Group]: Schema[] };
}
type ObjectPropertiesOptional<T> = (
    Partial<T> & { [K in keyof T as T[K] extends object ? never : K]: T[K] }
) extends infer O ? { [K in keyof O]: O[K] } : never;

export interface ViewGroupResult {
    Group: number;
    Fields: ObjectPropertiesOptional<{ [FieldType in Group]: Schema[] }>;
    Grouped?: boolean;
}
