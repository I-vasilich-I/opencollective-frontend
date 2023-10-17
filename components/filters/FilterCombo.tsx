import React from 'react';

import { FilterDropdown } from './FilterDropdown';
import { TextFilter } from './TextFilter';
import { Filter, FilterOptions, FilterType } from './types';

export function FilterCombo({ filter, filterOptions, onChange }: { filter?: Filter; filterOptions?: FilterOptions }) {
  if (filter) {
    if (filter.static && filter.filterType === FilterType.TEXT_INPUT) {
      return <TextFilter filter={filter} onChange={onChange} />;
    }

    return (
      <FilterDropdown
        title={filter.label}
        // options={filter.options}
        value={filter.value}
        onChange={onChange}
        filterOptions={filterOptions}
        filterKey={filter.key}
        Icon={filter.Icon}
      />
    );
  }
  return <FilterDropdown title={'Add Filter'} filterOptions={filterOptions} onChange={onChange} />;
}
