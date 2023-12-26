// To see from npm run : npm run reusing -- --help

import {ArgumentParser} from "argparse"
// const { ArgumentParser } = require('argparse')


const parser = new ArgumentParser({ description: 'Update reused files from other projects' })
parser.parse_args()


import http from "http"
import https from "https"
import fs from "fs"
// var http = require('http');
// var https = require('https');
// var fs = require('fs');

async function download(url, filePath) {
    const proto = !url.charAt(4).localeCompare('s') ? https : http;
  
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      let fileInfo = null;
  
      const request = proto.get(url, response => {
        if (response.statusCode !== 200) {
          fs.unlink(filePath, () => {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          });
          return;
        }
  
        fileInfo = {
          mime: response.headers['content-type'],
          size: parseInt(response.headers['content-length'], 10),
        };
  
        response.pipe(file);
      });
  
      // The destination stream is ended by the time it's called
      file.on('finish', () => {
        resolve(fileInfo)
      });
  
      request.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });
  
      file.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });
  
      request.end();
    });
  }
  

/*var replace_in_file = async function(someFile, search, replace){
    const data = await fs.promises.readFile(someFile, 'utf8');
    const result = data.replace(search,replace)
    await fs.promises.writeFile(someFile, result,'utf8');
}*/

download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/BtnLogIn.vue", "src/components/reusing/BtnLogIn.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/BtnLogOut.vue", "src/components/reusing/BtnLogOut.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/ChartPie.vue", "src/components/reusing/ChartPie.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/DisplayValues.vue", "src/components/reusing/DisplayValues.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyDatePicker.vue", "src/components/reusing/MyDatePicker.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyDateTimePicker.vue", "src/components/reusing/MyDateTimePicker.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyMenuInline.vue", "src/components/reusing/MyMenuInline.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/BtnSwitchLanguages.vue", "src/components/reusing/BtnSwitchLanguages.vue")

