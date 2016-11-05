import J from 'j';

const defaultOption = {
  filename: '',
  sheet: 0,
  mode: 'row',
  alias: [],
  ignoreFirstRow: false,
  ignoreFirstCol: false
};

export default function (filename, option) {
  if (typeof filename === 'object') {
    option = filename;
    filename = option.filename || '';
  }
  if (!/\.xlsx?$/.test(filename)) {
    throw new Error(`Invalid excel filename [${filename}].`);
  }

  const {ignoreFirstRow, ignoreFirstCol, sheet, mode, alias} = Object.assign({}, defaultOption, option);

  console.log('Read excel file start...');
  const excel = J.readFile(filename)[1];
  console.log('Read excel file finished.');

  const workSheet = excel.Sheets[excel.SheetNames[sheet]];

  const [_, rangeStart, rangeEnd] = workSheet['!ref'].match(/^(.*?):(.*?)$/i);
  const colStart = rangeStart.charCodeAt(0) + (ignoreFirstCol ? 1 : 0);
  const rowStart = +rangeStart[1] + (ignoreFirstRow ? 1 : 0);
  const colEnd = rangeEnd.charCodeAt(0);
  const rowEnd = +rangeEnd[1];

  let mainLoopStart, mainLoopEnd,
      subLoopStart, subLoopEnd;

  if (/^row$/i.test(mode)) {
    mainLoopStart = rowStart;
    mainLoopEnd = rowEnd;
    subLoopStart = colStart;
    subLoopEnd = colEnd;
  } else {
    mainLoopStart = colStart;
    mainLoopEnd = colEnd;
    subLoopStart = rowStart;
    subLoopEnd = rowEnd;
  }

  const resArr = [];
  for (let i = mainLoopStart; i <= mainLoopEnd; i++) {
    const obj = {};
    for (let j = subLoopStart; j <= subLoopEnd; j++) {
      const sheetIndex = mode === 'row'
        ? String.fromCharCode(j) + i
        : String.fromCharCode(i) + j;
      const objKeyIndex = j - subLoopStart;
      const objKey = alias[objKeyIndex] || objKeyIndex;
      obj[objKey] = workSheet[sheetIndex].v;
    }
    resArr.push(obj);
  }

  return resArr;
};
