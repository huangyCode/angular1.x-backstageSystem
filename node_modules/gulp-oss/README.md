# gulp-oss

> oss plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-oss` as a development dependency:

```shell
npm install --save-dev gulp-oss
```

```javascript
var gulp = require("gulp");
var oss = require("gulp-oss");
var gzip = require("gulp-gzip");

gulp.src('./**/*.js')
  .pipe(gzip({ append: false }))
  .pipe(oss({
    "key": "oss key",
    "secret": "oss secret",
    "endpoint": "http://oss-cn-beijing.aliyuncs.com"
  }, {
    headers: {
      Bucket: 'oss bucket',
      CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
      ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
      ContentEncoding: 'gzip',          // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
      ServerSideEncryption: '',
      Expires: ''
    },
    uploadPath: 'assets/js/'
  }));
```
