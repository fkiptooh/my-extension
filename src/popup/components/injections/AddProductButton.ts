export const AddProductButton = (buttonText: string, displayStyle: string,  clickFunction: (buttonContainer: HTMLDivElement) => void,
afterClickFunction: (buttonContainer: HTMLDivElement) => void) => {
    // Create the button container
    const btnContainer = document.createElement('div') as HTMLDivElement;
    btnContainer.classList.add('ext-button');
    btnContainer.style.display = displayStyle;

    // Create the button
    const button = document.createElement('button') as HTMLButtonElement;
    button.classList.add('ext-add-individual-product-button');
    button.type = 'button';

    // Create left container for button text
    const leftContainer = document.createElement('div') as HTMLDivElement;
    leftContainer.classList.add('left-container');

    // Create text container and set button text
    const textContainer = document.createElement('div');
    textContainer.classList.add('ext-add-product-text');
    textContainer.textContent = buttonText;

    // Append text container to left container
    leftContainer.appendChild(textContainer);

    // Append left container to the button
    button.appendChild(leftContainer);

    // Append button to button container
    btnContainer.appendChild(button);

    button.addEventListener('click', function () {
        if (button.getAttribute('data-clicked') === 'true') {
          afterClickFunction(btnContainer);
        } else {
          clickFunction(btnContainer);
          button.setAttribute('data-clicked', 'true');
        }
      });
    
    // Return the button container
    return btnContainer;
}
