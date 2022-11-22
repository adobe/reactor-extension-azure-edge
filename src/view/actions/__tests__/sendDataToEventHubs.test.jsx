/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND,  either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable no-template-curly-in-string */

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';
import {
  changeInputValue,
  click,
  getTextFieldByLabel
} from '../../__tests_helpers__/jsDomHelpers';

import SendDataToEventHubs from '../sendDataToEventHubs';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFromFields = () => ({
  namespaceField: screen.getByLabelText(/Namespace/i),
  nameField: screen.getByLabelText(/Name /i, {
    selector: '[name="name"]'
  }),
  sasAutorizationRuleNameField: screen.getByLabelText(
    /SAS Authorization Rule Name/i,
    {
      selector: '[name="sasRuleName"]'
    }
  ),
  sasAAccessKeyField: screen.getByLabelText(/SAS Access Key/i),
  partitionIdField: screen.getByLabelText(/Partition ID/i),
  dataField: screen.getByLabelText(/data/i, {
    selector: '[name="dataRaw"]'
  }),
  dataJsonRadio: screen.getByLabelText(/JSON Key-Value Pairs Editor/i)
});

describe('Send data to event hubs view', () => {
  test('sets form values from setting', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: {
        name: 'name',
        namespace: 'namespace',
        sasRuleName: 'rulename',
        sasAccessKey: '12345',
        partitionId: '1',
        data: {
          a: 'b'
        }
      }
    });

    const {
      namespaceField,
      nameField,
      sasAutorizationRuleNameField,
      sasAAccessKeyField,
      partitionIdField,
      dataField
    } = getFromFields();

    expect(namespaceField.value).toBe('namespace');
    expect(nameField.value).toBe('name');
    expect(sasAutorizationRuleNameField.value).toBe('rulename');
    expect(sasAAccessKeyField.value).toBe('12345');
    expect(partitionIdField.value).toBe('1');
    expect(dataField.value).toBe('{\n  "a": "b"\n}');
  });

  test('sets settings from form values', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: {
        name: 'name',
        namespace: 'namespace',
        sasRuleName: 'rulename',
        sasAccessKey: '12345',
        partitionId: '1',
        data: {
          a: 'b'
        }
      }
    });

    const {
      namespaceField,
      nameField,
      sasAutorizationRuleNameField,
      sasAAccessKeyField,
      partitionIdField,
      dataField
    } = getFromFields();

    await changeInputValue(namespaceField, 'new namespace');
    await changeInputValue(nameField, 'new name');
    await changeInputValue(sasAutorizationRuleNameField, 'new rulename');
    await changeInputValue(sasAAccessKeyField, '123456');
    await changeInputValue(partitionIdField, '2');
    await changeInputValue(dataField, '{{"a":"c"}');

    expect(extensionBridge.getSettings()).toEqual({
      name: 'new name',
      namespace: 'new namespace',
      sasRuleName: 'new rulename',
      sasAccessKey: '123456',
      partitionId: '2',
      data: {
        a: 'c'
      }
    });
  });

  test('sets settings from form values when JSON editors are used', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: {
        name: 'name',
        namespace: 'namespace',
        sasRuleName: 'rulename',
        sasAccessKey: '12345',
        partitionId: '1',
        data: {
          a: 'b',
          c: {
            d: 'e'
          }
        }
      }
    });

    const { dataJsonRadio } = getFromFields();

    await click(dataJsonRadio);

    expect(getTextFieldByLabel('Data JSON Key 0').value).toBe('a');
    expect(getTextFieldByLabel('Data JSON Value 0').value).toBe('b');
    expect(getTextFieldByLabel('Data JSON Key 1').value).toBe('c.d');
    expect(getTextFieldByLabel('Data JSON Value 1').value).toBe('e');

    await click(getTextFieldByLabel('Delete Data JSON Row 0'));

    await changeInputValue(getTextFieldByLabel('Data JSON Key 0'), 'a');

    expect(extensionBridge.getSettings()).toEqual({
      name: 'name',
      namespace: 'namespace',
      sasRuleName: 'rulename',
      sasAccessKey: '12345',
      partitionId: '1',
      data: {
        a: 'e'
      }
    });
  });

  test('handles default form validation correctly', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: {
        name: 'name',
        namespace: 'namespace',
        sasRuleName: 'rulename',
        sasAccessKey: '12345',
        partitionId: '1',
        data: {
          a: 'b'
        }
      }
    });

    const {
      namespaceField,
      nameField,
      sasAutorizationRuleNameField,
      sasAAccessKeyField,
      dataField
    } = getFromFields();

    expect(namespaceField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(namespaceField, '');

    expect(nameField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(nameField, '');

    expect(sasAutorizationRuleNameField).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await changeInputValue(sasAutorizationRuleNameField, '');

    expect(sasAAccessKeyField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(sasAAccessKeyField, '');

    expect(dataField).not.toHaveAttribute('aria-invalid', 'true');
    await changeInputValue(dataField, '');

    await extensionBridge.validate();

    expect(namespaceField).toHaveAttribute('aria-invalid', 'true');
    expect(nameField).toHaveAttribute('aria-invalid', 'true');
    expect(sasAutorizationRuleNameField).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(sasAAccessKeyField).toHaveAttribute('aria-invalid', 'true');
    expect(dataField).toHaveAttribute('aria-invalid', 'true');
  });

  test('handles json editor validation when no data is provided', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: null
    });

    const { dataJsonRadio } = getFromFields();

    await click(dataJsonRadio);

    expect(getTextFieldByLabel('Data JSON Key 0')).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await extensionBridge.validate();
    expect(getTextFieldByLabel('Data JSON Key 0')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  test('handles json editor validation when no key is provided but there is data', async () => {
    renderView(SendDataToEventHubs);

    extensionBridge.init({
      settings: null
    });

    const { dataJsonRadio } = getFromFields();

    await click(dataJsonRadio);

    expect(getTextFieldByLabel('Data JSON Key 0')).not.toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await changeInputValue(getTextFieldByLabel('Data JSON Value 0'), 'a');

    await extensionBridge.validate();

    expect(getTextFieldByLabel('Data JSON Key 0')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
