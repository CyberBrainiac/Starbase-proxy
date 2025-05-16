"use strict"

const removeNetworkErrorPopup = () => {
  // Create a MutationObserver to detect when the popup is added to the DOM
  const observer = new MutationObserver((mutations) => {
    console.log("Mutation", Date.now());

    try {
      for (const mutation of mutations) {
        const root = document.querySelector('#root');
        const body = document.querySelector('body');

        //list to delete
        const dialog = document.querySelector('div.fixed.z-50.bg-containerDark.rounded-\\[24px\\]');
        const wcmModals = document.querySelectorAll('wcm-modal');
        const spanFocusGuards = document.querySelectorAll('span[data-radix-focus-guard]');
        const errorPage = document.querySelector("#root > div:nth-child(2)");
        const backdrop = document.querySelector('div[data-state="open"].fixed.z-50.bg-black\\/50');

        const allElementToRemove = [dialog, backdrop,  errorPage, ...wcmModals, ...spanFocusGuards];

        //delete styles block scroll
        root.style = '';
        body.style = ''
        
        for (const element of allElementToRemove) {
          if (!element) continue;
          element.remove();
          console.log('Element removed successfully');
        }
      }
    } catch (error) {
      console.error(`***************${error}*******************`);
      
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
};

const restoreOriginalContent = () => {
  const targetElement = document.querySelector('#root');
  
  if (!targetElement) {
    console.error('Target element not found');
    return;
  }
  
  // Store the original HTML content
  const originalContent = targetElement.innerHTML;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {

      if (mutation.type !== 'childList') continue;
      const removedNodes = [...mutation.removedNodes]

      if (!removedNodes.length) continue;
      const main = document.querySelector('main');
      if (main) continue;

      targetElement.innerHTML = originalContent; //restore content
      console.log("content restored");

      break; //if i have 4 child mutation events this occurs 4 replacing of main content, so i break cycle to prevent this
    }
  });

  observer.observe(targetElement, { childList: true, subtree: true });
  return observer;
};

document.addEventListener('DOMContentLoaded', () => {
  removeNetworkErrorPopup();
  restoreOriginalContent();
  console.log("Add observers");
});