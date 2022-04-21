export default function DeleteSelectedFilesButton({ selectedCount, handleBulkDeleteClick }) {
	return (
		<button
			className="btn btn-danger pull-left"
			style={{marginLeft: 2}}
			disabled={selectedCount === 0}
			onClick={handleBulkDeleteClick}
		>
			Delete Selected Files
		</button>
	);
}