import { StoryFn, Meta } from '@storybook/react';
import TaskRecorder from './TaskRecorder';

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
      workName: 'Task 1',
      startDate: '2024-07-10T08:00:00Z',
      endDate: '2024-07-10T09:00:00Z',
    },
    {
      workName: 'Task 2',
      startDate: '2024-07-10T09:30:00Z',
      endDate: '2024-07-10T10:00:00Z',
    },
    {
      workName: 'Task 3',
      startDate: '2024-07-10T10:15:00Z',
      endDate: '2024-07-10T11:15:00Z',
    },
  ],
};

