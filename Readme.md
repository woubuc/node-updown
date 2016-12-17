# node-updown
A simple Node.js API wrapper for [updown.io](http://updown.io)

```
npm install @proux/node-updown
```

# Usage
Simply create a new Updown instance:
```javascript
Updown = require('@proux/node-updown');
var ud = new Updown('api_key');
```

All methods in the Updown class return promises.

## Methods
For more information on the various API endpoints, see the [Updown API documentation](https://updown.io/api)

#### getChecks()
Gets all checks
```javascript
ud.getChecks().then(function(checks) {
    console.log(checks);
});
```

#### getCheckDowntime(token [, page])
Gets downtime information for a check.
```javascript
ud.getCheckDowntime('check_token').then(function(downtime) {
    console.log(downtime);
});
```

#### getCheckMetrics(token [, from][, to][, sortByTime])
Gets all metrics for a check. Parameters `from` and `to` are timestamps in milliseconds (e.g. from `Date.getTime()`).
```javascript
ud.getCheckMetrics('check_token').then(function(metrics) {
    console.log(metrics);
});
```

#### addCheck (url [, interval][, name])
Adds a new check. Parameter `interval` can be 30, 60, 120, 300 or 600.
```javascript
// Add a check for http://example.com with 10 minute interval
ud.addCheck('http://example.com', 600).then(function(newCheck) {
    console.log(newCheck);
});
```

#### modifyCheck (token [, url][, interval][, name])
Modifies a check
```javascript
// Change a check to 5 minute interval
ud.modifyCheck('check_token', null, 300).then(function(modifiedCheck) {
    console.log(modifiedCheck);
});
```

#### deleteCheck (token)
Deletes a check
```javascript
// Change a check to 5 minute interval
ud.deleteCheck('check_token').then(function(response) {
    console.log(response.deleted);
});
```


## Issues
If you have any problems or questions, just create an issue and I will take a look at it asap.
