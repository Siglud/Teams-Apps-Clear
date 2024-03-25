// ==UserScript==
// @name         Clear Teams App
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  clear all teams app that you created
// @author       Siglud
// @source       https://github.com/siglud/Teams-Apps-Clear/raw/main/src/ClearTeamsApps.user.js
// @namespace    https://github.com/siglud/Teams-Apps-Clear/raw/main/src/ClearTeamsApps.user.js
// @match        https://dev.teams.microsoft.com/apps
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const event = new Event('change', { bubbles: true });
    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Clear All Apps';
    button.onclick = () => {
        clearAll();
    };

    const init = setInterval(() => {
        if (!document.querySelector('main')) {
            console.log('Still waiting for page init');
        } else {
            clearInterval(init);
            document.querySelector('main').appendChild(button);
        }
    }, 1000);

    function clearAll() {
        const delBtn = document.querySelector(".ui-table__cell button");
        if (!delBtn) {
            alert('All Apps Cleared!');
            return;
        }

        delBtn.click();
        const clickDot = setInterval(() => {
            const panel = document.querySelector(".ui-popup__content li:nth-child(3) a");
            if (panel) {
                clearInterval(clickDot);
                panel.click();                
                const clickDelete = setInterval(() => {
                    const verifyColumn = document.querySelector(".ui-box>div[role='dialog'] span");
                    const input = document.querySelector(".ui-box>div[role='dialog'] section input");
                    if (input && verifyColumn) {
                        clearInterval(clickDelete);
                        input.value = verifyColumn.innerText;
                        input._valueTracker.setValue('');
                        input.dispatchEvent(event);
                        const deleteButton = document.querySelector('.ui-dialog__footer button:nth-child(2)');
                        deleteButton.click();
                        const clickDone = setInterval(() => {
                            const doneBtn = document.querySelector('div[role="alert"] button');
                            if (doneBtn) {
                                clearInterval(clickDone);
                                doneBtn.click();
                                clearAll();
                            }
                        }, 1000);
                    }
                }, 1000);
            }
        }, 1000);
    }
})();