export function createAndAppend(
  host: HTMLElement,
  elementType: string
): HTMLElement {
  const element: HTMLElement = document.createElement(elementType);
  host.appendChild(element);
  return element;
}
