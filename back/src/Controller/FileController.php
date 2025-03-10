<?php

namespace App\Controller;

use App\Security\AccessTokenHandler;
use App\Service\FileUploader;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/file')]
#[OA\Tag(name: 'File')]
class FileController extends ApiController
{
    public function __construct(
        private readonly FileUploader $fileUploader,
        protected AccessTokenHandler         $accessTokenHandler,
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('/upload', name: 'app_post_file_upload', methods: ['POST'])]
    public function uploadFiles(Request $request): Response
    {
        $files = $request->files->get('file'); // Le fichier doit être envoyé sous la clé "file[]"
        
        if (!$files || !is_array($files)) {
            return new JsonResponse(['error' => 'Aucun fichier fourni.'], 400);
        }
    
        $allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
        $uploadedFiles = [];
    
        foreach ($files as $file) {
            // Vérifier le type du fichier
            if (!in_array($file->getClientOriginalExtension(), $allowedExtensions)) {
                return new JsonResponse(['error' => 'Format de fichier non supporté.'], 400);
            }
    
            // Générer un nom de fichier unique
            $uniqueFileName = uniqid() . '.' . $file->getClientOriginalExtension();
    
            // Traiter le fichier (enregistrer sur le serveur)
            $this->fileUploader->fileImport($file, $this->authenticatedUser ->getSocietePrincipal(), $uniqueFileName);
            
            // Ajouter le nom de fichier enregistré à la réponse
            $uploadedFiles[] = $uniqueFileName; // Utiliser le nom de fichier unique
        }
    
        return new JsonResponse(['success' => true, 'uploaded_files' => $uploadedFiles]);
    }

}