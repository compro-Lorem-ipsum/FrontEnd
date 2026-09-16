import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Button,
  Tooltip,
} from "@heroui/react";
import { FaEdit, FaImage } from "react-icons/fa";
import { formatDateTimeZone } from "../../Utils/helpers";
import type { Patroli } from "../../types/patroli";

interface PatroliTableProps {
  data: Patroli[];
  isLoading: boolean;
  page: number;
  limit: number;
  hasMore: boolean;
  role: string;
  onNextPage: () => void;
  onPrevPage: () => void;
  onEdit: (item: Patroli) => void;
  onViewImages: (images: string[]) => void;
}

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Mitra", uid: "mitra" },
  { name: "Waktu", uid: "waktu" },
  { name: "Pos", uid: "pos" },
  { name: "Status", uid: "status" },
  { name: "Keterangan", uid: "keterangan" },
  { name: "Dokumentasi", uid: "dokumentasi" },
  { name: "Aksi", uid: "aksi" },
];

export const PatroliTable = ({
  data,
  isLoading,
  page,
  limit,
  hasMore,
  role,
  onNextPage,
  onPrevPage,
  onEdit,
  onViewImages,
}: PatroliTableProps) => {
  const total = Math.max(page + (hasMore ? 1 : 0), 1);

  const columns = INITIAL_COLUMNS.filter((col) => {
    if (role === "client" && col.uid === "mitra") return false;
    if (role?.toLowerCase() === "cabang" && col.uid === "aksi") return false;
    return true;
  });

  return (
    <Table
      isStriped
      shadow="none"
      className="border border-gray-200 rounded-xl"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={total}
            onChange={(p) => {
              if (p > page) onNextPage();
              else if (p < page) onPrevPage();
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
            align={column.uid === "dokumentasi" || column.uid === "aksi" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent="Data tidak ditemukan"
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {(item: Patroli) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              switch (columnKey) {
                case "no":
                  return <TableCell>{(page - 1) * limit + data.indexOf(item) + 1}</TableCell>;
                case "nama":
                  return (
                    <TableCell>
                      <div className="w-[150px] truncate">{item.satpam?.nama || "-"}</div>
                    </TableCell>
                  );
                case "nip":
                  return (
                    <TableCell>
                      <div className="w-[150px] truncate">{item.satpam?.nip || "-"}</div>
                    </TableCell>
                  );
                case "mitra":
                  return (
                    <TableCell>
                      <div className="w-[150px] truncate">{item.satpam?.client || "-"}</div>
                    </TableCell>
                  );
                case "waktu":
                  return <TableCell>{formatDateTimeZone(item.created_at)}</TableCell>;
                case "pos":
                  return (
                    <TableCell>
                      <div className="w-[150px] truncate">{item.pos?.nama || "-"}</div>
                    </TableCell>
                  );
                case "status":
                  return (
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status?.toLowerCase() === "aman" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {item.status || "-"}
                      </span>
                    </TableCell>
                  );
                case "keterangan":
                  return (
                    <TableCell>
                      <div className="w-[150px] truncate">{item.description || "-"}</div>
                    </TableCell>
                  );
                case "dokumentasi":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        {item.photos && item.photos.length > 0 ? (
                          <Tooltip content="Lihat Foto">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="text-[#122C93]"
                              onPress={() => onViewImages(item.photos.map((p) => p.view_url))}
                            >
                              <FaImage size={18} />
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </TableCell>
                  );
                case "aksi":
                  return (
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onPress={() => onEdit(item)}
                        className="bg-[#02A758] text-white font-semibold"
                        startContent={<FaEdit />}
                      >
                        Ubah
                      </Button>
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
