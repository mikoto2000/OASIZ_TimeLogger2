import { Button, ListItem, ListItemText } from "@mui/material"

interface TaskListItemProps {
  workNo: number,
  workName: string,
  startDate: string,
  endDate?: string | null,
  onEndClicked: (workNo: number) => void
}


const TaskListItem: React.FC<TaskListItemProps> = (props: TaskListItemProps) => {

  const getElapsed = (startDate: string, endDate?: string | null) => {
    if (!endDate) {
      return "計算中";
    }

    const sd = Date.parse(startDate);
    const ed = Date.parse(endDate);
    const elapsed = (ed - sd) / (60 * 1000);
    return elapsed.toString();
  };

  return (
    <ListItem>
      <ListItemText
        primary={`作業名: ${props.workName}`}
        secondary={
          <>
            <div>開始: {props.startDate}</div>
            <div>終了: {props.endDate ? props.endDate : '進行中'}</div>
            <div>経過時間: {getElapsed(props.startDate, props.endDate)} 分</div>
          </>
        }
      />
      {
        !props.endDate
          ?
          <Button onClick={() => { props.onEndClicked(props.workNo) }} >記録終了</Button>
          :
          <></>
      }
    </ListItem>
  )
}

export default TaskListItem;
