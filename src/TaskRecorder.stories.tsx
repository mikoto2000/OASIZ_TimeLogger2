import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import TaskRecorder, { Log } from './TaskRecorder';

export default {
  title: 'Components/TaskRecorder',
  component: TaskRecorder,
} as Meta;

const Template: StoryFn<typeof TaskRecorder> = (args) => <TaskRecorder {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithMultipleItems = Template.bind({});
WithMultipleItems.args = {
  initialLogs: [
    {
      taskName: 'Task 1',
      startTime: '2024-07-10T08:00:00Z',
      endTime: '2024-07-10T09:00:00Z',
      elapsed: 3600,
    },
    {
      taskName: 'Task 2',
      startTime: '2024-07-10T09:30:00Z',
      endTime: '2024-07-10T10:00:00Z',
      elapsed: 1800,
    },
    {
      taskName: 'Task 3',
      startTime: '2024-07-10T10:15:00Z',
      endTime: '2024-07-10T11:15:00Z',
      elapsed: 3600,
    },
  ],
};

