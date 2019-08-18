// TODO extract this into a separate module?

/** @internal */
export default class Validator {

	private readonly sourceObject : any;

	public constructor(object : any) {
		this.sourceObject = object;
	}

	public getBoolean(property : string) : boolean;
	public getBoolean(property : string, optional : true) : boolean | undefined;
	public getBoolean(property : string, optional : boolean = false) : boolean | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (typeof data !== 'boolean') {
			throw new TypeError(`Property ${ property } of object is not a boolean`);
		}

		return data;
	}

	public getNumber(property : string) : number;
	public getNumber(property : string, optional : true) : number | undefined;
	public getNumber(property : string, optional : boolean = false) : number | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (typeof data !== 'number') {
			throw new TypeError(`Property ${ property } of object is not a number`);
		}

		return data;
	}

	public getString(property : string) : string;
	public getString(property : string, optional : true) : string | undefined;
	public getString(property : string, optional : boolean = false) : string | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (typeof data !== 'string') {
			throw new TypeError(`Property ${ property } of object is not a string`);
		}

		return data;
	}

	public getArray<T>(property : string, type : string) : T[];
	public getArray<T>(property : string, type : string, optional : true) : T[] | undefined;
	public getArray<T>(property : string, type : string, optional : boolean = false) : T[] | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (!Array.isArray(data)) {
			throw new TypeError(`Property ${ property } of object is not an array`);
		}

		if (!data.every(i => typeof i === type)) {
			throw new TypeError(`Array ${ property } in object contains invalid types`);
		}

		return data;
	}

	public getObject<T>(property : string) : T;
	public getObject<T>(property : string, optional : true) : T | undefined;
	public getObject<T>(property : string, optional : boolean = false) : T | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (typeof data !== 'object') {
			throw new TypeError(`Property ${ property } of object is not an object`);
		}

		return data;
	}

	public getDate(property : string) : Date;
	public getDate(property : string, optional : true) : Date | undefined;
	public getDate(property : string, optional : boolean = false) : Date | undefined {
		const data = this.getProperty(property, optional);

		if (optional && data === undefined) {
			return undefined;
		}

		if (data instanceof Date) {
			return data;
		}

		if (typeof data === 'string' || typeof data === 'number') {
			return new Date(data);
		}

		throw new TypeError(`Property ${ property } of object is not a date, date string or timestamp`);
	}

	private getProperty(property : string, optional : boolean) : any {
		if (this.sourceObject[property] === null || this.sourceObject[property] === undefined) {
			if (optional) {
				return undefined;
			}

			throw new Error(`Property ${ property } does not exist on object`);
		}

		return this.sourceObject[property];
	}
}
