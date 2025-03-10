<?php

namespace App\Controller;

use App\Dto\CriticiteDto; // Assurez-vous d'avoir un DTO pour Criticite
use App\Entity\Criticite;
use App\Repository\CriticiteRepository;
use App\Security\AccessTokenHandler;
use App\Service\CriticiteService; // Assurez-vous d'avoir un service pour Criticite
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/criticite')]
#[OA\Tag(name: 'Criticite')]
class CriticiteController extends ApiController
{
    public function __construct(
        private readonly CriticiteRepository $criticiteRepository,
        private readonly SerializerInterface $serializer,
        private readonly CriticiteService $criticiteService,
        protected AccessTokenHandler $accessTokenHandler
    ) {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_criticite', methods: ['GET'])]
    public function getAll(): Response
    {
        $criticites = $this->criticiteRepository->findBy(['societe' => $this->authenticatedUser ->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($criticites, 'json', ['groups' => 'defaultCriticite'])));
    }

    #[Route('/{id}', name: 'app_get_one_criticite', methods: ['GET'])]
    public function getOne(Criticite $criticite): Response
    {
        if ($criticite->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            return new JsonResponse(json_decode($this->serializer->serialize($criticite, 'json', ['groups' => 'defaultCriticite'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_criticite', methods: ['POST'])]
    public function create(#[MapRequestPayload] CriticiteDto $criticiteDto): Response
    {
        $criticite = $this->criticiteService->createCriticite($criticiteDto, $this->authenticatedUser ->getSocietePrincipal());
        $this->criticiteRepository->create($criticite);
    
        return new JsonResponse(json_decode($this->serializer->serialize($criticite, 'json', ['groups' => 'defaultCriticite'])), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_update_criticite', methods: ['PUT'])]
    public function update(Criticite $criticite, #[MapRequestPayload] CriticiteDto $criticiteDto): Response
    {
        if ($criticite->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            $updatedCriticite = $this->criticiteService->updateCriticite($criticiteDto, $criticite, $this->authenticatedUser ->getSocietePrincipal());
            return new JsonResponse(json_decode($this->serializer->serialize($updatedCriticite, 'json', ['groups' => 'defaultCriticite'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_criticite', methods: ['DELETE'])]
    public function delete(Criticite $criticite): Response
    {
        if ($criticite->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            $this->criticiteRepository->delete($criticite);
            return new JsonResponse(['message' => 'Criticite deleted successfully.']);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/batch', name: 'app_create_criticite_batch', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: CriticiteDto::class)] array $criticites, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($criticites as $index => $criticite) {
            if (!$criticite instanceof CriticiteDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un CriticiteDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($criticite);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($criticites as $criticite) {
            $criticiteRegister = $this->criticiteService->createCriticite($criticite, $this->authenticatedUser ->getSocietePrincipal());
            $this->criticiteRepository->create($criticiteRegister);
        }

        return new JsonResponse(['message' => 'Les criticités ont été créées avec succès.'], Response::HTTP_CREATED);
    }
}