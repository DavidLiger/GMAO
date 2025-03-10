<?php

namespace App\Controller;

use App\Dto\LocPointMesureSiteDto;
use App\Entity\Site;
use App\Repository\LocPointMesureSiteRepository;
use App\Repository\SiteRepository;
use App\Security\AccessTokenHandler;
use App\Service\LocPointMesureSiteService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/locpointmesuresite')]
#[OA\Tag(name: 'LocPointMesureSite')]
class LocPointMesureSiteController extends ApiController
{
    public function __construct(
        protected AccessTokenHandler                  $accessTokenHandler,
        private readonly LocPointMesureSiteRepository $locPointMesureSiteRepository,
        private readonly LocPointMesureSiteService    $locPointMesureSiteService,
        private readonly SerializerInterface          $serializer,
        private readonly SiteRepository               $siteRepository
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_loc_point_mesure_site', methods: ['GET'])]
    public function getAll(): Response
    {
        $locPointMesure = $this->locPointMesureSiteRepository->findAll();
        return new JsonResponse(json_decode($this->serializer->serialize($locPointMesure, 'json', ['groups' => 'defaultPointMesureSite'])));
    }

    #[Route('', name: 'app_create_loc_point_mesure_site', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: LocPointMesureSiteDto::class)] array $locPointMesureSites, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($locPointMesureSites as $index => $locPointMesureSite) {
            if (!$locPointMesureSite instanceof LocPointMesureSiteDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un CaracteristiqueBatchDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($locPointMesureSite);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($locPointMesureSites as $locPointMesureSite) {
            $this->locPointMesureSiteService->locPointMesureSiteDTOTransformer($locPointMesureSite);
        }

        return new JsonResponse(['message' => 'Les caractéristiques ont été créées avec succès.'], 201);
    }

    #[Route('/typebien/{id}', name: 'app_get_loc_point_mesure_by_type_bien', methods: ['GET'])]
    public function getAllPointByTypeBien(Site $site): Response
    {

        $locPointMesures = $site->getTypeBien()->getLocPointMesureTypeBiens();
        $result = [];
        foreach ($locPointMesures as $locPointMesure) {
            $temp = [
                "baseDesc" => $locPointMesure->getLocPointMesure()->getDescription(),
                "numeroPointMesure" => $locPointMesure->getValeurDefaut(),
                "id" => $locPointMesure->getLocPointMesure()->getId(),
                "nom" => $locPointMesure->getLocPointMesure()->getNom()
            ];
            $result[] = $temp;
        }
        return new JsonResponse($result);
    }

    #[Route('/site/{id}', name: 'app_get_loc_point_mesure_by_site', methods: ['GET'])]
    public function getAllPointBySite(int $id): Response
    {
        $site = $this->siteRepository->findOneBy(['id' => $id]);
        $locPointMesureSites = $site->getLocPointMesureSites();
        $result = [];
        foreach ($locPointMesureSites as $locPointMesureSite) {
            $temp = [
                "baseDesc" => $locPointMesureSite->getLocPointMesureId()->getDescription(),
                "description" => $locPointMesureSite->getDescription(),
                "numeroPointMesure" => $locPointMesureSite->getNumeroPointMesure(),
                "id" => $locPointMesureSite->getLocPointMesureId()->getId(),
                "nom" => $locPointMesureSite->getLocPointMesureId()->getNom()
            ];
            $result[] = $temp;
        }

        return new JsonResponse($result);
    }

}
