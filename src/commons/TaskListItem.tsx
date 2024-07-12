import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText } from "@mui/material"
import { useEffect, useState } from "react";

interface TaskListItemProps {
  workNo: number,
  workName: string,
  startDate: string,
  endDate?: string | null,
  onItemClicked?: (workNo: number) => void
  onEndClicked?: (workNo: number) => void
  onDeleteClicked?: (workNo: number) => void
}


const TaskListItem: React.FC<TaskListItemProps> = (props: TaskListItemProps) => {

  const [now, setNow] = useState(new Date);

  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  // 1 分ごとに経過時間を更新
  useEffect(() => {
    setTimeout(() => {
      setNow(new Date());
    }, 60000);
  }, [now]);

  const getElapsed = (startDate: string, endDate?: string | null) => {
    if (!endDate) {
      return getElapsed(startDate, now.toString());
    }

    // 経過時間を分単位で表示
    const sd = Date.parse(startDate);
    const ed = Date.parse(endDate);
    const elapsed = Math.round((ed - sd) / (60 * 1000));
    return elapsed.toString() + "分";
  };

  return (
    <>
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
          !props.endDate && props.onEndClicked
            ?
            <Button onClick={() => {
              if (props.onEndClicked) {
                props.onEndClicked(props.workNo)
              }
            }} >記録終了</Button>
            :
            props.onDeleteClicked
              ?
              <Button variant="contained" color="error" onClick={(e) => {
                e.stopPropagation();
                if (props.onDeleteClicked) {
                  setShowConfirmDialog(true);
                }
              }} >削除</Button>
              :
              <></>
        }
      </ListItem>
      <Dialog open={showConfirmDialog} onClose={() => { setShowConfirmDialog(false) }}>
        <DialogTitle>作業削除確認</DialogTitle>
        <DialogContent>本当に削除しますか？</DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowConfirmDialog(false) }}>キャンセル</Button>
          <Button color="error" onClick={() => {
            if (props.onDeleteClicked) {
              props.onDeleteClicked(props.workNo);
              setShowConfirmDialog(false);
            }
          }}>削除</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TaskListItem;
