import { Check, CheckOptions } from '../types/Check';
import { Deleted } from '../types/Deleted';
import { Downtime } from '../types/Downtime';
import { GroupedMetrics, Metrics } from '../types/Metrics';
import { Nodes } from '../types/Node';
import { Webhook, WebhookOptions } from '../types/Webhook';

import { getChecks } from '../api/getChecks';
import { getCheck, GetCheckOptions } from '../api/getCheck';
import { getDowntimes, GetDowntimesOptions } from '../api/getDowntimes';
import { getMetrics, GetGroupedMetricsOptions, GetMetricsOptions } from '../api/getMetrics';
import { addCheck } from '../api/addCheck';
import { updateCheck } from '../api/updateCheck';
import { deleteCheck } from '../api/deleteCheck';
import { getIpv4Nodes, getIpv6Nodes, getNodes } from '../api/getNodes';
import { getWebhooks } from '../api/getWebhooks';
import { addWebhook } from '../api/addWebhook';
import { deleteWebhook } from '../api/deleteWebhook';

export class UpdownClient {

	private readonly apiKey : string;

	constructor(apiKey : string) {
		this.apiKey = apiKey;
	}

	public getChecks() : Promise<Check[]> {
		return getChecks(this.apiKey);
	}

	public getCheck(token : string, options ?: GetCheckOptions) : Promise<Check> {
		return getCheck(this.apiKey, token, options);
	}

	public getDowntimes(token : string, options ?: GetDowntimesOptions) : Promise<Downtime[]> {
		return getDowntimes(this.apiKey, token, options);
	}

	public getMetrics(token : string, options ?: GetMetricsOptions) : Promise<Metrics>;
	public getMetrics(token : string, options : GetGroupedMetricsOptions) : Promise<GroupedMetrics>;
	public getMetrics(token : string, options : GetGroupedMetricsOptions = {}) : Promise<Metrics | GroupedMetrics> {
		return getMetrics(this.apiKey, token, options);
	}

	public addCheck(options : CheckOptions) : Promise<Check> {
		return addCheck(this.apiKey, options);
	}

	public updateCheck(token : string, options : Partial<CheckOptions>) : Promise<Check> {
		return updateCheck(this.apiKey, token, options);
	}

	public deleteCheck(token : string) : Promise<Deleted> {
		return deleteCheck(this.apiKey, token);
	}

	public getNodes() : Promise<Nodes> {
		return getNodes();
	}

	public getIpv4Nodes() : Promise<string[]> {
		return getIpv4Nodes();
	}

	public getIpv6Nodes() : Promise<string[]> {
		return getIpv6Nodes();
	}

	public getWebhooks() : Promise<Webhook[]> {
		return getWebhooks(this.apiKey);
	}

	public addWebhook(options : WebhookOptions) : Promise<Webhook> {
		return addWebhook(this.apiKey, options);
	}

	public deleteWebhook(id : string) : Promise<Deleted> {
		return deleteWebhook(this.apiKey, id);
	}
}
