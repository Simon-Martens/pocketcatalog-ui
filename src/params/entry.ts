import { tables } from '$stores/schema';

export function match(param: string) {
	let res = false;
	if (Object.hasOwn(tables, "Entries")) {
		res = tables["Entries"].some((t) => t.Name === param);
	} if (!res && Object.hasOwn(tables, "Contents")) {
		res = tables["Contents"].some((t) => t.Name === param);
	}
	return res;
}
