<?php

namespace App\Service;

use App\Dto\CaracteristiqueTypeBienDto;
use App\Entity\CaracteristiqueTypeBien;
use App\Entity\TypeBien;
use App\Repository\CaracteristiqueRepository;
use App\Repository\CaracteristiqueTypeBienRepository;
use App\Repository\TypeBienRepository;

readonly class CaracteristiqueTypeBienService
{
    public function __construct(
        private CaracteristiqueRepository $caracteristiqueRepository,
        private CaracteristiqueTypeBienRepository $caracteristiqueTypeBienRepository,
        private TypeBienRepository $typeBienRepository
    ) {
    }

    public function caracteristiqueTypeBienDTOTransformer(CaracteristiqueTypeBienDto $dto, CaracteristiqueTypeBien $caracteristiqueTypeBien): CaracteristiqueTypeBien
    {
        $caracteristiqueTypeBien->setCaracteristique($this->caracteristiqueRepository->findOneBy(['id' => $dto->caracteristiqueId]))
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]))
            ->setPriorite($dto->priorite);
        
        return $caracteristiqueTypeBien;
    }

    public function deleteAllByTypeBienId(TypeBien $typeBien): void
    {
        $caracteristiquesToDelete = $typeBien->getCaracteristiqueTypeBiens();
        // dd($typeBien);
        foreach ($caracteristiquesToDelete as $caracteristiqueTypeBien) {
            $this->caracteristiqueTypeBienRepository->delete($caracteristiqueTypeBien);
        }
    }
}