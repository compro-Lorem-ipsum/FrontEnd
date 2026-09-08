import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePanicAlertData } from "../hooks/usePanicAlertData";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { InfiniteScrollTrigger } from "../Components/common/InfiniteScrollTrigger";
import { ActivePanicAlertCard } from "../Components/panicAlert/ActivePanicAlertCard";
import type { PanicAlertData } from "../types/panicAlert";
import { formatDateTimeZone, getRole } from "../Utils/helpers";


const filters = [
  { key: "semua", label: "Semua" },
  { key: "active", label: "Aktif" },
  { key: "handled", label: "Dalam Penanganan" },
  { key: "resolved", label: "Selesai" },
];

const statusStyles: Record<string, string> = {
  active: "bg-[#FFE2E2] text-[#F31260]",
  handled: "bg-[#E8EEFF] text-[#122C93]",
  resolved: "bg-[#E4F9EE] text-[#02A758]",
};

const statusLabels: Record<string, string> = {
  active: "Aktif",
  handled: "Dalam Penanganan",
  resolved: "Selesai",
};

const AdminPanicAlert = () => {
  const role = getRole() ?? "";

  const {
    data,
    activeData,
    loading,
    satpamId,
    setSatpamId,
    statusFilter,
    setStatusFilter,
    limit,
    setLimit,
    currentIndex,
    hasMore,
    handleNextPage,
    handlePrevPage,
    resolveAlert,
    handleAlert,
  } = usePanicAlertData();

  const scheduleOptions = useScheduleOptions(true);

  const activeAlerts = activeData || [];
  const [activeAlertPage, setActiveAlertPage] = useState(1);
  const activeAlertsLimit = 3;
  const paginatedAlerts = activeAlerts.slice(
    (activeAlertPage - 1) * activeAlertsLimit,
    activeAlertPage * activeAlertsLimit
  );

  const columns = [
    { name: "No", uid: "no" },
    { name: "Nama", uid: "nama" },
    { name: "NIP", uid: "nip" },
  ];
  if (role !== "client") {
    columns.push({ name: "Mitra", uid: "mitra" });
  }
  columns.push(
    { name: "Lokasi", uid: "lokasi" },
    { name: "Waktu", uid: "waktu" },
    { name: "Status", uid: "status" }
  );
  if (role !== "admin") {
    columns.push({ name: "Aksi", uid: "aksi" });
  }

  return (
    <div className="flex flex-col gap-2 p-2.5">
      {/* Header */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">Panic Alert</h2>
          <p className="text-md text-black text-sm w-full max-w-2xl">
            Tombol darurat satpam. Status Aktif perlu tindakan secepatnya.
          </p>
        </div>
      </div>

      {/* Search Engine */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <Select
          className="flex-1 min-w-0"
          placeholder="Filter by Satpam"
          selectedKeys={satpamId ? [satpamId] : [""]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            setSatpamId(val ? String(val) : "");
          }}
          classNames={{
            trigger: "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11",
            value: "text-gray-700 text-sm",
          }}
          listboxProps={{
            bottomContent: (
              <InfiniteScrollTrigger
                hasMore={scheduleOptions.hasMoreSatpam}
                isLoading={scheduleOptions.isLoadingSatpam}
                onLoadMore={scheduleOptions.loadMoreSatpam}
              />
            ),
          }}
        >
          {[{ uuid: "", nama: "Semua Satpam", nip: "" }, ...scheduleOptions.listSatpam].map((s: any) => (
            <SelectItem key={s.uuid} textValue={s.uuid ? `${s.nama} - ${s.nip}` : s.nama}>
              {s.uuid ? `${s.nama} - ${s.nip}` : s.nama}
            </SelectItem>
          ))}
        </Select>

        <Select
          className="w-28 flex-shrink-0"
          placeholder="Data"
          selectedKeys={[limit.toString()]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            if (val) setLimit(Number(val));
          }}
          classNames={{
            trigger: "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {[5, 10, 15, 20].map((pageSize) => (
            <SelectItem key={pageSize.toString()} textValue={`${pageSize} Data`}>
              {pageSize} Data
            </SelectItem>
          ))}
        </Select>

        <div className="container-selector-filter flex flex-row gap-2 items-center flex-shrink-0">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              onPress={() => setStatusFilter(f.key)}
              className={
                statusFilter === f.key
                  ? "bg-[#122C93] text-white font-semibold h-11 px-4"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium px-4"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container-card-table flex flex-col gap-2 mt-3 w-full min-w-0 overflow-hidden">

        {/* Active Alerts Section */}
        <div className="flex flex-row items-center justify-between w-full">
          <h2 className="font-semibold">
            Aktif <span className="text-danger">({activeAlerts.length})</span>
          </h2>
          {activeAlerts.length > activeAlertsLimit && (
            <div className="flex flex-row gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-white border border-gray-200"
                onPress={() => setActiveAlertPage((prev) => Math.max(1, prev - 1))}
                isDisabled={activeAlertPage === 1}
              >
                <FiChevronLeft className="text-lg text-[#122C93]" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-white border border-gray-200"
                onPress={() => setActiveAlertPage((prev) => prev + 1)}
                isDisabled={activeAlertPage * activeAlertsLimit >= activeAlerts.length}
              >
                <FiChevronRight className="text-lg text-[#122C93]" />
              </Button>
            </div>
          )}
        </div>

        <div className="w-full pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
            {paginatedAlerts.map((item) => (
              <ActivePanicAlertCard
                key={item.uuid}
                item={item}
                role={role}
                onHandleAlert={handleAlert}
              />
            ))}
          {activeAlerts.length === 0 && (
            <div className="text-sm text-gray-500 italic p-2">Tidak ada panic alert aktif saat ini.</div>
          )}
          </div>
        </div>

        {/* Table */}
        <div className="table-container mt-3">
          <Table
            aria-label="Tabel Riwayat Panic Alert"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={currentIndex + 1}
                  total={Math.max(currentIndex + 1 + (hasMore ? 1 : 0), 1)}
                  onChange={(page) => {
                    if (page > currentIndex + 1) handleNextPage();
                    else if (page < currentIndex + 1) handlePrevPage();
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
                <TableColumn key={column.uid} align={column.uid === "status" || column.uid === "aksi" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={data}
              emptyContent={loading ? <Spinner size="sm" /> : "Tidak ada data"}
              isLoading={loading}
            >
              {(item: PanicAlertData) => (
                <TableRow key={item.uuid}>
                  {(columnKey) => {
                    switch (columnKey) {
                      case "no":
                        return (
                          <TableCell>
                            {currentIndex * limit + data.indexOf(item) + 1}
                          </TableCell>
                        );
                      case "nama":
                        return <TableCell>{item.satpam.nama}</TableCell>;
                      case "nip":
                        return <TableCell>{item.satpam.nip}</TableCell>;
                      case "mitra":
                        return <TableCell>{item.client}</TableCell>;
                      case "lokasi":
                        return (
                          <TableCell>
                            <a
                              href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#122C93] font-medium text-sm hover:underline"
                            >
                              Lihat Lokasi
                            </a>
                          </TableCell>
                        );
                      case "waktu":
                        return <TableCell>{formatDateTimeZone(item.created_at)}</TableCell>;
                      case "status":
                        return (
                          <TableCell>
                            <div className="flex justify-center">
                              <span
                                className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status] || ""}`}
                              >
                                {statusLabels[item.status] || item.status}
                              </span>
                            </div>
                          </TableCell>
                        );
                      case "aksi":
                        return (
                          <TableCell>
                            <div className="flex justify-center items-center gap-2">
                              {item.status === "active" && (
                                <Button size="sm" className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium" onPress={() => handleAlert(item.uuid)}>
                                  Tangani
                                </Button>
                              )}
                              {item.status === "handled" && (
                                <Button size="sm" className="bg-[#E4F9EE] text-[#02A758] text-xs font-medium" onPress={() => resolveAlert(item.uuid)}>
                                  Selesaikan
                                </Button>
                              )}
                              {item.status === "resolved" && (
                                <span className="text-gray-400 text-xs">-</span>
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
        </div>
      </div>

    </div>
  );
};

export default AdminPanicAlert;
