"use strict";
/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const msRest = require("ms-rest-js");
const packageName = "hybris-occ-client";
const packageVersion = "0.1.1";
class CommerceWebservicesV2Context extends msRest.ServiceClient {
    /**
     * @class
     * Initializes a new instance of the CommerceWebservicesV2Context class.
     * @constructor
     *
     * @param {string} [baseUri] - The base URI of the service.
     *
     * @param {object} [options] - The parameter options
     *
     * @param {Array} [options.filters] - Filters to be added to the request pipeline
     *
     * @param {object} [options.requestOptions] - The request options. Detailed info can be found at
     * {@link https://github.github.io/fetch/#Request Options doc}
     *
     * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
     *
     */
    constructor(baseUri, options) {
        if (!options) {
            options = {};
        }
        super(undefined, options);
        this.baseUri = baseUri;
        if (!this.baseUri) {
            this.baseUri = "http://backoffice.christian-spartacus1-s2-public.model-t.myhybris.cloud";
        }
        this.addUserAgentInfo(`${packageName}/${packageVersion}`);
    }
}
exports.CommerceWebservicesV2Context = CommerceWebservicesV2Context;
//# sourceMappingURL=commerceWebservicesV2Context.js.map