<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/file_manipulation.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/user_file_permissions.php";

class File_Share_File_Delete extends API_Endpoint
{

    function postFunc()
    {

        $mode = $this->args['mode'];

        if ($mode === "deleteFile") {
            $UserFilePermissions = new UserFilePermissions($this->args['id']);
            if (!$UserFilePermissions->canDelete()) {
                echo json_encode(["error" => "You do not have access to delete this file."]);
                return;
            }
    
            $FileManip = new FileManipulation();
    
            // first, delete the existing file for this id
            $file_path = get_sql_value("SELECT file_path 
            from fs_files 
            where file_id = ?", "file_path", [$this->args['id']]);
            $FileManip->deleteFile($file_path);
    
    
            // delete file row
            dbi_execute("DELETE from fs_files where file_id = ?", [$this->args['id']], 1, 1, 'execute');
    
            // delete the logs
            dbi_execute("DELETE from fs_file_logs where file_id = ?", [$this->args['id']], 1, 1, 'execute');
        }
        
    }
}
