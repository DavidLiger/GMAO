<?php

namespace App\Service;

use App\Entity\Document;
use App\Entity\Societe;
use InvalidArgumentException;
use RuntimeException;
use App\Repository\DocumentRepository;

class FileUploader
{
    private string $uploadDirectory;
    private DocumentRepository $documentRepository;

    public function __construct(string $uploadDirectory, DocumentRepository $documentRepository)
    {
        $this->uploadDirectory = $uploadDirectory;
        $this->documentRepository = $documentRepository;
    }

    public function uploadBienImageBase64(string $base64, int $idSociete, int $bienId, string $originalFileName): string
    {
// Construire le chemin du répertoire basé sur les IDs
        $directoryPath = sprintf('%s/%d/%d', $this->uploadDirectory, $idSociete, $bienId);

// S'assurer que le répertoire existe, sinon le créer
        if (!is_dir($directoryPath)) {
            if (!mkdir($directoryPath, 0755, true) && !is_dir($directoryPath)) {
                throw new RuntimeException(sprintf('Impossible de créer le répertoire : %s', $directoryPath));
            }
        }

// Décoder le fichier Base64
        $data = explode(',', $base64);
        if (count($data) !== 2 || !str_starts_with($data[0], 'data:')) {
            throw new InvalidArgumentException('Format de fichier Base64 invalide.');
        }
        $decodedFile = base64_decode($data[1], true);

        if ($decodedFile === false) {
            throw new RuntimeException('Impossible de décoder les données Base64.');
        }

// Générer un nom unique pour le fichier en conservant l'extension d'origine
        $extension = pathinfo($originalFileName, PATHINFO_EXTENSION) ?: 'bin';
        $fileName = uniqid() . '.' . $extension;

// Chemin complet du fichier
        $filePath = $directoryPath . '/' . $fileName;

// Sauvegarder le fichier
        if (file_put_contents($filePath, $decodedFile) === false) {
            throw new RuntimeException(sprintf('Impossible d\'écrire dans le fichier : %s', $filePath));
        }

// Retourner le chemin relatif pour le stockage dans la base de données
        return sprintf('%d/%d/%s', $idSociete, $bienId, $fileName);
    }

    public function deleteFile(string $filePath): void
    {
        $absolutePath = $this->uploadDirectory . '/' . $filePath;

        if (file_exists($absolutePath)) {
            unlink($absolutePath);
        }
    }

    public function fileImport($file, Societe $societe, string $uniqueFileName): void
    {
        // Définir le chemin de destination pour les fichiers importés
        $destinationPath = $this->uploadDirectory; // Remplacez par votre chemin

        // Déplacer le fichier vers le répertoire de destination avec le nom unique
        $file->move($destinationPath, $uniqueFileName);

        // Logique pour enregistrer le document dans la base de données
        $document = new Document();
        $document->setNom($uniqueFileName); // Vous pouvez également stocker le nom d'origine si nécessaire
        $document->setChemin($destinationPath . '/' . $uniqueFileName);
        $document->setSociete($societe);

        // Enregistrer le document dans la base de données
        $this->documentRepository->create($document);
    }
}
