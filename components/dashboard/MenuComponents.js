import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from '@styled-icons/feather/ChevronDown';
import { ChevronUp } from '@styled-icons/feather/ChevronUp';
import { useRouter } from 'next/router';
import ReactAnimateHeight from 'react-animate-height';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { cx } from 'class-variance-authority';
import { getDashboardRoute } from '../../lib/url-helpers';

import { Box, Flex } from '../Grid';
import Link from '../Link';
import StyledLink from '../StyledLink';
import { Span } from '../Text';

import { SECTION_LABELS } from './constants';
import { DashboardContext } from './DashboardContext';

const MenuLinkContainer = styled.li`
  a,
  ${StyledLink} {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    padding: 8px;
    border-radius: 6px;
    -webkit-font-smoothing: antialiased;
    width: 100%;
    cursor: pointer;

    svg {
      flex-shrink: 0;
    }

    ${props =>
      props.isSelected
        ? css`
            background: ${props => props.theme.colors.black[50]};
            color: ${props => props.theme.colors.primary[700]} !important;
            &:hover {
              color: ${props => props.theme.colors.primary[700]} !important;
            }
          `
        : css`
            color: ${props => props.theme.colors.black[900]} !important;
            &:hover {
              color: ${props => props.theme.colors.primary[700]} !important;
              background: ${props => props.theme.colors.black[50]};
            }
          `}

    ${props =>
      props.isSub
        ? css`
            padding-left: 32px;
          `
        : css``}
  }
`;

const ExpandButton = styled.button`
  border: 0;
  outline: 0;
  border-radius: 6px;
  flex-shrink: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: background 50ms ease-in-out;
  color: ${props => props.theme.colors.black[800]};
  &:hover {
    background: ${props => props.theme.colors.black[200]};
  }
`;

export const MenuLink = ({
  section,
  children,
  onClick,
  if: conditional,
  isBeta,
  icon = null,
  renderSubMenu,
  parentSection = null,
  goToSection,
  item,
  AyCon,
}) => {
  const router = useRouter();
  const { selectedSection, expandedSection, setExpandedSection, account } = React.useContext(DashboardContext);
  const expanded = expandedSection === section;
  const { formatMessage } = useIntl();
  const isSelected = section && selectedSection === section;
  console.log({ isSelected });
  useEffect(() => {
    if (parentSection && isSelected) {
      setExpandedSection?.(parentSection);
    }
  }, [isSelected]);

  if (conditional === false) {
    return null;
  }

  if (!children && SECTION_LABELS[item?.section || section]) {
    children = formatMessage(SECTION_LABELS[item?.section || section]);
  }
  const handleClick = e => {
    setExpandedSection?.(section);
    onClick?.(e);
    if (goToSection) {
      router.push({ pathname: getDashboardRoute(account, goToSection) });
    }
  };

  const renderButtonContent = () => (
    <Flex alignItems="center" justifyContent="space-between" flex={1}>
      <Flex alignItems="center" gridGap="8px">
        {icon}
        <Span truncateOverflow>
          {children}
          {isBeta ? ' (Beta)' : ''}
        </Span>
      </Flex>
      {renderSubMenu && (
        <ExpandButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            setExpandedSection(expanded ? null : section);
          }}
        >
          {expanded ? <ChevronUp size="16px" /> : <ChevronDown size="16px" />}
        </ExpandButton>
      )}
    </Flex>
  );
  return (
    <React.Fragment>
      <li key={section}>
        <Link
          href={getDashboardRoute(account, section)}
          className={cx(
            isSelected ? 'bg-gray-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
          )}
        >
          {AyCon && (
            <AyCon
              className={cx(
                isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                'h-6 w-6 shrink-0',
              )}
              aria-hidden="true"
            />
          )}
          {item?.icon && (
            <item.icon
              className={cx(
                isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                'h-6 w-6 shrink-0',
              )}
              aria-hidden="true"
            />
          )}
          {children}
        </Link>
      </li>
      {/* <li isSelected={isSelected} isSub={!!parentSection}>
        {onClick ? (
          <StyledLink as="button" onClick={handleClick} data-cy={`menu-item-${section}`}>
            {renderButtonContent()}
          </StyledLink>
        ) : (
          <Link
            onClick={handleClick}
            href={getDashboardRoute(account, goToSection ? goToSection : section)}
            data-cy={`menu-item-${section}`}
          >
            {renderButtonContent()}
          </Link>
        )}
      </li> */}
      {renderSubMenu && (
        <ReactAnimateHeight duration={150} height={expanded ? 'auto' : 0}>
          {renderSubMenu({ parentSection: section })}
        </ReactAnimateHeight>
      )}
    </React.Fragment>
  );
};

MenuLink.propTypes = {
  if: PropTypes.bool,
  section: PropTypes.string,
  selectedSection: PropTypes.string,
  children: PropTypes.node,
  isBeta: PropTypes.bool,
  isStrong: PropTypes.bool,
  onClick: PropTypes.func,
  afterClick: PropTypes.func,
  icon: PropTypes.node,
  renderSubMenu: PropTypes.node,
  parentSection: PropTypes.string,
  goToSection: PropTypes.string,
};

export const MenuSectionHeader = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  margin-top: 12px;
  margin-bottom: 6px;

  color: ${props => props.theme.colors.black[600]};
`;

export const MenuContainer = styled.ul`
  // margin: 0;
  // max-width: 100%;
  // position: relative;
  // display: flex;
  // flex-direction: column;
  // grid-gap: 4px;
  // a {
  //   color: ${props => props.theme.colors.black[900]};
  //   &:hover {
  //     color: ${props => props.theme.colors.black[700]};
  //   }
  // }

  // &,
  // & ul {
  //   list-style-type: none;
  //   padding: 0;
  //   & li {
  //     padding: 2px 0;
  //   }
  // }
`;

export const MenuGroup = ({ if: conditional, children, ...props }) => {
  return conditional === false ? null : <ul className="space-y-1">{children}</ul>;
};

MenuGroup.propTypes = {
  if: PropTypes.bool,
  children: PropTypes.node,
};
