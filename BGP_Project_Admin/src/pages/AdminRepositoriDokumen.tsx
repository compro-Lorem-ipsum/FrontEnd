import { formatDateTimeZone, getRole } from "../Utils/helpers";
import { useSharedDocumentData } from "../hooks/useSharedDocumentData";
import { useSharedDocumentForm } from "../hooks/useSharedDocumentForm";
import { useMitraOptions } from "../hooks/useMitraOptions";
import { useDocumentDelete } from "../hooks/useDocumentDelete";
import { InfiniteScrollTrigger } from "../Components/common/InfiniteScrollTrigger";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";

import { FiSearch } from "react-icons/fi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";

import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";
import { DocumentFormModal } from "../Components/sharedDocument/DocumentFormModal";

export const jenisDokumen = [
  { key: "peraturan", label: "Peraturan" },
  { key: "atribut", label: "Atribut" },
  { key: "sop", label: "SOP" },
  { key: "lainnya", label: "Lainnya" },
];

const columns = [
  { name: "No", uid: "no" },
  { name: "Nama Dokumen", uid: "nama_dokumen" },
  { name: "File", uid: "file" },
  { name: "Tujuan", uid: "tujuan" },
  { name: "Diunggah", uid: "diunggah" },
  { name: "Aksi", uid: "aksi" },
];

const AdminRepositoriDokumen = () => {
  const role = getRole() ?? "";
  const visibleColumns = role === "client" ? columns.filter(c => c.uid !== "tujuan") : columns;
  const {
    dataDocs,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    refreshData,
    search,
    setSearch,
    filterClient,
    setFilterClient,
  } = useSharedDocumentData();

  const formHook = useSharedDocumentForm(refreshData);
  const {
    isOpen,
    onClose,
    judul,
    setJudul,
    deskripsi,
    setDeskripsi,
    file,
    setFile,
    selectedKeys,
    submitting,
    targetOptions,
    handleSelectionChange,
    clearAll,
    openCreateModal,
    openEditModal,
    editUuid,
    handleSubmit,
    ALL_KEY
  } = formHook;

  const handleEdit = (item: any) => {
    openEditModal(item.uuid);
  };

  const {
    mitraOptions,
    hasMoreMitra,
    loadingMoreMitra,
    loadMoreMitra,
  } = useMitraOptions();

  const {
    isDeleteOpen,
    onDeleteClose,
    deleteTarget,
    deleting,
    handleDeletePrompt,
    handleConfirmDelete,
  } = useDocumentDelete(refreshData);

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Repositori Dokumen
          </h2>
          <p className="text-md text-black text-sm w-200">
            Upload dokumen (peraturan, atribut, dll) yang bisa dilihat & diunduh
            satpam via aplikasi. Bisa untuk semua satpam atau client tertentu.
          </p>
        </div>
        {role !== "client" && (
          <Button
            className="text-white font-semibold bg-[#122C93]"
            size="md"
            onPress={openCreateModal}
          >
            + Upload Dokumen
          </Button>
        )}
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama dokumen, atau deskripsi"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {role !== "client" && (
          <Select
            className="w-48"
            placeholder="Semua Client"
            selectedKeys={[filterClient]}
            onChange={(e) => setFilterClient(e.target.value || "all")}
            classNames={{
              trigger:
                "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
              value: "text-[#8D8787] text-sm",
            }}
            listboxProps={{
              bottomContent: (
                <InfiniteScrollTrigger
                  hasMore={hasMoreMitra}
                  isLoading={loadingMoreMitra}
                  onLoadMore={loadMoreMitra}
                />
              ),
            }}
          >
            {[
              { key: "all", label: "Semua Client" },
              ...mitraOptions.map(m => ({ key: m.uuid, label: m.nama }))
            ].map((c) => (
              <SelectItem key={c.key} textValue={c.label}>{c.label}</SelectItem>
            ))}
          </Select>
        )}
        <Select
          className="w-32"
          placeholder="Tampilkan"
          selectedKeys={[limit.toString()]}
          onChange={(e) => {
            const newLimit = parseInt(e.target.value);
            if (!isNaN(newLimit)) setLimit(newLimit);
          }}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((pageSize) => (
            <SelectItem key={pageSize.toString()} textValue={`${pageSize} Data`}>
              {pageSize} Data
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <Table
          aria-label="Tabel Repositori Dokumen"
          shadow="none"
          isStriped
          className="rounded-xl"
          bottomContent={
            <div className="flex w-full justify-center items-center px-4 py-2">
              <Pagination
                showControls
                page={currentPage}
                total={Math.max(currentPage + (hasMore ? 1 : 0), 1)}
                onChange={(page) => {
                  if (page > currentPage) handleNextPage();
                  else if (page < currentPage) handlePrevPage();
                }}
                classNames={{
                  item: "[&:not([data-active=true])]:hidden",
                }}
              />
            </div>
          }
        >
          <TableHeader columns={visibleColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "aksi" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={dataDocs}
            emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
          >
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell>
                          {(currentPage - 1) * limit +
                            dataDocs.indexOf(item) +
                            1}
                        </TableCell>
                      );
                    case "nama_dokumen":
                      return (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {item.nama}
                            </span>
                            <span className="text-sm font-light text-[#8D8787] w-[280px] truncate">
                              {item.deskripsi}
                            </span>
                          </div>
                        </TableCell>
                      );
                    case "file":
                      return (
                        <TableCell>
                          <div className="flex flex-row items-center gap-2">
                            <FaFilePdf className="text-[#E5493A] text-2xl" />
                            {item.file?.view_url ? (
                              <a
                                href={item.file.view_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#122C93] hover:underline cursor-pointer"
                              >
                                Lihat Dokumen
                              </a>
                            ) : (
                              <span className="text-sm text-black">
                                Tidak ada file
                              </span>
                            )}
                          </div>
                        </TableCell>
                      );
                    case "tujuan":
                      if (role === "client") return <TableCell>{" "}</TableCell>;
                      return (
                        <TableCell>
                          {item.recipient_type === "all_client" ? (
                            <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-full">
                              Semua Mitra
                            </span>
                          ) : (
                            <span className="bg-[#E4F9EE] text-[#02A758] text-xs font-medium px-3 py-1.5 rounded-full">
                              Mitra
                            </span>
                          )}
                        </TableCell>
                      );
                    case "diunggah":
                      return <TableCell>{formatDateTimeZone(item.created_at).replace(" pukul ", ", ").replace(".", ":")}</TableCell>;
                    case "aksi":
                      return (
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            {role !== "client" && (
                              <button
                                className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer"
                                onClick={() => handleEdit(item)}
                              >
                                <FaRegEdit className="text-base" />
                              </button>
                            )}
                            {item.file?.download_url ? (
                              <a
                                href={item.file.download_url}
                                download
                                className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] flex cursor-pointer"
                              >
                                <LuDownload className="text-base" />
                              </a>
                            ) : (
                              <button className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] opacity-50 cursor-not-allowed">
                                <LuDownload className="text-base" />
                              </button>
                            )}
                            {role !== "client" && (
                              <button
                                className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED] cursor-pointer"
                                onClick={() => handleDeletePrompt(item)}
                              >
                                <FaRegTrashAlt className="text-base" />
                              </button>
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

      <DocumentFormModal
        isOpen={isOpen}
        onClose={onClose}
        editUuid={editUuid}
        judul={judul}
        setJudul={setJudul}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        file={file}
        setFile={setFile}
        selectedKeys={selectedKeys}
        handleSelectionChange={handleSelectionChange}
        clearAll={clearAll}
        targetOptions={targetOptions}
        ALL_KEY={ALL_KEY}
        handleSubmit={handleSubmit}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus dokumen ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={deleting}
      />
    </div>
  );
};

export default AdminRepositoriDokumen;
