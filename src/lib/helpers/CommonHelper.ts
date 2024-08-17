import type { AnyNode } from "postcss";

export default class CommonHelper {
    /**
     * Checks whether a value is empty. The following values are considered as empty:
     * - null
     * - undefined
     * - empty string
     * - empty array
     * - empty object
     * - zero uuid, time and dates
     */
    static isEmpty(value: string | object | number | undefined | null | Array<any>): boolean {
        return (
            (value === "") ||
            (value === null) ||
            (value === "00000000-0000-0000-0000-000000000000") || // zero uuid
            (value === "0001-01-01 00:00:00.000Z") || // zero datetime
            (value === "0001-01-01") || // zero date
            (typeof value === "undefined") ||
            (Array.isArray(value) && value.length === 0) ||
            (CommonHelper.isObject(value) && Object.keys(value).length === 0)
        );
    }

    /**
     * Normalizes and returns arr as a new array instance.
     */
    static toArray(arr: Array<any>, allowEmpty: boolean = false): Array<any> | [] {
        if (Array.isArray(arr)) {
            return arr.slice();
        }

        return (allowEmpty || !CommonHelper.isEmpty(arr)) && typeof arr !== "undefined" ? [arr] : [];
    }

    /**
    * Checks whether value is plain object.
    */
    static isObject(value: any): boolean {
        return value !== null && typeof value === "object" && value.constructor === Object;
    }

    /**
     * Safely access nested object/array key with dot-notation.
     *
     * @example
     * ```javascript
     * var myObj = {a: {b: {c: 3}}}
     * this.getNestedVal(myObj, "a.b.c");       // returns 3
     * this.getNestedVal(myObj, "a.b.c.d");     // returns null
     * this.getNestedVal(myObj, "a.b.c.d", -1); // returns -1
     * ```
     */
    static getNestedVal(data: Object | Array<any>, path: string, defaultVal: any = null, delimiter: string = "."): any {
        let result = data || {};
        let parts = (path || "").split(delimiter);

        for (const part of parts) {
            if ((!CommonHelper.isObject(result) && !Array.isArray(result)) || typeof result[part] === "undefined") 
                return defaultVal;

            result = result[part];
        }

        return result;
    }


    /**
     * Removes single element from objects array by matching an item"s property value.
     */
    static removeByKey(objectsArr: Array<AnyNode>, key: any, value: any) {
        for (let i in objectsArr) {
            if (objectsArr[i][key] == value) {
                objectsArr.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Adds or replace an object array element by comparing its key value.
     */
    static pushOrReplaceByKey(objectsArr: Array<Object>, item: Object, key: any = "id") {
        for (let i = objectsArr.length - 1; i >= 0; i--) {
            if (objectsArr[i][key] == item[key]) {
                objectsArr[i] = item; // replace
                return;
            }
        }

        objectsArr.push(item);
    }


    /**
     * Returns single element from objects array by matching its key value.
     */
    static findByKey(objectsArr: Array<Object>, key: any, value: any) {
        objectsArr = Array.isArray(objectsArr) ? objectsArr : [];

        for (let i in objectsArr) {
            if (objectsArr[i][key] == value) {
                return objectsArr[i];
            }
        }

        return null;
    }
}
