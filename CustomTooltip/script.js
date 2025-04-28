// Get all elements with the data-toggle attribute
const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');

// Loop through each element and create a tooltip
tooltipElements.forEach((element) => {
  const tooltipContent = element.getAttribute('title');
  const tooltipType = element.getAttribute('data-tooltip-type');
  const placement = element.getAttribute('data-placement');

  // Create the tooltip element
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.innerHTML = tooltipContent;

  // Add the tooltip type class if specified
  if (tooltipType) {
    tooltip.classList.add(`tooltip-${tooltipType}`);
  }

  // Add the tooltip to the page
  document.body.appendChild(tooltip);

  // Function to position the tooltip
  function positionTooltip() {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    switch (placement) {
      case 'top':
        tooltip.style.top = `${rect.top - tooltipRect.height}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        break;
      case 'right':
        tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipRect.height / 2)}px`;
        tooltip.style.left = `${rect.right}px`;
        break;
      case 'bottom':
        tooltip.style.top = `${rect.bottom}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        break;
      case 'left':
        tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipRect.height / 2)}px`;
        tooltip.style.left = `${rect.left - tooltipRect.width}px`;
        break;
      default:
        break;
    }
  }

  // Position the tooltip initially
  positionTooltip();

  // Show the tooltip on hover
  element.addEventListener('mouseover', () => {
    tooltip.classList.add('show');
    positionTooltip();
  });

  // Hide the tooltip on mouse out
  element.addEventListener('mouseout', () => {
    tooltip.classList.remove('show');
  });

  // Add keyboard navigation support
  element.addEventListener('focus', () => {
    tooltip.classList.add('show');
    positionTooltip();
  });

  element.addEventListener('blur', () => {
    tooltip.classList.remove('show');
  });

  // Update tooltip position on window resize
  window.addEventListener('resize', () => {
    positionTooltip();
  });
});