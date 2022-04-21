<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/file_manipulation.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/user_file_permissions.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/fs_directory.php";

class File_Share_File_Read extends API_Endpoint
{
    function getFunc()
    {        
        // print_r($this->args);

        $mode = $this->args['mode'];
        if ($mode === "getFile") {
            $this->_getFile();
        }
        

    }

    private function _getFile() {
        $UserFilePermissions = new UserFilePermissions($this->args['id']);
        $Directory = new FileShareDirectory();

        if (!$UserFilePermissions->canView()) {
            echo json_encode(["error" => "You do not have access to view this file."]);
            return;
        }

        $file = get_sql_row("SELECT * 
        from fs_files
        where file_id = ?", [$this->args['id']], 1, 1);

        $update_log = get_sql_rows("SELECT update_by, update_dt
        from fs_file_logs
        where file_id = ?", [$this->args['id']], 1, 1);

        $return = [
            "file" => $file,
            "file_update_log" => $update_log,
            'user_file_permissions' => $UserFilePermissions->returnPermissions(),
            'directory' => $Directory->directoryInfo($file['directory_id'])
        ];

        echo json_encode($return, JSON_NUMERIC_CHECK);
    }


}
