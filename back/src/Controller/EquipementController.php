<?php

namespace App\Controller;

use App\Dto\ComposantChildDto;
use App\Dto\EquipementDto;
use App\Entity\Equipement;
use App\Repository\EquipementRepository;
use App\Security\AccessTokenHandler;
use App\Service\EquipementService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/equipement')]
#[OA\Tag(name: 'Equipement')]
class EquipementController extends ApiController
{
    public function __construct(
        private readonly EquipementRepository $equipementRepository,
        private readonly SerializerInterface  $serializer,
        private readonly EquipementService    $equipementService,
        protected AccessTokenHandler          $accessTokenHandler
    )
    {
        parent::__construct($this->accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_equipement', methods: ['GET'])]
    public function getAll(): Response
    {
        $equipements = $this->equipementRepository->findBy(['societe' => $this->authenticatedUser->getSocietes()]);
        return new JsonResponse(json_decode($this->serializer->serialize($equipements, 'json', ['groups' => 'defaultEquipement'])));
    }

    #[Route('/child/{id}', name: 'app_create_child_equipement', methods: ['POST'])]
    public function createComposant(Equipement $equipement, #[MapRequestPayload] ComposantChildDto $composantDto): Response
    {
        $composant = $this->equipementService->composantDtoTransformer($composantDto, $equipement, $this->authenticatedUser->getSocietePrincipal());

        return new JsonResponse(json_decode($this->serializer->serialize($composant, 'json', ['groups' => 'defaultBien'])));
    }

    #[Route('/{id}', name: 'app_get_one_equipement', methods: ['GET'])]
    public function getOne(Equipement $equipement): Response
    {
        if ($equipement->getSociete() === $this->authenticatedUser->getSocietePrincipal()) {
            $equipementData = json_decode(
                $this->serializer->serialize($equipement, 'json', ['groups' => 'defaultEquipement']),
                true
            );

            $breadcrumb = $this->equipementService->breadcrumb($equipement);

            $responseData = array_merge($equipementData, ['breadcrumb' => $breadcrumb]);

            return new JsonResponse($responseData);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_equipement', methods: ['POST'])]
    public function create(#[MapRequestPayload] EquipementDto $equipementDto): Response
    {
        $equipement = $this->equipementService->equipementDTOTransformer($equipementDto, new Equipement(), $this->authenticatedUser->getSocietePrincipal());
        $this->equipementRepository->create($equipement);

        return new JsonResponse(json_decode($this->serializer->serialize($equipement, 'json', ['groups' => 'defaultEquipement'])));
    }

    #[Route('/{id}', name: 'app_update_equipement', methods: ['PUT'])]
    public function update(Equipement $equipement, #[MapRequestPayload] EquipementDto $equipementDto): Response
    {
        if (in_array($equipement->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $equipement = $this->equipementService->equipementDTOTransformer($equipementDto, $equipement, $this->authenticatedUser->getSocietePrincipal());
            $this->equipementRepository->update();

            return new JsonResponse(json_decode($this->serializer->serialize($equipement, 'json', ['groups' => 'defaultEquipement'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_equipement', methods: ['DELETE'])]
    public function delete(Equipement $equipement): Response
    {
        if (in_array($equipement->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $this->equipementRepository->delete($equipement);
            return new JsonResponse('sucess');
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}/composants', name: 'app_composants_equipement', methods: ['GET'])]
    public function getEquipementsBySite(Equipement $equipement): Response
    {
        if (in_array($equipement->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $composants = $equipement->getComposants();
            return new JsonResponse(json_decode($this->serializer->serialize($composants, 'json', ['groups' => 'minimal'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }
}
