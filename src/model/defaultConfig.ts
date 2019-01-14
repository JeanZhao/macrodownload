/**
 * Created by jeanzhao on 10/23/18.
 */

export const DefaultConfig = {

    // puppeteer launch setting
    launchOptions: {
        headless: false,
        defaultViewport: {
            width: 1024,
            height: 768
        },
        timeout: 60 * 60 * 1000
    },


    // delay for visiting a link
    indexPageDelay: 5000,
    linkDelay: 2000,
    clickDelay: 1000,

    // force to initialize opening chrome
    init: true
};
