import { Box, Button } from "@mui/material";
import { Service } from "../services/Service";
import { TauriService } from "../services/TauriService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export type ExportType = 'json' | 'csv';

interface FileExporterProps {
  exportType: ExportType;
  service: Service;
};

const FileExporter: React.FC<FileExporterProps> = ({ exportType, service = new TauriService() }) => {

  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());

  const exportWorkLog = async () => {
    if (fromDate && toDate) {
      const logs = await service.getWorkLogs(
        fromDate.year(),
        fromDate.month(),
        fromDate.day(),
        toDate.year(),
        toDate.month(),
        toDate.day(),
      );

      let data;
      if (exportType === 'json') {
        data = JSON.stringify(logs);
      } else {
        // TODO: CSV 対応
        data = JSON.stringify(logs);
      }

      console.log(data);

      // Blob を作成
      const blob = new Blob([data], { type: 'text/plain' });

      // ダミーの a タグを作って Blob の URL を設定し、クリックをエミュレート
      const link = document.createElement('a');
      link.download = `作業記録.${exportType}`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
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
      </Box>
    </LocalizationProvider>
  )
}


export default FileExporter;
