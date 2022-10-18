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

var sendDataToEventHubs = require('../sendDataToEventHubs');
jest.mock('../helpers/getSasAuthorizationToken');

describe('send data to event hubs action', () => {
  test('makes the correct API calling without partition', () => {
    const payload = {
      time: '1433188255',
      event: 'metric',
      source: 'test12',
      sourceType: 'extenstion',
      host: 'abc.splunk.com',
      fields: {
        firstname: 'abc'
      }
    };

    const fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve([114, 101, 115, 117, 108, 116]) //result
      })
    );

    const settings = {
      name: 'name',
      namespace: 'namespace',
      sasRuleName: 'rulename',
      sasAccessKey: '12345',
      data: payload
    };

    var arc = {
      ruleStash: {}
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings
    };

    return sendDataToEventHubs({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://namespace.servicebus.windows.net/name/messages',
        {
          method: 'POST',
          headers: {
            Authorization:
              'SharedAccessSignature sr=https%3A%2F%2Fnamespace.servicebus.windows.net' +
              '&sig=jRwdF%2BQ%2F9A1F0S77K69ZsybdgGCSl8agjl8PR3Ouulw%3D&se=1666218759&skn=rulename',
            'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
          },
          body: JSON.stringify(payload)
        }
      );
    });
  });

  test('makes the correct API calling with partition', () => {
    const payload = {
      time: '1433188255',
      event: 'metric',
      source: 'test12',
      sourceType: 'extenstion',
      host: 'abc.splunk.com',
      fields: {
        firstname: 'abc'
      }
    };

    const fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve([114, 101, 115, 117, 108, 116]) //result
      })
    );

    const settings = {
      name: 'name',
      namespace: 'namespace',
      sasRuleName: 'rulename',
      sasAccessKey: '12345',
      partitionId: '1',
      data: payload
    };

    var arc = {
      ruleStash: {}
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings
    };

    return sendDataToEventHubs({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://namespace.servicebus.windows.net/name/partitions/1/messages',
        {
          method: 'POST',
          headers: {
            Authorization:
              'SharedAccessSignature sr=https%3A%2F%2Fnamespace.servicebus.windows.net' +
              '&sig=jRwdF%2BQ%2F9A1F0S77K69ZsybdgGCSl8agjl8PR3Ouulw%3D&se=1666218759&skn=rulename',
            'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
          },
          body: JSON.stringify(payload)
        }
      );
    });
  });
});
