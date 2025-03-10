<?php

namespace App\Controller;

use App\Dto\TypeActionDto; // Assurez-vous d'avoir un DTO pour TypeAction
use App\Entity\TypeAction;
use App\Repository\TypeActionRepository;
use App\Security\AccessTokenHandler;
use App\Service\TypeActionService; // Service pour gérer la logique métier
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/typeaction')]
#[OA\Tag(name: 'TypeAction')]
class TypeActionController extends ApiController
{
    public function __construct(
        private readonly TypeActionRepository $typeActionRepository,
        private readonly SerializerInterface $serializer,
        private readonly TypeActionService $typeActionService,
        protected AccessTokenHandler $accessTokenHandler
    ) {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_type_action', methods: ['GET'])]
    public function getAll(): Response
    {
        $societe_id = $this->authenticatedUser->getSocietePrincipal()->getId();
        $typeActions = $this->typeActionRepository->findAllTypeActions($societe_id);
        return new JsonResponse(json_decode($this->serializer->serialize($typeActions, 'json', ['groups' => 'defaultTypeAction'])));
    }
    
    #[Route('/sous_types', name: 'app_get_all_sous_type_action', methods: ['GET'])]
    public function getAllSousTypes(): Response
    {
        $sousTypeActions = $this->typeActionRepository->findAllSousTypeActions();
        return new JsonResponse(json_decode($this->serializer->serialize($sousTypeActions, 'json', ['groups' => 'defaultTypeAction'])));
    }

    #[Route('/{id}/sous_types', name: 'app_get_sous_types', methods: ['GET'])]
    public function getSousTypes(TypeAction $typeAction): Response
    {
        $sousTypes = $typeAction->getSousTypes();
        return new JsonResponse(json_decode($this->serializer->serialize($sousTypes, 'json', ['groups' => 'defaultTypeAction'])));
    }

    #[Route('/{id}', name: 'app_get_one_type_action', methods: ['GET'])]
    public function getOne(TypeAction $typeAction): Response
    {
        return new JsonResponse(json_decode($this->serializer->serialize($typeAction, 'json', ['groups' => 'defaultTypeAction'])));
    }

    #[Route('', name: 'app_create_type_action', methods: ['POST'])]
    public function create(#[MapRequestPayload] TypeActionDto $typeActionDto): Response
    {
        $typeAction = $this->typeActionService->createTypeAction($typeActionDto, $this->authenticatedUser ->getSocietePrincipal());
        $this->typeActionRepository->create($typeAction);
    
        return new JsonResponse(json_decode($this->serializer->serialize($typeAction, 'json', ['groups' => 'defaultTypeAction'])), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_update_type_action', methods: ['PUT'])]
    public function update(TypeAction $typeAction, #[MapRequestPayload] TypeActionDto $typeActionDto): Response
    {
        $updatedTypeAction = $this->typeActionService->updateTypeAction($typeActionDto, $typeAction, $this->authenticatedUser ->getSocietePrincipal());
        return new JsonResponse(json_decode($this->serializer->serialize($updatedTypeAction, 'json', ['groups' => 'defaultTypeAction'])));
    }

    #[Route('/{id}', name: 'app_delete_type_action', methods: ['DELETE'])]
    public function delete(TypeAction $typeAction): Response
    {
        $this->typeActionRepository->delete($typeAction);
        return new JsonResponse(['message' => 'TypeAction deleted successfully.']);
    }

    #[Route('/batch', name: 'app_create_type_action_batch', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: TypeActionDto::class)] array $typeActions, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($typeActions as $index => $typeAction) {
            if (!$typeAction instanceof TypeActionDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un TypeActionDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($typeAction);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($typeActions as $typeAction) {
            $typeActionRegister = $this->typeActionService->createTypeAction($typeAction);
            $this->typeActionRepository->create($typeActionRegister);
        }

        return new JsonResponse(['message' => 'Les types d\'actions ont été créés avec succès.'], Response::HTTP_CREATED);
    }
}