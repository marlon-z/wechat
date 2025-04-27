import React from 'react';
import { Popover, ColorPicker as AntdColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

interface ColorPickerProps {
  value: string;
  onChange: (color: Color) => void;
  size?: 'small' | 'middle' | 'large';
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, size = 'middle' }) => {
  return (
    <Popover
      content={
        <AntdColorPicker
          value={value}
          onChange={onChange}
          presets={[
            {
              label: 'Recommended',
              colors: [
                '#000000',
                '#262626',
                '#595959',
                '#8c8c8c',
                '#bfbfbf',
                '#d9d9d9',
                '#f0f0f0',
                '#f5f5f5',
                '#ffffff',
                '#f5222d',
                '#fa8c16',
                '#fadb14',
                '#52c41a',
                '#1890ff',
                '#2f54eb',
                '#722ed1',
                '#eb2f96',
              ],
            },
          ]}
        />
      }
      trigger="click"
    >
      <div
        style={{
          width: size === 'small' ? 20 : size === 'large' ? 32 : 24,
          height: size === 'small' ? 20 : size === 'large' ? 32 : 24,
          borderRadius: '4px',
          border: '1px solid #d9d9d9',
          backgroundColor: value,
          cursor: 'pointer',
        }}
      />
    </Popover>
  );
};

export default ColorPicker; 