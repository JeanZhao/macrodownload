# macro-execution
This is a simple plug-in based on puppeteer.   
  
Currently it supports macro download. It helps monitoring tasks status for macro downloading files from a virtual web page.    
It also provides customized settings and pushes download progress for per task.  

Please feel free to use it in javascript or typescript projects.  

## Install
 * npm install macro-execution

## Usage
### Used in js projects:   
```js
let me = require(`macro-execution`); 

function A(tasks){
  let test = new me.MacroDownload();
  return test.download(tasks, {site: 'localhost:3000'})
      .then(test.close);
}

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
}];

A(tasks);
``` 
### Used in ts projects: 
```ts
import {Task, MacroDownload} from 'macro-execution';

export function A(tasks: Task[]): Promise<void> {
    let test = new MacroDownload();
    return test.download(tasks, {site: 'http://localhost:3000'})
        .then(test.close);
}
``` 
## Launch options

| Parameters | default Value | Descriptions   
| ---        | ---          | ---       |
| `site`     | `--`         | `must be set: site to visit` 

## API

* Disconnect  
```js  
test.close();  
```

* Monitoring task status  

```js 
test.runningSteam.subscribe(list => {  

// do something with ${list}  

// [{  "name":"test link",  
//     "processInfo": {"pid":25459,"cpu":0},   // process id and cpu info  
//     "macroId":"q1",                         // unique id for running tasks  
//     "total":0,                              // total number for per task   
//     "success":0,                            // current success number for per task   
//     "errInfo":[],                           // error message  
//     "otherErr":[]                           // unexpected error message collection   
// }]   
});  
```

# Coming soon  

More supports is coming...    

It's for open source learning.   
Any questions please feel free to contact me.
