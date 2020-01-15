export function handleResponse(res : Response) : Promise<any> {
	return res.json().then(data => {
		if (res.status < 300) {
			return data;
		}
	
		if (data.error) {
			throw new Error(data.error);
		}
	
		throw new Error(res.status.toString());
	});
}
