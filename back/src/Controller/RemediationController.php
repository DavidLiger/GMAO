<?php

namespace App\Controller;

use App\Dto\RemediationDto; // Assurez-vous d'avoir un DTO pour Remediation
use App\Entity\Remediation;
use App\Repository\RemediationRepository;
use App\Security\AccessTokenHandler;
use App\Service\RemediationService; // Assurez-vous d'avoir un service pour Remediation
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/remediation')]
#[OA\Tag(name: 'Remediation')]
class RemediationController extends ApiController
{
    public function __construct(
        private readonly RemediationRepository $remediationRepository,
        private readonly SerializerInterface $serializer,
        private readonly RemediationService $remediationService,
        protected AccessTokenHandler $accessTokenHandler
    ) {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_remediation', methods: ['GET'])]
    public function getAll(): Response
    {
        $remediations = $this->remediationRepository->findBy(['societe' => $this->authenticatedUser ->getSocietePrincipal()]);
        return new JsonResponse(json_decode($this->serializer->serialize($remediations, 'json', ['groups' => 'defaultRemediation'])));
    }

    #[Route('/{id}', name: 'app_get_one_remediation', methods: ['GET'])]
    public function getOne(Remediation $remediation): Response
    {
        if ($remediation->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            return new JsonResponse(json_decode($this->serializer->serialize($remediation, 'json', ['groups' => 'defaultRemediation'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_remediation', methods: ['POST'])]
    public function create(#[MapRequestPayload] RemediationDto $remediationDto): Response
    {
        $remediation = $this->remediationService->createRemediation($remediationDto, $this->authenticatedUser ->getSocietePrincipal());
        $this->remediationRepository->create($remediation);
    
        return new JsonResponse(json_decode($this->serializer->serialize($remediation, 'json', ['groups' => 'defaultRemediation'])), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_update_remediation', methods: ['PUT'])]
    public function update(Remediation $remediation, #[MapRequestPayload] RemediationDto $remediationDto): Response
    {
        if ($remediation->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            $updatedRemediation = $this->remediationService->updateRemediation($remediationDto, $remediation, $this->authenticatedUser ->getSocietePrincipal());
            return new JsonResponse(json_decode($this->serializer->serialize($updatedRemediation, 'json', ['groups' => 'defaultRemediation'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_remediation', methods: ['DELETE'])]
    public function delete(Remediation $remediation): Response
    {
        if ($remediation->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            $this->remediationRepository->delete($remediation);
            return new JsonResponse(['message' => 'Remediation deleted successfully.']);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/batch', name: 'app_create_remediation_batch', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: RemediationDto::class)] array $remediations, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($remediations as $index => $remediation) {
            if (!$remediation instanceof RemediationDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un RemediationDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($remediation);
            if (count($violations) > 0) {
                $errors[$index ] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($remediations as $remediation) {
            $remediationRegister = $this->remediationService->createRemediation($remediation, $this->authenticatedUser ->getSocietePrincipal());
            $this->remediationRepository->create($remediationRegister);
        }

        return new JsonResponse(['message' => 'Les remédiations ont été créées avec succès.'], Response::HTTP_CREATED);
    }
}