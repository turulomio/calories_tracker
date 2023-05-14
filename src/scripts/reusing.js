// To see from npm run : npm run reusing -- --help

const { ArgumentParser } = require('argparse')


const parser = new ArgumentParser({ description: 'Update reused files from other projects' })
let args = parser.parse_args()


var http = require('http');
var https = require('https');
var fs = require('fs');

// var download = function(url, dest, callback) {
//   var file = fs.createWriteStream(dest);
//   https.get(url, function(response) {
//     response.pipe(file);
//     file.on('finish', function() {
//       file.close(callback);
//       console.log("Done", url)
//     });
//   });
// }


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
      file.on('finish', () => resolve(fileInfo));
  
      request.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });
  
      file.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });
  
      request.end();
    });
  }
  

var replace_in_file = async function(someFile, search, replace){
    const data = await fs.promises.readFile(someFile, 'utf8');
    const result = data.replace(search,replace)
    await fs.promises.writeFile(someFile, result,'utf8');
}

download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/btnLogIn.vue", "src/components/reusing/btnLogIn.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/btnLogOut.vue", "src/components/reusing/btnLogOut.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/ChartPie.vue", "src/components/reusing/ChartPie.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/DisplayValues.vue", "src/components/reusing/DisplayValues.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyDatePicker.vue", "src/components/reusing/MyDatePicker.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyDateTimePicker.vue", "src/components/reusing/MyDateTimePicker.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/MyMenuInline.vue", "src/components/reusing/MyMenuInline.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/components/SwitchLanguages.vue", "src/components/reusing/SwitchLanguages.vue")
download("https://raw.githubusercontent.com/turulomio/vipcontacts/main/src/components/PasteImage.vue", "src/components/reusing/PasteImage.vue")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/rules.js", "src/components/reusing/rules.js")
download("https://raw.githubusercontent.com/turulomio/moneymoney/main/src/my_commons.js", "src/components/reusing/my_commons.js")

