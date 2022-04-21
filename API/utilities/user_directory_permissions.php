<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/functions.php";

class UserDirectoryPermissions
{
    private $can_view_directory = false;
    private $can_edit_directory = false;
    private $can_delete_directory = false;
    private $can_create_files_in_directory = false;
    private $can_view_any_file_in_directory = false;
    private $can_edit_any_file_in_directory = false;
    // private $can_edit_own_files_in_directory = false;
    private $can_delete_any_file_in_directory = false;
    private $directory_files_can_be_created_until = '';

    function __construct($directory_id)
    {
        global $use_user;

        $params = [
            'directory_id' => $directory_id,
            'use_user' => $use_user,
            'whse' => get_branch($use_user)
        ];

        $p = get_sql_row("SELECT 
            if (fd.directory_is_visible_to_all or 
                fd.create_by = ?:use_user or 
                fdu.can_view_any_file or 
                fdb.can_view_any_file, 1, 0) as can_view_directory,
            if (fdu.can_edit_directory or fd.create_by = ?:use_user, 1, 0) as can_edit_directory,
            if (fdu.can_delete_directory or fd.create_by = ?:use_user, 1, 0) as can_delete_directory,
            if (fd.create_by = ?:use_user or 
                fd.directory_files_can_be_created_by_all or fdu.can_create_files or fdb.can_create_files, 1, 0) as can_create_files,
            if (fd.create_by = ?:use_user or 
                fd.directory_files_are_visible_to_all or fdu.can_view_any_file or fdb.can_view_any_file, 1, 0) as can_view_any_file,
            if (fd.create_by = ?:use_user or 
                fd.directory_files_are_editable_by_all or fdu.can_edit_any_file or fdb.can_edit_any_file, 1, 0) as can_edit_any_file,
            if (fd.create_by = ?:use_user or 
                fdu.can_delete_any_file or fdb.can_delete_any_file, 1, 0) as can_delete_any_file,
            if (fd.create_by = ?:use_user or 
                fd.directory_files_can_be_created_until, fd.directory_files_can_be_created_until, '') as directory_files_can_be_created_until
        from fs_directories fd
        left join fs_directory_users fdu on fd.directory_id = fdu.directory_id and fdu.ad_login = ?:use_user
        left join fs_directory_branches fdb on fd.directory_id = fdb.directory_id and fdb.whse = ?:whse
        where fd.directory_id = ?:directory_id;", $params, 1, 1);

        $this->can_view_directory = ($p['can_view_directory'] === 1);
        $this->can_edit_directory = ($p['can_edit_directory'] === 1);
        $this->can_delete_directory = ($p['can_delete_directory'] === 1);
        $this->can_create_files_in_directory = ($p['can_create_files'] === 1);
        $this->can_view_any_file_in_directory = ($p['can_view_any_file'] === 1);
        $this->can_edit_any_file_in_directory = ($p['can_edit_any_file'] === 1);
        // $this->can_edit_own_files_in_directory = ($p['can_edit_own_files'] === 1);
        $this->can_delete_any_file_in_directory = ($p['can_delete_any_file'] === 1);
        $this->directory_files_can_be_created_until = ($p['directory_files_can_be_created_until']);
    }

    public function __get($name)
    {
        return $this->$name;
    }

    function returnPermissions()
    {
        return [
            'can_view_directory' => $this->can_view_directory,
            'can_edit_directory' => $this->can_edit_directory,
            'can_delete_directory' => $this->can_delete_directory,
            'can_create_files_in_directory' => $this->can_create_files_in_directory,
            'can_view_any_file_in_directory' => $this->can_view_any_file_in_directory,
            'can_edit_any_file_in_directory' => $this->can_edit_any_file_in_directory,
            'can_delete_any_file_in_directory' => $this->can_delete_any_file_in_directory,
            'directory_files_can_be_created_until' => $this->directory_files_can_be_created_until
        ];
    }
}
