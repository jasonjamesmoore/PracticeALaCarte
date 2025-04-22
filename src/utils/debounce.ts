// type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
// 	? A
// 	: never;

export function debounce<TArgs extends any[], TReturn>(
	callback: (...args: TArgs) => TReturn,
	delay = 300
): (...args: TArgs) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function (...args: TArgs): void {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback(...args), delay);
	};
}