<?php

namespace App\Service;


use App\Dto\UniteDto;
use App\Entity\Unite;

class UniteService
{
    public function __construct()
    {
    }

    public function uniteDTOTransformer(UniteDto $dto, Unite $unite): Unite
    {
        $unite->setNom($dto->nom)
            ->setDescription($dto->description)
            ->setLibelle($dto->libelle);

        return $unite;
    }
}