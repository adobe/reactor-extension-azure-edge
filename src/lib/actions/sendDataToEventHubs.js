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

const getSasAuthorizationToken = require('./helpers/getSasAuthorizationToken');

module.exports = async ({ utils: { fetch, getSettings } }) => {
  const { name, namespace, partitionId, sasRuleName, sasAccessKey, data } =
    getSettings();

  const apiUrl = `https://${namespace}.servicebus.windows.net/${name}/${
    partitionId ? `partitions/${partitionId}/` : ''
  }messages`;

  const token = await getSasAuthorizationToken(
    namespace,
    sasRuleName,
    sasAccessKey
  );

  const fetchOptions = {
    method: 'POST',
    body: typeof data === 'string' ? data : JSON.stringify(data),
    headers: {
      Authorization: token,
      'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
    }
  };

  await fetch(apiUrl, fetchOptions);
};
