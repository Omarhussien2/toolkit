import React from 'react';

interface PerPageSelectorProps {
  value: number | 'All';
  onChange: (value: number | 'All') => void;
}

const PerPageSelector: React.FC<PerPageSelectorProps> = ({ value, onChange }) => {
  const options: (number | 'All')[] = [20, 50, 100, 'All'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'All') {
      onChange('All');
    } else {
      onChange(Number(selectedValue));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="per-page" className="text-sm text-zinc-400">إظهار:</label>
      <select
        id="per-page"
        value={value}
        onChange={handleChange}
        className="p-2 bg-zinc-700 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none text-white text-sm"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt === 'All' ? 'الكل' : opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PerPageSelector;
