<?php

namespace App\Controller;

use App\Dto\CaracteristiqueDto;
use App\Dto\CaracteristiqueTypeBienDto;
use App\Entity\Caracteristique;
use App\Entity\TypeBien;
use App\Repository\CaracteristiqueRepository;
use App\Repository\CaracteristiqueTypeBienRepository;
use App\Security\AccessTokenHandler;
use App\Service\CaracteristiqueService;
use App\Service\CaracteristiqueTypeBienService;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/caracteristique')]
#[OA\Tag(name: 'Caracteristique')]
class CaracteristiqueController extends ApiController
{
    public function __construct(
        private readonly CaracteristiqueRepository $caracteristiqueRepository,
        private readonly SerializerInterface       $serializer,
        private readonly CaracteristiqueService    $caracteristiqueService,
        protected AccessTokenHandler               $accessTokenHandler,
        private CaracteristiqueTypeBienRepository  $caracteristiqueTypeBienRepository,
        private CaracteristiqueTypeBienService     $caracteristiqueTypeBienService
    )
    {
        parent::__construct($this->accessTokenHandler);
    }

    #[Route('', name: 'app_get_all_caracteristique', methods: ['GET'])]
    public function getAll(): Response
    {
        $caracteristiques = $this->caracteristiqueRepository->findBy(['societe' => $this->authenticatedUser->getSocietePrincipal()], ["nom" => "ASC"]);
        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiques, 'json', ['groups' => 'defaultCaracteristique'])));
    }

    #[Route('/{id}', name: 'app_get_one_caracteristique', methods: ['GET'])]
    public function getOne(Caracteristique $caracteristique): Response
    {
        if (in_array($caracteristique->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            return new JsonResponse(json_decode($this->serializer->serialize($caracteristique, 'json', ['groups' => 'defaultCaracteristique'])));
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('', name: 'app_create_caracteristique', methods: ['POST'])]
    public function create(#[MapRequestPayload] CaracteristiqueDto $caracteristiqueDto): Response
    {

        $caracteristique = $this->caracteristiqueService->caracteristiqueDTOCreate($caracteristiqueDto, $this->authenticatedUser->getSocietePrincipal());
        $this->caracteristiqueRepository->create($caracteristique);

        return new JsonResponse(json_decode($this->serializer->serialize($caracteristique, 'json', ['groups' => 'defaultCaracteristique'])));
    }

    #[Route('/{typeBien}/{caracteristique}', name: 'app_update_caracteristique_type_bien', methods: ['PUT'])]
    public function updateTypeBien(TypeBien $typeBien, Caracteristique $caracteristique, #[MapRequestPayload] CaracteristiqueTypeBienDto $caracteristiqueTypeBienDto): Response
    {
        // Récupérer l'entité en utilisant les deux identifiants
        $caracteristiqueTypeBien = $this->caracteristiqueTypeBienRepository->findOneBy(['typeBien' => $typeBien, 'caracteristique' => $caracteristique]);

        if (!$caracteristiqueTypeBien) {
            throw $this->createNotFoundException('Caractéristique Type Bien not found');
        }

        $caracteristiqueTypeBien = $this->caracteristiqueTypeBienService->caracteristiqueTypeBienDTOTransformer($caracteristiqueTypeBienDto, $caracteristiqueTypeBien);
        $this->caracteristiqueTypeBienRepository->update($caracteristiqueTypeBien);

        return new JsonResponse(json_decode($this->serializer->serialize($caracteristiqueTypeBien, 'json', ['groups' => 'defaultCaracteristiqueTypeBien'])));
    }

    #[Route('/{id}', name: 'app_delete_caracteristique', methods: ['DELETE'])]
    public function delete(Caracteristique $caracteristique): Response
    {
        if (in_array($caracteristique->getSociete(), $this->authenticatedUser->getSocietes(), true)) {
            $this->caracteristiqueRepository->delete($caracteristique);
            return new JsonResponse('sucess');
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }

    #[Route('/{id}', name: 'app_update_caracteristique', methods: ['PUT'])]
    public function update(#[MapRequestPayload] CaracteristiqueDto $dto, Caracteristique $caracteristique): Response
    {
        $this->caracteristiqueService->caracteristiqueDTOUpdate($dto, $caracteristique);
        return new JsonResponse('sucess');
    }

    #[Route('/batch', name: 'app_create_caracteristique_batch', methods: ['POST'])]
    public function createBatch(#[MapRequestPayload(type: CaracteristiqueDto::class)] array $caracteristiques, ValidatorInterface $validator): Response
    {
        $errors = [];

        foreach ($caracteristiques as $index => $caracteristique) {
            if (!$caracteristique instanceof CaracteristiqueDto) {
                throw new BadRequestHttpException("Chaque élément du tableau doit être un CaracteristiqueBatchDto.");
            }

            // Valider chaque DTO
            $violations = $validator->validate($caracteristique);
            if (count($violations) > 0) {
                $errors[$index] = (string)$violations;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['errors' => $errors], 400);
        }

        foreach ($caracteristiques as $caracteristique) {
            $caracteristiqueRegister = $this->caracteristiqueService->caracteristiqueDTOCreate($caracteristique, $this->authenticatedUser->getSocietePrincipal());
            $this->caracteristiqueRepository->create($caracteristiqueRegister);
        }

        return new JsonResponse(['message' => 'Les caractéristiques ont été créées avec succès.'], 201);
    }

    #[Route('/{id}/allowdelete', name: 'app_get_allow_carac_delete', methods: ['GET'])]
    public function getAllowDelete(Caracteristique $caracteristique): Response
    {
        if ($caracteristique->getSociete() === $this->authenticatedUser->getSocietePrincipal()) {
            $typeBien = $caracteristique->getCaracteristiqueTypeBiens();
            $bien = $caracteristique->getBienCaracteristiques();

            if ($typeBien->isEmpty() && $bien->isEmpty()) {
                return new JsonResponse(true);
            }

            return new JsonResponse(false);
        }
        return new JsonResponse(['message' => 'Unauthorized'], 401);
    }
}
