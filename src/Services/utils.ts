/**
 * Created by jeanzhao on 11/23/18.
 */
import {LaunchOptions} from "../model/Options";
import * as winston from "winston";

export class UtilService {
    private static _instance: UtilService = new UtilService();
    constructor(){
        UtilService._instance = this;
    }
    static isNull(i: any): boolean {
        return Object.prototype.toString.call(i) === "[object Null]";
    }

    static isUndefined(i: any): boolean {
        return Object.prototype.toString.call(i) === "[object Undefined]";
    }

    static isString(i: any): boolean {
        return Object.prototype.toString.call(i) === "[object String]";
    }

    static isEqualValue(p1: LaunchOptions, p2: LaunchOptions): boolean {
        let result;
        for (let k in p1) {
            result = p1[k] !== p2[k];
        }
        return result;
    }

    delay(time: number): Promise<string> {
        return new Promise(resolve => {
            setTimeout(() => resolve(""), time);
        });
    }

    mapSeries(array: any[], promise: (value, index) => Promise<any>): Promise<any> {
        if (array.length > 0) {
            return array.reduce((p, c, i) => p.then(() => promise(c, i)), Promise.resolve());
        } else {
            winston.info(`found empty list need execution.`);
            return Promise.resolve();
        }
    }

}