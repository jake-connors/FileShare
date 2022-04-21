<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/file_manipulation.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/user_file_permissions.php";

class File_Share_File_Update extends API_Endpoint
{
    function postFunc()
    {

        if(intval($_SERVER['CONTENT_LENGTH'])>0 && count($_POST)===0){
            throw new Exception('Exceeded Maximum File Size.');
        }

        // if (empty($_FILES)) {
        //     throw new Exception('Exceeded Maximum File Size');
        // }


        global $use_user;        

        if (!isset($this->args['id'])) {
            echo json_encode(['error' => "no id"]);
            return;
        }

        $existing_file_path = get_sql_value("SELECT file_path from fs_files where file_id = ?", 'file_path', [$this->args['id']], 1, 1);

        // check that this file exists in system
        if ($existing_file_path === '') {
            echo json_encode(['error' => "could not find file"]);
            return;
        }

        $UserFilePermissions = new UserFilePermissions($this->args['id']);
        if (!$UserFilePermissions->canEdit()) {
            echo json_encode(["error" => "You do not have access to update this file."]);
            return;
        }

        // // print_r($_REQUEST);
        // print_r($_FILES);
        // echo count($_FILES);
        // exit;
        //
        if ($this->args['file_description'] == "") {
            $file_description = get_sql_value("SELECT file_description 
            from fs_files
            where file_id = ?", "file_description", [$this->args['id']]);

            //['file_description']
            // print_r($file_description);
            
            $params = [
                'id' => $this->args['id'],
                'file_description' => $file_description
            ];

        } else {
            $params = [
                'id' => $this->args['id'],
                'file_description' => $this->args['file_description']
            ];
        }

        dbi_execute("UPDATE fs_files
        set file_description = ?:file_description
        where file_id = ?:id", $params, 1, 1, 'execute');

        // add to log
        $params = [
            'id' => $this->args['id'],
            'by' => $use_user,
            'dt' => date('Y-m-d H:i:s')
        ];

        dbi_execute("INSERT into fs_file_logs (file_id, update_by, update_dt)
        values (?:id, ?:by, ?:dt)", $params, 1, 1, 'execute');

        if (count($_FILES)) {
            $this->_replaceFile($existing_file_path);
        }

        $return = ['success' => true];
        echo json_encode($return, JSON_NUMERIC_CHECK);
    }

    private function _replaceFile($existing_file_path)
    {
        $FileManip = new FileManipulation();

        $targetFileName = $_FILES["upload"]["name"];
        $tmpFilePath = $_FILES['upload']['tmp_name'];
        $fileType = $_FILES["upload"]["type"];
        $fileSize = $_FILES["upload"]["size"];

        // Make sure we have a file path
        if ($tmpFilePath != "") {

            // first, delete the existing file in the file system for this id
            $FileManip->deleteFile($existing_file_path);

            // now write the new file
            $file_location = $FileManip->writeFile($tmpFilePath, $targetFileName);

            $params = [
                'id' => $this->args['id'],
                'fpath' => $file_location,
                'ftype' => $fileType,
                'fsize' => $fileSize
            ];

            dbi_execute("UPDATE fs_files 
            set file_path = ?:fpath, file_type = ?:ftype, file_size = ?:fsize
            where file_id = ?:id", $params, 1, 1, 'execute');
        }
    }
}
