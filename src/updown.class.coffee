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
	@param {string} url - The API URL to post to
	@param {object} params - Parameters to be sent in the POST body
	@param {function} callback - Is called when the request completes
	###
	_post: (url, params, callback) ->

		# Initiate POST request
		request
			url: url
			method: 'POST'
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
	@param {number} sortByTime - Set this to true if you want to get results separated by time instead of totals
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
				interval: interval
			params.name = name if name?

			# Create request
			@_post 'https://updown.io/api/checks/', params, (err, data) ->

				# Reject if request errored
				return reject(err) if err

				# Resolve with response data
				resolve(data)
			


# Export class
module.exports = Updown