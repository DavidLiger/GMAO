<?php

namespace App\Service;


use App\Dto\LocPointMesureSiteDto;
use App\Entity\LocPointMesureSite;
use App\Repository\LocPointMesureRepository;
use App\Repository\LocPointMesureSiteRepository;
use App\Repository\SiteRepository;

readonly class LocPointMesureSiteService
{
    public function __construct(
        private LocPointMesureSiteRepository $locPointMesureSiteRepository,
        private SiteRepository               $siteRepository,
        private LocPointMesureRepository     $locPointMesureRepository
    )
    {
    }

    public function locPointMesureSiteDTOTransformer(LocPointMesureSiteDto $dto): LocPointMesureSite
    {
        $site = $this->siteRepository->findOneBy(['id' => $dto->siteId]);
        $locPointMesure = $this->locPointMesureRepository->findOneBy(['id' => $dto->locPointMesureId]);
        $locPointMesureSite = $this->locPointMesureSiteRepository->findOneBy(['site' => $site, 'locPointMesure' => $locPointMesure]);
        if ($locPointMesureSite === null) {
            $locPointMesureSiteNew = new LocPointMesureSite();
            $locPointMesureSiteNew->setSiteId($site);
            $locPointMesureSiteNew->setLocPointMesureId($locPointMesure);
            $locPointMesureSiteNew->setNumeroPointMesure($dto->numeroPointMesure);
            $locPointMesureSiteNew->setDescription($dto->description);
            $this->locPointMesureSiteRepository->create($locPointMesureSiteNew);
            return $locPointMesureSiteNew;
        } else {
            $locPointMesureSite->setNumeroPointMesure($dto->numeroPointMesure);
            $locPointMesureSite->setDescription($dto->description);
            $this->locPointMesureSiteRepository->update();
            return $locPointMesureSite;
        }

    }
}