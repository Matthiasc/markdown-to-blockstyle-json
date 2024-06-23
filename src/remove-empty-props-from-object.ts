export default function removeEmptyPropsFromObject(o: Object): Object {
  const isEmpty = (value: any) =>
    value === undefined ||
    value === "" ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (value.constructor === Object && Object.keys(value).length === 0);

  Object.keys(o).forEach((key) => {
    //@ts-ignore
    if (isEmpty(o[key])) {
      //@ts-ignore
      delete o[key];
    }
  });

  return o;
}
