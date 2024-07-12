import { StoryFn, Meta } from '@storybook/react';
import TaskList from './TaskList';
import { mockService_0, mockService_3 } from '../services/MockService';

export default {
  title: 'Components/TaskList',
  component: TaskList,
  argTypes: {},
} as Meta<typeof TaskList>;

const Template: StoryFn<typeof TaskList> = (args) => <TaskList {...args} />;

export const NoLogs = Template.bind({});
NoLogs.args = {
  service: mockService_0,
};

export const ThreeLogs = Template.bind({});
ThreeLogs.args = {
  service: mockService_3,
};
