<?php

namespace App\Service;


use App\Dto\LocPointMesureTypeBienDto;
use App\Entity\LocPointMesureTypeBien;
use App\Repository\LocPointMesureRepository;
use App\Repository\LocPointMesureTypeBienRepository;
use App\Repository\TypeBienRepository;

readonly class LocPointMesureTypeBienService
{
    public function __construct(
        private LocPointMesureTypeBienRepository $locPointMesureTypeBienRepository,
        private TypeBienRepository               $typeBienRepository,
        private LocPointMesureRepository         $locPointMesureRepository
    )
    {
    }

    public function locPointMesureTypeBienDTOTransformer(LocPointMesureTypeBienDto $dto): LocPointMesureTypeBien
    {
        $typeBien = $this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]);
        $locPointMesure = $this->locPointMesureRepository->findOneBy(['id' => $dto->locPointMesureId]);
        $locPointMesureTypeBien = $this->locPointMesureTypeBienRepository->findOneBy(['typeBien' => $typeBien, 'locPointMesure' => $locPointMesure]);
        if ($locPointMesureTypeBien === null) {
            $locPointMesureTypeBienNew = new LocPointMesureTypeBien();
            $locPointMesureTypeBienNew->setLocPointMesure($locPointMesure);
            $locPointMesureTypeBienNew->setTypeBien($typeBien);
            $locPointMesureTypeBienNew->setValeurDefaut($dto->valeurDefaut);
            $this->locPointMesureTypeBienRepository->create($locPointMesureTypeBienNew);
            return $locPointMesureTypeBienNew;
        } else {
            $locPointMesureTypeBien->setValeurDefaut($dto->valeurDefaut);
            $this->locPointMesureTypeBienRepository->update();
            return $locPointMesureTypeBien;
        }
    }
}