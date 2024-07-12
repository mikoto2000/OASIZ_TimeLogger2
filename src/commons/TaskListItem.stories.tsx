import { StoryFn, Meta } from '@storybook/react';
import TaskListItem from './TaskListItem';

export default {
  title: 'Components/TaskListItem',
  component: TaskListItem,
} as Meta<typeof TaskListItem>;

const Template: StoryFn<typeof TaskListItem> = (args) => <TaskListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  workNo: 1,
  workName: 'Task 1',
  startDate: '2024-07-10T08:00:00Z',
  endDate: null,
  onEndClicked: (workNo: number) => alert(`End clicked for workNo: ${workNo}`),
};

export const CompletedTask = Template.bind({});
CompletedTask.args = {
  workNo: 2,
  workName: 'Task 2',
  startDate: '2024-07-10T09:00:00Z',
  endDate: '2024-07-10T10:00:00Z',
  onEndClicked: (workNo: number) => alert(`End clicked for workNo: ${workNo}`),
};

