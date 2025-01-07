
export function active(filter) {
  return filter.clahe.active || filter.rotate.active;
}

export default {active}