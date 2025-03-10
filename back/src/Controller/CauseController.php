<?php

namespace App\Controller;

use App\Dto\CauseDto;
use App\Entity\Cause;
use App\Repository\CauseRepository;
use App\Security\AccessTokenHandler;
use App\Service\CauseService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/cause')]
#[OA\Tag(name: 'Cause')]
class CauseController extends ApiController
{
    public function __construct(
        private readonly CauseRepository $causeRepository,
        private readonly SerializerInterface $serializer,
        private readonly CauseService $causeService,
        protected AccessTokenHandler $accessTokenHandler
    ) {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_cause', methods: ['GET'])]
    public function getAll(): Response
    {
        $causes = $this->causeRepository->findBy(['societe' => $this->authenticatedUser ->getSocietePrincipal()]);
        // dd($causes);
        return new JsonResponse(json_decode($this->serializer->serialize($causes, 'json', ['groups' => 'defaultCause'])));

    }

    #[Route('/{id}', name: 'app_get_one_cause', methods: ['GET'])]
    public function getOne(Cause $cause): Response
    {
        if ($cause->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            // dd($cause);
            return new JsonResponse(json_decode($this->serializer->serialize($cause, 'json', ['groups' => 'defaultCause'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_cause', methods: ['POST'])]
    public function create(#[MapRequestPayload] CauseDto $causeDto): Response
    {
        $cause = $this->causeService->createCause($causeDto, $this->authenticatedUser ->getSocietePrincipal());
        $this->causeRepository->create($cause);
    
        return new JsonResponse(json_decode($this->serializer->serialize($cause, 'json', ['groups' => 'defaultCause'])), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_update_cause', methods: ['PUT'])]
    public function update(Cause $cause, #[MapRequestPayload] CauseDto $causeDto): Response
    {
        if ($cause->getSociete() === $this->authenticatedUser ->getSocietePrincipal()) {
            $updatedCause = $this->causeService->updateCause($causeDto, $cause, $this->authenticatedUser ->getSocietePrincipal());
            return new JsonResponse(json_decode($this->serializer->serialize($updatedCause, 'json', ['groups' => 'defaultCause'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_delete_cause', methods: ['DELETE'])]
    public function delete(Cause $cause): Response
    {
        if ($cause->getSociete() === $this->authenticatedUser ->getSocietePrincipal())  {
            $this->causeRepository->delete($cause);
            return new JsonResponse(['message' => 'Cause deleted successfully.']);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/batch', name: 'app_create_cause_batch', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: CauseDto::class)] array $causes, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($causes as $index => $cause) {
            if (!$cause instanceof CauseDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un CauseDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($cause);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($causes as $cause) {
            $causeRegister = $this->causeService->createCause($cause, $this->authenticatedUser ->getSocietePrincipal());
            $this->causeRepository->create($causeRegister);
        }

        return new JsonResponse(['message' => 'Les causes ont été créées avec succès.'], Response::HTTP_CREATED);
    }
}