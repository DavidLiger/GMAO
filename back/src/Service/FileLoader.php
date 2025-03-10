<?php

namespace App\Service;

class FileLoader
{
    private string $uploadDirectory;

    public function __construct(string $uploadDirectory)
    {
        $this->uploadDirectory = $uploadDirectory;
    }

    public function getBase64Image(string $filePath): ?string
    {
        $fullPath = $this->uploadDirectory . '/' . $filePath;

        if (!file_exists($fullPath)) {
            return null;
        }

// Obtenez le type MIME
        $mimeType = mime_content_type($fullPath);

// Lisez le contenu du fichier
        $fileContent = file_get_contents($fullPath);

// Encodez en Base64
        return 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
    }
}
