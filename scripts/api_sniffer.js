/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2024, Philipp Reuter
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions, and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this
 *    list of conditions, and the following disclaimer in the documentation and/or
 *    other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may
 *    be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
 * OF SUCH DAMAGE.
 */

/**
 * Monitors and intercepts API requests to capture `clientSessionId` and `authorization` headers.
 * Reverts to original request functions once both values are captured.
 */
function apiSniffer() {
    // Check if clientSessionId and authorization are already defined in the global window object
    if (window.clientSessionId && window.authorization) {
        console.log(
            "clientSessionId and authorization are already defined:",
            window.clientSessionId,
            window.authorization
        );
        return;
    }

    // Store original request functions
    const originalXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    const originalXMLHttpRequestSetRequestHeader =
        XMLHttpRequest.prototype.setRequestHeader;
    const originalXMLHttpRequestSend = XMLHttpRequest.prototype.send;
    const originalFetch = fetch;

    /**
     * Extracts `clientSessionId` from the query parameters of a given URL.
     *
     * @param {string} url - The URL to parse.
     * @returns {string|null} - The extracted clientSessionId or null if not found.
     */
    const parseClientSessionId = (url) => {
        try {
            return new URL(url).searchParams.get("clientSessionId");
        } catch (e) {
            return null;
        }
    };

    /**
     * Handles request headers to find and store the authorization token.
     *
     * @param {Headers} headers - The headers to search through.
     */
    const handleRequestHeaders = (headers) => {
        headers.forEach((value, key) => {
            if (key.toLowerCase() === "authorization") {
                window.authorization = value;
                console.log("Found authorization:", value);
            }
        });
        if (window.clientSessionId && window.authorization) {
            restoreOriginalFunctions();
        }
    };

    /**
     * Handles the request URL and headers to capture `clientSessionId` and `authorization`.
     *
     * @param {string} url - The request URL.
     * @param {Headers} headers - The request headers.
     */
    const handleRequest = (url, headers) => {
        const sessionId = parseClientSessionId(url);
        if (sessionId) {
            window.clientSessionId = sessionId;
            console.log("Found clientSessionId:", sessionId);
        }
        handleRequestHeaders(headers);
    };

    // Override XMLHttpRequest.open method
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        this._url = url;
        this._requestHeaders = new Map();
        originalXMLHttpRequestOpen.call(this, method, url, async, user, pass);
    };

    // Override XMLHttpRequest.setRequestHeader method
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
        this._requestHeaders.set(name, value);
        originalXMLHttpRequestSetRequestHeader.call(this, name, value);
    };

    // Override XMLHttpRequest.send method
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("readystatechange", () => {
            if (this.readyState === XMLHttpRequest.DONE) {
                handleRequest(this._url, this._requestHeaders);
            }
        });
        originalXMLHttpRequestSend.call(this, body);
    };

    // Override fetch function
    window.fetch = (...args) => {
        const [resource, config] = args;
        const url = typeof resource === "string" ? resource : resource.url;
        const headers = new Headers(config?.headers || resource?.headers || {});
        handleRequest(url, headers);
        return originalFetch(...args).then((response) => response);
    };

    /**
     * Restores the original request functions for XMLHttpRequest and fetch.
     */
    const restoreOriginalFunctions = () => {
        XMLHttpRequest.prototype.open = originalXMLHttpRequestOpen;
        XMLHttpRequest.prototype.setRequestHeader =
            originalXMLHttpRequestSetRequestHeader;
        XMLHttpRequest.prototype.send = originalXMLHttpRequestSend;
        window.fetch = originalFetch;
        console.log("Restored original functions");
    };

    console.log("Request interception enabled");
}

// Initialize the API sniffer
apiSniffer();
