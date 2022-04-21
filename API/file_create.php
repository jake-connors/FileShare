<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/file_manipulation.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/user_directory_permissions.php";

class File_Share_File_Create extends API_Endpoint
{
    function postFunc()
    {
        global $use_user;

        // print_r($_REQUEST);
        // print_r($_FILES);

        // print_r($this->args);
        // exit;

        // echo $_FILES['upload'];

        // print_r($_FILES);
        // echo phpinfo();

        if(intval($_SERVER['CONTENT_LENGTH'])>0 && count($_POST)===0){
            throw new Exception('Exceeded Maximum File Size.');
        }
        // print_r($_GET['processed']);
        // if (empty($_FILES)) {
        //     throw new Exception('Exceeded Maximum File Size');
        // }


        $UserDirectoryPermissions = new UserDirectoryPermissions($this->args['directory_id']);
        if (!$UserDirectoryPermissions->can_create_files_in_directory) {
            echo json_encode(["error" => "You do not have access to create files in this directory."]);
            return;
        }

        $FileManip = new FileManipulation();

        $targetFileName = $_FILES["upload"]["name"];
        $tmpFilePath = $_FILES['upload']['tmp_name'];
        $fileType = $_FILES["upload"]["type"];
        $fileSize = $_FILES["upload"]["size"];        
        
        if ($tmpFilePath != "") {
            $file_location = $FileManip->writeFile($tmpFilePath, $targetFileName);

            $params = [
                'directory_id' => $this->args['directory_id'],
                'file_desc' => $this->args['file_description'],
                'create_by' => $use_user,
                'create_dt' => date('Y-m-d H:i:s'),
                'fpath' => $file_location,
                'ftype' => $fileType,
                'fsize' => $fileSize
            ];

            dbi_execute(
                "INSERT into fs_files (directory_id, file_description, file_path, file_type, file_size, create_by, create_dt)
                values (?:directory_id, ?:file_desc, ?:fpath, ?:ftype, ?:fsize, ?:create_by, ?:create_dt)",
                $params,
                1,
                1,
                'execute'
            );

            $id = get_sql_value('select last_insert_id() as id', 'id');
            $return = ["id" => $id];
            
            echo json_encode($return, JSON_NUMERIC_CHECK);
        } else {
            echo "no file path";
        }
    }
}
