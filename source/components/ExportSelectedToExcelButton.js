export default function ExportSelectedToExcelButton({ handleBulkExportClick }) {
	return (
		<button
			className="btn btn-success pull-left"
            style={{marginLeft: 10}}
			disabled={false}
			onClick={handleBulkExportClick}
		>
			Export To Excel
		</button>
	);
}