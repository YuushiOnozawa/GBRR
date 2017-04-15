const fs = require('fs');
const glob = require('glob');
const del = require('del');
const scssDir = 'src/client/scss';
const fileList = glob.sync(`${scssDir}/**/_*.scss`);
let importString = '';

fileList.forEach((item) => {
    //ループになるので除外。ファイル削除完了後でもいいかな？
    if(item !== 'src/client/scss/_include.scss') {
        importString += `@import "${item.substr(item.indexOf('scss/')+5, item.length)}";\n`;
    }
});

fs.writeFileSync('src/client/scss/_include.scss', importString);