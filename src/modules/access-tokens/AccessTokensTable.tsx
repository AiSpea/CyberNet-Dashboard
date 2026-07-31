import Card from "@components/Card";
import { DataTable } from "@components/table/DataTable";
import DataTableHeader from "@components/table/DataTableHeader";
import NoResults from "@components/ui/NoResults";
import { IconApi } from "@tabler/icons-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import useFetchApi from "@utils/api";
import loadConfig from "@utils/config";
import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import React from "react";
import { useLocale } from "@/contexts/LocaleProvider";
import UserProvider from "@/contexts/UserProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AccessToken } from "@/interfaces/AccessToken";
import { User } from "@/interfaces/User";
import AccessTokenActionCell from "@/modules/access-tokens/AccessTokenActionCell";
import EmptyRow from "@/modules/common-table-rows/EmptyRow";
import ExpirationDateRow from "@/modules/common-table-rows/ExpirationDateRow";
import LastTimeRow from "@/modules/common-table-rows/LastTimeRow";
import SetupKeyNameCell from "@/modules/setup-keys/SetupKeyNameCell";

const config = loadConfig();

type Props = {
  user: User;
};

const accessTokenColumnLabels = {
  name: "accessTokens.column.name",
  expires: "accessTokens.column.expires",
  lastUsed: "accessTokens.column.lastUsed",
} as const;

function AccessTokenColumnLabel({
  label,
}: Readonly<{ label: keyof typeof accessTokenColumnLabels }>) {
  const { t } = useLocale();
  return <>{t(accessTokenColumnLabels[label])}</>;
}

function AccessTokenLastUsed({ date }: Readonly<{ date: Date }>) {
  const { t } = useLocale();
  return <LastTimeRow date={date} text={t("accessTokens.lastUsedOn")} />;
}

export const AccessTokensTableColumns: ColumnDef<AccessToken>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableHeader column={column}>
          <AccessTokenColumnLabel label={"name"} />
        </DataTableHeader>
      );
    },
    sortingFn: "text",
    cell: ({ row }) => {
      const isValid = dayjs(row.original.expiration_date).isAfter(dayjs());
      return <SetupKeyNameCell name={row.original.name} valid={isValid} />;
    },
  },
  {
    accessorKey: "expiration_date",
    header: ({ column }) => {
      return (
        <DataTableHeader column={column}>
          <AccessTokenColumnLabel label={"expires"} />
        </DataTableHeader>
      );
    },
    cell: ({ row }) => (
      <ExpirationDateRow date={row.original.expiration_date} />
    ),
  },
  {
    accessorKey: "last_used",
    header: ({ column }) => {
      return (
        <DataTableHeader column={column}>
          <AccessTokenColumnLabel label={"lastUsed"} />
        </DataTableHeader>
      );
    },
    sortingFn: "datetime",
    cell: ({ row }) => {
      return typeof row.original.last_used === "undefined" ? (
        <EmptyRow />
      ) : (
        <AccessTokenLastUsed date={row.original.last_used} />
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => <AccessTokenActionCell access_token={row.original} />,
  },
];

export default function AccessTokensTable({ user }: Readonly<Props>) {
  const { t } = useLocale();
  const { data: tokens } = useFetchApi<AccessToken[]>(
    `/users/${user.id}/tokens`,
    true,
  );

  const path = usePathname();

  // Default sorting state of the table
  const [sorting, setSorting] = useLocalStorage<SortingState>(
    "netbird-table-sort" + path,
    [
      {
        id: "name",
        desc: true,
      },
    ],
  );

  return (
    <UserProvider user={user}>
      <Card className={"mt-5 w-full"}>
        {tokens && tokens.length > 0 ? (
          <DataTable
            text={t("accessTokens.title")}
            tableClassName={"mt-0"}
            minimal={true}
            showSearchAndFilters={false}
            inset={false}
            sorting={sorting}
            setSorting={setSorting}
            columns={AccessTokensTableColumns}
            data={tokens}
          />
        ) : (
          <div className={"bg-nb-gray-950 overflow-hidden"}>
            <NoResults
              className={"py-3"}
              title={t("accessTokens.emptyTitle")}
              description={t("accessTokens.emptyDescription", {
                product: config.productName,
              })}
              icon={<IconApi size={20} className={"fill-nb-gray-300"} />}
            />
          </div>
        )}
      </Card>
    </UserProvider>
  );
}
