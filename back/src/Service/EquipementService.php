<?php

namespace App\Service;


use App\Dto\ComposantChildDto;
use App\Dto\EquipementDto;
use App\Entity\Bien;
use App\Entity\Composant;
use App\Entity\Equipement;
use App\Entity\Societe;
use App\Repository\ComposantRepository;
use App\Repository\OuvrageRepository;
use App\Repository\SiteRepository;
use App\Repository\TypeBienRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class EquipementService
{
    public function __construct(
        private OuvrageRepository      $ouvrageRepository,
        private SiteRepository         $siteRepository,
        private TypeBienRepository     $typeBienRepository,
        private EntityManagerInterface $entityManager,
        private ComposantRepository    $composantRepository,
        private FileUploader           $fileUploader
    )
    {
    }

    public function equipementDTOTransformer(EquipementDto $dto, Equipement $equipement, Societe $societe): Equipement
    {
        $equipement->setImage($dto->image)
            ->setDescription($dto->description)
            ->setNom($dto->nom)
            ->setRelevable($dto->relevable)
            ->setSite($this->siteRepository->findOneBy(['id' => $dto->siteId]))
            ->setOuvrage($this->ouvrageRepository->findOneBy(['id' => $dto->ouvrageId]))
            ->setSociete($societe)
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]));

        return $equipement;
    }

    public function breadcrumb(Equipement $equipement): array
    {
        $breadcrumb = [];

        $site = $equipement->getSite();
        $breadcrumb[] = [
            'id' => $site->getId(),
            'nom' => $site->getNom(),
        ];

        $ouvrage = $equipement->getOuvrage();
        if ($ouvrage) {
            $breadcrumb[] = [
                'id' => $ouvrage->getId(),
                'nom' => $ouvrage->getNom(),
            ];
        }

        return $breadcrumb;
    }

    public function delete(Bien $bien): void
    {
        foreach ($bien->getComposants() as $composant) {
            foreach ($composant->getCaracteristiques() as $caracteristique) {
                $this->entityManager->remove($caracteristique);
            }
            $this->entityManager->remove($composant);
        }
        foreach ($bien->getCaracteristiques() as $caracteristique) {
            $this->entityManager->remove($caracteristique);
        }
        $this->entityManager->remove($bien);
        $this->entityManager->flush();
    }

    public function composantDtoTransformer(ComposantChildDto $composantDto, Equipement $equipement, ?Societe $societe): Composant
    {
        $composant = new Composant();
        $composant->setDescription($composantDto->description);
        $composant->setNom($composantDto->nom);
        $composant->setEquipement($equipement);
        $composant->setsociete($societe);
        $composant->setTypeBien($this->typeBienRepository->findOneBy(['id' => $composantDto->typeBienId]));
        $composant = $this->composantRepository->create($composant);
        $ancienChemin = $composant->getImage();
        if ($composantDto->image !== null) {
            if ($ancienChemin) {
                // Supprimez l'ancien fichier
                $this->fileUploader->deleteFile($ancienChemin);
            }
            $chemin = $this->fileUploader->uploadBienImageBase64($composantDto->image, $societe->getId(), $composant->getId(), $composantDto->nom);
            $composant->setImage($chemin);
            $this->composantRepository->update();
        }
        return $composant;
    }
}