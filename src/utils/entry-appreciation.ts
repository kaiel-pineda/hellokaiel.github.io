export type EntryAppreciationKind = "kudos" | "claps";

export type EntryAppreciationCopy = {
	actionLabel: string;
	description: string;
	eyebrow: string;
	pluralLabel: string;
	singularLabel: string;
};

const entryAppreciationCopyByKind: Record<EntryAppreciationKind, EntryAppreciationCopy> = {
	claps: {
		actionLabel: "Leave a clap",
		description: "A local-only interaction pass for now. The backend can aggregate this later.",
		eyebrow: "Applause",
		pluralLabel: "claps",
		singularLabel: "clap",
	},
	kudos: {
		actionLabel: "Send signal",
		description: "A local-only interaction pass for now. The backend can aggregate this later.",
		eyebrow: "Signal",
		pluralLabel: "signals",
		singularLabel: "signal",
	},
};

export function getEntryAppreciationCopy(kind: EntryAppreciationKind): EntryAppreciationCopy {
	return entryAppreciationCopyByKind[kind];
}

export function getEntryAppreciationStorageKey(entryKey: string, kind: EntryAppreciationKind): string {
	return `entry-appreciation:${kind}:${entryKey}`;
}
