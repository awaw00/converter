# 数据转换工具

使用 gulp 和 ejs 提供将任意格式的数据（如Excel文件）转换为指定格式的功能。

## 目录结构

.
├─ dist       # 处理后的文件的输出目录
├─ static     # 存放数据源等静态数据文件（可选）
├─ tasks      # 存放执行数据转换任务的js文件
├─ templates  # 存放ejs模板文件
├─ utils      # 存放通用的工具代码

## 使用说明

每一个数据转换任务都需要一个 ./tasks/${taskName}.js 文件和一个 ./templates/${taskName}.ejs 模板文件

两个文件的 taskName 必须保持一致。

其中，${taskName}.js 文件的默认导出对象必须包含一个名为 run 的方法，方法需要返回一个 Promise，
导出对象也可包含一个名为 outputExt 的属性，属性值将会作为输出的数据文件的后缀名，默认为'.json'。

下面是 task.js 文件的例子：


使用 CommonJS 语法：

```javascript
// testTask.js
module.export = {
  run: function () {
    return new Promise(function (resolve) {
      resolve({
        data: 'hello world'
      });
    });
  },
  outputExt: '.json'
}
```

使用 es6 语法和 async/await：

```javascript
// testTask.js
export default {
  async run () {
    return await request('http://test.com/api');
  },
  outputExt: '.txt'
}
```

有了 testTask.js 文件之后，需要创建一个 testTask.ejs 模板文件，
模板文件用于将 testTask.js 文件的 run 方法异步返回的数据根据模板的逻辑输出相应数据格式的文件。

比如，在 testTask.js 的 run 方法异步返回的数据为：
```javascript
[
  {
    id: 1,
    name: '小王'
  },
  {
    id: 2,
    name: '小张'
  }
]
```

在 testTask.ejs 文件中我们可以使用 data 对象获取上面的数据，编写下面的模板代码：

```ejs
<%- JSON.stringify(data) %>
```

然后执行 `$ gulp -n testTask` 将会在 dist 目录下输出一个 testTask.json 文件，文件内容为上述 data 对象的 json 格式数据。

使用 ejs 提供的强大模板语法，我们能够将任意数据转换为任意的格式输出到文件。

## 当前可用工具说明

### utils/excel.js

excel.js 导出了一个方便的读取 excel 文件数据的方法，使用方法如下：
```javascript
import path from 'path';
import readExcel from '../utils/excel';

export default {
  run () {
    return new Promise((resolve) => {
      const data = readExcel(
        path.join(__dirname, '../static/test.xlsx'), // excel 文件的路径
        {
          mode: 'row',              // 读取模式，可以为 'row' 和 'column'，默认为 'row'，会以一行的数据作为一个对象读取（'column' 以一列的数据作为一个对象读取）
          sheet: 0,                 // 读取的表的索引，默认为0，读取第一张表
          alias: ['id', 'name'],    // 每一行（或列）所读取到的数据对象的键名映射列表，默认值为[]，不传入 alias 得到的对象键名为0到n
          ignoreFirstRow: true,    // 忽略 excel 表中第一行数据，默认为 false
          ignoreFirstCol: false     // 忽略 excel 表中第一列数据，默认为 false
        }
      );
      resolve(data);
    });
  }
}
```

若 test.xlsx 的内容为：

| 序号 | 姓名 |
| ------ | ------ |
| 1 | 小王 |
| 2 | 小张 |

则上述 readExcel 方法返回的 data 则为:
```json
[
  {
    "id": 1,
    "name": "小王"
  },
  {
    "id": 2,
    "name": "小张"
  }
]
```

## 参考资料

- [ejs模板语法](https://github.com/mde/ejs)
- [gulp](https://github.com/gulpjs/gulp)
- [Excel 读取使用的模块： J](https://github.com/SheetJS/j)
