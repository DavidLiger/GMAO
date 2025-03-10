<?php

namespace App\Controller;

use App\Dto\EquipementChildDto;
use App\Dto\OuvrageChildDto;
use App\Dto\SiteCreateDto;
use App\Entity\Site;
use App\Repository\SiteRepository;
use App\Security\AccessTokenHandler;
use App\Service\SiteService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/site')]
#[OA\Tag(name: 'Site')]
class SiteController extends ApiController
{
    public function __construct(
        private readonly SiteRepository      $siteRepository,
        private readonly SerializerInterface $serializer,
        private readonly SiteService         $siteService,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_site', methods: ['GET'])]
    public function getAll(): Response
    {
        $sites = $this->siteRepository->findBy(['dateArchive' => null, 'societe' => $this->authenticatedUser->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($sites, 'json', ['groups' => 'defaultSite'])));
    }

    #[Route('/caracteristiques/{id}', name: 'app_handle_carac', methods: ['POST'])]
    public function handleCarac(Site $site, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $this->siteService->handleCarac($site, $data);

        return new JsonResponse(['status' => 'Caracteristique updated successfully'], 200);
    }

    #[Route('/{id}', name: 'app_get_one_site', methods: ['GET'])]
    public function getOne(Site $site): Response
    {
        if ($site->getSociete() === $this->authenticatedUser->getSocietePrincipal()) {
            return new JsonResponse(json_decode($this->serializer->serialize($site, 'json', ['groups' => 'defaultSite'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_site', methods: ['POST'])]
    public function create(#[MapRequestPayload] SiteCreateDto $siteDto): Response
    {
        $site = $this->siteService->create($siteDto, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse(json_decode($this->serializer->serialize($site, 'json', ['groups' => 'defaultSite'])));
    }

    #[Route('/child/ouvrage/{id}', name: 'app_create_child_site_ouvrage', methods: ['POST'])]
    public function createOuvrage(Site $site, #[MapRequestPayload] OuvrageChildDto $ouvrageDto): Response
    {
        $ouvrage = $this->siteService->ouvrageDtoTransformer($ouvrageDto, $site, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse(json_decode($this->serializer->serialize($ouvrage, 'json', ['groups' => 'defaultBien'])));
    }

    #[Route('/child/equipement/{id}', name: 'app_create_child_site_equipement', methods: ['POST'])]
    public function createEquipement(Site $site, #[MapRequestPayload] EquipementChildDto $equipementDto): Response
    {
        $ouvrage = $this->siteService->equipementDtoTransformer($equipementDto, $site, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse(json_decode($this->serializer->serialize($ouvrage, 'json', ['groups' => 'defaultBien'])));
    }

    #[Route('/{id}', name: 'app_update_site', methods: ['PUT'])]
    public function update(Site $site, #[MapRequestPayload] SiteCreateDto $siteDto): Response
    {
        if (in_array($site->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $site = $this->siteService->update($siteDto, $site, $this->authenticatedUser->getSocietePrincipal());
            return new JsonResponse(json_decode($this->serializer->serialize($site, 'json', ['groups' => 'defaultSite'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}/ouvrages', name: 'app_ouvrages_site', methods: ['GET'])]
    public function getOuvragesBySite(Site $site): Response
    {
        if ($site->getSociete() == $this->authenticatedUser->getSocietePrincipal()) {
            $ouvrages = $site->getOuvrages();
            return new JsonResponse(json_decode($this->serializer->serialize($ouvrages, 'json', ['groups' => 'minimal'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}/equipements', name: 'app_equipements_site', methods: ['GET'])]
    public function getEquipementsBySite(Site $site): Response
    {
        if ($site->getSociete() == $this->authenticatedUser->getSocietePrincipal()) {
            $equipements = $site->getEquipements();
            return new JsonResponse(json_decode($this->serializer->serialize($equipements, 'json', ['groups' => 'minimal'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }
}
