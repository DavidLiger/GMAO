<?php

namespace App\Controller;

use App\Dto\EquipementChildDto;
use App\Dto\OuvrageDto;
use App\Entity\Ouvrage;
use App\Repository\OuvrageRepository;
use App\Security\AccessTokenHandler;
use App\Service\OuvrageService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/ouvrage')]
#[OA\Tag(name: 'Ouvrage')]
class OuvrageContoller extends ApiController
{
    public function __construct(
        private readonly OuvrageRepository   $ouvrageRepository,
        private readonly SerializerInterface $serializer,
        private readonly OuvrageService      $ouvrageService,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_ouvrage', methods: ['GET'])]
    public function getAll(): Response
    {
        $ouvrages = $this->ouvrageRepository->findBy(['societe' => $this->authenticatedUser->getSocietes()]);
        return new JsonResponse(json_decode($this->serializer->serialize($ouvrages, 'json', ['groups' => 'defaultOuvrage'])));
    }

    #[Route('/child/{id}', name: 'app_create_child_ouvrage', methods: ['POST'])]
    public function createEquipement(Ouvrage $ouvrage, #[MapRequestPayload] EquipementChildDto $equipementDto): Response
    {
        $equipement = $this->ouvrageService->equipementDtoTransformer($equipementDto, $ouvrage, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse(json_decode($this->serializer->serialize($equipement, 'json', ['groups' => 'defaultBien'])));
    }

    #[Route('/{id}', name: 'app_get_one_ouvrage', methods: ['GET'])]
    public function getOne(Ouvrage $ouvrage): Response
    {
        if (in_array($ouvrage->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $ouvrageData = json_decode(
                $this->serializer->serialize($ouvrage, 'json', ['groups' => 'defaultOuvrage']),
                true
            );
            $breadcrumb = $this->ouvrageService->breadcrumb($ouvrage);
            $responseData = array_merge($ouvrageData, ['breadcrumb' => $breadcrumb]);
            return new JsonResponse($responseData);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_ouvrage', methods: ['POST'])]
    public function create(#[MapRequestPayload] OuvrageDto $ouvrageDto): Response
    {
        $ouvrage = $this->ouvrageService->ouvrageDTOTransformer($ouvrageDto, new Ouvrage(), $this->authenticatedUser->getSocietePrincipal());
        $this->ouvrageRepository->create($ouvrage);

        return new JsonResponse(json_decode($this->serializer->serialize($ouvrage, 'json', ['groups' => 'defaultOuvrage'])));
    }

    #[Route('/{id}', name: 'app_update_ouvrage', methods: ['PUT'])]
    public function update(Ouvrage $ouvrage, #[MapRequestPayload] OuvrageDto $ouvrageDto): Response
    {
        if (in_array($ouvrage->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $ouvrage = $this->ouvrageService->ouvrageDTOTransformer($ouvrageDto, $ouvrage, $this->authenticatedUser->getSocietePrincipal());
            $this->ouvrageRepository->update();
            return new JsonResponse(json_decode($this->serializer->serialize($ouvrage, 'json', ['groups' => 'defaultOuvrage'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_ouvrage', methods: ['DELETE'])]
    public function delete(Ouvrage $ouvrage): Response
    {
        if (in_array($ouvrage->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $this->ouvrageRepository->delete($ouvrage);
            return new JsonResponse('sucess');
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}/equipements', name: 'app_equipements_ouvrage', methods: ['GET'])]
    public function getEquipementsBySite(Ouvrage $ouvrage): Response
    {
        if (in_array($ouvrage->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $equipements = $ouvrage->getEquipements();
            return new JsonResponse(json_decode($this->serializer->serialize($equipements, 'json', ['groups' => 'minimal'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }
}
