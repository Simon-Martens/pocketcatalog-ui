import { tables } from '$stores/schema';

export function match(param: string) {
	if (Object.hasOwn(tables, "Entries")) {
		return tables["Entries"].some((t) => t.Name === param);
	}
}
