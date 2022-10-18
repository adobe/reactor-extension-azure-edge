/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const createHmac = async (secretKey, data) => {
  const enc = new TextEncoder('utf-8');

  const key = await crypto.subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    enc.encode(secretKey),
    {
      // algorithm details
      name: 'HMAC',
      hash: { name: 'SHA-256' }
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));

  const b = new Uint8Array(signature);
  return btoa(String.fromCharCode.apply(null, b));
};

module.exports = async (
  eventHubNameSpace,
  sasPolicyName,
  sasPolicyPrimaryKey,
  ttlDays = 1
) => {
  const uri = `https://${eventHubNameSpace}.servicebus.windows.net`;
  const encodedURIComponent = encodeURIComponent(uri);

  const ttlSeconds = 60 * 60 * 24 * ttlDays;
  const ttl = Math.round(new Date().getTime() / 1000) + ttlSeconds;
  const callSignature = encodedURIComponent + '\n' + ttl;

  const hash = await createHmac(sasPolicyPrimaryKey, callSignature);

  return (
    'SharedAccessSignature sr=' +
    encodedURIComponent +
    '&sig=' +
    encodeURIComponent(hash) +
    '&se=' +
    ttl +
    '&skn=' +
    sasPolicyName
  );
};
