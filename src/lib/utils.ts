export function toggleEditMode(
  get: () => boolean,
  set: (value: boolean) => void,
) {
  set(!get());
}

export function handleSelectChange(
  e: Event,
  setValue: (val: number) => void,
  toggle: () => void,
) {
  const target = e.target as HTMLSelectElement;
  setValue(+target.value);
  toggle();
}
