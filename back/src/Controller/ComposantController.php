<?php

namespace App\Controller;

use App\Dto\ComposantDto;
use App\Entity\Composant;
use App\Repository\ComposantRepository;
use App\Security\AccessTokenHandler;
use App\Service\ComposantService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/composant')]
#[OA\Tag(name: 'Composant')]
class ComposantController extends ApiController
{
    public function __construct(
        private readonly ComposantRepository $composantRepository,
        private readonly SerializerInterface $serializer,
        private readonly ComposantService    $composantService,
        protected AccessTokenHandler         $accessTokenHandler
    )
    {
        parent::__construct($accessTokenHandler);
    }


    #[Route('', name: 'app_get_all_composant', methods: ['GET'])]
    public function getAll(): Response
    {
        $composants = $this->composantRepository->findBy(['societe' => $this->authenticatedUser->getSocietes()]);
        return new JsonResponse(json_decode($this->serializer->serialize($composants, 'json', ['groups' => 'default'])));
    }

    #[Route('/{id}', name: 'app_get_one_composant', methods: ['GET'])]
    public function getOne(Composant $composant): Response
    {
        if (in_array($composant->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $composantData = json_decode(
                $this->serializer->serialize($composant, 'json', ['groups' => 'defaultComposant']),
                true // Décoder en tableau associatif
            );

            $breadcrum = $this->composantService->breadcrumb($composant);

            $responseData = array_merge($composantData, ['breadcrumb' => $breadcrum]);

            return new JsonResponse($responseData);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);

    }

    #[Route('', name: 'app_create_composant', methods: ['POST'])]
    public function create(#[MapRequestPayload] ComposantDto $composantDto): Response
    {
        $site = $this->composantService->composantDTOTransformer($composantDto, new Composant(), $this->authenticatedUser->getSociete());
        $this->composantRepository->create($site);
        return new JsonResponse(json_decode($this->serializer->serialize($site, 'json', ['groups' => 'default'])));
    }

    #[Route('/{id}', name: 'app_update_composant', methods: ['PUT'])]
    public function update(Composant $composant, #[MapRequestPayload] ComposantDto $composantDto): Response
    {
        if (in_array($composant->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $site = $this->composantService->composantDTOTransformer($composantDto, $composant, $this->authenticatedUser->getSociete());
            $this->composantRepository->update();

            return new JsonResponse(json_decode($this->serializer->serialize($site, 'json', ['groups' => 'default'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_composant', methods: ['DELETE'])]
    public function delete(Composant $composant): Response
    {
        if (in_array($composant->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $this->composantRepository->delete($composant);
            return new JsonResponse('sucess');
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }
}
