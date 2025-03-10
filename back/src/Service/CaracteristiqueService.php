<?php

namespace App\Service;


use App\Dto\CaracteristiqueDto;
use App\Entity\Caracteristique;
use App\Entity\Societe;
use App\Library\Enum\EnumTypeChamp;
use App\Repository\CaracteristiqueRepository;
use App\Repository\UniteRepository;

class CaracteristiqueService
{
    public function __construct(
        private readonly UniteRepository           $uniteRepository,
        private readonly CaracteristiqueRepository $caracteristiqueRepository
    )
    {
    }

    public function caracteristiqueDTOUpdate(CaracteristiqueDto $dto, Caracteristique $caracteristique): Caracteristique
    {
        $caracteristique->setNom($dto->nom);
        $caracteristique->setObligatoire(true);
        $caracteristique->setTypeChamp($dto->typeChamp);
        if ($dto->typeChamp === EnumTypeChamp::SELECT) {
            $caracteristique->setListeValeurs($dto->listeValeurs);
        } else {
            $caracteristique->setListeValeurs(null);
        }
        $caracteristique->setValeurDefaut($dto->valeurDefaut);
        if ($dto->unite !== null) {
            $caracteristique->setUnite($this->uniteRepository->findOneBy(['id' => $dto->unite]));
        } else {
            $caracteristique->setUnite(null);
        }
        $this->caracteristiqueRepository->update();
        return $caracteristique;
    }

    public function caracteristiqueDTOCreate(CaracteristiqueDto $dto, Societe $societe)
    {
        $caracteristiqueRegsiter = new Caracteristique();
        $caracteristiqueRegsiter->setNom($dto->nom);
        $caracteristiqueRegsiter->setSociete($societe);
        $caracteristiqueRegsiter->setObligatoire(true);
        $caracteristiqueRegsiter->setTypeChamp($dto->typeChamp);
        if ($dto->typeChamp === EnumTypeChamp::SELECT) {
            $caracteristiqueRegsiter->setListeValeurs($dto->listeValeurs);
        }
        $caracteristiqueRegsiter->setValeurDefaut($dto->valeurDefaut);
        $caracteristiqueRegsiter->setUnite($this->uniteRepository->findOneBy(['id' => $dto->unite]));
        return $caracteristiqueRegsiter;

    }
}