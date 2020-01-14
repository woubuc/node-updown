export { UpdownClient } from './client/UpdownClient';

// Ordered as they appear on Updown's API docs

export { getChecks } from './api/getChecks';
export { getCheck } from './api/getCheck';
export { getDowntimes } from './api/getDowntimes';
export { getMetrics } from './api/getMetrics';

export { addCheck } from './api/addCheck';
export { updateCheck } from './api/updateCheck';
export { deleteCheck } from './api/deleteCheck';

export { getNodes, getIpv4Nodes, getIpv6Nodes } from './api/getNodes';

export { getWebhooks } from './api/getWebhooks';
export { addWebhook } from './api/addWebhook';
export { deleteWebhook } from './api/deleteWebhook';
