# node-updown
[![npm](https://img.shields.io/npm/v/node-updown)](![npm](https://img.shields.io/npm/v/node-updown?style=flat-square))
[![Travis CI](https://img.shields.io/travis/woubuc/node-updown)](https://travis-ci.org/woubuc/node-updown)
[![Contributors](https://img.shields.io/badge/contributors-2-orange)](#contributors)
[![MIT license](https://img.shields.io/github/license/woubuc/node-updown)](https://github.com/woubuc/node-updown/blob/master/LICENSE)

A simple Node.js API wrapper for [updown.io](http://updown.io)

```
npm install node-updown
```

# Usage
Simply create a new Updown instance:
```javascript
import Updown from 'node-updown';
const updown = new Updown('API_KEY');
```

All methods in the Updown class return promises.

## Methods
For more information on the various API endpoints, see the [Updown API documentation](https://updown.io/api)

#### getChecks()
Gets all checks.
```javascript
updown.getChecks().then(checks => {
    console.log(checks);
});
```

#### getDowntime(token [, page])
Gets downtime information for a check.
```javascript
updown.getDowntime('check_token').then(downtime => {
    console.log(downtime);
});
```

#### getMetrics(token [, from][, to][, sortByTime])
Gets all metrics for a check. Parameters `from` and `to` are timestamps in milliseconds (e.g. from `Date.getTime()`).
```javascript
updown.getMetrics('check_token').then(metrics => {
    console.log(metrics);
});
```

#### addCheck (url [, interval][, name])
Adds a new check. Parameter `interval` can be 15, 30, 60, 120, 300, 600, 1800 or 3600.
```javascript
// Add a check for http://example.com with 10 minute interval
updown.addCheck('http://example.com', 600).then(newCheck => {
    console.log(newCheck);
});
```

#### modifyCheck (token [, url][, interval][, name])
Modifies a check.
```javascript
// Change a check to 5 minute interval
updown.modifyCheck('check_token', null, 300).then(modifiedCheck => {
    console.log(modifiedCheck);
});
```

#### deleteCheck (token)
Deletes a check.
```javascript
// Change a check to 5 minute interval
updown.deleteCheck('check_token').then(response => {
    console.log(response.deleted);
});
```

## Issues
If you have any problems or questions, just create an issue and I will take a look at it asap.

## Contributors
Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)) ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.woubuc.be"><img src="https://avatars1.githubusercontent.com/u/1015540?v=4" width="100px;" alt="Wouter Buckens"/><br /><sub><b>Wouter Buckens</b></sub></a><br /><a href="https://github.com/woubuc/node-updown/commits?author=woubuc" title="Code">💻</a> <a href="#tool-woubuc" title="Tools">🔧</a> <a href="https://github.com/woubuc/node-updown/commits?author=woubuc" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/woubuc/node-updown/commits?author=MichaelDeBoey" title="Documentation">📖</a> <a href="#maintenance-MichaelDeBoey" title="Maintenance">🚧</a> <a href="#tool-MichaelDeBoey" title="Tools">🔧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

## LICENSE
This package is licensed under the [MIT license](/LICENSE)
