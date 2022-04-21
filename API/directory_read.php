<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/api/file_share/utilities/fs_directory.php";

class File_Share_Directory_Read extends API_Endpoint
{

    function postFunc() {
        if ($this->args['mode'] == 'updateDirectoryPermissions') {
            // print_r($this->args);            

            $params = [
                'directory_id' => $this->args['directory_id'],
                'user' => $this->args['ad_login'],
                'can_create_files' => $this->args['canCreateFiles'],
                'can_view_any_file' => $this->args['canViewAnyFile'],
                'can_edit_any_file' => $this->args['canEditAnyFile'],
                'can_delete_any_file' => $this->args['canDeleteAnyFile'],
                'can_edit_directory' => $this->args['canEditDirectory'],
                'can_delete_directory' => $this->args['canDeleteDirectory']
            ];
            
            // $sql = "INSERT INTO fs_directory_users (can_create_files, can_view_any_file, can_edit_any_file, can_delete_any_file, can_edit_directory, can_delete_directory)
            //         VALUE (?:can_create_files, ?:can_view_any_file, ?:can_edit_any_file, ?:can_delete_any_file, ?:can_edit_directory, ?:can_delete_directory)
            //         WHERE directory_id=?:directory_id AND ad_login=?:user";




            // either insert or update depending. ... .. . .. . .. .. . . 


            // $sqlInsert = "INSERT INTO fs_directory_users VALUES ()";
            $isInTable = false;
            $sql = '';

            $ad_login_from_table = get_sql_value("SELECT ad_login FROM fs_directory_users WHERE directory_id=?:directory_id AND ad_login=?:ad_login", "ad_login", ['directory_id' => $this->args['directory_id'], 'ad_login' => $this->args['ad_login']]);
            
            if ($this->args['ad_login'] == $ad_login_from_table) {
                $isInTable = true;
            }

            if ($isInTable) {
                $sql = "UPDATE fs_directory_users SET
                can_create_files=?:can_create_files,
                can_view_any_file=?:can_view_any_file,
                can_edit_any_file=?:can_edit_any_file,
                can_delete_any_file=?:can_delete_any_file,
                can_edit_directory=?:can_edit_directory,
                can_delete_directory=?:can_delete_directory
                WHERE directory_id=?:directory_id AND ad_login=?:user";    
            } else { 
                $sql = "INSERT INTO fs_directory_users VALUES 
                (?:directory_id, ?:user, ?:can_create_files, ?:can_view_any_file, 
                ?:can_edit_any_file, ?:can_delete_any_file, ?:can_edit_directory, ?:can_delete_directory, NOW())";
            }


            

            // $sqlUpdate = "UPDATE fs_directory_users SET
            // can_create_files=?:can_create_files,
            // can_view_any_file=?:can_view_any_file,
            // can_edit_any_file=?:can_edit_any_file,
            // can_delete_any_file=?:can_delete_any_file,
            // can_edit_directory=?:can_edit_directory,
            // can_delete_directory=?:can_delete_directory
            // WHERE directory_id=?:directory_id AND ad_login=?:user";

            dbi_execute($sql, $params, 1, 1, 'display non-html execute');


            echo json_encode(["success" => 1 ]);
        }
    }
    
    function getFunc()
    {
        if ($this->args['mode'] === 'getDirectoriesList') {
            $Directory = new FileShareDirectory();
            echo json_encode($Directory->viewableDirectoriesForUser());
        }

        if ($this->args['mode'] === "getDirectoryAndFiles") {
            $Directory = new FileShareDirectory();
            echo json_encode(
                [
                    'directory' => $Directory->directoryInfo($this->args['directory_id']),
                    'visible_files' => $Directory->viewableFilesForUser($this->args['directory_id'])
                ]
            );
        }

        if ($this->args['mode'] === "getCurrentUser") {
            global $use_user;

            $ret = get_sql_value(
                "SELECT concat(a.firstname, ' ', a.lastname) AS user
                FROM AD_data a
                WHERE a.ad_login = ?:use_user", "user", ['use_user' => $use_user]
            );

            echo json_encode($ret);
        }

        if ($this->args['mode'] === "get_export") {
            // $Directory = new FileShareDirectory();
            // $ret = $Directory->viewableFilesForUser($this->args['directory_id']);
            // echo json_encode($ret, JSON_FORCE_OBJECT);


            // print_r($data);

            require_once $_SERVER["DOCUMENT_ROOT"] . '/reports/functions.php';
            require_once $_SERVER["DOCUMENT_ROOT"] . '/includes/functions.php';
            require_once $_SERVER["DOCUMENT_ROOT"] . '/includes/classes/fw_methods.php';
            global $use_user;
            $reportFuncs = new ReportFunctions();

            // $actual_link = (isset($_SERVER['HTTPS_REFERER']) && $_SERVER['HTTPS_REFERER'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[HTTP_REFERER]/";
            $actual_link ='http://' . $_SERVER['HTTP_HOST'] . '/file_share/files/';
            $params = [
                'directory_id' => $this->args['directory_id'],
                'use_user' => $use_user,
                'whse' => get_branch($use_user),
                'url' => $actual_link
            ];
            $sql = "SELECT
                        concat(a.firstname, ' ', a.lastname) as Created_By,
                        substring_index(f.file_path, '/', -1) as File_Name,
                        f.file_description as File_Description,
                        concat(?:url, f.file_path) as Link
                from fs_files f
                    inner join fs_directories fd on f.directory_id = fd.directory_id
                    inner join AD_data a on a.ad_login = f.create_by
                    left join fs_directory_users fdu on fd.directory_id = fdu.directory_id and fdu.ad_login = ?:use_user
                    left join fs_directory_branches fdb on fd.directory_id = fdb.directory_id and fdb.whse = ?:whse
                where f.directory_id = ?:directory_id
                and (f.create_by = ?:use_user or fd.directory_files_are_visible_to_all or fdb.can_view_any_file or fdu.can_view_any_file)
                group by f.file_id
                order by f.file_id asc";

            // add in link to file (http link to open in browser)
            // do this either with:
            // 1. the createExcel function
            // 2. add to sql table/select statement (add as a column)
            // 3. create link in select statement concating the link together like this;
            // https://crm-dev-jake.fwwebb.com/file_share/files/000000000001/helloworld%20js%20(1).JPG

            list($file_path, $error) = $reportFuncs->createExcel($sql, $params);
            echo json_encode(['file_path' => $file_path, 'errorMsg' => $error]);

            // $this->_run_and_create_excel($query);


        }

        if ($this->args['mode'] == 'getDirectoriesPermissionsList') {
            print_r($this->args);
        }

        if ($this->args['mode'] == "getUsersPermissionsList") {
            // print_r($this->args);

            $params = [
                'directory_id' => $this->args['directory_id'],
                'use_user' => $this->args['user'],
            ];
    
            $p = get_sql_rows("SELECT 
                if (fd.create_by = ?:use_user or 
                    fdu.can_view_any_file, 'Yes', 'No') as can_view_directory,
                if (fdu.can_edit_directory or fd.create_by = ?:use_user, 'Yes', 'No') as can_edit_directory,
                if (fdu.can_delete_directory or fd.create_by = ?:use_user, 'Yes', 'No') as can_delete_directory,
                if (fd.create_by = ?:use_user or 
                    fdu.can_create_files, 'Yes', 'No') as can_create_files,
                if (fd.create_by = ?:use_user or 
                    fdu.can_view_any_file, 'Yes', 'No') as can_view_any_file,
                if (fd.create_by = ?:use_user or 
                    fdu.can_edit_any_file, 'Yes', 'No') as can_edit_any_file,
                if (fd.create_by = ?:use_user or 
                    fdu.can_delete_any_file, 'Yes', 'No') as can_delete_any_file,
                if (fd.create_by = ?:use_user or 
                    fd.directory_files_can_be_created_until, fd.directory_files_can_be_created_until, '') as directory_files_can_be_created_until
            from fs_directories fd
            left join fs_directory_users fdu on fd.directory_id = fdu.directory_id and fdu.ad_login = ?:use_user
            where fd.directory_id = ?:directory_id;", $params, 1, 1);

            // row or rows ??/
            $dir = get_sql_rows("SELECT directory_title, create_dt, create_by 
            from fs_directories
            where directory_id = ?", [$this->args['directory_id']], 1, 1);

            array_push($p[0], $dir[0]['directory_title']);


            $ret = $p;

            echo json_encode($ret);
        }

        if ($this->args['mode'] == 'getBranchPermissionsList') {
            // print_r($this->args);
            $params = [
                'directory_id' => $this->args['directory_id'],
                'branch' => $this->args['branch']
            ];

            $sql = "
                SELECT 
                if (fdb.can_create_files, 'Yes', 'No') as can_create_files,
                if (fdb.can_view_any_file, 'Yes', 'No') as can_view_any_file,
                if (fdb.can_edit_any_file, 'Yes', 'No') as can_edit_any_file,
                if (fdb.can_delete_any_file, 'Yes', 'No') as can_delete_any_file,
                if (fd.directory_files_can_be_created_until, fd.directory_files_can_be_created_until, '') as directory_files_can_be_created_until
                from fs_directories fd
                left join fs_directory_branches fdb on fd.directory_id = fdb.directory_id and fdb.whse = ?:branch
            ";

            $ret = get_sql_row($sql, $params, 1, 1, 'execute');
            array_push($ret, $this->args['directory_id']);
            unset($ret['0']);
            $ret['directory_id'] = intval($this->args['directory_id']);
            
            echo json_encode($ret);
            
        }
        
    }

}
