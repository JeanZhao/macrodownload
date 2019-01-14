/**
 * Created by jeanzhao on 10/23/18.
 */


export interface Task {
    /**
     * task name:
     * special one for same macroId
     */
    name: string;
    /**
     * basis for calculating progress
     */
    macroId: string;
    /**
     *  menu selector list for sequentially click
     */
    menuList?: string[];
    /**
     * directory path for multiple download files
     */
    downloadPath: string;
    /**
     * a list of download link information for this menu link
     */
    downloadLink: linkInfo[];
    /**
     * option value set in widgets after clicking current menu link
     */
    param?: any;
}

export interface linkInfo {
    /**
     * description for this download link:
     * could be set as widget name, action description
     */
    name: string;
    /**
     * selector for download body:
     * would click download link until the body is ready
     */
    waitSelector: string;
    /**
     * selector for possible error
     * could save much time instead of timeout for waitSelector
     */
    errorSelector: string;
    /**
     * selector for download link
     */
    downloadLink?: string;

}