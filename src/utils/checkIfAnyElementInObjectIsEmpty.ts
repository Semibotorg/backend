/* eslint-disable unicorn/filename-case */

export function checkIfAnyElementInObjectIsEmpty(object: object) {
	const isEmpty = Object.keys(object).some((key) => !object[key]);

	return isEmpty;
}
