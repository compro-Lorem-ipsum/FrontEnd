import { useSatpamData } from "../hooks/useSatpamData";
import { useApprovalAkun } from "../hooks/useApprovalAkun";
import { ApprovalAkunTable } from "../Components/satpam/ApprovalAkunTable";
import { ApprovalAkunModal } from "../Components/satpam/ApprovalAkunModal";

const AdminAprovalAkun = () => {
  const { 
    dataSatpam, 
    loading, 
    limit,
    hasMore, 
    currentPage, 
    handleNextPage, 
    handlePrevPage, 
    refreshData 
  } = useSatpamData();
  
  const { modalState, approvalState, actions } = useApprovalAkun(refreshData);

  const filteredData = dataSatpam.filter(item => {
    if (item.status === 'pending') return true;
    if (item.status === 'active' || item.status === 'rejected') {
      if (!item.status_updated_at) return false;
      const updatedDate = new Date(item.status_updated_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }
    return false;
  });

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Approval Akun Satpam
          </h2>
        </div>

        <div className="table-section-container mt-6">
          <ApprovalAkunTable
            data={filteredData}
            loading={loading}
            hasMore={hasMore}
            limit={limit}
            currentPage={currentPage}
            isRejecting={approvalState.isRejecting}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onApproveConfirm={actions.handleOpenModal}
            onReject={actions.handleReject}
          />
        </div>

        <ApprovalAkunModal
          isOpen={modalState.isOpen}
          onClose={modalState.onClose}
          selectedSatpam={approvalState.selectedSatpam}
          mitraOptions={approvalState.mitraOptions}
          selectedMitraId={approvalState.selectedMitraId}
          setSelectedMitraId={approvalState.setSelectedMitraId}
          loadingMitra={approvalState.loadingMitra}
          hasMoreMitra={approvalState.hasMoreMitra}
          loadingMoreMitra={approvalState.loadingMoreMitra}
          loadMoreMitra={approvalState.loadMoreMitra}
          isApproving={approvalState.isApproving}
          onApprove={actions.handleApprove}
        />
      </div>
    </div>
  );
};

export default AdminAprovalAkun;
