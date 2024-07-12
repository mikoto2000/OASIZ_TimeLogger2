import { StoryFn, Meta } from '@storybook/react';
import WorkLogEditDialog from './WorkLogEditDialog';
import { Button } from '@mui/material';
import { useState } from 'react';

export default {
  title: 'components/WorkLogEditDialog',
  component: WorkLogEditDialog,
  argTypes: {
    initialWorkName: { control: 'text' },
    show: { control: 'boolean' },
    onSave: { action: 'saved' },
    onClose: { action: 'closed' },
  },
} as Meta;

const Template: StoryFn<typeof WorkLogEditDialog> = (args) => {
  const [show, setShow] = useState(args.show);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSave = (newName: string) => {
    args.onSave(newName);
    setShow(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>Open Dialog</Button>
      <WorkLogEditDialog
        {...args}
        show={show}
        onSave={handleSave}
        onClose={handleClose}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  initialWorkName: '初期の作業名',
  show: false,
};

export const Open = Template.bind({});
Open.args = {
  initialWorkName: '初期の作業名',
  show: true,
};

