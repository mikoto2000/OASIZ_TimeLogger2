import { Meta, StoryFn } from '@storybook/react';
import App from './App';
import { mockService_0, mockService_3 } from './services/MockService';

export default {
  title: 'Components/App',
  component: App,
} as Meta<typeof App>;

const Template: StoryFn<typeof App> = (args) => <App {...args} />;

export const Default = Template.bind({});
Default.args = {
  service: mockService_0,
};

export const WithLogs = Template.bind({});
WithLogs.args = {
  service: mockService_3,
};

