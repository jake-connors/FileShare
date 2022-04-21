<?php
class FileManipulation
{
    private $_filesDirectory;
    private $_maxFilesPerDirectory = 1000;

    function __construct()
    {
        global $startup;
        $dir = 'file_share/files/';
        $this->_filesDirectory = $startup->getTrunkPath() . $dir;
        $this->_createFirstDirectory();
    }

    public function writeFile($tmp_file, $target_file)
    {
        // create a new directory if necessary to keep files per dir down
        $filesInTargetDir = $this->_countFilesInHighestDir();
        if ($filesInTargetDir >= $this->_maxFilesPerDirectory) {
            $highestDirNumber = $this->_getHighestDirNumber();
            $highestDirNumber++;
            $this->_createNewDir($highestDirNumber);
        }

        // get the destination set
        $highestDir = $this->_filesDirectory . $this->_getHighestDirName();
        $destination_path = $highestDir . "/" . $target_file;
        $destination_path = $this->_renameFileIfNecessary($destination_path);

        // move the file and return the final path
        if (move_uploaded_file($tmp_file, $destination_path)) {
            return str_replace($this->_filesDirectory, "", $destination_path);
        } else {
            return false;
        }
    }

    public function deleteFile($file_location)
    {
        if (!strlen($file_location)) return false;

        $full_path = $this->_filesDirectory . $file_location;
        if (file_exists($full_path)) {
            unlink($full_path);
            return true;
        }
        return false;
    }

    private function _renameFileIfNecessary($destination_path)
    {
        if (!file_exists($destination_path)) return $destination_path;

        $last_dot = strrpos($destination_path, ".");
        $file_ext = substr($destination_path, $last_dot);
        $file_no_ext = substr($destination_path, 0, $last_dot);
        $new_destination_path = $file_no_ext . " (1)" . $file_ext;
        return $this->_renameFileIfNecessary($new_destination_path);
    }

    private function _createFirstDirectory()
    {
        $count_of_dirs = $this->_countDirectories($this->_filesDirectory);
        if ($count_of_dirs === 0) {
            $this->_createNewDir(1);
        }
    }

    private function _createNewDir($dirNumber)
    {
        $dirName = str_pad($dirNumber, 12, "0", STR_PAD_LEFT);
        $fullDirPath = $this->_filesDirectory . $dirName;

        if (!file_exists($fullDirPath))/* Check folder exists or not */ {
            mkdir($fullDirPath, 0755);/* Create folder by using mkdir function */
            echo "Folder $fullDirPath Created";/* Success Message */
        }
    }

    private function _countDirectories($dir)
    {
        return count(glob($dir . "*", GLOB_ONLYDIR));
    }

    private function _countFiles($dir)
    {
        return count(glob($dir . "*"));
    }

    private function _getHighestDirName()
    {
        $arr = glob($this->_filesDirectory . "*", GLOB_ONLYDIR);
        $last = end($arr);
        $dirName = str_replace($this->_filesDirectory, "", $last);
        return $dirName;
    }

    private function _getHighestDirNumber()
    {
        return intval($this->_getHighestDirName());
    }

    private function _countFilesInHighestDir()
    {
        $dirPath = $this->_filesDirectory . $this->_getHighestDirName() . '/';
        return $this->_countFiles($dirPath);
    }
}
