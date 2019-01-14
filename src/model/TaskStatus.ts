/**
 * Created by jeanzhao on 11/23/18.
 */

export interface TaskStatus {
    /**
     * task name:
     * special one for same macroId
     */
    name: string;
    /**
     * process id for the browser
     */
    pid: number;
    /**
     * basis for calculating progress
     */
    macroId: string;
    /**
     *  total number for downloading links
     */
    total: number;
    /**
     * successful number for downloading links
     */
    success: number;
    /**
     * a list of error info during downloading files
     */
    errInfo: ERROR[];
    /**
     * other reported error case:
     * e.g. the browser is closed manually.
     */
    otherErr: ERROR[];
}

export interface ERROR {
    type: string,
    info: string
}