# macrodownload
This is a JS plug-in based on puppeteer.   

Help monitoring tasks status for macro downloading files from a virtual web page.  

It provides customized settings and pushes download progress for per task.  

# Initialize

npm install  

npm start  

# Simple to use

Step 1. require the js file for Node/CommonJS:    

let md = require(`./dist/macrodownload.min`);   

Step 2. invoke in project: 

let tasks = [{  
                    name: 'test link',       // task name  
                    menuList: [],            // nested menu wait to be clicked   
                    downloadPath: './Test',  // the directory to download files  
                    downloadLink: [],        // download link set, e.g.   
                                             // linkInfo {  
                                             //       name: ''                
                                             //       waitSelector: ''    // selector for download body  
                                             //       errorSelector: ''   // selector for possible error  
                                             //       downloadLink: ''    // selector for download link  
                                             //   }  
                    macroId: 'q1'            // unique id for running tasks  
                }  
                ];  
let test = new md.MacroDownload();  
test.download(tasks, {site: 'http://localhost:3000'});  

# Disconnect  
test.closeBrowser();  

# Monitoring task status  

test.runningSteam.subscribe(list => {  

// do something with ${list}  

// [{"name":"test link",  
//     "processInfo": {"pid":25459,"cpu":0},   // process id and cpu info  
//     "macroId":"q1",      // unique id for running tasks  
//     "total":0,           // total number for per task   
//     "success":0,         // current success number for per task   
//     "errInfo":[],        // error message  
//     "otherErr":[]        // unexpected error message collection   
// }]   
});  


# Coming soon  

More supports is coming...    

It's for open source learning.   
Any questions please feel free to contact me.
