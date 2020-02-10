// PE 3/3 
function doEveryXSecondsForYSeconds(anomFunction, X, Y) {
    const interval = setInterval(anomFunction, X * 1000);
    setTimeout(() => {
        clearInterval(interval)
    }, Y * 1000);
}

// PE 2/3
// confusing name 
function getMainUrlName(url) {
    url = url.replace('www.', '')
    url = url.split("//")[1];
    url = url.split('?')[0];
    url = url.split('/')[0];
    return url;
}

// PE 2/3
// Add comments
window.addEventListener('keydown', function (e) {
    if (authUser) {
        var hasFocus = document.querySelectorAll('input:focus').length > 0
        var modalIsOpen = ($("#add-resource-modal").data('bs.modal') || {})._isShown;

        if (e.keyCode === 81 && hasFocus == false && modalIsOpen != true) {
            setTimeout(() => {
                addResourceModal.clearInputs();
                addResourceModal.open();
            }, 300)
        }
    }
})

/**
 * Intuitive: PE 3/3 
 */
function getUrlParamByName(name) {
    return new URLSearchParams(window.location.search).get(name);
}

/**
 * Intuitive: PE 2/3
 * 
 * Description: A fetch that calls json() for you. 
 * It also sets url parameters for GET requests.
 */
function fetchJson(url, config = null, obj = null) {
    // GET request -> Set url parameters
    if (config == null || config.method == "GET") {
        if (obj) {
            url += "?"
            for (key in obj) {
                url += key + "=" + obj[key] + "&"
            }
        }
    }

    return fetch(url, config).then(r => r.json())
}

// PE 2/3
function URLisValid(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}