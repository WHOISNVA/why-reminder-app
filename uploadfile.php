<?php     
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: PUT, GET, POST");
   header("Access-Control-Allow-Headers: *");
   
    $uploadFolderPath = "/uploads";

    if($_FILES['file'])
    {
        $rootPath = $_SERVER['DOCUMENT_ROOT'];
        $uploadedfilename = uniqid() . $_FILES['file']['name'];
        $uploadedfilepath = $rootPath . $uploadFolderPath . '/' . $uploadedfilename;

        if(move_uploaded_file($_FILES['file']['tmp_name'] , $uploadedfilepath)) {
            $response = array(
                "uploadedname" => $uploadedfilename,
            );
            echo json_encode($response);
        }
    }else{
        $response = array(
            "status" => "error",
            "error" => true,
            "message" => "No file was sent!"
        );
        echo json_encode($response);
    }
?>