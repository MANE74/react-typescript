export const scrollTo = (
  countryRef: React.RefObject<HTMLLIElement>,
  dropDownRef: React.RefObject<HTMLUListElement>
) => {
  if (!countryRef.current) return;
  const container = dropDownRef.current;
  if (!container || !document.body) return;

  const containerHeight = container.offsetHeight;

  const containerOffset = container.getBoundingClientRect();

  const containerTop = containerOffset.top + document.body.scrollTop;
  const containerBottom = containerTop + containerHeight;

  const element = countryRef.current;
  const elementOffset = element.getBoundingClientRect();

  const elementHeight = element.offsetHeight;
  const elementTop = elementOffset.top + document.body.scrollTop;
  const elementBottom = elementTop + elementHeight;

  let newScrollTop = elementTop - containerTop + container.scrollTop;

  if (elementTop < containerTop) {
    container.scrollTop = newScrollTop;
  } else if (elementBottom > containerBottom) {
    const heightDifference = containerHeight - elementHeight;
    container.scrollTop = newScrollTop - heightDifference;
  }
};
