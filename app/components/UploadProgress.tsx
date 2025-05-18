import { FC } from 'react';

interface UploadProgressProps {
  percentage: number;
  status: 'idle' | 'processing' | 'success' | 'error';
  fileName?: string;
  fileSize?: number;
}

const UploadProgress: FC<UploadProgressProps> = ({
  percentage,
  status,
  fileName,
  fileSize
}) => {
  // Convert bytes to KB/MB
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Get the appropriate color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };
  
  // Get progress text based on status
  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return 'Ready to upload';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center mb-2">
        {fileName && (
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
            <p className="text-xs text-gray-500">
              {formatSize(fileSize)}
            </p>
          </div>
        )}
        <div className="ml-2 shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'processing' ? 'bg-blue-100 text-blue-800' :
            status === 'success' ? 'bg-green-100 text-green-800' :
            status === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className={`${getStatusColor()} h-2 rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{percentage}% complete</span>
        {status === 'processing' && (
          <span className="text-xs text-gray-500">Please wait...</span>
        )}
      </div>
    </div>
  );
};

export default UploadProgress; 