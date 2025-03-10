<?php

namespace App\Service;

use App\Dto\TypeActionDto;
use App\Entity\TypeAction;
use App\Entity\Societe;
use App\Repository\TypeActionRepository;
use Doctrine\ORM\EntityManagerInterface;

class TypeActionService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TypeActionRepository $typeActionRepository
    ) {
    }

    public function createTypeAction(TypeActionDto $dto, Societe $societe): TypeAction
    {
        $typeAction = new TypeAction();
        $typeAction->setNom($dto->nom);
        $typeAction->setSociete($societe);
        $typeAction->setColor($dto->color);

        // Si un type parent est spécifié, vous pouvez le récupérer ici
        if (isset($dto->idTypeActionParent)) {
            $parentTypeAction = $this->typeActionRepository->find($dto->idTypeActionParent);
            if ($parentTypeAction) {
                $typeAction->setTypeActionParent($parentTypeAction);
            }
        }

        // Utilisez le repository pour créer le type d'action
        $this->typeActionRepository->create($typeAction);

        return $typeAction;
    }

    public function updateTypeAction(TypeActionDto $dto, TypeAction $typeAction, Societe $societe): TypeAction
    {
        $typeAction->setNom($dto->nom);
        $typeAction->setSociete($societe);
        $typeAction->setColor($dto->color);

        // Si un type parent est spécifié, vous pouvez le récupérer ici
        if (isset($dto->idTypeActionParent)) {
            $parentTypeAction = $this->typeActionRepository->find($dto->idTypeActionParent);
            if ($parentTypeAction) {
                $typeAction->setTypeActionParent($parentTypeAction);
            } else {
                // Si le parent n'existe pas, vous pouvez gérer l'erreur ici
                throw new \InvalidArgumentException("Le type d'action parent spécifié n'existe pas.");
            }
        } else {
            // Si aucun parent n'est spécifié, on peut le retirer
            $typeAction->setTypeActionParent(null);
        }

        // Mettre à jour l'entité TypeAction
        $this->entityManager->flush();

        return $typeAction;
    }
}