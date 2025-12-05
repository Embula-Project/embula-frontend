"use client";
import { useState } from "react";
import CustomDialog from "./CustomDialog";
import ErrorDialog from "./ErrorDialog";
import SuccessDialog from "./SuccessDialog";

/**
 * DialogExamples Component
 * 
 * This component demonstrates all available dialog types.
 * You can use this as a reference for implementing dialogs in your components.
 */
export default function DialogExamples() {
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dialog Examples</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Error Dialog */}
          <button
            onClick={() => setErrorOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Show Error Dialog
          </button>

          {/* Success Dialog */}
          <button
            onClick={() => setSuccessOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Show Success Dialog
          </button>

          {/* Warning Dialog */}
          <button
            onClick={() => setWarningOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Show Warning Dialog
          </button>

          {/* Info Dialog */}
          <button
            onClick={() => setInfoOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Show Info Dialog
          </button>

          {/* Confirmation Dialog */}
          <button
            onClick={() => setConfirmOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors md:col-span-2"
          >
            Show Confirmation Dialog
          </button>
        </div>

        {/* Error Dialog */}
        <ErrorDialog
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          title="Error Occurred"
          message="Failed to load data. Please check your connection and try again."
        />

        {/* Success Dialog */}
        <SuccessDialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          title="Operation Successful"
          message="Your changes have been saved successfully!"
        />

        {/* Warning Dialog */}
        <CustomDialog
          open={warningOpen}
          onClose={() => setWarningOpen(false)}
          variant="warning"
          title="Warning"
          message="This action may have unintended consequences. Are you sure you want to continue?"
          confirmText="Proceed"
        />

        {/* Info Dialog */}
        <CustomDialog
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          variant="info"
          title="Information"
          message="Your session will expire in 5 minutes. Please save your work."
          confirmText="Got it"
        />

        {/* Confirmation Dialog */}
        <CustomDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          variant="warning"
          title="Confirm Action"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            console.log("Item deleted!");
          }}
          onCancel={() => {
            console.log("Deletion cancelled");
          }}
        />
      </div>
    </div>
  );
}
