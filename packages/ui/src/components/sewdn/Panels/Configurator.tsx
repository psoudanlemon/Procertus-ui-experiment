import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { PanelsConfigProps } from './types';

// Define the types for the configuration values we can change
export type ConfigurableProps = Pick<
  Required<PanelsConfigProps>,
  | 'panelWidth'
  | 'maxPanels'
  | 'maxVisiblePanels'
  | 'mainViewMinWidth'
  | 'breakpoint'
  | 'stackedPanelWidth'
>;

interface ConfiguratorProps {
  config: ConfigurableProps;
  onChange: <K extends keyof ConfigurableProps>(key: K, value: ConfigurableProps[K]) => void;
}

// Helper component for a configuration item
const ConfigItem: React.FC<{ label: string; htmlFor?: string; children: React.ReactNode }> = ({
  label,
  htmlFor,
  children,
}) => (
  <div className="grid grid-cols-2 gap-2 items-center mb-3">
    <Label htmlFor={htmlFor} className="text-sm text-right font-medium">
      {label}
    </Label>
    <div>{children}</div>
  </div>
);

export const DetailPanelsConfigurator: React.FC<ConfiguratorProps> = ({ config, onChange }) => {
  const handleNumberChange = (key: keyof ConfigurableProps, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onChange(key, num as any); // Type assertion needed due to generic onChange
    }
  };

  const handleSliderChange = (key: keyof ConfigurableProps, value: number[]) => {
    onChange(key, value[0] as any);
  };

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Configure DetailPanels</h3>

      <ConfigItem label="Panel Width (px)" htmlFor="panelWidthSlider">
        <Slider
          id="panelWidthSlider"
          min={200}
          max={800}
          step={10}
          value={[config.panelWidth]}
          onValueChange={(val: number[]) => handleSliderChange('panelWidth', val)}
          aria-label="Panel Width"
        />
        <Input
          type="number"
          value={config.panelWidth}
          onChange={e => handleNumberChange('panelWidth', e.target.value)}
          className="mt-1 w-20 text-sm h-8"
          aria-labelledby="Panel Width Label"
        />
      </ConfigItem>

      <ConfigItem label="Stacked Width (px)" htmlFor="stackedWidthSlider">
        <Slider
          id="stackedWidthSlider"
          min={40}
          max={150}
          step={5}
          value={[config.stackedPanelWidth]}
          onValueChange={(val: number[]) => handleSliderChange('stackedPanelWidth', val)}
          aria-label="Stacked Panel Width"
        />
        <Input
          type="number"
          value={config.stackedPanelWidth}
          onChange={e => handleNumberChange('stackedPanelWidth', e.target.value)}
          className="mt-1 w-20 text-sm h-8"
          aria-labelledby="Stacked Panel Width Label"
        />
      </ConfigItem>

      <ConfigItem label="Max Panels (Total)" htmlFor="maxPanelsInput">
        <Input
          id="maxPanelsInput"
          type="number"
          min={1}
          max={20}
          value={config.maxPanels}
          onChange={e => handleNumberChange('maxPanels', e.target.value)}
          className="w-20 text-sm h-8"
        />
      </ConfigItem>

      <ConfigItem label="Max Visible Panels" htmlFor="maxVisibleInput">
        <Input
          id="maxVisibleInput"
          type="number"
          min={1}
          max={config.maxPanels}
          value={config.maxVisiblePanels}
          onChange={e => handleNumberChange('maxVisiblePanels', e.target.value)}
          className="w-20 text-sm h-8"
        />
      </ConfigItem>

      <ConfigItem label="Main View Min Width (px)" htmlFor="minWidthSlider">
        <Slider
          id="minWidthSlider"
          min={100}
          max={1000}
          step={20}
          value={[config.mainViewMinWidth]}
          onValueChange={(val: number[]) => handleSliderChange('mainViewMinWidth', val)}
          aria-label="Main View Minimum Width"
        />
        <Input
          type="number"
          value={config.mainViewMinWidth}
          onChange={e => handleNumberChange('mainViewMinWidth', e.target.value)}
          className="mt-1 w-20 text-sm h-8"
          aria-labelledby="Main View Minimum Width Label"
        />
      </ConfigItem>

      <ConfigItem label="Breakpoint">
        <Select
          value={config.breakpoint}
          onValueChange={(value: ConfigurableProps['breakpoint']) => onChange('breakpoint', value)}
        >
          <SelectTrigger className="w-[100px] text-sm h-8">
            <SelectValue placeholder="Select breakpoint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">sm</SelectItem>
            <SelectItem value="md">md</SelectItem>
            <SelectItem value="lg">lg</SelectItem>
            <SelectItem value="xl">xl</SelectItem>
            <SelectItem value="2xl">2xl</SelectItem>
          </SelectContent>
        </Select>
      </ConfigItem>
    </div>
  );
};
