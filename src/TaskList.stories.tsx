import { StoryFn, Meta } from '@storybook/react';
import TaskList from './TaskList';

export default {
  title: 'Components/TaskList',
  component: TaskList,
} as Meta;

const Template: StoryFn<typeof TaskList> = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithMultipleItems = Template.bind({});
WithMultipleItems.args = {
  logs: [
    {
      taskName: 'Task 1',
      startDate: '2024-07-10T08:00:00Z',
      endDate: '2024-07-10T09:00:00Z',
    },
    {
      taskName: 'Task 2',
      startDate: '2024-07-10T09:30:00Z',
      endDate: '2024-07-10T10:00:00Z',
    },
    {
      taskName: 'Task 3',
      startDate: '2024-07-10T10:15:00Z',
      endDate: '2024-07-10T11:15:00Z',
    },
  ],
};

