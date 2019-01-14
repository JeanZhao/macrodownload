/**
 * Created by jeanzhao on 10/24/18.
 */

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



/**
 * options are copied from puppeteer launch option
 * */

export interface LaunchOptions {
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