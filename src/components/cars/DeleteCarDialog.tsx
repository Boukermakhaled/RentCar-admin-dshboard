import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface DeleteCarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteCarDialog({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteCarDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 lg:p-8">
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Delete car
        </h3>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this car?
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="bg-error-500 hover:bg-error-600 disabled:bg-error-300"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
