<?php

namespace App\Service;


use App\Dto\EquipementChildDto;
use App\Dto\OuvrageChildDto;
use App\Dto\SiteCreateDto;
use App\Entity\Bien;
use App\Entity\BienCaracteristique;
use App\Entity\Equipement;
use App\Entity\Ouvrage;
use App\Entity\Site;
use App\Entity\Societe;
use App\Repository\BienCaracteristiqueRepository;
use App\Repository\CaracteristiqueRepository;
use App\Repository\EquipementRepository;
use App\Repository\OuvrageRepository;
use App\Repository\SiteRepository;
use App\Repository\TypeBienRepository;
use App\Repository\VilleRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class SiteService
{
    public function __construct(
        private villeRepository               $villeRepository,
        private TypeBienRepository            $typeBienRepository,
        private SiteRepository                $siteRepository,
        private BienCaracteristiqueRepository $bienCaracteristiqueRepository,
        private FileUploader                  $fileUploader,
        private caracteristiqueRepository     $caracteristiqueRepository,
        private EntityManagerInterface        $entityManager,
        private OuvrageRepository             $ouvrageRepository,
        private EquipementRepository          $equipementRepository
    )
    {
    }

    public function create(SiteCreateDto $dto, Societe $societe): Site
    {
        $site = new Site();
        $site->setDescription($dto->description)
            ->setNom($dto->nom)
            ->setLatitude($dto->latitude)
            ->setLongitude($dto->longitude)
            ->setSociete($societe)
            ->setVille($this->villeRepository->findOneBy(['nom' => $dto->nomVille, 'codePostal' => $dto->codePostal]))
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]));

        $site = $this->siteRepository->create($site);

        if ($dto->nomImage !== "") {
            $ancienChemin = $site->getImage();
            if ($ancienChemin) {
                // Supprimez l'ancien fichier
                $this->fileUploader->deleteFile($ancienChemin);
            }
            $chemin = $this->fileUploader->uploadBienImageBase64($dto->image, $societe->getId(), $site->getId(), $dto->nomImage);

            $site->setImage($chemin);
        }
        foreach ($dto->caracteristiques as $caracteristique) {
            $bienCaracteristique = new BienCaracteristique();
            $bienCaracteristique->setCaracteristique($this->caracteristiqueRepository->findOneBy(['id' => $caracteristique["id"]]))
                ->setBien($site)
                ->setPriorite($caracteristique["order"])
                ->setValeur($caracteristique["value"]);

            $this->bienCaracteristiqueRepository->create($bienCaracteristique);

        }

        return $site;
    }

    public function update(SiteCreateDto $dto, Site $site, Societe $societe): Site
    {

        $site->setDescription($dto->description)
            ->setNom($dto->nom)
            ->setLatitude($dto->latitude)
            ->setLongitude($dto->longitude)
            ->setSociete($societe)
            ->setVille($this->villeRepository->findOneBy(['nom' => $dto->nomVille, 'codePostal' => $dto->codePostal]))
            ->setTypeBien($this->typeBienRepository->findOneBy(['id' => $dto->typeBienId]));

        $this->siteRepository->update();

        return $site;
    }

    public function delete(Bien $bien): void
    {
        $ouvrages = $bien->getOuvrages();

        if ($ouvrages->isEmpty()) {
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
        } else {
            foreach ($ouvrages as $ouvrage) {
                foreach ($ouvrage->getEquipements() as $equipement) {
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
                foreach ($ouvrage->getCaracteristiques() as $caracteristique) {
                    $this->entityManager->remove($caracteristique);
                }
                $this->entityManager->remove($ouvrage);
            }
        }

        foreach ($bien->getCaracteristiques() as $caracteristique) {
            $this->entityManager->remove($caracteristique);
        }
        $this->entityManager->remove($bien);

        $this->entityManager->flush();
    }

    public function handleCarac(Site $site, mixed $data)
    {
        foreach ($data as $carac) {
            $completeCarac = $this->caracteristiqueRepository->findOneBy(['id' => $carac['id']]);
            $bienCarac = $this->bienCaracteristiqueRepository->findOneBy(['bien' => $site, 'caracteristique' => $completeCarac]);
            if ($bienCarac !== null) {
                $bienCarac->setPriorite($carac['priorite']);
                $bienCarac->setValeur($carac['value']);
                $this->bienCaracteristiqueRepository->persist($bienCarac);
            } else {
                $newBienCarac = new BienCaracteristique();
                $newBienCarac->setBien($site);
                $newBienCarac->setCaracteristique($completeCarac);
                $newBienCarac->setValeur($carac['value']);
                $newBienCarac->setPriorite(1);
                $this->bienCaracteristiqueRepository->persist($newBienCarac);
            }
        }

        $this->entityManager->flush();
    }

    public function ouvrageDtoTransformer(OuvrageChildDto $ouvrageDto, Site $site, ?Societe $societe)
    {
        $ouvrage = new Ouvrage();
        $ouvrage->setsociete($societe);
        $ouvrage->setSite($site);
        $ouvrage->setNom($ouvrageDto->nom);
        $ouvrage->setTypeBien($this->typeBienRepository->findOneBy(['id' => $ouvrageDto->typeBienId]));
        $ouvrage->setDescription($ouvrageDto->description);
        $ouvrage->setPosition($ouvrageDto->position);
        $ouvrage = $this->ouvrageRepository->create($ouvrage);
        if ($ouvrageDto->image !== null) {
            $ancienChemin = $ouvrage->getImage();
            if ($ancienChemin) {
                // Supprimez l'ancien fichier
                $this->fileUploader->deleteFile($ancienChemin);
            }
            $chemin = $this->fileUploader->uploadBienImageBase64($ouvrageDto->image, $societe->getId(), $ouvrage->getId(), $ouvrageDto->nom);
            $ouvrage->setImage($chemin);
            $this->ouvrageRepository->update();
        }
        return $ouvrage;
    }

    public function equipementDtoTransformer(EquipementChildDto $equipementDto, Site $site, ?Societe $societe)
    {
        $equipement = new Equipement();
        $equipement->setsociete($societe);
        $equipement->setSite($site);
        $equipement->setNom($equipementDto->nom);
        $equipement->setDescription($equipementDto->description);
        $equipement->setRelevable($equipementDto->relevable);
        $equipement->setTypeBien($this->typeBienRepository->findOneBy(['id' => $equipementDto->typeBienId]));
        $equipement = $this->equipementRepository->create($equipement);
        if ($equipementDto->image !== null) {
            $ancienChemin = $equipement->getImage();
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