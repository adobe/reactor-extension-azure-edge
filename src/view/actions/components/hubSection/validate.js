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

import checkRequired from '../../../utils/checkRequired';

export default ({ name, namespace, sasRuleName, sasAccessKey }) => {
  const errors = {};

  [
    ['name', name],
    ['namespace', namespace],
    ['sasRuleName', sasRuleName, 'a SAS authorization rule name'],
    ['sasAccessKey', sasAccessKey, 'a SAS access key']
  ].forEach(([key, value, errorVariableDescription]) => {
    checkRequired(key, value, errorVariableDescription || `a ${key}`, errors);
  });

  return errors;
};
