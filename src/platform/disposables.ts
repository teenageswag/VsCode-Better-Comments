import * as vscode from 'vscode';

export interface DisposableStore {
	add(...disposables: vscode.Disposable[]): void;
	dispose(): void;
}

class DisposableStoreImpl implements DisposableStore {
	private readonly items: vscode.Disposable[] = [];

	public add(...disposables: vscode.Disposable[]): void {
		this.items.push(...disposables);
	}

	public dispose(): void {
		while (this.items.length > 0) {
			this.items.pop()?.dispose();
		}
	}
}

export function createDisposableStore(): DisposableStore {
	return new DisposableStoreImpl();
}

export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | undefined;

	return (...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => fn(...args), delay);
	};
}
