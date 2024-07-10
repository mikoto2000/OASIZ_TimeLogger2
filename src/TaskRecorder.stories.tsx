import { StoryFn, Meta } from '@storybook/react';
import TaskRecorder from './TaskRecorder';

export default {
  title: 'Components/TaskRecorder',
  component: TaskRecorder,
} as Meta;

const Template: StoryFn<typeof TaskRecorder> = (args) => <TaskRecorder {...args} />;

export const Default = Template.bind({});
Default.args = {};

