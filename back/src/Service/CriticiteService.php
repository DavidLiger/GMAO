<?php

namespace App\Service;

use App\Dto\CriticiteDto;
use App\Entity\Criticite;
use App\Entity\Societe;
use App\Repository\CriticiteRepository;
use Doctrine\ORM\EntityManagerInterface;

class CriticiteService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CriticiteRepository $criticiteRepository
    ) {
    }

    public function createCriticite(CriticiteDto $dto, Societe $societe): Criticite
    {
        $criticite = new Criticite();
        $criticite->setNom($dto->nom);
        $criticite->setSociete($societe);
        
        // Utilisez le repository pour créer la criticité
        $this->criticiteRepository->create($criticite);

        return $criticite;
    }

    public function updateCriticite(CriticiteDto $dto, Criticite $criticite, Societe $societe): Criticite
    {
        $criticite->setNom($dto->nom);
        $criticite->setSociete($societe);
        
        // Mettre à jour l'entité criticité
        $this->entityManager->flush();

        return $criticite;
    }
}