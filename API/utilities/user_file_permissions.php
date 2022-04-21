<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/functions.php";

class UserFilePermissions
{
    private $can_view = false;
    private $can_edit = false;
    private $can_delete = false;

    function __construct($file_id)
    {
        global $use_user;

        $params = [
            'file_id' => $file_id,
            'use_user' => $use_user,
            'whse' => get_branch($use_user)
        ];

        $p = get_sql_row("SELECT 
            if(f.create_by = ?:use_user or 
                fd.directory_files_are_visible_to_all or 
                fdu.can_view_any_file or 
                fdb.can_view_any_file, 1, 0) as can_view,
            if((fd.directory_files_are_editable_by_creator and f.create_by = ?:use_user) or 
                fd.directory_files_are_editable_by_all or 
                fdu.can_edit_any_file or 
                fdb.can_edit_any_file, 1, 0) as can_edit,
            if((fd.directory_files_are_deletable_by_creator and f.create_by = ?:use_user) or 
                fdu.can_delete_any_file or fdb.can_delete_any_file, 1, 0) as can_delete
        from fs_files f
            inner join fs_directories fd on f.directory_id = fd.directory_id
            left join fs_directory_users fdu on f.directory_id = fdu.directory_id and fdu.ad_login = ?:use_user
            left join fs_directory_branches fdb on f.directory_id = fdb.directory_id and fdb.whse = ?:whse
        where f.file_id = ?:file_id", $params, 1, 1);

        $this->can_view = (isset($p['can_view']) && $p['can_view'] === 1);
        $this->can_edit = (isset($p['can_edit']) && $p['can_edit'] === 1);
        $this->can_delete = (isset($p['can_delete']) && $p['can_delete'] === 1);
    }

    public function canView()
    {
        return $this->can_view;
    }

    public function canDelete()
    {
        return $this->can_delete;
    }

    public function canEdit()
    {
        return $this->can_edit;
    }

    public function returnPermissions()
    {
        return ['can_view' => $this->can_view, 'can_edit' => $this->can_edit, 'can_delete' => $this->can_delete];
    }
}
