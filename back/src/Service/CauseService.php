<?php

namespace App\Service;

use App\Dto\CauseDto;
use App\Entity\Cause;
use App\Entity\Societe;
use App\Repository\CauseRepository;
use Doctrine\ORM\EntityManagerInterface;

class CauseService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CauseRepository $causeRepository
    ) {
    }

    public function createCause(CauseDto $dto, Societe $societe): Cause
    {
        $cause = new Cause();
        $cause->setNom($dto->nom);
        $cause->setSociete($societe);
        
        // Utilisez le repository pour créer la cause
        $this->causeRepository->create($cause);

        return $cause;
    }

    public function updateCause(CauseDto $dto, Cause $cause, Societe $societe): Cause
    {
        $cause->setNom($dto->nom);
        $cause->setSociete($societe);
        
        // Update the cause entity
        $this->entityManager->flush();

        return $cause;
    }
}