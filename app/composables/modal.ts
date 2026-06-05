const overlay = useOverlay();
export function openModal(
  component: any,
  props: object,
) {
  const modal = overlay.create(component, {
    props,
  });

  return modal.open();
}
