import React, { useState, useEffect } from 'react';
import { List, Divider, Typography, Button, Grid, Select, Box, Stack } from '@mui/material';
import { Service, WorkLog } from '../services/Service';
import { TauriService } from '../services/TauriService';
import TaskListItem from '../commons/TaskListItem';
import WorkLogEditDialog from './WorkLogEditDialog';
import MenuItem from '@mui/material/MenuItem';
import dayjs, { Dayjs } from 'dayjs';
import { AddCircle } from '@mui/icons-material';
import { TaskAddDialog } from './TaskAddDialog';

interface TaskListProps {
  service?: Service;
}

const scrollbarWidth = window.innerWidth - document.body.clientWidth;

const TaskList: React.FC<TaskListProps> = ({ service = new TauriService() }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<WorkLog[]>([]);

  // 作業名編集ダイアログ
  const [showDialog, setShowDialog] = useState<boolean>(false);

  // 新規作業追加ダイアログ
  const [showTaskAddDialog, setShowTaskAddDialog] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [editTask, setEditTask] = useState<WorkLog | null>(null);

  const [productivityScore, setProductivityScore] = useState<Array<number>>([]);

  const targetDay = dayjs(selectedDate).startOf('day');

  useEffect(() => {
    fetchWorkLog(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
    fetchProductivityScore(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
  }, [selectedDate]);

  const fetchWorkLog = (year: number, month: number, day: number) => {
    service.getWorkLogsByDate(year, month, day)
      .then((logs) => {
        const newLogs = logs.map((e: any) => {
          return {
            workNo: e.work_no,
            workName: e.work_name,
            startDate: e.start_date,
            endDate: e.end_date,
          }
        });
        setLogs(newLogs);
      })
      .catch((e: any) => setErrorMessage(e.message));
  }

  const fetchProductivityScore = async (year: number, month: number, day: number) => {
    setProductivityScore(await service.getProductivityScoreByDate(year, month, day));
  }

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
    fetchWorkLog(prevDay.getFullYear(), prevDay.getMonth() + 1, prevDay.getDate());
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
    fetchWorkLog(nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate());
  };

  const handleEdit = (task: WorkLog) => {
    setEditTask(task);
    setShowDialog(true);
  };

  const handleDelete = (deleteTask: WorkLog) => {
    service.deleteWorkLog(deleteTask.workNo);
    // 削除対象以外を抽出
    const newLogs = logs.filter((e) => e.workNo !== deleteTask.workNo);
    setLogs([...newLogs]);
  };

  const isIncludeWorkHour = (workStartISOString: string, workEndISOString: string | null | undefined, hour: number) => {
    const workStart = dayjs(workStartISOString);
    let workEnd: Dayjs;
    if (!workEndISOString) {
      workEnd = dayjs(workEndISOString);
    } else {
      workEnd = workStart;
    }
    const targetTimeStart = targetDay.add(hour, 'h');
    const targetTimeEnd = targetDay.add(hour + 1, 'h');
    const isIncludeStart = workStart.isAfter(targetTimeStart) && workStart.isBefore(targetTimeEnd);
    const isIncludeEnd = workEnd.isAfter(targetTimeStart) && workEnd.isBefore(targetTimeEnd);

    return isIncludeStart || isIncludeEnd;
  }

  const logList = (logs: WorkLog[], targetHour: number) => {
    const filterdLogs = logs
      .filter((log) => isIncludeWorkHour(log.startDate, log.endDate, targetHour));

    if (filterdLogs.length === 0) {
      return <Divider />
    }

    return (
      logs
        .filter((log) => isIncludeWorkHour(log.startDate, log.endDate, targetHour))
        .map((log, index) => (
          <>
            <Divider />
            <Grid container>
              <Grid xs={12} key={index}>
                <TaskListItem
                  workNo={log.workNo}
                  workName={log.workName}
                  startDate={log.startDate}
                  endDate={log.endDate}
                  onItemClicked={() => handleEdit(log)}
                  onDeleteClicked={() => handleDelete(log)}
                />
              </Grid>
            </Grid>
          </>
        ))

    );
  }

  const grid = (logs: WorkLog[]) => {
    if (logs.length === 0) {
      return <p>ログデータがありません。</p>
    }

    return (
      <List style={{}}>
        <Grid container>
          <Grid xs={1}>時間</Grid>
          <Grid xs={9}>作業</Grid>
          <Grid xs={2}>生産性スコア</Grid>
          {
            [...range(0, 24)].map((e) => (
              <>
                <Grid xs={1} sx={{}}>
                  <Divider />
                  <Box sx={{ width: "100%", height: "100%", textAlign: "center", verticalAlign: "middle" }}>
                    <Stack>
                      <Box>{e}</Box>
                      <Box><AddCircle color="primary" onClick={() => {
                        setShowTaskAddDialog(true);
                      }} /></Box>
                    </Stack>
                  </Box>
                </Grid >
                <Divider orientation="vertical" flexItem sx={{ marginLeft: "-1px" }} />
                <Grid xs={9}>
                  {logList(logs, e)}
                </Grid>
                <Grid xs={2}>
                  <Select
                    style={{ width: `calc(100% - ${scrollbarWidth}px)`, height: "100%" }}
                    value={productivityScore[e]}
                    onChange={(event) => {
                      productivityScore[e] = event.target.value as number;
                      setProductivityScore([...productivityScore]);
                      setTimeout(() => {
                        service.updateProductivityScoreByDate(selectedDate, productivityScore);
                      });
                    }}
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                  </Select>
                </Grid>
              </>
            ))
          }
        </Grid>
      </List >
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 5.5em)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: '0' }}>
        <Typography variant="h6">
          {selectedDate.toLocaleDateString()}の作業一覧, 生産性スコア合計: {productivityScore.reduce((sum, current) => sum + current, 0)}
        </Typography>
        <div>{errorMessage}</div>
      </div>
      <div style={{ flexGrow: '1', overflowY: 'auto' }}>
        {grid(logs)}
      </div>
      <div style={{ flexGrow: '0' }}>
        <div style={{ display: 'flex' }}>
          <Button
            color="primary"
            variant="outlined"
            style={{ flexGrow: '1' }}
            onClick={handlePrevDay}>前日</Button>
          <Button
            color="primary"
            variant="outlined"
            style={{ flexGrow: '1' }}
            onClick={handleNextDay}>翌日</Button>
        </div>
      </div>
      <WorkLogEditDialog
        initialWorkName={editTask?.workName ?? ''}
        show={showDialog}
        onSave={(newTaskName: string) => {
          if (editTask) {
            const targetLog = logs.find((e) => e.workNo === editTask.workNo);
            if (targetLog) {
              targetLog.workName = newTaskName;
              service.updateWorkName(targetLog);
              setLogs([...logs]);
            }
            setShowDialog(false);
          }
        }}
        onClose={() => { setShowDialog(false) }}
      ></WorkLogEditDialog>
      <TaskAddDialog
        show={showTaskAddDialog}
        onSave={(newTaskName, elapsed) => {
          console.log(newTaskName, elapsed);
        }}
        onClose={() => { setShowTaskAddDialog(false) }}
      />
    </div>
  );

  function* range(start: number, end: number) {
    for (let i = start; i < end; i++) {
      yield i;
    }
  }
};

export default TaskList;

