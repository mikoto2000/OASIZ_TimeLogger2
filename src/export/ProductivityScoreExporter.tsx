import { useEffect, useState } from "react";

import { Box, Button, Link, Stack } from "@mui/material";
import { Service } from "../services/Service";
import { TauriService } from "../services/TauriService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs, { Dayjs } from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import Parser from "@json2csv/plainjs/Parser.js";

import { sendIntent } from "tauri-plugin-android-intent-send-api";

export type ExportType = 'json' | 'csv';

interface ProductivityScoreExporterProps {
  exportType: ExportType;
  service: Service;
};

export const ProductivityScoreExporter: React.FC<ProductivityScoreExporterProps> = ({ exportType, service = new TauriService() }) => {

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

      // TODO: 戻り値に日付情報が必要
      const productivityScores: { [key: string]: number[] } = await service.getProductivityScores(
        fromDate.year(),
        fromDate.month() + 1,
        fromDate.date(),
        toDate.year(),
        toDate.month() + 1,
        toDate.date(),
      );
      console.log(productivityScores);

      const fromDay = dayjs()
        .startOf('date')
        .year(fromDate.year())
        .month(fromDate.month())
        .date(fromDate.date());

      const toDay = dayjs()
        .startOf('date')
        .year(toDate.year())
        .month(toDate.month())
        .date(toDate.date());

      const parser = new Parser({
        fields: ["年月日", "時間", "作業", "生産性スコア", "生産性スコア合計"],
        withBOM: true
      });

      let rows: any = [];
      let target = fromDay;
      while (!target.isAfter(toDay)) {
        console.log(target);
        if (!productivityScores.hasOwnProperty(target.format("YYYY-MM-DD"))) {
          console.log("kityatta...");
          target = target.add(1, 'day');
          continue;
        }

        const nextDay = target.add(1, 'day');

        // TODO: 最適化
        const filterdLogs = logs
          .filter((log: any) => {
            let logStartDay = dayjs(log.start_date);
            let logEndDay = dayjs(log.end_date);

            return ((!logStartDay.isBefore(target) && logStartDay.isBefore(nextDay))
              ||
              (!logEndDay.isBefore(target) && logEndDay.isBefore(nextDay)))
          })

        let dateLabel = target.format("YYYY-MM-DD");
        let sum = productivityScores[target.format("YYYY-MM-DD")].reduce((sum: number, current: number) => { return sum + current }, 0);

        for (let i = 0; i < 24; i++) {
          rows.push({
            "年月日": dateLabel,
            "時間": i,
            "作業": filterdLogs.filter((e: any) => {
              let logStartHour = dayjs(e.start_date).hour();
              let logEndHour = dayjs(e.end_date).hour();

              return (logStartHour === i || logEndHour === i)
            }).map((e: any) => e.work_name).join("\n"),
            "生産性スコア": productivityScores[dateLabel][i],
            "生産性スコア合計": sum
          })
        }

        target = target.add(1, 'day');
      }

      let data = parser.parse(rows);

      // try {
      //   const dd = await downloadDir();
      //   console.log(dd);
      //   const savePath = path.join(dd, "worklog.json");

      //   if (savePath) {
      //     writeTextFile(savePath, data);
      //     toast.success(`save to ${savePath}`);
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      if (platform !== 'android' && platform !== 'ios' && platform != null) {
        const blob = new Blob([data], { type: 'text/plain' });
        const blobUrl = URL.createObjectURL(blob);
        setDataBlobUrl(blobUrl);
      } else {
        sendIntent(`worklog.${exportType}`, data);
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


export default ProductivityScoreExporter;

