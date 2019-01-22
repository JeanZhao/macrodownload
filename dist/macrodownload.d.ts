import { Subject } from "rxjs";

declare interface LaunchOptions {
    /**
     * Whether to open chrome in appMode.
     * @default false
     */
    appMode?: boolean;
    /**
     * Whether to ignore HTTPS errors during navigation.
     * @default false
     */
    ignoreHTTPSErrors?: boolean;
    /**
     * Do not use `puppeteer.defaultArgs()` for launching Chromium.
     * @default false
     */
    ignoreDefaultArgs?: boolean | string[];
    /**
     * Whether to run Chromium in headless mode.
     * @default true
     */
    headless?: boolean;
    /**
     * Path to a Chromium executable to run instead of bundled Chromium. If
     * executablePath is a relative path, then it is resolved relative to current
     * working directory.
     */
    executablePath?: string;
    /**
     * Slows down Puppeteer operations by the specified amount of milliseconds.
     * Useful so that you can see what is going on.
     */
    slowMo?: number;
    /**
     * Sets a consistent viewport for each page. Defaults to an 800x600 viewport. null disables the default viewport.
     */
    defaultViewport?: {
        /**
         * page width in pixels.
         */
        width?: number;
        /**
         * page height in pixels.
         */
        height?: number;
        /**
         * Specify device scale factor (can be thought of as dpr).
         * @default 1
         */
        deviceScaleFactor?: number;
        /**
         * Whether the meta viewport tag is taken into account.
         * @default false
         */
        isMobile?: boolean;
        /**
         *
         * Specifies if viewport supports touch events.
         * @default false
         */
        hasTouch?: boolean;
        /**
         * Specifies if viewport is in landscape mode.
         * @default false
         */
        isLandscape?: boolean;
    };
    /**
     * Additional arguments to pass to the Chromium instance. List of Chromium
     * flags can be found here.
     */
    args?: string[];
    /**
     * Close chrome process on Ctrl-C.
     * @default true
     */
    handleSIGINT?: boolean;
    /**
     * Close chrome process on SIGTERM.
     * @default true
     */
    handleSIGTERM?: boolean;
    /**
     * Close chrome process on SIGHUP.
     * @default true
     */
    handleSIGHUP?: boolean;
    /**
     * Maximum time in milliseconds to wait for the Chrome instance to start.
     * Pass 0 to disable timeout.
     * @default 30000 (30 seconds).
     */
    timeout?: number;
    /**
     * Whether to pipe browser process stdout and stderr into process.stdout and
     * process.stderr.
     * @default false
     */
    dumpio?: boolean;
    /** Path to a User Data Directory. */
    userDataDir?: string;
    /**
     * Specify environment variables that will be visible to Chromium.
     * @default `process.env`.
     */
    env?: {
        [key: string]: string | boolean | number;
    };
    /**
     * Whether to auto-open DevTools panel for each tab. If this option is true, the headless option will be set false.
     */
    devtools?: boolean;
    /**
     * Connects to the browser over a pipe instead of a WebSocket.
     * @default false
     */
    pipe?: boolean;
}
declare interface linkInfo {
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
    downloadLink: string;
}
declare interface ERROR {
    type: string;
    info: string;
}


export interface Options {
    /**
     * site to visit
     */
    site: string;
    /**
     * launch options for using puppeteer
     * @default read from defaultConfig.ts file
     */
    launchOptions?: LaunchOptions;
    /**
     * whether to force to initialize opening chrome
     * @default read from defaultConfig.ts file
     * */
    init?: boolean;
    /**
     * delay in milliseconds to wait for the Chrome instance to start.
     * @default read from defaultConfig.ts file
     */
    indexPageDelay?: number;
    /**
     * delay in milliseconds to wait for the possible rendering time of link
     * @default read from defaultConfig.ts file
     */
    linkDelay?: number;
    /**
     * delay in milliseconds to wait for the possible responding time of link
     * @default read from defaultConfig.ts file
     */
    clickDelay?: number;
}
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
export interface TaskStatus {
    /**
     * task name:
     * special one for same macroId
     */
    name: string;
    /**
     * process info for the browser
     */
    processInfo: ProcessInfo;
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
export interface ProcessInfo {
    pid: number;
    cpu: number;
}

export declare class MacroDownload {
    runningSteam: Subject<TaskStatus[]>;
    constructor();
    static getCustomizedOptions(options: Options): Options;
    download(tasks: Task[], options: Options): Promise<void>;
    close(): Promise<void>;
    getCpuProcess(processId?: number): Promise<ProcessInfo>;
    getRunningProcess(): any;
}
