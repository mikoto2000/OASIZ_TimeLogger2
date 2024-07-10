import { Meta, StoryFn } from '@storybook/react';
import TaskRecorder from './TaskRecorder';
import { mockService_0, mockService_3 } from './services/MockService';

export default {
  title: 'Components/TaskRecorder',
  component: TaskRecorder,
} as Meta<typeof TaskRecorder>;

const Template: StoryFn<typeof TaskRecorder> = (args) => <TaskRecorder {...args} />;

export const Default = Template.bind({});
Default.args = {
  service: mockService_0,
};

export const WithLogs = Template.bind({});
WithLogs.args = {
  service: mockService_3
};

