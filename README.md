# node-updown

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

A simple Node.js API wrapper for [updown.io](http://updown.io)

```
npm install node-updown
```

# Usage

Simply create a new Updown instance:

```javascript
import Updown from 'node-updown';
const ud = new Updown('api_key');
```

All methods in the Updown class return promises.

## Methods

For more information on the various API endpoints, see the
[Updown API documentation](https://updown.io/api)

#### getChecks()

Gets all checks

```javascript
ud.getChecks().then(checks => {
	console.log(checks);
});
```

#### getCheckDowntime(token [, page])

Gets downtime information for a check.

```javascript
ud.getCheckDowntime('check_token').then(downtime => {
	console.log(downtime);
});
```

#### getCheckMetrics(token [, from][, to][, sortByTime])

Gets all metrics for a check. Parameters `from` and `to` are timestamps in
milliseconds (e.g. from `Date.getTime()`).

```javascript
ud.getCheckMetrics('check_token').then(metrics => {
	console.log(metrics);
});
```

#### addCheck (url [, interval][, name])

Adds a new check. Parameter `interval` can be 30, 60, 120, 300 or 600.

```javascript
// Add a check for http://example.com with 10 minute interval
ud.addCheck('http://example.com', 600).then(newCheck => {
	console.log(newCheck);
});
```

#### modifyCheck (token [, url][, interval][, name])

Modifies a check

```javascript
// Change a check to 5 minute interval
ud.modifyCheck('check_token', null, 300).then(modifiedCheck => {
	console.log(modifiedCheck);
});
```

#### deleteCheck (token)

Deletes a check

```javascript
// Change a check to 5 minute interval
ud.deleteCheck('check_token').then(response => {
	console.log(response.deleted);
});
```

## Issues

If you have any problems or questions, just create an issue and I will take a
look at it asap.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.woubuc.be"><img src="https://avatars1.githubusercontent.com/u/1015540?v=4" width="100px;" alt="Wouter Buckens"/><br /><sub><b>Wouter Buckens</b></sub></a><br /><a href="https://github.com/woubuc/node-updown/commits?author=woubuc" title="Code">💻</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="#maintenance-MichaelDeBoey" title="Maintenance">🚧</a> <a href="#tool-MichaelDeBoey" title="Tools">🔧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[emojis]: https://allcontributors.org/docs/en/emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
<!-- prettier-ignore-end -->
