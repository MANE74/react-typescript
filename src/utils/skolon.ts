import { getItem } from './storage';

var loadedSkolon = false;

export function loadSkolonButtonScript() {
  if (!loadedSkolon && getItem('user')?.sso_provider === 0) {
    var button = document.createElement('div');
    button.className = 'skolon-menu-button';
    button.setAttribute('data-always-show', 'true');

    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'skolon-button-wrapper';
    buttonWrapper.appendChild(button);

    document.getElementsByTagName('body')[0].appendChild(buttonWrapper);

    var buttonSrc = 'https://api.skolon.com/v1/plugins/menu/button.js';
    var node = document.createElement('script');
    node.src = buttonSrc;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
    loadedSkolon = true;
  }
}

export function unloadSkolonButtonScript() {
  document.querySelector('.skolon-button-wrapper')?.remove();
}
