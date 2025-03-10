<?php

namespace App\Service;


use App\Dto\ReleveDto;
use App\Entity\Releve;
use App\Repository\EquipementRepository;
use App\Repository\TypeReleveRepository;
use DateTime;

class ReleveService
{
    public function __construct(
        private readonly EquipementRepository $equipementRepository,
        private readonly TypeReleveRepository $typeReleveRepository
    )
    {
    }

    public function releveDTOTransformer(ReleveDto $dto, Releve $releve): Releve
    {
        $releve->setValeur($dto->valeur)
            ->setDate(new DateTime())
            ->setEquipement($this->equipementRepository->findOneBy(['id' => $dto->equipementId]))
            ->setTypeReleve($this->typeReleveRepository->findOneBy(['id' => $dto->typeReleve]));

        return $releve;
    }
}