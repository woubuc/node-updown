# Require modules
moment = require 'moment'
request = require 'request'

###
Updown
Simple API wrapper for the updown.io service
###
class Updown

  ###
  Constructor method
  @param {string} apiKey - Your Updown API key
  @param {object} config - A configuration object. Currently only supports the `readOnly` property
  ###
  constructor: (@apiKey, config = {}) ->

    # Assign config properties
    @readOnly = config.readOnly or no


  ###
  Loads an URL with the Updown API key header
  @param {string} url - The API URL to call
  @param {object} query - (optional) Parameters to be added to the querystring
  @param {function} callback - Is called when the request completes
  ###
  _get: (url, query = {}, callback) ->

    # Allow for (url, callback) parameters without query
    if typeof query is 'function' and not callback?
      [callback, query] = [query, {}]

    # Add getTime to urls to prevent caching
    query._t = new Date().getTime()

    # Initiate GET request
    request
      url: url
      method: 'GET'
      json: yes
      qs: query
      headers:
        'X-API-KEY': @apiKey

    # Handle result
    , (err, response, data) ->
      callback(err, data)


  ###
  Posts data to an URL with the Updown API key header
  @param {string} method - Method for the HTTP request
  @param {string} url - The API URL to post to
  @param {object} params - Parameters to be sent in the POST body
  @param {function} callback - Is called when the request completes
  ###
  _req: (method, url, params, callback) ->

    # Initiate POST request
    request
      url: url
      method: method
      json: yes
      form: params
      headers:
        'X-API-KEY': @apiKey

    # Handle result
    , (err, response, data) ->
      callback(err, data)




  ###
  Gets all checks for the user
  ###
  getChecks: ->

    # Create promise
    new Promise (resolve, reject) =>

      # Create request
      @_get 'https://updown.io/api/checks', (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)


  ###
  Gets downtime information about a specific check
  @param {string} token - The token for a check
  @param {number} page - The page number (results are paginated per 100)
  ###
  getDowntime: (token, page) ->

    # Create promise
    new Promise (resolve, reject) =>

      # Check if parameters are valid
      return reject new TypeError('token parameter should be a string') if typeof token isnt 'string'
      return reject new TyepError('page parameter should be a number') if typeof page isnt 'number'

      # Get query parameters
      query = {}
      query.page = page if page?

      # Create request
      @_get 'https://updown.io/api/checks/' + token + '/downtimes', query, (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)


  ###
  Gets metrics for a specific check
  @param {string} token - The token for a check
  @param {number} from - Start date of the metrics (timestamp in milliseconds)
  @param {number} to - End date of the metrics (timestamp in milliseconds)
  @param {boolean} sortByTime - Set this to true if you want to get results separated by time instead of totals
  ###
  getMetrics: (token, from, to, sortByTime = no) ->

    # Create promise
    new Promise (resolve, reject) =>

      # Check if parameters are valid
      return reject new TypeError('token parameter should be a string') if typeof token isnt 'string'

      # Get query parameters
      query = {}
      query.from = moment(from).format('YYYY-MM-DD hh:mm:ss') if from?
      query.to = moment(to).format('YYYY-MM-DD hh:mm:ss') if to?
      query.group = 'time' if sortByTime


      # Create request
      @_get 'https://updown.io/api/checks/' + token + '/metrics', query, (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)


  ###
  Adds new check
  @param {string} url - The URL to check
  @param {number} interval - The interval in seconds (30, 60, 120, 300 or 600)
  @param {string} name - (optional) An alias to recognise this url by
  ###
  addCheck: (url, interval, name) ->

    # Create promise
    new Promise (resolve, reject) =>

      # Reject if we're in read-only mode
      return reject new Error('Updown is set to read-only mode') if @readOnly

      # Check if parameters are valid
      return reject new TypeError('url parameter should be a string') if typeof url isnt 'string'
      return reject new TypeError('interval parameter should be a number') if typeof interval isnt 'number'
      return reject new RangeError('interval must be 30, 60, 120, 300 or 600') if interval not in [30, 60, 120, 300, 600]

      # Assemble params
      params =
        url: url
        period: interval
      params.name = name if name?

      # Create request
      @_req 'POST', 'https://updown.io/api/checks/', params, (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)



  ###
  Modifies a check
  @param {string} token - The token
  @param {string} url - (optional) The new URL
  @param {number} interval - (optional) The new interval in seconds (30, 60, 120, 300 or 600)
  @param {string} name - (optional) A new alias for the check
  ###
  modifyCheck: (token, url, interval, name) ->

    # Create promise
    new Promise (resolve, reject) =>

      # Reject if we're in read-only mode
      return reject new Error('Updown is set to read-only mode') if @readOnly

      # Check if parameters are valid
      return reject new TypeError('token parameter should be a string') if typeof token isnt 'string'
      return reject new TypeError('url parameter should be a string') if url? and typeof url isnt 'string'
      return reject new TypeError('interval parameter should be a number') if interval? and typeof interval isnt 'number'
      return reject new RangeError('interval must be 30, 60, 120, 300 or 600') if interval? and interval not in [30, 60, 120, 300, 600]

      # Assemble params
      params = {}
      params.url = url if url?
      params.period = interval if interval?
      params.name = name if name?

      # Create request
      @_req 'PUT', 'https://updown.io/api/checks/' + token, params, (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)

  ###
  Deletes a check
  @param {string} token - Token of the check to delete
  ###
  deleteCheck: (token) ->

    # Create promise
    new Promise (resolve, reject) =>

      # Reject if we're in read-only mode
      return reject new Error('Updown is set to read-only mode') if @readOnly

      # Check if parameters are valid
      return reject new TypeError('token parameter should be a string') if typeof token isnt 'string'

      @_req 'DELETE', 'https://updown.io/api/checks/' + token, {}, (err, data) ->

        # Reject if request errored
        return reject(err) if err

        # Resolve with response data
        resolve(data)


# Export class
module.exports = Updown
