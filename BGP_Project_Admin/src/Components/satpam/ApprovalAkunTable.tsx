import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Spinner,
} from "@heroui/react";
import type { Satpam } from "../../types/satpam";

const statusStyles: Record<string, string> = {
  pending: "bg-[#FEF6E0] text-[#B45309]",
  active: "bg-[#E4F9EE] text-[#02A758]",
  rejected: "bg-[#FCE7E9] text-[#E11D48]",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  active: "Disetujui",
  rejected: "Ditolak",
};

interface ApprovalAkunTableProps {
  data: Satpam[];
  loading: boolean;
  limit: number;
  hasMore: boolean;
  currentPage: number;
  isRejecting: string | null;
  userRole: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onApproveConfirm: (item: Satpam) => void;
  onReject: (uuid: string) => void;
}

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "Email", uid: "email" },
  { name: "NIP", uid: "nip" },
  { name: "Jabatan", uid: "jabatan" },
  { name: "No Telp", uid: "no_telp" },
  { name: "Status", uid: "status" },
  { name: "Pembuatan", uid: "created_at" },
  { name: "Aksi", uid: "aksi" },
];

export const ApprovalAkunTable = ({
  data,
  loading,
  limit,
  hasMore,
  currentPage,
  isRejecting,
  userRole,
  onNextPage,
  onPrevPage,
  onApproveConfirm,
  onReject,
}: ApprovalAkunTableProps) => {
  const columns =
    userRole?.toLowerCase() === "cabang"
      ? INITIAL_COLUMNS.filter((col) => col.uid !== "aksi")
      : INITIAL_COLUMNS;

  return (
    <Table
      aria-label="Tabel Approval Akun Satpam"
      shadow="none"
      isStriped
      className="rounded-xl border border-gray-200"
      bottomContent={
        <div className="flex w-full justify-center items-center px-4 py-2">
          <Pagination
            showControls
            page={currentPage}
            total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
            onChange={(page) => {
              if (page > currentPage) onNextPage();
              else if (page < currentPage) onPrevPage();
            }}
            classNames={{
              item: "[&:not([data-active=true])]:hidden",
            }}
          />
        </div>
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "status" || column.uid === "aksi" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={data}
        emptyContent={loading ? <Spinner /> : "Tidak ada data satpam."}
        isLoading={loading}
        loadingContent={<Spinner />}
      >
        {(item: Satpam) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              switch (columnKey) {
                case "no":
                  return (
                    <TableCell>
                      {(currentPage - 1) * limit + data.indexOf(item) + 1}
                    </TableCell>
                  );
                case "nama":
                  return <TableCell>{item.nama || "-"}</TableCell>;
                case "email":
                  return <TableCell>{item.email || "-"}</TableCell>;
                case "nip":
                  return <TableCell>{item.nip || "-"}</TableCell>;
                case "jabatan":
                  return <TableCell>{item.jabatan || "-"}</TableCell>;
                case "no_telp":
                  return <TableCell>{item.nomor_hp || item.no_telp || "-"}</TableCell>;
                case "status":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                            statusStyles[item.status || ""] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusLabels[item.status || ""] || item.status || "-"}
                        </span>
                      </div>
                    </TableCell>
                  );
                case "created_at":
                  return (
                    <TableCell>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}
                    </TableCell>
                  );
                case "aksi":
                  return (
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {item.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-[#E4F9EE] text-[#02A758] font-medium"
                              onPress={() => onApproveConfirm(item)}
                            >
                              Setuju
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#FCE7E9] text-[#E11D48] font-medium"
                              onPress={() => onReject(item.uuid)}
                              isLoading={isRejecting === item.uuid}
                            >
                              Tolak
                            </Button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">
                            {statusLabels[item.status || ""] || "-"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  );
                default:
                  return <TableCell>-</TableCell>;
              }
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
