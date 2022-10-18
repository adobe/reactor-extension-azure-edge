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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import {
  Flex,
  Heading,
  View,
  Link,
  Content,
  ContextualHelp
} from '@adobe/react-spectrum';
import WrappedTextField from '../../../components/wrappedTextField';

export default function RequestSectionFields() {
  return (
    <View>
      <Flex alignItems="center" gap="size-75">
        <Heading level="3">Event Hub Details</Heading>

        <ContextualHelp>
          <Heading>Need help?</Heading>
          <Content>
            <p>
              Azure Event Hubs is a highly scalable data ingress service that
              ingests millions of events per second. Once data is collected into
              an event hub, it can be transformed and stored using any real-time
              analytics provider or batching/storage adapters.
            </p>
            <p>
              Learn more about{' '}
              <Link>
                <a
                  href="https://learn.microsoft.com/en-us/rest/api/eventhub/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Event Hubs
                </a>
              </Link>
              .
            </p>
          </Content>
        </ContextualHelp>
      </Flex>

      <Flex direction="column" gap="size-150" minWidth="size-6000">
        <WrappedTextField
          minWidth="size-4600"
          width="size-4600"
          name="namespace"
          label="Namespace"
          necessityIndicator="label"
          isRequired
          supportDataElement
        />

        <WrappedTextField
          minWidth="size-4600"
          width="size-4600"
          name="name"
          label="Name"
          necessityIndicator="label"
          isRequired
          supportDataElement
        />

        <WrappedTextField
          minWidth="size-4600"
          width="size-4600"
          name="sasRuleName"
          label="SAS Authorization Rule Name"
          necessityIndicator="label"
          isRequired
          supportDataElement
          contextualHelp={
            <ContextualHelp>
              <Heading>Need help?</Heading>
              <Content>
                <p>
                  A shared access signature (SAS) provides delegated access to
                  Event Hubs resources based on authorization rules. An
                  authorization rule has a name, is associated with specific
                  rights, and carries a pair of cryptographic keys. The rule
                  name and key are used to generate SAS tokens.
                </p>
                <p>
                  Learn more about{' '}
                  <Link>
                    <a
                      href="https://learn.microsoft.com/en-us/azure/event-hubs/authorize-access-shared-access-signature"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Authorizing access to Event Hubs resources using Shared
                      Access Signatures
                    </a>
                  </Link>
                  .
                </p>
              </Content>
            </ContextualHelp>
          }
        />

        <WrappedTextField
          minWidth="size-4600"
          width="size-4600"
          name="sasAccessKey"
          label="SAS Access Key"
          necessityIndicator="label"
          isRequired
          supportDataElement
        />

        <Flex direction="column">
          <WrappedTextField
            minWidth="size-4600"
            width="size-4600"
            name="partitionId"
            label="Partition ID"
            supportDataElement
          />
        </Flex>
      </Flex>
    </View>
  );
}
