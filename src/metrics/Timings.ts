export default interface Timings {

	readonly redirect : number;

	readonly nameLookup : number;

	readonly connection : number;

	readonly handshake : number;

	readonly response : number;

	readonly total : number;

}
