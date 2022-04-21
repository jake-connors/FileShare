<?php
require_once "user_directory_permissions.php";

class FileShareDirectory
{
    public function directoryInfo($id)
    {
        $UserDirectoryPermissions = new UserDirectoryPermissions($id);

        $dir = get_sql_row("SELECT directory_title, create_dt, create_by 
        from fs_directories
        where directory_id = ?", [$id], 1, 1);

        $dir['user_permissions'] = $UserDirectoryPermissions->returnPermissions();
        return $dir;
    }

    public function viewableFilesForUser($directory_id)
    {
        global $use_user;

        $params = [
            'directory_id' => $directory_id,
            'use_user' => $use_user,
            'whse' => get_branch($use_user)
        ];

        return get_sql_rows("SELECT f.file_id,
                    f.file_description,
                    substring_index(f.file_path, '/', -1) as file_name,
                    fd.directory_id as from_dir,
                    f.file_path,
                    f.file_type,
                    f.file_size,
                    concat(a.firstname, ' ', a.lastname) as create_by,
                    if(l.file_id is not null, max(l.update_dt), f.create_dt) as last_modified_dt,
                    if(fd.directory_files_are_editable_by_all or (fd.directory_files_are_editable_by_creator and f.create_by = ?:use_user) or fdu.can_edit_any_file or
                    fdb.can_edit_any_file, 1, 0) as user_can_edit,
                    if(fd.directory_files_are_deletable_by_all or (fd.directory_files_are_deletable_by_creator and f.create_by = ?:use_user) or fdu.can_delete_any_file or
                    fdb.can_delete_any_file, 1, 0) as user_can_delete
            from fs_files f
                inner join fs_directories fd on f.directory_id = fd.directory_id
                inner join AD_data a on a.ad_login = f.create_by
                left join fs_file_logs l on l.file_id = f.file_id
                left join fs_directory_users fdu on fd.directory_id = fdu.directory_id and fdu.ad_login = ?:use_user
                left join fs_directory_branches fdb on fd.directory_id = fdb.directory_id and fdb.whse = ?:whse
            where f.directory_id = ?:directory_id
            and (f.create_by = ?:use_user or fd.directory_files_are_visible_to_all or fdb.can_view_any_file or fdu.can_view_any_file)
            group by f.file_id
            order by f.file_id asc", $params, 1, 1);
    }

    public function viewableDirectoriesForUser($parent_directory_id = 0)
    {
        global $use_user;

        $params = [
            'use_user' => $use_user,
            'whse' => get_branch($use_user)
        ];
        $where = '';

        if ($parent_directory_id !== 0) {
            // add parent id later and only show directories under the parent
        }

        $dirs = get_sql_rows("SELECT d.directory_id, d.directory_title, create_dt, create_by
        from fs_directories d
              left join fs_directory_users fdu on fdu.directory_id = d.directory_id and fdu.ad_login = ?:use_user
              left join fs_directory_branches fdb on d.directory_id = fdb.directory_id and fdb.whse = ?:whse
        where (d.directory_is_visible_to_all
           or fdu.can_view_any_file
           or fdb.can_view_any_file
           or d.create_by = ?:use_user) $where", $params, 1, 1);

        return ['directories' => $dirs];
    }
}
