export async function handleResponse(res : Response) : Promise<any> {
	const data = await res.json();

	if (res.status < 300) {
		return data;
	}

	if (data.error) {
		throw new Error(data.error);
	}

	throw new Error(res.status.toString());
}
