export default function DownloadSelectedFilesButton({ selectedCount, handleBulkDownloadClick }) {
	return (
		<button
			className="btn btn-primary pull-left"
            style={{marginLeft: 10}}
			disabled={selectedCount === 0}
			onClick={handleBulkDownloadClick}
		>
			Download Selected Files
		</button>
	);
}