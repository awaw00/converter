import path from 'path';
import getExcelData from '../utils/excel';

export default {
  run () {
    return new Promise((resolve) => {
      const res = getExcelData(path.join(__dirname, '../static/test.xlsx'), {
        alias: ['id', 'value'],
        ignoreFirstRow: true
      });
      resolve(res);
    });
  },
  outputExt: '.json'
}
