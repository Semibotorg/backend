/* eslint-disable unicorn/filename-case */
function globalErrorHandler(error: Error) {
	console.error('Unhandled error occurred:');
	console.error(error);
}
export function handleErrors() {
	process.on('uncaughtException', globalErrorHandler);
	process.on('unhandledRejection', globalErrorHandler);
}
