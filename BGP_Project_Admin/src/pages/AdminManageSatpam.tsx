import type { Satpam } from "../types/satpam";
import { useNavigate } from "react-router-dom";
import { useSatpamData } from "../hooks/useSatpamData";
import { useMitraAssignment } from "../hooks/useMitraAssignment";
import { SatpamTable } from "../Components/satpam/SatpamTable";
import { MitraAssignmentModal } from "../Components/satpam/MitraAssignmentModal";
import { DeleteConfirmationModal } from "../Components/common/DeleteConfirmationModal";

const AdminManageSatpam = () => {
  const navigate = useNavigate();
  const {
    dataSatpam,
    loading,
    limit,
    hasMore,
    currentPage,
    handleNextPage,
    handlePrevPage,
    userRole,
    refreshData,
    deleteState,
  } = useSatpamData();

  const assignmentHook = useMitraAssignment(refreshData);

  const handleOpenEdit = (item: Satpam) => {
    navigate("/AdminEditDetailSatpam", { state: { uuid: item.uuid } });
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Satpam
          </h2>

        </div>

        <div className="table-section-container mt-6">
          <SatpamTable
            data={dataSatpam}
            loading={loading}
            hasMore={hasMore}
            currentPage={currentPage}
            limit={limit}
            userRole={userRole}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onEdit={handleOpenEdit}
            onDelete={deleteState.confirm}
            onAssign={assignmentHook.openAssignmentModal}
            onDetail={() => navigate(userRole?.toLowerCase() === "client" ? "/ClientDetailSatpam" : "/AdminDetailSatpam")}
          />
        </div>

        <MitraAssignmentModal assignment={assignmentHook} />
        <DeleteConfirmationModal
          isOpen={deleteState.isOpen}
          onClose={() => deleteState.setIsOpen(false)}
          onConfirm={deleteState.execute}
        />
      </div>
    </div>
  );
};

export default AdminManageSatpam;
