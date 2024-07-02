// ==UserScript==
// @name         Clear all App Registration in Azure Entra
// @namespace    https://github.com/siglud/Teams-Apps-Clear/
// @version      1.0
// @description  Clear all App Registration in Azure Entra
// @author       Siglud
// @match        https://entra.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @source       https://github.com/siglud/Teams-Apps-Clear/raw/main/src/ClearAppRegisteration.user.js
// @grant        window.onurlchange
// ==/UserScript==

(function () {
    'use strict';
    const AAD_PAGE = '#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceType/Microsoft_AAD_IAM';
    if (window.location.href.includes(AAD_PAGE)) {
        init();
    }

    function init() {
        const button = document.createElement('button');
        button.innerHTML = 'Clear All App Registration';
        button.onclick = () => {
            clearAllAppRegistration();
        };

        retryUntilElementReady(() => document.querySelector('h2.fxs-blade-title-titleText'), (contentArea) => {
            contentArea.appendChild(button);
            console.log('Button added');
        });
    }
    
    function clearAllAppRegistration() {
        retryUntilElementReady(() => {
            let tmp = document.evaluate("//span[contains(., 'Owned applications')]", document, null, XPathResult.ANY_TYPE, null);
            return tmp.iterateNext();
        }, (Owned) => {
            Owned.click();
            retryUntilElementReady(() => document.querySelectorAll('.fxc-gc-rows'), (contentArea) => {
                const rows = contentArea[contentArea.length - 1].querySelector('.fxc-gc-row');
                if (!rows) {
                    alert('All App Registration Cleared!');
                    return;
                }
                rows.querySelector('a').click();
                console.log('Click on App Registration detail page');
                retryUntilElementReady(() => document.querySelector('.fxs-blade-content-container-default-details ul li[title="Delete"] .azc-toolbarButton-label'), (deleteButton) => {
                    deleteButton.click();
                    console.log('Click on Delete button');
                    retryUntilElementReady(() => document.querySelector('.msportalfx-docking div[role="button"][title="Delete"]'), (confirmButton) => {
                        confirmButton.click();
                        console.log('Click on Confirm button');
                        document.querySelector('a[href="#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceType/Microsoft_AAD_IAM"]').click();
                        retryUntilElementReady(() => {
                            let tmp = document.querySelectorAll('div[class="fxs-blade-commandBarContainer fxs-portal-background az-noprint"] li>div');
                            if (tmp.length > 3) {
                                return tmp[3];
                            }
                        }, () => {
                            clearAllAppRegistration();
                        });                        
                    }, 'still waiting for Confirm button');
                }, 'still waiting for Delete button');
            }, 'still waiting for App Registration detail page');
        }, 'still waiting for Owned applications');
    }

    function retryUntilElementReady(selector, callback, errorLog) {
        const interval = setInterval(() => {
            const element = selector();
            if (element) {
                clearInterval(interval);
                callback(element);
            } else {
                if (errorLog) {
                    console.log(errorLog)
                }
            }
        }, 1000);
    }
})();