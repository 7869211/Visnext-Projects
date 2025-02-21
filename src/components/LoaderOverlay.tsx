export function LoaderOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-purple-1" />
        <p className="text-sm text-b-black-1">Creating conversation...</p>
      </div>
    </div>
  );
} 