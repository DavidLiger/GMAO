<?php

namespace App\Service;


use App\Dto\ComposantDto;
use App\Entity\Bien;
use App\Entity\Composant;
use App\Entity\Societe;
use App\Repository\EquipementRepository;
use App\Repository\TypeBienRepository;
use Doctrine\ORM\EntityManagerInterface;

class ComposantService
{
    public function __construct(
        private readonly EquipementRepository $equipementRepository,
        private readonly TypeBienRepository   $typeBienRepository,
        private EntityManagerInterface        $entityManager
    )
    {
    }

    public function composantDTOTransformer(ComposantDto $dto, Composant $composant, Societe $societe): Composant
    {
        $composant->setImage($dto->image)
            ->setDescription($dto->description)
            ->setNom($dto->nom)
            ->setSociete($societe)
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]))
            ->setEquipement($this->equipementRepository->findOneBy(['id' => $dto->equipementId]));

        return $composant;
    }

    public function breadcrumb(Composant $composant): array
    {
        $breadcrumb = [];

        $site = $composant->getEquipement()->getSite();
        if ($site) {
            $breadcrumb[] = [
                'id' => $site->getId(),
                'nom' => $site->getNom(),
            ];
        }

        $ouvrage = $composant->getEquipement()->getOuvrage();
        if ($ouvrage) {
            $breadcrumb[] = [
                'id' => $ouvrage->getId(),
                'nom' => $ouvrage->getNom(),
            ];
        }

        $equipement = $composant->getEquipement();
        if ($equipement) {
            $breadcrumb[] = [
                'id' => $equipement->getId(),
                'nom' => $equipement->getNom(),
            ];
        }

        return $breadcrumb;
    }

    public function delete(Bien $bien): void
    {
        foreach ($bien->getCaracteristiques() as $caracteristique) {
            $this->entityManager->remove($caracteristique);
        }
        $this->entityManager->remove($bien);
        $this->entityManager->flush();
    }
}