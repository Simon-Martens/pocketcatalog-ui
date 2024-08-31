import { tables } from '$stores/tables';

export function match(param: string) {
	// TODO: we do an extra content table, just with serials; but for now this is enough:
	return !!(tables.GetTable(param)?.Type === "Entries" || tables.GetTable(param)?.Type === "Contents");
}
