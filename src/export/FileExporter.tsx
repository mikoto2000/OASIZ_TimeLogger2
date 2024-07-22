import { useEffect, useState } from "react";

import { Box, Button, Link, Stack } from "@mui/material";
import { Service } from "../services/Service";
import { TauriService } from "../services/TauriService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs, { Dayjs } from "dayjs";
import { Parser } from '@json2csv/plainjs';
import toast, { Toaster } from "react-hot-toast";

import { sendIntent } from "tauri-plugin-android-intent-send-api";

export type ExportType = 'json' | 'csv';

interface FileExporterProps {
  exportType: ExportType;
  service: Service;
};

const FileExporter: React.FC<FileExporterProps> = ({ exportType, service = new TauriService() }) => {

  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const [dataBlobUrl, setDataBlobUrl] = useState<string | null>(null);

  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setPlatform(service.getPlatform());
    })();
  }, []);

  const exportWorkLog = async () => {
    if (fromDate && toDate) {
      const logs = await service.getWorkLogs(
        fromDate.year(),
        fromDate.month() + 1,
        fromDate.date(),
        toDate.year(),
        toDate.month() + 1,
        toDate.date(),
      );

      let data;
      if (exportType === 'json') {
        data = JSON.stringify(logs);
      } else {
        data = JSON.stringify(logs);
        try {
          const parser = new Parser({
            fields: ["work_no", "work_name", "start_date", "end_date"]
          });
          const csv = parser.parse(logs);
          data = csv;
        } catch (err) {
          console.error(err);
        }
      }

      //try {
      //  const dd = await downloadDir();
      //  console.log(dd);
      //const savePath = path.join(dd, "worklog.json");

      //if (savePath) {
      //  writeTextFile(savePath, data);
      //  toast.success(`save to ${savePath}`);
      //}
      //} catch (err) {
      //  console.log(err);
      //}

      if (platform !== 'android' && platform !== 'ios' && platform != null) {
        const blob = new Blob([data], { type: 'text/plain' });
        const blobUrl = URL.createObjectURL(blob);
        setDataBlobUrl(blobUrl);
      } else {
        sendIntent(data);
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <DatePicker
          label="開始日"
          value={fromDate}
          onChange={(newValue) => setFromDate(newValue)}
        ></DatePicker>
        <DatePicker
          label="終了日"
          value={toDate}
          onChange={(newValue) => setToDate(newValue)}
        ></DatePicker>
        <Button onClick={exportWorkLog}>エクスポート</Button>
        <Box style={{ textAlign: "center" }}>
          {
            dataBlobUrl
              ?
              <Link
                href={dataBlobUrl}
                download={"worklog." + exportType}
                onClick={() => {
                  setTimeout(() => {
                    toast.success('save to Download directory');
                    URL.revokeObjectURL(dataBlobUrl);
                    setDataBlobUrl(null);
                  }, 0);
                }}>ダウンロード</Link>
              :
              <></>
          }
        </Box>
      </Stack>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </LocalizationProvider>
  )
}


export default FileExporter;
