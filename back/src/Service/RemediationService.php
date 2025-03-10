<?php

namespace App\Service;

use App\Dto\RemediationDto; // Assurez-vous d'importer le bon DTO
use App\Entity\Remediation;
use App\Entity\Societe;
use App\Repository\RemediationRepository;
use Doctrine\ORM\EntityManagerInterface;

class RemediationService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RemediationRepository $remediationRepository
    ) {
    }

    public function createRemediation(RemediationDto $dto, Societe $societe): Remediation
    {
        $remediation = new Remediation();
        $remediation->setNom($dto->nom);
        $remediation->setSociete($societe);
        
        // Utilisez le repository pour créer la remédiation
        $this->remediationRepository->create($remediation);

        return $remediation;
    }

    public function updateRemediation(RemediationDto $dto, Remediation $remediation, Societe $societe): Remediation
    {
        $remediation->setNom($dto->nom);
        $remediation->setSociete($societe);
        
        // Mettre à jour l'entité remédiation
        $this->entityManager->flush();

        return $remediation;
    }
}