<?php

namespace App\Service;


use App\Dto\TypeReleveDto;
use App\Entity\TypeReleve;
use App\Repository\SocieteRepository;

class TypeReleveService
{
    public function __construct(
        private readonly SocieteRepository $societeRepository
        )
    {
    }

    public function typeReleveDTOTransformer(TypeReleveDto $dto, TypeReleve $typeReleve, int $idSociete): TypeReleve
    {
        $typeReleve->setNom($dto->nom);
        $typeReleve->setSociete($this->societeRepository->find($idSociete)); // Assurez-vous que cela renvoie une instance de Societe

        return $typeReleve;
    }
}