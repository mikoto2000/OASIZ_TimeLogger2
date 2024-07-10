import { StoryFn, Meta } from '@storybook/react';
import TaskList from './TaskList';

export default {
  title: 'Components/TaskList',
  component: TaskList,
} as Meta;

const Template: StoryFn<typeof TaskList> = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {};

