import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { get, sortBy } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { API_V2_CONTEXT } from '../../../lib/graphql/helpers';

import AdminContributeCardsContainer from '../../contribute-cards/AdminContributeCardsContainer';
import ContributeCrypto from '../../contribute-cards/ContributeCrypto';
import ContributeCustom from '../../contribute-cards/ContributeCustom';
import ContributeTier from '../../contribute-cards/ContributeTier';
import { Box, Grid } from '../../Grid';
import Image from '../../Image';
import LoadingPlaceholder from '../../LoadingPlaceholder';
import MessageBoxGraphqlError from '../../MessageBoxGraphqlError';
import StyledCheckbox from '../../StyledCheckbox';
import StyledHr from '../../StyledHr';
import StyledLink from '../../StyledLink';
import { P, Span, Strong } from '../../Text';
import { editAccountSettingsMutation } from '../mutations';
import { listTierQuery } from '../tiers/EditTierModal';

import { collectiveSettingsV1Query } from './EditCollectivePage';

// TODO Make this a common function with the contribute section
const getFinancialContributions = (collective, sortedTiers) => {
  const hasCustomContribution = !get(collective, 'settings.disableCustomContributions', false);
  const hasCryptoContribution =
    !get(collective, 'settings.disableCryptoContributions', true) &&
    get(collective, 'host.settings.cryptoEnabled', false);
  const waysToContribute = [];

  sortedTiers.forEach(tier => {
    if (tier === 'custom') {
      if (hasCustomContribution) {
        waysToContribute.push({
          key: 'custom',
          Component: ContributeCustom,
          componentProps: {
            collective,
            hideContributors: true,
            hideCTA: true,
          },
        });
      }
      if (hasCryptoContribution) {
        waysToContribute.push({
          key: 'crypto',
          Component: ContributeCrypto,
          componentProps: {
            collective,
            hideContributors: true, // for the MVP we shall not display the financial contributors for crypto
            hideCTA: true,
          },
        });
      }
    } else {
      waysToContribute.push({
        key: tier.id,
        Component: ContributeTier,
        componentProps: {
          collective,
          tier,
          hideContributors: true,
          hideCTA: true,
        },
      });
    }
  });

  return waysToContribute;
};

const CardsContainer = styled(Grid).attrs({
  justifyItems: 'center',
  gridGap: '30px',
  gridTemplateColumns: ['repeat(auto-fit, minmax(280px, 1fr))'],
  gridAutoRows: ['1fr'],
})`
  & > * {
    padding: 0;
  }
`;

/**
 * A revamp of `components/edit-collective/sections/Tiers.js`. Meant to be renamed once we'll be ready
 * to replace the old tiers form.
 */
const Tiers = ({ collective }) => {
  const variables = { accountSlug: collective.slug };
  const { data, loading, error, refetch } = useQuery(listTierQuery, { variables, context: API_V2_CONTEXT });
  const tiers = sortBy(get(data, 'account.tiers.nodes', []), 'legacyId');
  const filteredTiers = collective.type === 'EVENT' ? tiers.filter(tier => tier.type !== 'TICKET') : tiers; // Events have their tickets displayed in the "Tickets" section
  const intl = useIntl();
  const cryptoContributionsEnabledByHost = get(collective, 'host.settings.cryptoEnabled', false);
  const hasCryptoContributionsDisabled = get(collective, 'settings.disableCryptoContributions', true);

  return (
    <div>
      <Grid gridTemplateColumns={['1fr', '172px 1fr']} gridGap={62} mt={34}>
        <Box>
          <Image src="/static/images/tiers-graphic.png" alt="" width={172} height={145} />
        </Box>
        <Box ml={2}>
          <P>
            <Strong>
              <FormattedMessage defaultMessage="About contribution tiers" />
            </Strong>
            <br />
            <br />
            <Span>
              <FormattedMessage defaultMessage="You can provide perks or rewards for your tiers, have a set membership fee, or create categories for your contributors. Tiers can be limited to an amount or frequency (one time, monthly, yearly), or allowed to be flexibly set by contributors." />
            </Span>
          </P>
          <P mt={3}>
            <StyledLink
              href="https://docs.opencollective.com/help/collectives/collective-settings/tiers-goals"
              openInNewTab
            >
              <FormattedMessage defaultMessage="Learn more about tiers" />.
            </StyledLink>
          </P>
        </Box>
      </Grid>
      <StyledHr my={4} borderColor="black.300" />

      <Box my={4}>
        {loading ? (
          <LoadingPlaceholder height={500} width="100%" />
        ) : error ? (
          <MessageBoxGraphqlError error={error} />
        ) : (
          <div>
            <Box mb={4}>
              <P fontSize="14px" lineHeight="20x" mb={3}>
                <FormattedMessage defaultMessage="The custom contribution adds a default tier on your collective that doesn't enforce any minimum amount or interval. This is the easiest way for people to contribute to your Collective, but it cannot be customized." />
              </P>
              <Mutation
                mutation={editAccountSettingsMutation}
                refetchQueries={[{ query: collectiveSettingsV1Query, variables: { slug: collective.slug } }]}
                awaitRefetchQueries
              >
                {(editSettings, { loading }) => (
                  <StyledCheckbox
                    name="custom-contributions"
                    label={intl.formatMessage({
                      id: 'tier.customContributions.label',
                      defaultMessage: 'Enable flexible contributions',
                    })}
                    defaultChecked={!get(collective, 'settings.disableCustomContributions', false)}
                    width="auto"
                    isLoading={loading}
                    onChange={({ target }) => {
                      editSettings({
                        variables: {
                          account: { legacyId: collective.id },
                          key: 'disableCustomContributions',
                          value: !target.value,
                        },
                        context: API_V2_CONTEXT,
                      });
                    }}
                  />
                )}
              </Mutation>
            </Box>
            {cryptoContributionsEnabledByHost && (
              <Box mb={4}>
                <StyledHr my={4} borderColor="black.300" />
                <P fontSize="14px" lineHeight="20x" mb={3}>
                  <FormattedMessage
                    id="Tiers.CryptoTierDescription"
                    defaultMessage="Enabling this will enable support for donations with Cryptocurrencies such as Bitcoin or Ethereum."
                  />
                </P>
                <Mutation
                  mutation={editAccountSettingsMutation}
                  refetchQueries={[{ query: collectiveSettingsV1Query, variables: { slug: collective.slug } }]}
                  awaitRefetchQueries
                >
                  {(editSettings, { loading }) => (
                    <StyledCheckbox
                      name="crypto-contributions"
                      label={intl.formatMessage({
                        id: 'tier.cryptoContributions.label',
                        defaultMessage: 'Enable Crypto contributions',
                      })}
                      defaultChecked={!hasCryptoContributionsDisabled}
                      width="auto"
                      isLoading={loading}
                      onChange={({ target }) => {
                        editSettings({
                          variables: {
                            account: { legacyId: collective.id },
                            key: 'disableCryptoContributions',
                            value: !target.value,
                          },
                          context: API_V2_CONTEXT,
                        });
                      }}
                    />
                  )}
                </Mutation>
              </Box>
            )}
            <AdminContributeCardsContainer
              collective={collective}
              cards={getFinancialContributions(collective, filteredTiers)}
              CardsContainer={CardsContainer}
              useTierModals
              enableReordering={false}
              onTierUpdate={() => refetch()}
            />
          </div>
        )}
      </Box>
    </div>
  );
};

Tiers.propTypes = {
  collective: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default Tiers;
