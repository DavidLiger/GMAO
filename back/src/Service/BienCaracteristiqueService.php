<?php

namespace App\Service;


use App\Dto\BienCaracteristiqueDto;
use App\Entity\BienCaracteristique;
use App\Repository\BienRepository;
use App\Repository\CaracteristiqueRepository;

readonly class BienCaracteristiqueService
{
    public function __construct(
        private BienRepository            $bienRepository,
        private CaracteristiqueRepository $caracteristiqueRepository)
    {
    }

    public function bienCaracteristiqueDTOTransformer(BienCaracteristiqueDto $dto, BienCaracteristique $bienCaracteristique): BienCaracteristique
    {
        $bienCaracteristique->setValeur($dto->value)
            ->setBien($this->bienRepository->findOneBy(['id' => $dto->bienId]))
            ->setCaracteristique($this->caracteristiqueRepository->findOneBy(['id' => $dto->caracteristiqueId]))
            ->setPriorite($dto->priorite);
        return $bienCaracteristique;
    }
}