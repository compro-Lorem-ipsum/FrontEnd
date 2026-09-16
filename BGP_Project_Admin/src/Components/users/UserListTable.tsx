import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Pagination,
} from "@heroui/react";
import { FaTrash } from "react-icons/fa";
import type { User } from "../../types/user";
import { formatTanggal } from "../../Utils/helpers";

interface UserListTableProps {
  users: User[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  userRole: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onDeleteClick: (uuid: string) => void;
}

const INITIAL_COLUMNS = [
  { name: "Nama Mitra", uid: "nama" },
  { name: "Email", uid: "email" },
  { name: "Pembuatan", uid: "created_at" },
  { name: "Aksi", uid: "aksi" },
];

export const UserListTable = ({
  users,
  loading,
  hasMore,
  currentPage,
  userRole,
  onNextPage,
  onPrevPage,
  onDeleteClick,
}: UserListTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Memuat data..." />
      </div>
    );
  }

  const columns =
    userRole?.toLowerCase() === "cabang"
      ? INITIAL_COLUMNS.filter((col) => col.uid !== "aksi")
      : INITIAL_COLUMNS;

  return (
    <Table
      aria-label="Tabel Data User"
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
            align={column.uid === "aksi" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users} emptyContent={"Tidak ada data user"}>
        {(item) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              switch (columnKey) {
                case "nama":
                  return (
                    <TableCell>
                      <div className="max-w-[250px] truncate" title={item.nama}>
                        {item.nama}
                      </div>
                    </TableCell>
                  );
                case "email":
                  return (
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={item.email}>
                        {item.email}
                      </div>
                    </TableCell>
                  );
                case "created_at":
                  return <TableCell>{formatTanggal(item.created_at)}</TableCell>;
                case "aksi":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="bg-[#A70202] text-white font-semibold"
                          startContent={<FaTrash />}
                          onPress={() => onDeleteClick(item.uuid)}
                        >
                          Hapus
                        </Button>
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
