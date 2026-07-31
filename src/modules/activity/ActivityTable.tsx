import { DatePickerWithRange } from "@components/DatePickerWithRange";
import SquareIcon from "@components/SquareIcon";
import { DataTable } from "@components/table/DataTable";
import DataTableHeader from "@components/table/DataTableHeader";
import DataTableRefreshButton from "@components/table/DataTableRefreshButton";
import DataTableResetFilterButton from "@components/table/DataTableResetFilterButton";
import {
  formatUsersChip,
  UserOption,
  UsersPicker,
} from "@components/table/filters/UsersPicker";
import {
  TableFilterChips,
  TableFilterDef,
  TableFiltersButton,
} from "@components/table/TableFilters";
import GetStartedTest from "@components/ui/GetStartedTest";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { uniqBy } from "lodash";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSWRConfig } from "swr";
import PeerIcon from "@/assets/icons/PeerIcon";
import { useLocale } from "@/contexts/LocaleProvider";
import loadConfig from "@utils/config";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ActivityEvent } from "@/interfaces/ActivityEvent";
import { ActivityEntryRow } from "@/modules/activity/ActivityEntryRow";
import {
  ActivityTypePicker,
  formatActivityTypeChip,
} from "@/modules/activity/ActivityTypePicker";

const config = loadConfig();

type Props = {
  events?: ActivityEvent[];
  isLoading: boolean;
  headingTarget?: HTMLHeadingElement | null;
};

const defaultFromDate = dayjs().subtract(14, "day").toDate();
const defaultToDate = dayjs().toDate();

export default function ActivityTable({
  events,
  isLoading,
  headingTarget,
}: Props) {
  const { t } = useLocale();
  const { mutate } = useSWRConfig();
  const path = usePathname();

  const columns = useMemo<ColumnDef<ActivityEvent>[]>(
    () => [
      {
        accessorKey: "activity_code",
        header: ({ column }) => (
          <DataTableHeader column={column}>
            {t("activity.table.code")}
          </DataTableHeader>
        ),
        sortingFn: "text",
        filterFn: "arrIncludesSomeExact",
        cell: ({ row }) => <ActivityEntryRow event={row.original} />,
      },
      {
        id: "activity_text",
        accessorFn: (event) => {
          try {
            if (event.meta) {
              return Object.keys(event.meta)
                .map((key) => `${event.meta[key]}`)
                .join(" ");
            }
          } catch (error) {
            return "";
          }
        },
      },
      {
        accessorKey: "timestamp",
        id: "timestamp",
        filterFn: "dateRange",
      },
      {
        accessorKey: "activity",
        id: "name",
      },
      {
        id: "initiator_email",
        // Keep the server sentinel unchanged; only visible labels are localized.
        accessorFn: (row) => row.initiator_email || "NetBird",
        filterFn: "exactMatch",
      },
    ],
    [t],
  );

  // Default sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "timestamp",
      desc: true,
    },
  ]);

  // Initial Date Range
  const [initialDateRange, setInitialDateRange] = useLocalStorage<
    DateRange | undefined
  >("netbird-table-range" + path, {
    from: defaultFromDate,
    to: defaultToDate,
  });

  // Range for DatePicker
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dayjs(initialDateRange?.from).toDate(),
    to: dayjs(initialDateRange?.to).toDate(),
  });

  const userOptions = useMemo<UserOption[]>(() => {
    const uniqueUsers = uniqBy(events, (event) => event.initiator_email);
    return uniqueUsers.map((event) => ({
      name: event.initiator_name,
      id: event.initiator_id,
      email: event.initiator_email || "NetBird",
      external: !!event?.meta?.external,
    }));
  }, [events]);

  const filterDefs = useMemo<TableFilterDef[]>(
    () => [
      {
        id: "activity_code",
        label: t("activity.filter.type"),
        renderPicker: (p) => (
          <ActivityTypePicker
            value={p.value as string[] | undefined}
            onChange={p.onChange}
            close={p.close}
            events={events ?? []}
          />
        ),
        formatChip: (v) =>
          formatActivityTypeChip(
            v as string[] | undefined,
            t("activity.filter.typeCount", {
              count: (v as string[] | undefined)?.length ?? 0,
            }),
          ),
      },
      {
        id: "initiator_email",
        label: t("activity.filter.initiator"),
        renderPicker: (p) => (
          <UsersPicker
            value={p.value as string | undefined}
            onChange={p.onChange}
            close={p.close}
            options={userOptions}
          />
        ),
        formatChip: (v) =>
          formatUsersChip(v as string | undefined, userOptions),
      },
    ],
    [events, t, userOptions],
  );

  return (
    <DataTable
      headingTarget={headingTarget}
      paginationClassName={"max-w-[800px]"}
      as={"div"}
      text={t("activity.table.title")}
      sorting={sorting}
      setSorting={setSorting}
      initialPageSize={25}
      showResetFilterButton={false}
      wrapperClassName={"gap-0 flex flex-col"}
      tableClassName={"px-8 pt-4"}
      columns={columns}
      data={events}
      searchPlaceholder={t("activity.search.placeholder")}
      isLoading={isLoading}
      aboveTable={(table) => (
        <TableFilterChips table={table} filters={filterDefs} />
      )}
      columnVisibility={{
        timestamp: false,
        name: false,
        activity_text: false,
        initiator_email: false,
      }}
      getStartedCard={
        <GetStartedTest
          icon={
            <SquareIcon
              icon={<PeerIcon className={"fill-nb-gray-200"} size={20} />}
              color={"gray"}
              size={"large"}
            />
          }
          title={t("activity.empty.title")}
          description={t("activity.empty.description", {
            product: config.productName,
          })}
        />
      }
      onFilterReset={() => {
        const date = { from: defaultFromDate, to: defaultToDate };
        setInitialDateRange(date);
        setDateRange(date);
      }}
    >
      {(table) => {
        return (
          <>
            <DatePickerWithRange
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setInitialDateRange(range);
                table.setPageIndex(0);
                table
                  .getColumn("timestamp")
                  ?.setFilterValue([range?.from, range?.to]);
              }}
            />
            <TableFiltersButton
              table={table}
              filters={filterDefs}
              disabled={events?.length == 0}
            />
            <DataTableResetFilterButton
              table={table}
              onClick={() => {
                table.setPageIndex(0);
                table.resetColumnFilters();
                table.resetGlobalFilter();
                const date = { from: defaultFromDate, to: defaultToDate };
                setInitialDateRange(date);
                setDateRange(date);
                table
                  .getColumn("timestamp")
                  ?.setFilterValue([date.from, date.to]);
              }}
            />
            <DataTableRefreshButton
              isDisabled={events?.length == 0}
              onClick={() => {
                mutate("/events/audit").then();
              }}
            />
          </>
        );
      }}
    </DataTable>
  );
}
