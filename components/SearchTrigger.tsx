import React from 'react';
import { Search } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Flex } from './Grid';
import Hide from './Hide';
import StyledButton from './StyledButton';

const SearchButton = styled(StyledButton)`
  color: #64748b;
  font-weight: 400;
  height: 36px;
  padding: 0 12px;
  max-width: 280px;
  width: 280px;
  min-width: 120px;
  flex-shrink: 4;
  letter-spacing: 0;

  @media screen and (max-width: 52em) {
    width: 32px;
    min-width: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0;
    border: none;
  }

  .slash {
    border: 1px solid #d1d5db;
    background-color: #f1f5f9;
    border-radius: 4px;
    padding: 0 4px;
    letter-spacing: 0;
  }

  &:active,
  :hover {
    .slash {
      background-color: inherit;
    }
  }
`;

const SearchTrigger = ({ setShowSearchModal }) => {
  React.useEffect(() => {
    const handleKeydown = e => {
      if (e.key === '/' && e.target.tagName === 'BODY') {
        e.preventDefault();
        setShowSearchModal(show => !show);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <SearchButton onClick={() => setShowSearchModal(true)}>
      <Flex alignItems="center" gridGap="6px">
        <Search size={16} />
        <Hide xs sm>
          <span className="text-xs">
            <FormattedMessage
              defaultMessage="Search for Profiles and Collectives {slash}"
              values={{ slash: <span className="slash">/</span> }}
            />
          </span>
        </Hide>
      </Flex>
    </SearchButton>
  );
};

export default SearchTrigger;
