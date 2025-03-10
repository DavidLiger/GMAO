<?php

namespace App\Service;


use App\Dto\EquipementChildDto;
use App\Dto\OuvrageDto;
use App\Entity\Bien;
use App\Entity\Equipement;
use App\Entity\Ouvrage;
use App\Entity\Societe;
use App\Repository\EquipementRepository;
use App\Repository\SiteRepository;
use App\Repository\TypeBienRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class OuvrageService
{
    public function __construct(
        private SiteRepository         $siteRepository,
        private TypeBienRepository     $typeBienRepository,
        private EntityManagerInterface $entityManager,
        private EquipementRepository   $equipementRepository,
        private FileUploader           $fileUploader
    )
    {
    }

    public function ouvrageDTOTransformer(OuvrageDto $dto, Ouvrage $ouvrage, Societe $societe): Ouvrage
    {
        $ouvrage->setImage($dto->image)
            ->setDescription($dto->description)
            ->setNom($dto->nom)
            ->setPosition($dto->position)
            ->setSite($this->siteRepository->findOneBy(['id' => $dto->siteId]))
            ->setSociete($societe)
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]));

        return $ouvrage;
    }

    public function breadcrumb(Ouvrage $ouvrage): array
    {
        $breadcrumb = [];

        $site = $ouvrage->getSite();
        $breadcrumb[] = [
            'id' => $site->getId(),
            'nom' => $site->getNom(),
        ];

        return $breadcrumb;
    }

    public function delete(Bien $bien): void
    {
        foreach ($bien->getEquipements() as $equipement) {
            foreach ($equipement->getComposants() as $composant) {
                foreach ($composant->getCaracteristiques() as $caracteristique) {
                    $this->entityManager->remove($caracteristique);
                }
                $this->entityManager->remove($composant);
            }
            foreach ($equipement->getCaracteristiques() as $caracteristique) {
                $this->entityManager->remove($caracteristique);
            }
            $this->entityManager->remove($equipement);
        }
        foreach ($bien->getCaracteristiques() as $caracteristique) {
            $this->entityManager->remove($caracteristique);
        }
        $this->entityManager->remove($bien);

        $this->entityManager->flush();
    }

    public function equipementDtoTransformer(EquipementChildDto $equipementDto, Ouvrage $ouvrage, ?Societe $societe): Equipement
    {
        $equipement = new Equipement();
        $equipement->setsociete($societe);
        $equipement->setOuvrage($ouvrage);
        $equipement->setSite($ouvrage->getSite());
        $equipement->setNom($equipementDto->nom);
        $equipement->setDescription($equipementDto->description);
        $equipement->setRelevable($equipementDto->relevable);
        $equipement->setTypeBien($this->typeBienRepository->findOneBy(['id' => $equipementDto->typeBienId]));
        $equipement = $this->equipementRepository->create($equipement);
        $ancienChemin = $equipement->getImage();
        if ($equipementDto->image !== null) {
            if ($ancienChemin) {
                // Supprimez l'ancien fichier
                $this->fileUploader->deleteFile($ancienChemin);
            }
            $chemin = $this->fileUploader->uploadBienImageBase64($equipementDto->image, $societe->getId(), $equipement->getId(), $equipementDto->nom);
            $equipement->setImage($chemin);
            $this->equipementRepository->update();
        }
        return $equipement;
    }
}