/**
 * The configuration options for the {@link Updown} class
 *
 * @remarks The {@link Updown} constructor takes a `Partial` of this object,
 *          which means all properties are effectively optional.
 */
export default interface UpdownConfig {
	/**
	 * Set this to true if the provided API key is a readonly key
	 *
	 * @remarks Read the [official Updown API documentation](https://updown.io/api#rest)
	 *          for the difference between regular API keys and readonly API keys.
	 *
	 * @default false
	 */
	readonly : boolean;

	/**
	 * Set this to true to make node-updown log debug information.
	 *
	 * __DO NOT USE IN PRODUCTION__, as this may log your API keys. This
	 * setting is only meant for debugging during development.
	 *
	 * @default false
	 */
	verbose : boolean;
}

/**
 * Takes a partial config and fills the missing properties with default values
 *
 * @param partial  The user-provided configuration object
 *
 * @internal
 */
export function parseConfig(partial : Partial<UpdownConfig>) : UpdownConfig {
	return {
		readonly: partial.readonly || false,
		verbose: partial.verbose || false,
	};
}
