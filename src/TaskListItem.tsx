import { Button, ListItem, ListItemText } from "@mui/material"

interface TaskListItemProps {
  workNo: number,
  workName: string,
  startDate: string,
  endDate?: string | null,
  onItemClicked?: (workNo: number) => void
  onEndClicked?: (workNo: number) => void
}


const TaskListItem: React.FC<TaskListItemProps> = (props: TaskListItemProps) => {

  const getElapsed = (startDate: string, endDate?: string | null) => {
    if (!endDate) {
      return "計算中";
    }

    const sd = Date.parse(startDate);
    const ed = Date.parse(endDate);
    const elapsed = (ed - sd) / (60 * 1000);
    // 小数第3位で四捨五入
    const printElapse = Math.round(elapsed * 100) / 100;
    return printElapse.toString() + "分";
  };

  return (
    <ListItem
      id={props.workNo.toString()}
      onClick={() => {
        if (props.onItemClicked) {
          props.onItemClicked(props.workNo);
        }
      }} >
      <ListItemText
        primary={`作業名: ${props.workName}`}
        secondary={
          <>
            <div>開始: {props.startDate}</div>
            <div>終了: {props.endDate ? props.endDate : '進行中'}</div>
            <div>経過時間: {getElapsed(props.startDate, props.endDate)}</div>
          </>
        }
      />
      {
        !props.endDate
          ?
          <Button onClick={() => {
            if (props.onEndClicked) {
              props.onEndClicked(props.workNo)
            }
          }} >記録終了</Button>
          :
          <></>
      }
    </ListItem>
  )
}

export default TaskListItem;
