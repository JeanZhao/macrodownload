/**
 * Created by jeanzhao on 12/23/18.
 */
import * as puppeteer from "puppeteer";
import {UtilService} from "../Services/utils";
import {Subject} from "rxjs";
import {Options, LaunchOptions} from "../model/Options";
import {DefaultConfig} from "../model/defaultConfig";
import {Task} from "../model/Task";
import {ERROR, ProcessInfo, TaskStatus} from "../model/TaskStatus";
import * as winston from "winston";
import * as pidUsage from 'pidusage';

export class MacroDownload {
    private utils = new UtilService();
    private browser: any;
    private launch: LaunchOptions;
    private runningList: TaskStatus[] = [];

    public runningSteam: Subject<TaskStatus[]> = new Subject<TaskStatus[]>();

    constructor() {
    }

    static getCustomizedOptions(options?: Options): Options {
        let result: any = Object.assign({}, DefaultConfig);
        if (options.launchOptions) {
            Object.assign(result.launchOptions, options.launchOptions);
        }
        let remainingConf = Object.assign({}, options);
        for (let attr in remainingConf) {
            if (attr === 'launchOptions') delete remainingConf[attr];
        }
        Object.assign(result, remainingConf);
        return result;
    }

    public async close() {
        await this.utils.delay(DefaultConfig.indexPageDelay);
        await this.browser.close();
        await pidUsage.clear();
        this.browser = null;
        this.launch = null;
        this.runningSteam = null;
        return;
    }

    public async getCpuProcess(processId?: number): Promise<ProcessInfo> {
        let pid = processId || this.getRunningProcess().pid;
        let cpu = 0;
        if (pid) {
            let stat = await pidUsage(pid);
            cpu = stat.cpu ? +(stat.cpu).toFixed(2) : 0;
        }
        return {pid, cpu};
    }

    public getRunningProcess() {
        return this.browser ? this.browser.process() : {};
    }

    public async initTaskList(tasks: Task[]) {
        const processInfo = await this.getCpuProcess();
        tasks.forEach(task => {
            const index = this.runningList.findIndex(t => t.name === task.name && t.macroId === task.macroId);
            if (index !== -1) {
                this.runningList[index].total = +this.runningList[index].total + task.downloadLink.filter(i => !!i.downloadLink).length;
            } else {
                this.runningList.push({
                    "name": task.name,
                    "processInfo": processInfo,
                    "macroId": task.macroId,
                    "total": task.downloadLink.filter(i => !!i.downloadLink).length,
                    "success": 0,
                    "errInfo": [],
                    "otherErr": []
                });
            }
        });
        this.runningSteam.next(this.runningList);
        return;
    }

    public async download(tasks: Task[], options: Options) {
        let page = await this.openWebPage(options,
            () => this.initTaskList(tasks)
        );
        winston.info(`start macro download, task numbers:${tasks.length}`);
        await this.utils.mapSeries(tasks, async task => {
            try {
                await (page as any)._client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: task.downloadPath
                });

                let successIndex = 0;
                const total = task.downloadLink.filter(i => !!i.downloadLink).length;

                // 1. click nested menu
                await this.utils.mapSeries(task.menuList, async (menuSelector, index) => {
                    winston.info(`click menu with selector:${menuSelector}`);
                    await this.clickBySelector(menuSelector, task, page);
                });

                // 2. download files after the last menu link
                await this.utils.mapSeries(task.downloadLink, async linkInfo => {
                    winston.info(`start to download a file for ${linkInfo.name}`);
                    try {
                        await this.raceCheck(linkInfo.waitSelector, linkInfo.errorSelector, page);
                        let downloadContent = await this.raceCheck(linkInfo.downloadLink, linkInfo.errorSelector, page);
                        await this.clickHandler(downloadContent);
                        successIndex++;
                        this.pushList({task: task, success: 1});
                        winston.debug(`Complete ${successIndex}/${total} for downloading ${task.name}${task.param ? ' with param ' + JSON.stringify(task.param) : ''}`);
                        await this.utils.delay(DefaultConfig.clickDelay);
                    } catch (e) {
                        const info = `fail download file for ${linkInfo.name} of link '${task.name}'${task.param ? ' with param ' + JSON.stringify(task.param) : ''}`;
                        this.errHandler(task, e.message ? e : info);
                    }
                });
            } catch (e) {
                this.errHandler(task, e);
            }
        });
        return;
    }

    private async openWebPage(options: Options, launchCallback?: () => void) {
        let conf = MacroDownload.getCustomizedOptions(options);
        if (this.isNeedLaunch(conf)) {
            this.launch = conf.launchOptions;
            this.browser = await puppeteer.launch(this.launch);
            if (launchCallback) {
                launchCallback();
            }
        }
        let page = await this.browser.newPage();
        await page.goto(`${conf.site}`);
        await this.utils.delay(conf.indexPageDelay);
        return page;
    }

    private isNeedLaunch(options: Options): boolean {
        return UtilService.isNull(this.browser) || UtilService.isUndefined(this.browser)
            || (options.init && this.launch
                && !UtilService.isEqualValue(this.launch, options.launchOptions));
    }

    private async pushList(item: { task: Task, success?: number, err?: ERROR }) {
        const index = this.runningList.findIndex(t => t.name === item.task.name && t.macroId === item.task.macroId);
        if (index !== -1) {
            let curLink = this.runningList[index];
            if (item.success) {
                curLink["success"] = +curLink["success"] + item.success;
            }

            if (item.err) {
                const errKey = item.err.type === "download" ? "err" : "otherErr";
                item.err.info = `[${curLink.macroId}]: ${item.err.info}`;
                if (!errKey.includes(item.err.info)) {
                    curLink[errKey].push(item.err.info);
                }
            }

            curLink.processInfo = await this.getCpuProcess(curLink.processInfo.pid);
            this.runningSteam.next(this.runningList);
        }
    }

    private async clickBySelector(selector: string, task: Task, page: any) {
        try {
            let curMenu = await page.waitForSelector(selector, {timeout: this.launch.timeout});
            await this.clickHandler(curMenu);
            return;
        } catch (e) {
            this.errHandler(task, e);
        }
    }

    private raceCheck(selector: string, errorSelector: string, page: any): Promise<any> {
        return Promise.race([this.checkSelector(selector, page), this.checkSelector(errorSelector, page)]);
    }

    private checkSelector(selector: string, page: any): Promise<any> {
        return page.waitForSelector(selector, {timeout: this.launch.timeout})
            .then(value => {
                return selector.includes('img[src$=\'/error_500.png\']') ? Promise.reject() : Promise.resolve(value);
            });
    }

    private async clickHandler($selector: any) {
        await $selector.click({clickCount: 1, delay: DefaultConfig.clickDelay});
        await this.utils.delay(DefaultConfig.clickDelay);
        return;
    }

    private errHandler(task: Task, e: any) {
        let err;
        if (UtilService.isString(e)) {
            err = {"type": "download", "info": e};
        } else {
            err = {"type": "other", "info": e.message || JSON.stringify(e)};
        }
        this.pushList({task: task, err: err});
        return;
    }

}