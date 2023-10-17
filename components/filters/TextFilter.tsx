import React from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';
import { Input } from '../ui/Input';
export function TextFilter({ filter, onChange }) {
  const debouncedOnChange = debounce(onChange, 500);

  return (
    <Input
      className="w-[150px] rounded-full lg:w-[200px]"
      Icon={Search} // TODO: allow custom icon in input
      placeholder={filter.label}
      defaultValue={filter.value}
      name={filter.key}
      onChange={e => debouncedOnChange({ [filter.key]: e.target.value })}
    />
  );
}
