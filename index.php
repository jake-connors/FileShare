<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/includes/crm_startup.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/includes/crm_html_template.php';

$template = new CRM_HTML_Template([
    'page_title'   => '', // will be set by javascript
    'css'          => [],
    'js_framework' => 'react',
    // 'js'           => ['/app_src/jake1/index.bundle.js']
    'js'           => ["/file_share".'/index.bundle.js']
]);


$template->printHeadTop();
$template->printHeadBottom();
$template->printHeaderTemplate();

?>

<div id="root" style="min-height:400px;">
    <!-- react will fill in the HTML -->
</div>
<div id="portal"></div>

<?php
$template->printFooterTemplate();
$template->printFooterJS();
$template->printBodyHTMLClose();
?>